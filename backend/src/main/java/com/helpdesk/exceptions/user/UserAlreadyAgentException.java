package com.helpdesk.exceptions.user;

public class UserAlreadyAgentException extends RuntimeException {

    public UserAlreadyAgentException(String message) {
        super(message);
    }

}