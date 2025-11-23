import React from 'react'
import { useContext } from 'react'  
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = () => {
   const {currency,delivery_fee,getCartAmount} =useContext(ShopContext)
  return (
    <div className='w-full'>
      <div className='text-2xl'>
         <Title text1={'Cart'}  text2={'totals'}/>
      </div>
      <div className='flex flex-col gap-2 mt-2 gext-sm'>
         <div className='flex justify-between'>
            <p>Subtotal</p>
            <p>{currency} {getCartAmount()}.00</p>
         </div>
         <hr />
         <div className='flex justify-between'>
            <p>Shipping fee</p>
            <p>{currency} {delivery_fee}.00</p>
         </div>
         <hr />
         <div className='flex justify-between'>
            <b>Total</b>
            <p>{currency} {getCartAmount()===0? 0:getCartAmount()+delivery_fee}.00</p>
         </div>

      </div>
      
    </div>
  )
}

export default CartTotal
