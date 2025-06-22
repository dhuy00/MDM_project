// Utility functions and mock data for the Shopee project

// Mock product data
export const mockProduct = {
  id: 1,
  name: "Wireless Bluetooth Earbuds with Noise Cancellation",
  rating: 4.8,
  reviews: 1253,
  sold: 5642,
  price: 29.99,
  originalPrice: 59.99,
  discount: 50,
  images: [
    "https://via.placeholder.com/500",
    "https://via.placeholder.com/500",
    "https://via.placeholder.com/500",
    "https://via.placeholder.com/500",
    "https://via.placeholder.com/500",
  ],
  description:
    "Premium wireless earbuds with active noise cancellation, touch controls, and 30-hour battery life.",
  colors: ["Black", "White", "Blue"],
  variations: ["Standard", "Pro", "Lite"],
  specifications: [
    { name: "Brand", value: "TechAudio" },
    { name: "Model", value: "X-200" },
    { name: "Battery Life", value: "30 hours" },
    { name: "Connectivity", value: "Bluetooth 5.2" },
    { name: "Water Resistance", value: "IPX5" },
  ],
  seller: {
    name: "TechGadgets Official Store",
    rating: 4.9,
    followers: 25600,
    responseRate: 99,
    responseTime: "< 1 hour",
    joinedDate: "2019-04-15",
  },
};

// Generate mock similar products
export const generateSimilarProducts = (count = 6) => {
  return Array(count)
    .fill()
    .map((_, index) => ({
      id: index + 100,
      name: `Similar Product ${index + 1}`,
      price: (14.99 + index * 5).toFixed(2),
      image: "https://via.placeholder.com/180",
      sold: Math.floor(Math.random() * 1000),
    }));
};

// Generate mock flash sale products
export const generateFlashSaleProducts = (count = 6) => {
  return Array(count)
    .fill()
    .map((_, index) => ({
      id: index + 1,
      name: `Flash Sale Product ${index + 1}`,
      price: (9.99 + index * 5).toFixed(2),
      originalPrice: (19.99 + index * 10).toFixed(2),
      discount: 50,
      image: "https://via.placeholder.com/180",
      sold: Math.floor(Math.random() * 500),
      available: Math.floor(Math.random() * 100),
    }));
};

// Generate mock categories
export const mockCategories = [
  { id: 1, name: "Women's Fashion", image: "https://via.placeholder.com/80" },
  { id: 2, name: "Men's Fashion", image: "https://via.placeholder.com/80" },
  { id: 3, name: "Electronics", image: "https://via.placeholder.com/80" },
  { id: 4, name: "Home & Living", image: "https://via.placeholder.com/80" },
  { id: 5, name: "Health & Beauty", image: "https://via.placeholder.com/80" },
  { id: 6, name: "Baby & Toys", image: "https://via.placeholder.com/80" },
  { id: 7, name: "Groceries", image: "https://via.placeholder.com/80" },
  { id: 8, name: "Sports & Travel", image: "https://via.placeholder.com/80" },
  { id: 9, name: "Books & Media", image: "https://via.placeholder.com/80" },
  { id: 10, name: "Automotive", image: "https://via.placeholder.com/80" },
];

// Generate mock recommended products
export const generateRecommendedProducts = (count = 24) => {
  return Array(count)
    .fill()
    .map((_, index) => ({
      id: index + 1,
      name: `Product ${index + 1}`,
      price: (9.99 + index * 2).toFixed(2),
      image: "https://via.placeholder.com/180",
      sold: Math.floor(Math.random() * 1000),
    }));
};

// Format price with currency
export const formatPrice = (price, currency = "$") => {
  return `${currency}${parseFloat(price).toFixed(2)}`;
};

// Calculate discount percentage
export const calculateDiscountPercentage = (originalPrice, currentPrice) => {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Format large numbers with k, m suffix (e.g. 1.5k, 2.3m)
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "m";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Get star rating array (for rendering star icons)
export const getStarRatingArray = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  const stars = [];
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push("full");
  }
  // Add half star if needed
  if (hasHalfStar) {
    stars.push("half");
  }
  // Fill the rest with empty stars
  while (stars.length < 5) {
    stars.push("empty");
  }

  return stars;
};
