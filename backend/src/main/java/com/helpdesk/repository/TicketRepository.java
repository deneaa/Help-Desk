package com.helpdesk.repository;

import com.helpdesk.model.entities.Ticket;
import com.helpdesk.model.enums.Category;
import com.helpdesk.model.enums.Priority;
import com.helpdesk.model.enums.Status;
import com.helpdesk.model.enums.TicketType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByCreatedBy_Id(Long userId);

    Page<Ticket> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<Ticket> findByAssignedTo_Id(Long userId);

    List<Ticket> findByStatus(Status status);

    List<Ticket> findByPriority(Priority priority);

    List<Ticket> findByCategory(Category category);

    List<Ticket> findByTicketType(TicketType ticketType);

    long countByStatus(Status status);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<Ticket> findByStatusOrderByCreatedAtDesc(Status status, Pageable pageable);

    Page<Ticket> findByStatus(Status status, Pageable pageable);

    long countByCreatedById(Long userId);

    long countByAssignedToIdAndStatus(Long userId, Status status);
}