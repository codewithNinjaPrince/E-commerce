import { useEffect, useState } from "react";
import { FaBell, FaTrash, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("merchantToken");

  /* =====================================================
     LOAD NOTIFICATIONS (CACHE → API)
  ===================================================== */
  const loadNotifications = async () => {
    try {
      // 🔹 1. Instant load from cache
      const cached = sessionStorage.getItem("merchantNotifications");
      if (cached) {
        setNotifications(JSON.parse(cached));
        setLoading(false);
      }

      // 🔹 2. Background API sync
      const res = await axios.get(
        `${backendUrl}/api/merchant/notifications`,
        { headers: { token } }
      );

      if (res.data.success) {
        setNotifications(res.data.notifications);
        sessionStorage.setItem(
          "merchantNotifications",
          JSON.stringify(res.data.notifications)
        );
      }
    } catch {
      toast.error("Failed to load notifications");
    }

    setLoading(false);
  };

  /* =====================================================
     SOCKET REAL-TIME LISTENER
  ===================================================== */
  useEffect(() => {
    socket.on("NEW_NOTIFICATION", (notification) => {
      setNotifications((prev) => {
        const updated = [notification, ...prev];

        sessionStorage.setItem(
          "merchantNotifications",
          JSON.stringify(updated)
        );

        return updated;
      });
    });

    return () => {
      socket.off("NEW_NOTIFICATION");
    };
  }, []);

  /* =====================================================
     FIRST LOAD
  ===================================================== */
  useEffect(() => {
    loadNotifications();
  }, []);

  /* =====================================================
     ACTIONS
  ===================================================== */

  const markAllRead = async () => {
    try {
      setNotifications((prev) => {
        const updated = prev.map((n) => ({ ...n, read: true }));
        sessionStorage.setItem(
          "merchantNotifications",
          JSON.stringify(updated)
        );
        return updated;
      });

      await axios.post(
        `${backendUrl}/api/merchant/notifications/mark-all-read`,
        {},
        { headers: { token } }
      );
    } catch {
      toast.error("Could not mark all as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      setNotifications((prev) => {
        const updated = prev.filter((n) => n._id !== id);
        sessionStorage.setItem(
          "merchantNotifications",
          JSON.stringify(updated)
        );
        return updated;
      });

      await axios.post(
        `${backendUrl}/api/merchant/notifications/delete`,
        { id },
        { headers: { token } }
      );
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleNotificationClick = (n) => {
    // 🔹 mark read locally
    setNotifications((prev) => {
      const updated = prev.map((x) =>
        x._id === n._id ? { ...x, read: true } : x
      );

      sessionStorage.setItem(
        "merchantNotifications",
        JSON.stringify(updated)
      );

      return updated;
    });

    // 🔥 redirect rule
    if (n.type === "NEW_ORDER") {
      navigate("/orders");
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* =====================================================
     UI (UNCHANGED)
  ===================================================== */
  return (
    <div className="
      w-full max-w-[1600px] mx-auto 
      p-4 sm:p-6 text-white 
      pt-[30px] sm:pt-[60px] lg:pt-[50px]
    ">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="
          flex flex-col sm:flex-row 
          sm:justify-between sm:items-center 
          gap-4 mb-6
        ">
          <h1 className="
            text-3xl sm:text-4xl font-extrabold 
            bg-gradient-to-r from-white via-gray-300 to-gray-500 
            bg-clip-text text-transparent
            flex items-center gap-3
          ">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full shadow">
                {unreadCount}
              </span>
            )}
          </h1>

          {notifications.length > 0 && (
            <button
              onClick={markAllRead}
              className="
                flex items-center justify-center gap-2 
                bg-blue-600 hover:bg-blue-700 
                px-4 py-2 rounded-lg text-sm shadow cursor-pointer
              "
            >
              <FaCheckCircle /> Mark All as Read
            </button>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="w-10 h-10 border-4 border-gray-500 border-t-white rounded-full animate-spin"></div>
            <p className="mt-3">Loading notifications...</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && notifications.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-10 text-center text-gray-400">
            <FaBell className="text-5xl mx-auto mb-4 opacity-60" />
            <p className="text-xl font-semibold">No Notifications</p>
          </div>
        )}

        {/* LIST */}
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className="
                bg-white/5 border border-white/10
                p-4 sm:p-5 rounded-xl cursor-pointer
                flex justify-between items-start
                hover:border-blue-600/30 transition
              "
            >
              <div className="flex gap-4">
                {!n.read && (
                  <span className="w-3 h-3 mt-2 bg-blue-400 rounded-full animate-pulse"></span>
                )}

                <div>
                  <p className="font-semibold text-lg">{n.title}</p>
                  <p className="text-gray-400 text-sm mt-1">{n.message}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    {new Date(n.date).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n._id);
                }}
                className="text-red-500 hover:text-red-700 p-2"
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
