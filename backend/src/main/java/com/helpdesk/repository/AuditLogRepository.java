package com.helpdesk.repository;

import com.helpdesk.model.entities.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByTicketId(Long ticketId);
    List<AuditLog> findByTicketIdAndIsVisibleToUser(Long ticketId, boolean isVisibleToUser);
}
// JpaRepository ne ofera niste metode in plus si automat functiile scrise sunt generate