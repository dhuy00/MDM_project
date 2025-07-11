const Product = require("../models/mongodb/product");

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(parseInt(req.params.id));

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// Get similar products based on category, brand, or tags
exports.getSimilarProducts = async (req, res) => {
  try {
    const product = await Product.findById(parseInt(req.params.id));

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find products with the same category or brand, but exclude the current product
    const similarProducts = await Product.find({
      $and: [
        { _id: { $ne: product._id } },
        {
          $or: [
            { category: product.category },
            { brand: product.brand },
            { tags: { $in: product.tags } },
          ],
        },
      ],
    }).limit(8); // Limit to 8 similar products

    res.status(200).json(similarProducts);
  } catch (error) {
    console.error("Error fetching similar products:", error);
    res.status(500).json({ message: "Failed to fetch similar products" });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const {
      query = "",
      category = "",
      brand = "",
      minPrice,
      maxPrice,
      sort = "relevance",
    } = req.query;

    // Build the filter
    let filter = {};

    // Add search query
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ];
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by brand
    if (brand) {
      filter.brand = brand;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Set up sorting
    let sortOptions = {};
    switch (sort) {
      case "price_asc":
        sortOptions = { price: 1 };
        break;
      case "price_desc":
        sortOptions = { price: -1 };
        break;
      case "rating":
        sortOptions = { rating: -1 };
        break;
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "popular":
        sortOptions = { sales: -1 };
        break;
      default:
        sortOptions = { _id: 1 };
    }

    const products = await Product.find(filter).sort(sortOptions);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Failed to search products" });
  }
};

// Get product categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// Get product brands
exports.getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    res.status(200).json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ message: "Failed to fetch brands" });
  }
};
