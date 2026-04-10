package com.helpdesk.exceptions.ticket;

public class TicketAccessDeniedException extends RuntimeException{
    public TicketAccessDeniedException(){
        super("Access denied!");
    }
}
