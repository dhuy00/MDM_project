const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  brand: String,
  attributes: {
    sleeveLength: String,
    manufacturer: String,
    manufacturerAddress: String
  },
  images: [String],
  thumbnail: String,
  videoUrl: String,
  variantGroups: [{
    name: String,
    values: [String]
  }],
  price: Number,
  stock: Number,
  tags: [String],
  isFeatured: Boolean,
  views: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  status: { type: String, default: "active" },
  shipping: {
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    methods: [{
      name: String,
      price: Number,
      enabled: Boolean
    }]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
