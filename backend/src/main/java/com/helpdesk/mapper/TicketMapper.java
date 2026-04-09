package com.helpdesk.mapper;

import com.helpdesk.model.dto.TicketDTO;
import com.helpdesk.model.entities.Ticket;
import com.helpdesk.model.enums.Category;

public class TicketMapper {

    public static TicketDTO toDTO(Ticket ticket) {
        return TicketDTO.builder()
                .id(ticket.getId())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .status(ticket.getStatus())
                .category(ticket.getCategory())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .createdByName(ticket.getCreatedBy() != null ? ticket.getCreatedBy().getName() : null)
                .assignedToName(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getName() : null)
                .build();
    }

    public static Ticket toEntity(TicketDTO dto) {
        Ticket ticket = new Ticket();
        ticket.setTitle(dto.getTitle());
        ticket.setDescription(dto.getDescription());
        ticket.setCategory(dto.getCategory());
        return ticket;
    }
}