package com.helpdesk.controller;

import com.helpdesk.model.entities.Notification;
import com.helpdesk.service.NotificationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationServiceImpl notificationService;

    @GetMapping
    public List<Notification> getAll() {
        return notificationService.getAllNotifications();
    }

    @GetMapping("/user/{userId}")
    public List<Notification> getByUser(@PathVariable Long userId) {
        return notificationService.getNotificationsByUser(userId);
    }

    @PutMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }
}