package com.helpdesk.exceptions.ticket;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TicketAlreadyClosedException extends RuntimeException {
    public TicketAlreadyClosedException() {
        super("Ticket is already closed");
    }
}