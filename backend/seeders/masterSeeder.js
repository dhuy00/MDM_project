// Load environment variables first
require("dotenv").config();

const { syncDatabase } = require("../models/mysql");
const connectMongoDB = require("../config/mongodb");
const { runOrderSeeder } = require("./orderSeeder");

// Import individual seeders
const mongoose = require("mongoose");

// MongoDB Models
const Product = require("../models/mongodb/product");
const Cart = require("../models/mongodb/cart");
const Review = require("../models/mongodb/review");

// MySQL Models
const { User, Rank, Shop } = require("../models/mysql");

// Sample data
const runAllSeeders = async () => {
  try {
    console.log("🚀 Starting comprehensive database seeding...");

    // Initialize databases
    console.log("📊 Initializing databases...");
    await syncDatabase();
    await connectMongoDB();

    // Clear existing data (optional - be careful in production)
    console.log("🧹 Clearing existing data...");
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Review.deleteMany({});

    // Seed MySQL data first (users, ranks, shops)
    console.log("👥 Seeding MySQL data...");
    await seedMySQLData();

    // Seed MongoDB data
    console.log("📦 Seeding MongoDB data...");
    await seedMongoDBData();

    // Seed orders (depends on both MySQL users and MongoDB products)
    console.log("📋 Seeding orders...");
    await runOrderSeeder();

    console.log("✅ All seeders completed successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
};

const seedMySQLData = async () => {
  try {
    // Create sample ranks
    const ranks = [
      { rank_id: 1, rank_name: "Bronze", min_spent: 0, discount: 0 },
      { rank_id: 2, rank_name: "Silver", min_spent: 1000000, discount: 5 },
      { rank_id: 3, rank_name: "Gold", min_spent: 5000000, discount: 10 },
      { rank_id: 4, rank_name: "Platinum", min_spent: 10000000, discount: 15 },
    ];

    for (const rank of ranks) {
      await Rank.findOrCreate({
        where: { rank_id: rank.rank_id },
        defaults: rank,
      });
    }
    console.log("✅ Ranks seeded");

    // Create sample users
    const bcrypt = require("bcrypt");
    const users = [
      {
        user_id: 1,
        username: "testuser",
        email: "test@example.com",
        password: await bcrypt.hash("password123", 10),
        full_name: "Test User",
        phone: "0123456789",
        address: "123 Test Street, Ho Chi Minh City",
        rank_id: 1,
        total_spent: 0,
      },
      {
        user_id: 2,
        username: "johndoe",
        email: "john@example.com",
        password: await bcrypt.hash("password123", 10),
        full_name: "John Doe",
        phone: "0987654321",
        address: "456 Main Street, Ha Noi",
        rank_id: 2,
        total_spent: 2000000,
      },
      {
        user_id: 3,
        username: "janedoe",
        email: "jane@example.com",
        password: await bcrypt.hash("password123", 10),
        full_name: "Jane Doe",
        phone: "0369852147",
        address: "789 Second Street, Da Nang",
        rank_id: 3,
        total_spent: 6000000,
      },
    ];

    for (const user of users) {
      await User.findOrCreate({
        where: { user_id: user.user_id },
        defaults: user,
      });
    }
    console.log("✅ Users seeded");

    // Create sample shops
    const shops = [
      {
        shop_id: 1,
        user_id: 2,
        shop_name: "John's Electronics",
        description: "Best electronics in town",
        address: "456 Main Street, Ha Noi",
        phone: "0987654321",
        rating: 4.5,
        total_products: 25,
        total_sales: 150,
      },
      {
        shop_id: 2,
        user_id: 3,
        shop_name: "Jane's Fashion",
        description: "Trendy fashion for everyone",
        address: "789 Second Street, Da Nang",
        phone: "0369852147",
        rating: 4.8,
        total_products: 40,
        total_sales: 200,
      },
    ];

    for (const shop of shops) {
      await Shop.findOrCreate({
        where: { shop_id: shop.shop_id },
        defaults: shop,
      });
    }
    console.log("✅ Shops seeded");
  } catch (error) {
    console.error("❌ MySQL seeding failed:", error);
    throw error;
  }
};

const seedMongoDBData = async () => {
  try {
    // Enhanced product data
    const products = [
      {
        name: "iPhone 15 Pro Max",
        description: "The most advanced iPhone ever with A17 Pro chip, titanium design, and professional camera system",
        category: "Electronics",
        brand: "Apple",
        specifications: {
          sleeveLength: "N/A",
          manufacturer: "Apple Inc.",
          address: "Cupertino, CA, USA",
        },
        variants: {
          Size: ["128GB", "256GB", "512GB", "1TB"],
          Màu: [
            "Natural Titanium",
            "Blue Titanium",
            "White Titanium",
            "Black Titanium",
          ],
        },
        price: 29990000,
        stock: 50,
        rating: 4.8,
        views: 15420,
        sales: 234,
        isFeatured: true,
        status: "active",
        shop_id: 1,
        images: [
          "https://via.placeholder.com/300x300?text=iPhone+15+Pro+Max",
          "https://via.placeholder.com/300x300?text=iPhone+15+Pro+Max+2",
        ],
        thumbnail: "https://via.placeholder.com/150x150?text=iPhone+15+Pro+Max",
        videoUrl: "",
        tags: ["smartphone", "premium", "5G", "camera"],
        shipping: {
          weight: "0.22kg",
          dimensions: "16x7.8x0.83cm",
          methods: [
            { name: "Standard", price: 30000, enabled: true },
            { name: "Nhanh", price: 50000, enabled: true },
            { name: "Hỏa tốc", price: 80000, enabled: true },
          ],
        },
        createdAt: new Date(),
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        description: "Ultimate productivity powerhouse with S Pen, advanced AI features, and stunning 200MP camera",
        category: "Electronics",
        brand: "Samsung",
        specifications: {
          sleeveLength: "N/A",
          manufacturer: "Samsung Electronics",
          address: "Seoul, South Korea",
        },
        variants: {
          Size: ["256GB", "512GB", "1TB"],
          Màu: [
            "Titanium Gray",
            "Titanium Black",
            "Titanium Violet",
            "Titanium Yellow",
          ],
        },
        price: 26990000,
        stock: 75,
        rating: 4.7,
        views: 12340,
        sales: 189,
        isFeatured: true,
        status: "active",
        shop_id: 2,
        images: [
          "https://via.placeholder.com/300x300?text=Galaxy+S24+Ultra",
          "https://via.placeholder.com/300x300?text=Galaxy+S24+Ultra+2",
        ],
        thumbnail: "https://via.placeholder.com/150x150?text=Galaxy+S24+Ultra",
        videoUrl: "",
        tags: ["smartphone", "android", "s-pen", "camera"],
        shipping: {
          weight: "0.23kg",
          dimensions: "16.2x7.9x0.86cm",
          methods: [
            { name: "Standard", price: 30000, enabled: true },
            { name: "Nhanh", price: 50000, enabled: true },
            { name: "Hỏa tốc", price: 80000, enabled: true },
          ],
        },
        createdAt: new Date(),
      },
      {
        name: "MacBook Pro 14-inch M3",
        description: "Professional laptop with M3 chip, brilliant Liquid Retina XDR display, and all-day battery life",
        category: "Electronics",
        brand: "Apple",
        specifications: {
          sleeveLength: "N/A",
          manufacturer: "Apple Inc.",
          address: "Cupertino, CA, USA",
        },
        variants: {
          Size: ["8GB RAM 512GB SSD", "16GB RAM 512GB SSD", "16GB RAM 1TB SSD"],
          Màu: ["Space Gray", "Silver"],
        },
        price: 52990000,
        stock: 30,
        rating: 4.9,
        views: 8920,
        sales: 67,
        isFeatured: true,
        status: "active",
        shop_id: 1,
        images: [
          "https://via.placeholder.com/300x300?text=MacBook+Pro+14",
          "https://via.placeholder.com/300x300?text=MacBook+Pro+14+2",
        ],
        thumbnail: "https://via.placeholder.com/150x150?text=MacBook+Pro+14",
        videoUrl: "",
        tags: ["laptop", "apple", "m3", "professional"],
        shipping: {
          weight: "1.6kg",
          dimensions: "31.2x22.1x1.55cm",
          methods: [
            { name: "Standard", price: 50000, enabled: true },
            { name: "Nhanh", price: 75000, enabled: true },
            { name: "Hỏa tốc", price: 100000, enabled: true },
          ],
        },
        createdAt: new Date(),
      },
      {
        name: "AirPods Pro 2nd generation",
        description: "Advanced wireless earbuds with active noise cancellation, spatial audio, and adaptive transparency",
        category: "Electronics",
        brand: "Apple",
        specifications: {
          sleeveLength: "N/A",
          manufacturer: "Apple Inc.",
          address: "Cupertino, CA, USA",
        },
        variants: {
          Size: ["One Size"],
          Màu: ["White"],
        },
        price: 6490000,
        stock: 100,
        rating: 4.6,
        views: 5430,
        sales: 156,
        isFeatured: false,
        status: "active",
        shop_id: 1,
        images: [
          "https://via.placeholder.com/300x300?text=AirPods+Pro+2",
          "https://via.placeholder.com/300x300?text=AirPods+Pro+2+Case",
        ],
        thumbnail: "https://via.placeholder.com/150x150?text=AirPods+Pro+2",
        videoUrl: "",
        tags: ["airpods", "wireless", "earbuds", "apple"],
        shipping: {
          weight: "0.05kg",
          dimensions: "6x4.5x2.15cm",
          methods: [
            { name: "Standard", price: 25000, enabled: true },
            { name: "Nhanh", price: 40000, enabled: true },
            { name: "Hỏa tốc", price: 60000, enabled: true },
          ],
        },
        createdAt: new Date(),
      },
      {
        name: "Sony WH-1000XM5",
        description: "Industry-leading noise canceling headphones with premium sound quality and 30-hour battery life",
        category: "Electronics",
        brand: "Sony",
        specifications: {
          sleeveLength: "N/A",
          manufacturer: "Sony Corporation",
          address: "Tokyo, Japan",
        },
        variants: {
          Size: ["One Size"],
          Màu: ["Black", "Silver"],
        },
        price: 8990000,
        stock: 60,
        rating: 4.7,
        views: 3210,
        sales: 89,
        isFeatured: false,
        status: "active",
        shop_id: 2,
        images: [
          "https://via.placeholder.com/300x300?text=Sony+WH-1000XM5",
          "https://via.placeholder.com/300x300?text=Sony+WH-1000XM5+2",
        ],
        thumbnail: "https://via.placeholder.com/150x150?text=Sony+WH-1000XM5",
        videoUrl: "",
        tags: ["headphones", "wireless", "noise-cancelling", "premium"],
        shipping: {
          weight: "0.25kg",
          dimensions: "25x19x8cm",
          methods: [
            { name: "Standard", price: 30000, enabled: true },
            { name: "Nhanh", price: 45000, enabled: true },
            { name: "Hỏa tốc", price: 65000, enabled: true },
          ],
        },
        createdAt: new Date(),
      },
      {
        name: "Uniqlo Áo Thun Nam Cotton",
        description: "Essential men's cotton t-shirt with comfortable fit, breathable fabric, and modern design",
        category: "Fashion",
        brand: "Uniqlo",
        specifications: {
          sleeveLength: "Short Sleeve",
          manufacturer: "Uniqlo Co., Ltd.",
          address: "Tokyo, Japan",
        },
        variants: {
          Size: ["S", "M", "L", "XL", "XXL"],
          Màu: ["White", "Black", "Navy", "Gray", "Red"],
        },
        price: 299000,
        stock: 200,
        rating: 4.3,
        views: 2150,
        sales: 345,
        isFeatured: false,
        status: "active",
        shop_id: 2,
        images: [
          "https://via.placeholder.com/300x300?text=Uniqlo+T-Shirt",
          "https://via.placeholder.com/300x300?text=Uniqlo+T-Shirt+Colors",
        ],
        thumbnail: "https://via.placeholder.com/150x150?text=Uniqlo+T-Shirt",
        videoUrl: "",
        tags: ["t-shirt", "cotton", "basic", "men"],
        shipping: {
          weight: "0.15kg",
          dimensions: "25x20x2cm",
          methods: [
            { name: "Standard", price: 20000, enabled: true },
            { name: "Nhanh", price: 35000, enabled: true },
            { name: "Hỏa tốc", price: 50000, enabled: true },
          ],
        },
        createdAt: new Date(),
      },
      {
        name: "Nike Air Max 270",
        description: "Iconic lifestyle sneakers with Max Air cushioning, breathable mesh upper, and street-ready style",
        category: "Fashion",
        brand: "Nike",
        specifications: {
          sleeveLength: "N/A",
          manufacturer: "Nike Inc.",
          address: "Beaverton, OR, USA",
        },
        variants: {
          Size: ["39", "40", "41", "42", "43", "44"],
          Màu: ["White/Black", "All Black", "Navy/White", "Red/White"],
        },
        price: 3590000,
        stock: 80,
        rating: 4.5,
        views: 4320,
        sales: 127,
        isFeatured: true,
        status: "active",
        shop_id: 2,
        images: [
          "https://via.placeholder.com/300x300?text=Nike+Air+Max+270",
          "https://via.placeholder.com/300x300?text=Nike+Air+Max+270+2",
        ],
        thumbnail: "https://via.placeholder.com/150x150?text=Nike+Air+Max+270",
        videoUrl: "",
        tags: ["sneakers", "nike", "air-max", "running"],
        shipping: {
          weight: "0.8kg",
          dimensions: "33x20x12cm",
          methods: [
            { name: "Standard", price: 35000, enabled: true },
            { name: "Nhanh", price: 50000, enabled: true },
            { name: "Hỏa tốc", price: 70000, enabled: true },
          ],
        },
        createdAt: new Date(),
      },
      {
        name: "L'Oréal Revitalift Serum",
        description: "Anti-aging serum with hyaluronic acid and vitamin C for smoother, more radiant skin",
        category: "Beauty",
        brand: "L'Oréal",
        specifications: {
          sleeveLength: "N/A",
          manufacturer: "L'Oréal Group",
          address: "Paris, France",
        },
        variants: {
          Size: ["30ml", "50ml"],
          Màu: ["N/A"],
        },
        price: 850000,
        stock: 120,
        rating: 4.4,
        views: 1890,
        sales: 234,
        isFeatured: false,
        status: "active",
        shop_id: 1,
        images: [
          "https://via.placeholder.com/300x300?text=L'Oreal+Serum",
          "https://via.placeholder.com/300x300?text=L'Oreal+Serum+2",
        ],
        thumbnail: "https://via.placeholder.com/150x150?text=L'Oreal+Serum",
        videoUrl: "",
        tags: ["skincare", "serum", "anti-aging", "beauty"],
        shipping: {
          weight: "0.1kg",
          dimensions: "10x4x4cm",
          methods: [
            { name: "Standard", price: 25000, enabled: true },
            { name: "Nhanh", price: 40000, enabled: true },
            { name: "Hỏa tốc", price: 55000, enabled: true },
          ],
        },
        createdAt: new Date(),
      },
    ];

    // Insert products
    const insertedProducts = await Product.insertMany(products);
    console.log("✅ Products seeded");

    // Create sample reviews using the actual product IDs
    const reviews = [
      {
        product_id: insertedProducts[0]._id, // iPhone 15 Pro Max
        user_id: 1,
        rating: 5,
        comment: "Excellent product! Highly recommend.",
        created_at: new Date(),
      },
      {
        product_id: insertedProducts[0]._id, // iPhone 15 Pro Max
        user_id: 2,
        rating: 4,
        comment: "Good quality, fast delivery.",
        created_at: new Date(),
      },
      {
        product_id: insertedProducts[1]._id, // Samsung Galaxy S24 Ultra
        user_id: 3,
        rating: 5,
        comment: "Amazing camera quality!",
        created_at: new Date(),
      },
      {
        product_id: insertedProducts[2]._id, // MacBook Pro 14-inch M3
        user_id: 1,
        rating: 5,
        comment: "Perfect for work and creative tasks.",
        created_at: new Date(),
      },
      {
        product_id: insertedProducts[3]._id, // AirPods Pro 2nd generation
        user_id: 2,
        rating: 4,
        comment: "Great sound quality, comfortable fit.",
        created_at: new Date(),
      },
    ];

    await Review.insertMany(reviews);
    console.log("✅ Reviews seeded");

    // Create sample cart for test user using actual product IDs
    const sampleCart = {
      user_id: 1,
      products: [
        {
          product_id: insertedProducts[0]._id, // iPhone 15 Pro Max
          quantity: 1,
          variant: {
            size: "256GB",
            color: "Natural Titanium",
          },
          added_at: new Date(),
        },
        {
          product_id: insertedProducts[3]._id, // AirPods Pro 2nd generation
          quantity: 2,
          variant: {
            size: "One Size",
            color: "White",
          },
          added_at: new Date(),
        },
      ],
      last_updated: new Date(),
    };

    await Cart.create(sampleCart);
    console.log("✅ Cart seeded");
  } catch (error) {
    console.error("❌ MongoDB seeding failed:", error);
    throw error;
  }
};

// Export for use in other files
module.exports = { runAllSeeders };

// Run if called directly
if (require.main === module) {
  runAllSeeders()
    .then(() => {
      console.log("🎉 All seeders completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}
