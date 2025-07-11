import React from 'react'
import Navigation from '../../components/order/Navigation'
import { FaRegBell, FaRegUser, FaStore } from 'react-icons/fa'
import { MdOutlineLocalOffer } from 'react-icons/md'
import { BsCoin } from 'react-icons/bs'
import OrderProduct from '../../components/order/OrderProduct'
import { productData } from '../../mock/productData'
import ReviewModal from '../../components/order/ReviewModal'
import { useState, useEffect } from 'react'

const Order = () => {
  const [activeTab, setActiveTab] = useState('Tất cả')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredProducts, setFilteredProducts] = useState(productData)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null);

  const tabs = ['Tất cả', 'Chờ thanh toán', 'Vận chuyển', 'Chờ giao hàng', 'Hoàn thành', 'Đã huỷ', 'Trả hàng/Hoàn tiền']

  useEffect(() => {
    filterProducts()
  }, [activeTab, searchTerm])

  const handleOpenReviewModal = (product) => {
    setSelectedProduct(product);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedProduct(null);
  };

  const filterProducts = () => {
    let filtered = [...productData]

    if (activeTab !== 'Tất cả') {
      filtered = filtered.filter((p) => p.status === activeTab)
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.orderId.toString().includes(searchTerm) ||
        p.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }

  return (
    <div>
      <Navigation />
      <div className="min-h-screen bg-[#f5f5f5] px-32 text-[#333] flex">
        {/* Sidebar */}
        <div className="w-[240px] bg-white p-6 border-r">
          <div className="flex flex-col items-center gap-2 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full" />
            <div className="font-semibold">huyvc816</div>
            <button className="text-blue-500 text-xs">Sửa Hồ Sơ</button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FaRegBell /> Thông Báo
            </div>
            <div className="flex items-center gap-2">
              <FaRegUser /> Tài Khoản Của Tôi
            </div>
            <div className="flex items-center gap-2 text-[#f53d2d] font-medium">
              <FaStore /> Đơn Mua
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineLocalOffer /> Kho Voucher
            </div>
            <div className="flex items-center gap-2">
              <BsCoin /> Shopee Xu
            </div>
            <div className="flex items-center gap-2">
              <img src="https://cf.shopee.vn/file/8f9261bc7256d66fdc92e3980e64c978" alt="sale" className="w-5 h-5" />
              25.6 Lượng Vé Sale Tới <span className="text-xs text-red-500 font-bold ml-1">New</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          {/* Tabs */}
          <div className="flex gap-6 border-b pb-2 mb-4">
            {tabs.map((label, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(label)}
                className={`pb-1 ${activeTab === label ? 'text-[#ee4d2d] border-b-2 border-[#ee4d2d]' : 'hover:text-[#ee4d2d]'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <input
            type="text"
            placeholder="Bạn có thể tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
            className="w-full border border-gray-200 p-2 mb-4 rounded outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Order item */}
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <OrderProduct
                key={item.orderId}
                product={item}
                onReviewClick={() => handleOpenReviewModal(item)}
              />
            ))
          ) : (
            <div className="text-center text-gray-500">Không tìm thấy đơn hàng phù hợp</div>
          )}
        </div>
      </div>
      {isReviewModalOpen && (
        <ReviewModal product={selectedProduct} onClose={handleCloseReviewModal} />
      )}
    </div>
  )
}

export default Order
