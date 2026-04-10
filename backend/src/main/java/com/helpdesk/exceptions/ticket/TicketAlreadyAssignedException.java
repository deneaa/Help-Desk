package com.helpdesk.exceptions.ticket;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class TicketAlreadyAssignedException extends RuntimeException{
    public TicketAlreadyAssignedException(){
        super("Ticket is already assigned to an agent");
    }
}
