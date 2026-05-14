package com.helpdesk.exceptions.notification;

public class NotificationNotFoundException extends RuntimeException {
    public NotificationNotFoundException(Long id){
        super("Notification with " + id + " not found");
    }
}
