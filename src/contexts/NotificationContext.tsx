/**
 * NotificationContext - Context for managing real-time notifications
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';
import { websocketService, type WebSocketMessage, type NotificationMessage } from '../services/websocket.service';
import { useAuth } from './AuthContext';

export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  related_order_id?: number;
  related_seller_id?: number;
  is_read: boolean;
  created_at: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Connect/disconnect WebSocket when auth state changes
  useEffect(() => {
    if (token && user) {
      websocketService.connect(token);

      // Register message handler
      const unsubscribe = websocketService.onMessage(handleWebSocketMessage);

      // Check connection status periodically
      const checkConnection = setInterval(() => {
        setIsConnected(websocketService.isConnected());
      }, 1000);

      return () => {
        unsubscribe();
        clearInterval(checkConnection);
        websocketService.disconnect();
      };
    } else {
      // User logged out, disconnect
      websocketService.disconnect();
      setNotifications([]);
      setIsConnected(false);
    }
  }, [token, user]);

  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    console.log('[NotificationContext] Received message:', message);

    if (message.type === 'connection') {
      // Connection established
      console.log('[NotificationContext] WebSocket connection established');
      setIsConnected(true);
    } else if (message.type === 'notification') {
      // New notification received
      const notificationMsg = message as NotificationMessage;

      const newNotification: Notification = {
        id: notificationMsg.notification_id,
        title: notificationMsg.title,
        message: notificationMsg.message,
        notification_type: notificationMsg.notification_type,
        related_order_id: notificationMsg.related_order_id,
        related_seller_id: notificationMsg.related_seller_id,
        is_read: false,
        created_at: notificationMsg.created_at,
      };

      // Add to notifications list
      setNotifications(prev => [newNotification, ...prev]);

      // Show toast notification
      showToastForNotification(newNotification);
    }
  }, []);

  const showToastForNotification = (notification: Notification) => {
    // Different toast styles for different notification types
    switch (notification.notification_type) {
      case 'order_created':
        toast.success(notification.title, {
          description: notification.message,
          duration: 5000,
        } as any);
        break;
      case 'order_confirmed':
        toast.success(notification.title, {
          description: notification.message,
          duration: 5000,
        } as any);
        break;
      case 'order_delivered':
        toast.success(notification.title, {
          description: notification.message,
          duration: 5000,
        } as any);
        break;
      case 'order_cancelled':
        toast.error(notification.title, {
          description: notification.message,
          duration: 5000,
        } as any);
        break;
      default:
        toast(notification.title, {
          description: notification.message,
          duration: 4000,
        } as any);
    }

    // Play notification sound (optional)
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore error if audio doesn't exist or can't play
      });
    } catch {
      // Ignore audio errors
    }
  };

  const markAsRead = useCallback((notificationId: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, is_read: true }
          : notification
      )
    );

    // TODO: Call API to mark as read on server
    // api.patch(`/api/v1/notifications/${notificationId}`, { is_read: true });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, is_read: true }))
    );

    // TODO: Call API to mark all as read on server
    // api.post('/api/v1/notifications/mark-all-read');
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
