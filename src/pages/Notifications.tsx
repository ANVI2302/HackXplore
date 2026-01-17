import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { Bell, Trash2, Check } from "lucide-react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function Notifications() {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token) return;

    const fetchNotifications = async () => {
      try {
        const data = await api.getNotifications(token);
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [token]);

  const handleMarkAsRead = async (notifId: string) => {
    if (!token) return;
    try {
      setNotifications(notifications.map(n => 
        n.id === notifId ? { ...n, is_read: true } : n
      ));
      await api.markNotificationsRead(token, [notifId]);
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleDelete = async (notifId: string) => {
    if (!token) return;
    try {
      setNotifications(notifications.filter(n => n.id !== notifId));
      await api.deleteNotification(token, notifId);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  if (loading) return <Loader />;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "achievement":
        return "bg-amber-900 text-amber-200";
      case "mentorship":
        return "bg-purple-900 text-purple-200";
      case "course_recommendation":
        return "bg-green-900 text-green-200";
      case "connection_request":
        return "bg-blue-900 text-blue-200";
      default:
        return "bg-gray-700 text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Bell className="w-10 h-10 text-blue-400" />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="text-sm font-semibold bg-red-600 text-white px-3 py-1 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-gray-400">Stay updated with your activities</p>
        </div>

        {notifications.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No notifications yet</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <Card 
                key={notif.id} 
                className={`border-l-4 p-6 ${
                  notif.is_read 
                    ? "bg-slate-800 border-l-gray-600" 
                    : "bg-slate-700 border-l-blue-500"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs px-2 py-1 rounded font-semibold ${getTypeColor(notif.type)}`}>
                        {notif.type.replace("_", " ").toUpperCase()}
                      </span>
                      {!notif.is_read && (
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      )}
                    </div>
                    <h3 className="text-white font-semibold text-lg">{notif.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{notif.message}</p>
                    <p className="text-gray-500 text-xs mt-3">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!notif.is_read && (
                      <button 
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="p-2 text-gray-400 hover:text-green-400 transition"
                        title="Mark as read"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(notif.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
