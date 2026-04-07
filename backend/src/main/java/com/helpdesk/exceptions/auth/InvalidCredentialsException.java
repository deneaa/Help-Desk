package com.helpdesk.exceptions.auth;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED) // 401
public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException(String reason) {
        super(reason);
    }

    public static InvalidCredentialsException emailNotFound(String email) {
        return new InvalidCredentialsException("Email not found: " + email);
    }

    public static InvalidCredentialsException wrongPassword() {
        return new InvalidCredentialsException("Incorrect password");
    }
}