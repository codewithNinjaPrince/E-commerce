import { useEffect, useState } from "react";
import { FaBell, FaTrash, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("merchantToken");

  // unread count (derived)
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch Notifications
  const loadNotifications = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${backendUrl}/api/merchant/notifications`, {
        headers: { token },
      });

      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load notifications");
    }

    setLoading(false);
  };

  // Mark all as read
  const markAllRead = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/merchant/notifications/mark-all-read`,
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        loadNotifications();
      }
    } catch (error) {
      toast.error("Could not mark all as read");
    }
  };

  // Delete Notification
  const deleteNotification = async (id) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/merchant/notifications/delete`,
        { id },
        { headers: { token } }
      );

      if (res.data.success) {
        setNotifications(notifications.filter((n) => n._id !== id));
        toast.success("Notification deleted");
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div
      className="
        w-full max-w-[1600px] mx-auto 
        p-4 sm:p-6 text-white 
        pt-[30px] sm:pt-[60px] lg:pt-[50px]
      "
    >
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div
          className="
          flex flex-col sm:flex-row 
          sm:justify-between sm:items-center 
          gap-4 mb-6
        "
        >
          {/* TITLE */}
          <h1
            className="
              text-3xl sm:text-4xl font-extrabold 
              bg-gradient-to-r from-white via-gray-300 to-gray-500 
              bg-clip-text text-transparent
              flex items-center gap-3
            "
          >
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow">
                {unreadCount}
              </span>
            )}
          </h1>

          {/* MARK ALL READ BUTTON */}
          {notifications.length > 0 && (
            <button
              onClick={markAllRead}
              className="
                flex items-center justify-center gap-2 
                bg-blue-600 hover:bg-blue-700 
                px-4 py-2 rounded-lg text-sm shadow cursor-pointer 
                w-full sm:w-auto
              "
            >
              <FaCheckCircle /> Mark All as Read
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-10 h-10 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
            <p className="mt-3">Loading notifications...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && notifications.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center text-gray-400 cursor-pointer">
            <FaBell className="text-5xl mx-auto mb-4 opacity-60" />
            <p className="text-xl font-semibold">No Notifications</p>
            <p className="text-gray-500 mt-1">
              All caught up! We'll notify you about new orders, messages, and
              updates.
            </p>
          </div>
        )}

        {/* LIST */}
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              className="
      bg-white/5 border border-white/10
      p-4 sm:p-5 rounded-xl cursor-pointer flex justify-between 
      items-start hover:border-blue-600/30 transition 
      shadow-[0_0_15px_rgba(255,255,255,0.05)]
    "
            >
              <div className="flex gap-4">
                {!n.read && (
                  <span className="w-3 h-3 mt-2 bg-blue-400 rounded-full animate-pulse cursor-pointer"></span>
                )}

                <div>
                  <p className="font-semibold text-lg">{n.title}</p>
                  <p className="text-gray-400 text-sm mt-1">{n.message}</p>

                  <p className="text-gray-500 text-xs mt-2">
                    {new Date(n.date).toLocaleString()}
                  </p>

                  {/* UPDATE NOW BUTTON for ORDER_DELAYED */}
                  {n.type === "ORDER_DELAYED" && (
                    <button
                      onClick={() => navigate(n.meta?.redirect || "/orders")}
                      className="
              mt-3 px-4 py-2 text-sm rounded-lg 
              bg-blue-600 hover:bg-blue-700 
              transition cursor-pointer
            "
                    >
                      Update Now
                    </button>
                  )}
                </div>
              </div>

              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteNotification(n._id)}
                className="
        text-red-500 hover:text-red-700 
        p-2 rounded-lg hover:bg-red-500/10 
        transition cursor-pointer
      "
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notification;
