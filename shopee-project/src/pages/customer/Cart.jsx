import React from 'react'
import Navigation from '../../components/cart/Navigation'
import CartItem from '../../components/cart/CartItem'
import { cartData } from '../../mock/cartData'
import CartSummary from '../../components/cart/CartSummary'

const Cart = () => {
  return (
    <div className='flex flex-col gap-4'>
      <Navigation />
      <div className='px-32 flex flex-col gap-4'>
        <div className='flex justify-between bg-white py-4 px-8 rounded-[4px]'>
          <div className='flex items-center gap-2'>
            <input type='checkbox' className='w-4 h-4' />
            <span>Sản phẩm</span>
          </div>
          <div className='flex gap-20 text-gray-500'>
            <span>Đơn Giá</span>
            <span>Số Lượng</span>
            <span>Số Tiền</span>
            <span>Thao Tác</span>
          </div>
        </div>
        {cartData.map((cartGroup, idx) => (
          <CartItem key={idx} shopName={cartGroup.shopName} products={cartGroup.products} />
        ))}
      </div>
      <CartSummary/>
    </div>
  )
}

export default Cart
