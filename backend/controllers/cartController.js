const Cart = require("../models/mongodb/cart");
const Product = require("../models/mongodb/product");

// Lấy giỏ hàng của user
exports.getCart = async (req, res) => {
  // Debug: log req.user để xem thông tin user
  console.log("Debug - req.user:", req.user);
  console.log("Debug - req.user.userId:", req.user ? req.user.userId : "undefined");
  
  // Lấy user_id từ user đã xác thực qua middleware
  const user_id = req.user.userId;
  
  // Safety check
  if (!user_id) {
    console.error("User ID is undefined in getCart");
    return res.status(401).json({ message: "User not authenticated properly" });
  }
  try {
    let cart = await Cart.findOne({ user_id });

    // Nếu không tìm thấy giỏ hàng, tạo mới
    if (!cart) {
      cart = await Cart.create({ user_id, products: [] });
    }

    // Lấy thông tin chi tiết của sản phẩm từ MongoDB
    if (cart.products.length > 0) {
      const productIds = cart.products.map((item) => item.product_id);
      const products = await Product.find({ _id: { $in: productIds } });

      // Tạo response với thông tin sản phẩm đầy đủ
      const cartWithDetails = {
        _id: cart._id,
        user_id: cart.user_id,
        products: cart.products.map((item) => {
          const productDetail = products.find((p) => p._id.toString() === item.product_id.toString());
          return {
            product_id: item.product_id,
            quantity: item.quantity,
            details: productDetail || { message: "Sản phẩm không còn tồn tại" },
          };
        }),
        last_updated: cart.last_updated,
      };

      return res.json(cartWithDetails);
    }

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy giỏ hàng" });
  }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  // Debug: log req.user để xem thông tin user
  console.log("Debug - req.user:", req.user);
  console.log("Debug - req.user.userId:", req.user ? req.user.userId : "undefined");
  
  // Lấy user_id từ user đã xác thực qua middleware
  const user_id = req.user.userId;
  
  // Safety check
  if (!user_id) {
    console.error("User ID is undefined in addToCart");
    return res.status(401).json({ message: "User not authenticated properly" });
  }
  const { product_id, quantity, variant } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
  }

  try {
    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findOne({ _id: product_id });
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    // Kiểm tra tồn kho
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Số lượng vượt quá tồn kho" });
    }

    // Tìm giỏ hàng hiện tại của user
    let cart = await Cart.findOne({ user_id });

    // Nếu chưa có giỏ hàng, tạo mới
    if (!cart) {
      cart = new Cart({
        user_id,
        products: [{ product_id, quantity, variant }],
      });
    } else {
      // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product_id.toString() === product_id.toString()
      );

      if (existingProductIndex >= 0) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ product_id, quantity, variant });
      }
    }

    cart.last_updated = Date.now();
    await cart.save();

    res.status(201).json({
      message: "Đã thêm sản phẩm vào giỏ hàng",
      cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi thêm vào giỏ hàng" });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
exports.updateCartItem = async (req, res) => {
  // Lấy user_id từ user đã xác thực qua middleware
  const user_id = req.user.userId;
  const { product_id, quantity } = req.body;

  if (!product_id || quantity === undefined) {
    return res.status(400).json({ message: "Thiếu thông tin cập nhật" });
  }

  try {
    // Tìm giỏ hàng
    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    // Tìm sản phẩm trong giỏ hàng
    const productIndex = cart.products.findIndex(
      (item) => item.product_id.toString() === product_id.toString()
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không có trong giỏ hàng" });
    }

    // Cập nhật số lượng
    if (quantity > 0) {
      cart.products[productIndex].quantity = quantity;
    } else {
      // Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ hàng
      cart.products.splice(productIndex, 1);
    }

    cart.last_updated = Date.now();
    await cart.save();

    res.json({
      message: "Đã cập nhật giỏ hàng",
      cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi cập nhật giỏ hàng" });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
  // Lấy user_id từ user đã xác thực qua middleware
  const user_id = req.user.userId;
  const { product_id } = req.body;

  if (!product_id) {
    return res.status(400).json({ message: "Thiếu thông tin sản phẩm" });
  }

  try {
    // Tìm giỏ hàng
    const cart = await Cart.findOne({ user_id });
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    // Xóa sản phẩm khỏi giỏ hàng
    const productIndex = cart.products.findIndex(
      (item) => item.product_id.toString() === product_id.toString()
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không có trong giỏ hàng" });
    }

    cart.products.splice(productIndex, 1);
    cart.last_updated = Date.now();
    await cart.save();

    res.json({
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
      cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi xóa khỏi giỏ hàng" });
  }
};
