package com.helpdesk.exceptions.ticket;

public class InvalidStatusTransitionException extends RuntimeException {
    public InvalidStatusTransitionException(String from, String to) {
        super("Cannot change status from " + from + " to " + to);
    }
}