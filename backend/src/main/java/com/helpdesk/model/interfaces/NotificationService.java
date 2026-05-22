package com.helpdesk.model.interfaces;

import com.helpdesk.model.dto.notification.CreateBroadcastNotificationDTO;
import com.helpdesk.model.dto.notification.CreateNotificationDTO;
import com.helpdesk.model.dto.notification.NotificationResponseDTO;
import com.helpdesk.model.entities.Notification;
import java.util.List;

public interface NotificationService {
    NotificationResponseDTO createNotification(CreateNotificationDTO dto);

    List<NotificationResponseDTO> getMyNotifications();

    List<NotificationResponseDTO> getNotificationsByUser(Long userId);

    List<NotificationResponseDTO> getAllNotifications();

    NotificationResponseDTO markAsRead(Long notificationId);

    void deleteNotification(Long id);

    void markAllAsRead();

    void broadcastToAllUsers(CreateBroadcastNotificationDTO dto);
}