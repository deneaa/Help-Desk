package com.helpdesk.exceptions.general;

public class NotificationNotFoundException extends RuntimeException {
    public NotificationNotFoundException(Long id) {
        super("Notification not found with id: " + id);
    }
}