package com.helpdesk.model.dto.auditLog;

import com.helpdesk.model.enums.AuditType;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
public class AuditLogResponseDTO {
    private Long id;
    private AuditType type;
    private String action;
    private String entityType;
    private Long entityId;
    private String changedBy;
    private String newValue;
    private boolean internal;
    private LocalDateTime changedAt;
}