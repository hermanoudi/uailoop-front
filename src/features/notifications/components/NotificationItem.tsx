/**
 * NotificationItem - Individual notification item
 */

import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  Bell
} from 'lucide-react';
import { useNotifications, type Notification } from '../../../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const { markAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleClick = () => {
    // Mark as read
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    // Navigate to related order if exists
    if (notification.related_order_id) {
      navigate(`/orders/${notification.related_order_id}`);
    }

    // Close dropdown
    onClick?.();
  };

  // Get icon based on notification type
  const getIcon = () => {
    switch (notification.notification_type) {
      case 'order_created':
        return <ShoppingBag className="h-5 w-5 text-blue-600" />;
      case 'order_confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'order_out_for_delivery':
        return <Truck className="h-5 w-5 text-orange-600" />;
      case 'order_delivered':
        return <Package className="h-5 w-5 text-emerald-600" />;
      case 'order_cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  // Get background color based on read status
  const bgColor = notification.is_read ? 'bg-white' : 'bg-emerald-50';

  // Format time
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <button
      onClick={handleClick}
      className={`w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left ${bgColor}`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900 line-clamp-1">
              {notification.title}
            </p>
            {!notification.is_read && (
              <span className="flex-shrink-0 h-2 w-2 bg-emerald-600 rounded-full mt-1" />
            )}
          </div>
          <p className="mt-1 text-sm text-gray-700 line-clamp-2">
            {notification.message}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {timeAgo}
          </p>
        </div>
      </div>
    </button>
  );
}
