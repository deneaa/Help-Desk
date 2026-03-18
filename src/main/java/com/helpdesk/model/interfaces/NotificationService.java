package com.helpdesk.model.interfaces;

import com.helpdesk.model.entities.Notification;
import java.util.List;

public interface NotificationService {
    Notification createNotification(Notification notification);
    List<Notification> getNotificationsByUser(Long userId);
    Notification markAsRead(Long notificationId);
    void deleteNotification(Long id);
}