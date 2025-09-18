import React, { useContext,useState } from 'react'
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useEffect } from 'react';
import axios from 'axios'

const Orders = () => {
  const {backendUrl,token, currency } = useContext(ShopContext);
  const [orderData,setOrderData]=useState([])

  const loadOrderData=async()=>{
    try{
      if(!token){
        return null
      }
      const response =await axios.post(backendUrl+'/api/order/userorders',{},{headers:{token}})
      if(response.data.success){
        let allOrdersItem=[]
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            item['status']=order.status
            item['payment']=order.payment
            item['paymentMethod']=order.paymentMethod
            item['date']=order.date
            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse())
      }
    }catch(error){

    }
  }

  useEffect(()=>{
    loadOrderData()
  },[token])

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl mb-6'>
        <Title text1={'My'} and text2={'Orders'} />
      </div>

      <div>
        {
          orderData.map((item, index) => (
            <div key={index} className='py-4 border-t border-b text-gray-700 flex items-center justify-between gap-4'>
              
              {/* Left Side: Image and Product Details */}
              <div className='flex items-start gap-6 flex-1'>
                <img className='w-16 sm:w-20' src={item.image[0]} alt={item.name} />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-1 text-sm text-gray-700'>
                    <p >{currency}{item.price}</p>
                    <p>Quantity:{item.quantity}</p>
                    <p>Size:{item.size}</p>
                  </div>
                  <p className='mt-1 text-sm'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                  <p className='mt-2 text-sm'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                </div>
              </div>

              {/* Middle: Ready to Ship */}
              <div className='hidden md:flex items-center gap-2 px-4'>
                <div className='w-2 h-2 rounded-full bg-green-500'></div>
                <p className='text-sm md:text-base'>{item.status}</p>
              </div>

              {/* Right Side: Track Order Button */}
              <div className='px-4'>
                <button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-100'>Track Order</button>
              </div>

            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders;

