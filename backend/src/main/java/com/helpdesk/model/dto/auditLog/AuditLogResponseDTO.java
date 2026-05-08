package com.helpdesk.model.dto.auditLog;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuditLogResponseDTO {

    private Long id;
    private String action;

    private String entityType;
    private Long entityId;

    private String fieldName;
    private String oldValue;
    private String newValue;

    private boolean visibleToUser;

    private LocalDateTime changedAt;
    private String changedByName;
}