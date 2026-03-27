package com.helpdesk.service;

import com.helpdesk.model.entities.Notification;
import com.helpdesk.model.interfaces.NotificationService;
import com.helpdesk.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public Notification createNotification(Notification notification) {
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        return notificationRepository.save(notification);
    }
    @Override
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @Override
    public List<Notification> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    @Override
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Override
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}