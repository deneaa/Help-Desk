package com.helpdesk.exceptions.ticket;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TicketAlreadyUnassignedException extends RuntimeException{
    public TicketAlreadyUnassignedException(){
        super("Ticket is already assigned to an agent");
    }
}
