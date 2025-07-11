const Order = require("../models/mysql/order");
const OrderDetail = require("../models/mysql/orderDetail");
const Cart = require("../models/mongodb/cart");
const Product = require("../models/mongodb/product");
const sequelize = require("../config/database");

// Đặt hàng mới
exports.placeOrder = async (req, res) => {
  // Lấy user_id từ user đã xác thực qua middleware
  const user_id = req.user.id;

  const {
    payment_method,
    address,
    shipping_address, // Thêm shipping_address làm fallback
    selected_products, // Các sản phẩm được chọn để đặt hàng (có thể chỉ chọn một phần từ giỏ hàng)
    shipping_method, // Phương thức vận chuyển
    coupon_code, // Mã giảm giá (nếu có)
    note, // Ghi chú đơn hàng
  } = req.body;

  // Debug: log request body để kiểm tra dữ liệu
  console.log("Order request body:", req.body);
  console.log("Address:", address);
  console.log("Shipping address:", shipping_address);

  // Kiểm tra địa chỉ giao hàng
  const finalAddress = address || shipping_address;
  if (!finalAddress || finalAddress.trim() === "") {
    return res.status(400).json({
      message: "Địa chỉ giao hàng là bắt buộc!",
      error: "MISSING_SHIPPING_ADDRESS",
    });
  }

  try {
    // Lấy giỏ hàng của user
    const cart = await Cart.findOne({ user_id });
    if (!cart || !cart.products.length) {
      return res.status(400).json({ message: "Giỏ hàng trống!" });
    }

    // Xác định các sản phẩm được chọn để đặt hàng
    let productsToOrder = cart.products;
    if (selected_products && selected_products.length > 0) {
      // Nếu có chỉ định sản phẩm được chọn, chỉ lấy các sản phẩm đó
      productsToOrder = cart.products.filter((item) =>
        selected_products.includes(item.product_id)
      );
    }

    if (productsToOrder.length === 0) {
      return res
        .status(400)
        .json({ message: "Không có sản phẩm nào được chọn để đặt hàng!" });
    }

    // Lấy thông tin sản phẩm từ MongoDB
    const productIds = productsToOrder.map((p) => p.product_id);
    const products = await Product.find({ _id: { $in: productIds } });

    // Tính tổng tiền và chi tiết đơn hàng
    let total_amount = 0;
    let shipping_fee = 0;
    const orderDetails = [];

    for (const item of productsToOrder) {
      const prod = products.find((p) => p._id === item.product_id);
      if (!prod) continue;

      // Kiểm tra tồn kho
      if (prod.stock < item.quantity) {
        return res.status(400).json({
          message: `Sản phẩm ${prod.name} chỉ còn ${prod.stock} sản phẩm trong kho!`,
        });
      }

      // Tính phí vận chuyển
      if (shipping_method && prod.shipping.methods) {
        const shippingOption = prod.shipping.methods.find(
          (m) => m.name === shipping_method
        );
        if (shippingOption && shippingOption.enabled !== false) {
          shipping_fee += shippingOption.price;
        }
      }

      // Tính giá sản phẩm
      const itemTotal = prod.price * item.quantity;
      total_amount += itemTotal;

      orderDetails.push({
        product_id: prod._id,
        quantity: item.quantity,
        unit_price: prod.price,
        variant: item.variant,
        subtotal: itemTotal,
      });
    }

    // Thêm phí vận chuyển vào tổng tiền
    total_amount += shipping_fee;

    // Tạo đơn hàng và chi tiết đơn hàng trong MySQL
    const result = await sequelize.transaction(async (t) => {
      const order = await Order.create(
        {
          user_id,
          status: "pending",
          total_amount,
          payment_method,
          shipping_fee,
          shipping_address: finalAddress,
          note: note || "",
          shipping_method: shipping_method || "standard",
          coupon_code: coupon_code || null,
        },
        { transaction: t }
      );

      // Tạo chi tiết đơn hàng
      for (const detail of orderDetails) {
        await OrderDetail.create(
          {
            order_id: order.order_id,
            product_id: detail.product_id,
            quantity: detail.quantity,
            unit_price: detail.unit_price,
            variant: JSON.stringify(detail.variant), // Lưu thông tin variant dưới dạng JSON
          },
          { transaction: t }
        );

        // Cập nhật số lượng tồn kho và số lượng đã bán
        await Product.findOneAndUpdate(
          { _id: detail.product_id },
          {
            $inc: {
              stock: -detail.quantity,
              sales: detail.quantity,
            },
          }
        );
      }

      // Nếu chỉ đặt một phần sản phẩm từ giỏ hàng, cập nhật giỏ hàng
      if (selected_products && selected_products.length > 0) {
        const remainingProducts = cart.products.filter(
          (item) => !selected_products.includes(item.product_id)
        );

        await Cart.updateOne(
          { user_id },
          {
            $set: {
              products: remainingProducts,
              last_updated: new Date(),
            },
          }
        );
      } else {
        // Xóa toàn bộ giỏ hàng nếu đặt tất cả sản phẩm
        await Cart.deleteOne({ user_id });
      }

      return order;
    });
    res.status(201).json({
      message: "Đặt hàng thành công!",
      order: result,
      orderDetails: orderDetails,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi đặt hàng!" });
  }
};

// Lấy danh sách đơn hàng của user
exports.getOrdersByUser = async (req, res) => {
  // Lấy user_id từ user đã xác thực qua middleware
  const user_id = req.user.id;
  try {
    const orders = await Order.findAll({
      where: { user_id },
      order: [["created_at", "DESC"]],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy đơn hàng!" });
  }
};

// Lấy chi tiết đơn hàng
exports.getOrderDetail = async (req, res) => {
  const { order_id } = req.params;
  // Lấy user_id từ user đã xác thực qua middleware
  const user_id = req.user.id;

  try {
    // Thêm điều kiện user_id để đảm bảo người dùng chỉ xem được đơn hàng của họ
    const order = await Order.findOne({
      where: { order_id, user_id },
      include: [
        {
          model: OrderDetail,
          as: "orderDetails",
        },
      ],
    });

    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });

    // Lấy thông tin sản phẩm từ MongoDB để hiển thị chi tiết
    const productIds = order.orderDetails.map((detail) => detail.product_id);
    const products = await Product.find({ _id: { $in: productIds } });

    // Map thông tin sản phẩm với chi tiết đơn hàng
    const orderDetailsWithProducts = order.orderDetails.map((detail) => {
      const productInfo =
        products.find((p) => p._id === detail.product_id) || {};
      return {
        ...detail.toJSON(),
        product: {
          name: productInfo.name || "Sản phẩm không tồn tại",
          thumbnail: productInfo.thumbnail,
          brand: productInfo.brand,
        },
      };
    });

    // Trả về kết quả với thông tin sản phẩm
    const result = {
      ...order.toJSON(),
      orderDetails: orderDetailsWithProducts,
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi lấy chi tiết đơn hàng!" });
  }
};

// Hủy đơn hàng
exports.cancelOrder = async (req, res) => {
  const { order_id } = req.params;
  const user_id = req.user.id;

  try {
    // Tìm đơn hàng và kiểm tra quyền sở hữu
    const order = await Order.findOne({
      where: { order_id, user_id },
    });

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    }

    // Chỉ cho phép hủy đơn hàng khi trạng thái là pending hoặc confirmed
    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({
        message: "Không thể hủy đơn hàng ở trạng thái hiện tại!",
      });
    }

    // Lấy chi tiết đơn hàng để hoàn trả tồn kho
    const orderDetails = await OrderDetail.findAll({
      where: { order_id },
    });

    // Hoàn trả tồn kho sản phẩm
    for (const detail of orderDetails) {
      await Product.findOneAndUpdate(
        { _id: detail.product_id },
        {
          $inc: {
            stock: detail.quantity,
            sales: -detail.quantity,
          },
        }
      );
    }

    // Cập nhật trạng thái đơn hàng
    await Order.update({ status: "cancelled" }, { where: { order_id } });

    res.json({
      message: "Hủy đơn hàng thành công!",
      order_id: order_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi hủy đơn hàng!" });
  }
};

// Đặt lại đơn hàng
exports.reorder = async (req, res) => {
  const { order_id } = req.params;
  const user_id = req.user.id;

  try {
    // Tìm đơn hàng gốc
    const originalOrder = await Order.findOne({
      where: { order_id, user_id },
      include: [
        {
          model: OrderDetail,
          as: "orderDetails",
        },
      ],
    });

    if (!originalOrder) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    }

    // Kiểm tra tồn kho của các sản phẩm
    const productIds = originalOrder.orderDetails.map(
      (detail) => detail.product_id
    );
    const products = await Product.find({ _id: { $in: productIds } });

    for (const detail of originalOrder.orderDetails) {
      const product = products.find((p) => p._id === detail.product_id);
      if (!product) {
        return res.status(400).json({
          message: `Sản phẩm ID ${detail.product_id} không còn tồn tại!`,
        });
      }
      if (product.stock < detail.quantity) {
        return res.status(400).json({
          message: `Sản phẩm ${product.name} chỉ còn ${product.stock} sản phẩm trong kho!`,
        });
      }
    }

    // Tạo đơn hàng mới
    const newOrder = await Order.create({
      user_id,
      status: "pending",
      total_amount: originalOrder.total_amount,
      shipping_fee: originalOrder.shipping_fee,
      shipping_address: originalOrder.shipping_address,
      shipping_method: originalOrder.shipping_method,
      note: originalOrder.note,
      payment_method: originalOrder.payment_method,
    });

    // Tạo chi tiết đơn hàng mới
    for (const detail of originalOrder.orderDetails) {
      await OrderDetail.create({
        order_id: newOrder.order_id,
        product_id: detail.product_id,
        quantity: detail.quantity,
        unit_price: detail.unit_price,
        variant: detail.variant,
      });

      // Cập nhật tồn kho
      await Product.findOneAndUpdate(
        { _id: detail.product_id },
        {
          $inc: {
            stock: -detail.quantity,
            sales: detail.quantity,
          },
        }
      );
    }

    res.status(201).json({
      message: "Đặt lại đơn hàng thành công!",
      order: newOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi đặt lại đơn hàng!" });
  }
};
