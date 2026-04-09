package com.helpdesk.exceptions.comment;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.FORBIDDEN)
public class ForbiddenCommentActionException extends RuntimeException {
    public ForbiddenCommentActionException() {
        super("You are not allowed to perform this action on this comment");
    }
}