package com.helpdesk.exceptions.ticket;

public class InvalidPriorityException extends RuntimeException {
    public InvalidPriorityException(String priority) {
        super("Invalid priority: " + priority);
    }
}