package com.helpdesk.exceptions.user;

public class NotAnAgentException extends RuntimeException {
    public NotAnAgentException(Long id) {
        super("User with id " + id + " is not an agent");
    }
}