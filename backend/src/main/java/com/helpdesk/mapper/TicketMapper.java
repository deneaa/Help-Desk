package com.helpdesk.mapper;

import com.helpdesk.model.dto.ticket.CreateTicketDTO;
import com.helpdesk.model.dto.ticket.TicketDTO;
import com.helpdesk.model.entities.Ticket;

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

                .createdById(ticket.getCreatedBy() != null ? ticket.getCreatedBy().getId() : null)
                .createdByName(ticket.getCreatedBy() != null ? ticket.getCreatedBy().getName() : null)

                .assignedToId(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getId() : null)
                .assignedToName(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getName() : null)

                .build();
    }

    public static Ticket toEntity(CreateTicketDTO dto) {
        Ticket ticket = new Ticket();
        ticket.setTitle(dto.getTitle());
        ticket.setDescription(dto.getDescription());
        ticket.setCategory(dto.getCategory());
        return ticket;
    }
}