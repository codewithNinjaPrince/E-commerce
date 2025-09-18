import React from 'react'
import { assets } from '../assets/assets'

const footer = () => {
   return (
      <div>
         <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">

            <div>
               <img src={assets.logo} className='mb-5 w-32' alt="assets logo" />
               <p className='w-full md:w-2/3 text-gray-600' >Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem, rerum?</p>
            </div>

            <div>
               <p className='text-xl font-medium mb-5' >Company</p>
               <ul className='flex flex-col gap-1 text-gray-600'>
                  <li>Home</li>
                  <li>About</li>
                  <li>Delivery</li>
                  <li>Privacy Policy</li>
               </ul>
            </div>

            <div>
               <p className='text-xl font-medium mb-5' >Get In Touch</p>
               <ul className='flex flex-col gap-1 text-gray-600' >
                  <li>+91-87368-52549</li>
                  <li>dixitprince895@gmail.com</li>
               </ul>
            </div>

         </div>

         <div>
               <hr />
               <p className='py-5 text-sm text-center'>Copyright 2025@Alkoz Shop.com -All rights reserved</p>
            </div>
      </div>
   )
}

export default footer
