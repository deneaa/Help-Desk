package com.helpdesk.repository;

import com.helpdesk.model.entities.AuditLog;
import com.helpdesk.model.enums.AuditType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findByEntityIdAndEntityType(Long entityId, String entityType);

    List<AuditLog> findByChangedBy_Id(Long userId);

    List<AuditLog> findByType(AuditType type);

    List<AuditLog> findByEntityIdAndEntityTypeAndInternalFalse(Long entityId, String entityType);

    List<AuditLog> findByAction(String action);

    List<AuditLog> findAllByOrderByChangedAtDesc(Pageable pageable);
}