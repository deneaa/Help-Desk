package com.helpdesk.exceptions.ticket;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TicketNotAssignedException extends RuntimeException {
    public TicketNotAssignedException() {
        super("Ticket is not assigned to any agent");
    }
}