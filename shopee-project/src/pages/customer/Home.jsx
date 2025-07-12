import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaFire, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { mockCategories, formatPrice } from "../../utils/productUtils";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // Get categories from productUtils (TODO: fetch from API when available)
  const categories = mockCategories;

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    console.log("Home fetchProducts called"); // Debug log
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch featured products for flash sale
        const featuredResponse = await axios.get(`${API_URL}/products/search`, {
          params: { sort: "popular", limit: 6 },
        });

        // Add discount information for flash sale products
        const featuredWithDiscount = (featuredResponse.data || []).map((product) => {
          console.log("Flash sale product:", product); // Debug log
          console.log("Product _id:", product._id); // Debug log
          console.log("Product _id type:", typeof product._id); // Debug log
          return {
            ...product,
            id: product._id ? product._id.toString() : product.id,
            image: product.thumbnail || product.images?.[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Crect width='180' height='180' fill='%23f5f5f5'/%3E%3Ctext x='90' y='90' font-family='Arial' font-size='14' fill='%23999' text-anchor='middle' dy='0.3em'%3ENo Image%3C/text%3E%3C/svg%3E",
            discount: Math.floor(Math.random() * 30) + 20, // 20-50% discount
            originalPrice: Math.round(
              product.price * (1 + (Math.random() * 0.5 + 0.2))
            ), // 20-70% higher
          };
        });
        console.log("Featured with discount:", featuredWithDiscount); // Debug log
        setFlashSaleProducts(featuredWithDiscount);

        // Fetch recommended products
        const recommendedResponse = await axios.get(`${API_URL}/products`);
        console.log("Recommended response:", recommendedResponse.data); // Debug log
        const recommendedWithDetails = (recommendedResponse.data || []).map(
          (product) => {
            console.log("Recommended product:", product); // Debug log
            console.log("Product _id:", product._id); // Debug log
            console.log("Product _id type:", typeof product._id); // Debug log
            return {
              ...product,
              id: product._id ? product._id.toString() : product.id,
              image: product.thumbnail || product.images?.[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Crect width='180' height='180' fill='%23f5f5f5'/%3E%3Ctext x='90' y='90' font-family='Arial' font-size='14' fill='%23999' text-anchor='middle' dy='0.3em'%3ENo Image%3C/text%3E%3C/svg%3E",
              sold: product.sales || Math.floor(Math.random() * 1000),
            };
          }
        );
        console.log("Recommended with details:", recommendedWithDetails); // Debug log
        setRecommendedProducts(recommendedWithDetails);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Loading and Error States */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-white/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <FaSpinner className="text-[#f53d2d] text-4xl animate-spin mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="w-full bg-red-50 border border-red-200 p-4 mb-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-red-700 underline mt-2"
          >
            Try again
          </button>
        </div>
      )}

      {/* Banner Carousel */}
      <div className="w-full bg-white mb-4">
        <div className="container mx-auto py-4 px-4">
          <div className="w-full h-[300px] bg-[#f53d2d] rounded-lg relative overflow-hidden">
            <img
              src="https://cf.shopee.sg/file/sg-11134201-22120-nza33g8qbelvb5"
              alt="Shopee Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-0 w-full flex justify-center space-x-2">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === 0 ? "bg-white" : "bg-white/50"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="w-full bg-white mb-4">
        <div className="container mx-auto py-6 px-4">
          <h2 className="text-lg font-medium mb-4">Popular Categories</h2>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
            {categories.map((category) => (
              <Link
                to={`/category/${category.id}`}
                key={category.id}
                className="flex flex-col items-center hover:text-[#f53d2d]"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-[80px] h-[80px] rounded-lg object-cover mb-2"
                />
                <span className="text-xs text-center">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Flash Sale */}
      <div className="w-full bg-white mb-4">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <FaFire className="text-[#f53d2d] mr-2" />
              <h2 className="text-lg font-medium text-[#f53d2d]">FLASH SALE</h2>
            </div>
            <Link
              to="/flash-sale"
              className="text-sm text-[#f53d2d] flex items-center"
            >
              See All <FaArrowRight className="ml-1 text-xs" />
            </Link>
          </div>

          <div className="flex overflow-x-auto pb-4 space-x-4">
            {flashSaleProducts.length === 0 && !loading ? (
              <div className="w-full py-10 text-center text-gray-500">
                No flash sale products available
              </div>
            ) : (
              flashSaleProducts.map((product) => (
                <div
                  key={product.id}
                  className="min-w-[180px] bg-white border border-gray-100 rounded-sm p-2 flex flex-col"
                >
                  <Link to={`/product/${product.id}`} className="relative mb-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-[180px] object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Crect width='180' height='180' fill='%23f5f5f5'/%3E%3Ctext x='90' y='90' font-family='Arial' font-size='14' fill='%23999' text-anchor='middle' dy='0.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute top-0 right-0 bg-[#f53d2d] text-white text-xs px-1 py-0.5">
                      {product.discount}% OFF
                    </div>
                  </Link>
                  <Link
                    to={`/product/${product.id}`}
                    className="hover:text-[#f53d2d]"
                  >
                    <h3 className="text-sm mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center space-x-1 mt-auto">
                    <span className="text-[#f53d2d] font-medium">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-gray-400 text-xs line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recommended Products */}
      <div className="w-full bg-white">
        <div className="container mx-auto py-4 px-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Recommended For You</h2>
            <Link
              to="/recommendations"
              className="text-sm text-[#f53d2d] flex items-center"
            >
              See All <FaArrowRight className="ml-1 text-xs" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {recommendedProducts.length === 0 && !loading ? (
              <div className="col-span-full py-10 text-center text-gray-500">
                No recommended products available
              </div>
            ) : (
              recommendedProducts.map((product) => (
                <Link
                  to={`/product/${product.id}`}
                  key={product.id}
                  className="bg-white border border-gray-100 rounded-sm p-2 hover:shadow-md transition-shadow"
                >
                  <div className="mb-2">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-[180px] object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Crect width='180' height='180' fill='%23f5f5f5'/%3E%3Ctext x='90' y='90' font-family='Arial' font-size='14' fill='%23999' text-anchor='middle' dy='0.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <h3 className="text-sm mb-1 line-clamp-2 h-10">
                    {product.name}
                  </h3>
                  <div className="text-[#f53d2d] font-medium">
                    {formatPrice(product.price)}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    {product.sold || 0} sold
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Load More Button */}
      <div className="w-full py-6 flex justify-center">
        {recommendedProducts.length > 0 && (
          <button
            onClick={async () => {
              if (loading) return;

              setLoading(true);
              try {
                // Fetch next batch of products
                const offset = recommendedProducts.length;
                const response = await axios.get(`${API_URL}/products`, {
                  params: { offset, limit: 12 },
                });

                const moreProducts = response.data.map((product) => ({
                  ...product,
                  id: product._id,
                  image: product.thumbnail || product.images[0],
                  sold: product.sales || Math.floor(Math.random() * 1000),
                }));

                setRecommendedProducts([
                  ...recommendedProducts,
                  ...moreProducts,
                ]);
              } catch (err) {
                console.error("Failed to fetch more products:", err);
                setError("Failed to load more products");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className={`bg-white text-[#f53d2d] border border-[#f53d2d] px-8 py-2 rounded hover:bg-[#fef6f5] transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
