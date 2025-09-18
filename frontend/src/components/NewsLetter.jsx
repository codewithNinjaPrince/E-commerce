import React from 'react'

const NewsLetter = () => {
const onSubmitHandler = (e) =>{
   e.preventDefault();
}

  return (
    <div className='text-center cursor-pointer hover:scale-103 duration-100'>
      <p className='text-2xl font-medium text-gray-800 cursor-pointer'>Subscribe Now & get 20% Off</p>
      <p className='text-gray-400 mt-3 cursor-pointer' >
         Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis, dolore.
      </p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3' >
         <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Enter Your Email' required />
         <button className='bg-black text-white text-xs px-10 py-4 cursor-pointer' type='submit'>Subscribe</button>
      </form>
      
    </div>
  )
}

export default NewsLetter
