package com.helpdesk.repository;

import com.helpdesk.model.entities.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByEntityIdAndEntityType(Long entityId, String entityType);

    List<AuditLog> findByEntityIdAndEntityTypeAndVisibleToUser(
            Long entityId,
            String entityType,
            boolean visibleToUser
    );

    Page<AuditLog> findByEntityIdAndEntityTypeOrderByChangedAtDesc(
            Long entityId,
            String entityType,
            Pageable pageable
    );
}