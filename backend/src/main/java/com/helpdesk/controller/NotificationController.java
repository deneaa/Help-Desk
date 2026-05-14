package com.helpdesk.controller;

import com.helpdesk.model.dto.notification.NotificationResponseDTO;
import com.helpdesk.model.entities.Notification;
import com.helpdesk.model.interfaces.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public List<NotificationResponseDTO> getAll() {
        return notificationService.getAllNotifications();
    }

    @GetMapping("/my")
    public List<NotificationResponseDTO> getMyNotifications() {
        return notificationService.getMyNotifications();
    }

    @GetMapping("/user/{userId}")
    public List<NotificationResponseDTO> getByUser(@PathVariable Long userId) {
        return notificationService.getNotificationsByUser(userId);
    }

    @PatchMapping("/{id}/read")
    public NotificationResponseDTO markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }

    @PatchMapping("/read-all")
    public void readAllNotifications() {
        notificationService.markAllAsRead();
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
    }
}