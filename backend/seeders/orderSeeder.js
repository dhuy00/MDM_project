const { Order, OrderDetail, User } = require("../models/mysql");
const Product = require("../models/mongodb/product");

// Sample order data
const createSampleOrders = async () => {
  try {
    console.log("Creating sample orders...");

    // Get a sample user (assuming user with ID 1 exists)
    const sampleUser = await User.findOne({ where: { user_id: 1 } });
    if (!sampleUser) {
      console.log("No sample user found. Please create users first.");
      return;
    }

    // Get some sample products
    const sampleProducts = await Product.find().limit(5);
    if (sampleProducts.length === 0) {
      console.log("No sample products found. Please create products first.");
      return;
    }

    // Create sample orders
    const orders = [
      {
        user_id: sampleUser.user_id,
        status: "delivered",
        total_amount: 850000,
        shipping_fee: 30000,
        shipping_address: "123 Nguyễn Huệ, Quận 1, TP.HCM",
        shipping_method: "Nhanh",
        note: "Giao hàng giờ hành chính",
        payment_method: "cash_on_delivery",
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
      {
        user_id: sampleUser.user_id,
        status: "shipped",
        total_amount: 1200000,
        shipping_fee: 25000,
        shipping_address: "456 Lê Lợi, Quận 3, TP.HCM",
        shipping_method: "Hỏa tốc",
        note: "Giao hàng cuối tuần",
        payment_method: "cash_on_delivery",
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        user_id: sampleUser.user_id,
        status: "processing",
        total_amount: 450000,
        shipping_fee: 20000,
        shipping_address: "789 Trần Hưng Đạo, Quận 5, TP.HCM",
        shipping_method: "Standard",
        note: "",
        payment_method: "cash_on_delivery",
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        user_id: sampleUser.user_id,
        status: "confirmed",
        total_amount: 2500000,
        shipping_fee: 40000,
        shipping_address: "321 Võ Văn Tần, Quận 3, TP.HCM",
        shipping_method: "Nhanh",
        note: "Gọi trước khi giao",
        payment_method: "cash_on_delivery",
        created_at: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000), // 12 hours ago
      },
      {
        user_id: sampleUser.user_id,
        status: "pending",
        total_amount: 680000,
        shipping_fee: 15000,
        shipping_address: "654 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
        shipping_method: "Standard",
        note: "",
        payment_method: "cash_on_delivery",
        created_at: new Date(), // Now
      },
    ];

    // Create orders and order details
    for (let i = 0; i < orders.length; i++) {
      const orderData = orders[i];

      // Create order
      const order = await Order.create(orderData);
      console.log(`Created order #${order.order_id}`);

      // Create order details (1-3 products per order)
      const numProducts = Math.floor(Math.random() * 3) + 1;
      let orderTotal = 0;

      for (let j = 0; j < numProducts; j++) {
        const randomProduct =
          sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        const unitPrice = randomProduct.price;
        const itemTotal = unitPrice * quantity;

        await OrderDetail.create({
          order_id: order.order_id,
          product_id: randomProduct._id,
          quantity: quantity,
          unit_price: unitPrice,
          variant: JSON.stringify({
            size: randomProduct.variants.Size
              ? randomProduct.variants.Size[0]
              : null,
            color: randomProduct.variants.Màu
              ? randomProduct.variants.Màu[0]
              : null,
          }),
        });

        orderTotal += itemTotal;
      }

      // Update order total to match actual products
      await Order.update(
        {
          total_amount: orderTotal + orderData.shipping_fee,
        },
        {
          where: { order_id: order.order_id },
        }
      );

      console.log(
        `Created ${numProducts} order details for order #${order.order_id}`
      );
    }

    console.log("Sample orders created successfully!");
  } catch (error) {
    console.error("Error creating sample orders:", error);
  }
};

// Run the seeder
const runOrderSeeder = async () => {
  try {
    await createSampleOrders();
    console.log("Order seeder completed!");
  } catch (error) {
    console.error("Order seeder failed:", error);
  }
};

// Export for use in other files
module.exports = { createSampleOrders, runOrderSeeder };

// Run if called directly
if (require.main === module) {
  runOrderSeeder()
    .then(() => {
      console.log("Order seeder finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Order seeder error:", error);
      process.exit(1);
    });
}
