import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets } from '../assets/assets'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  // Fetch Products
  const fetchList = async () => {
  setLoading(true);
  try {
    const response = await axios.post(
      backendUrl + "/api/product/list",
      {},
      { headers: { token } }
    );

    if (response.data.success) {
      setList(response.data.products);
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
  setLoading(false);
};



  // Open confirmation box
  const openDeleteConfirm = (id) => {
    setDeleteId(id)
    setShowConfirm(true)
  }

  // Delete Product After Confirmation
  const confirmDelete = async () => {
    setShowConfirm(false)
    setDeleteLoading(true)

    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id: deleteId },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList()
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

    setDeleteLoading(false)
    setDeleteId(null)
  }

  useEffect(() => {
    fetchList()
  }, [])

  // ✅ Full Loader Screen
  const Loader = ({ text, subText }) => {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col justify-center items-center">
        <div className="w-14 h-14 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

        <p className="mt-6 text-lg font-semibold">{text}</p>
        <p className="text-sm mt-1 text-gray-500">{subText}</p>
      </div>
    )
  }

  // ✅ Confirmation Popup
  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-40">
      <div className="bg-white p-6 rounded-md text-center w-[90%] max-w-sm">

        <h2 className="text-lg font-semibold">Are you sure?</h2>
        <p className="text-sm text-gray-600 mt-2">
          Do you want to delete this product permanently?
        </p>

        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={() => setShowConfirm(false)}
            className="px-5 py-2 border border-gray-400 rounded cursor-pointer"
          >
            No
          </button>

          <button
            onClick={confirmDelete}
            className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
          >
            Yes
          </button>
        </div>

      </div>
    </div>
  )

  // ✅ Initial Page Loader
  if (loading) {
    return <Loader text="Loading your Online Store" subText="Hold yourself tight..." />
  }

  // ✅ Delete Loader
  if (deleteLoading) {
    return <Loader text="Oops! One item deleted" subText="Updating your store..." />
  }

  return (
    <div className="w-full px-2 md:px-6 py-4">

      {showConfirm && <DeleteConfirmModal />}

      <h2 className="text-lg font-semibold mb-4">🛒 Product List</h2>

      {/* HEADER FOR LARGE SCREEN */}
      <div className="hidden lg:grid grid-cols-[60px_80px_3fr_2fr_1fr_80px] bg-gray-100 px-4 py-2 font-semibold rounded-lg text-sm cursor-pointer">
        <p>S.No</p>
        <p>Image</p>
        <p>Name</p>
        <p>Category</p>
        <p>Discounted Price</p>
        <p className="text-center">Delete</p>
      </div>

      {/* PRODUCT LIST */}
      <div className="flex flex-col gap-4 mt-4 cursor-pointer">

        {list.length === 0 && (
          <p className="text-center text-gray-500">
            No products available.
          </p>
        )}

        {list.map((item, index) => (
          <div
            key={item._id}
            className="border rounded-lg shadow-sm p-3 bg-white"
          >

            <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[60px_80px_3fr_2fr_1fr_80px] lg:items-center">

              {/* Serial No */}
              <div className="flex justify-between lg:block cursor-pointer">
                <span className="text-gray-500 lg:hidden">S.No:</span>
                <p>{index + 1}</p>
              </div>

              {/* Image */}
              <div className="flex justify-between items-center lg:block cursor-pointer">
                <span className="text-gray-500 lg:hidden">Image:</span>
                <img
                  src={item.image?.[0] || assets.placeholder_img}
                  alt="Product"
                  className="w-14 h-14 object-cover rounded-md border"
                />
              </div>

              {/* Name */}
              <div className="flex justify-between lg:block cursor-pointer">
                <span className="text-gray-500 lg:hidden">Name:</span>
                <p className="font-semibold truncate">{item.name}</p>
              </div>

              {/* Category */}
              <div className="flex justify-between lg:block cursor-pointer">
                <span className="text-gray-500 lg:hidden">Category:</span>
                <p className="text-gray-600">{item.category}</p>
              </div>

              {/* Price */}
              <div className="flex justify-between lg:block cursor-pointer">
                <span className="text-gray-500 lg:hidden">Price:</span>
                <p className="font-bold">{currency}{item.discountedPrice}</p>
              </div>

              {/* Delete Button */}
              <div className="flex justify-between items-center lg:justify-center">
                <span className="text-gray-500 lg:hidden">Remove:</span>
                <button
                  onClick={() => openDeleteConfirm(item._id)}
                  className="flex justify-center items-center bg-red-100 
                  hover:bg-red-500 text-red-600 hover:text-white 
                  rounded-md w-9 h-9 transition cursor-pointer"
                >
                  <img
                    src={assets.bin_icon}
                    alt="Delete"
                    className="w-4"
                  />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default List


