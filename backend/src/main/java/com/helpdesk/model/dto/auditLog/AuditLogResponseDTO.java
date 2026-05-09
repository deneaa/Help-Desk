package com.helpdesk.model.dto.auditLog;

import com.helpdesk.model.enums.AuditType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AuditLogResponseDTO {

    private Long id;
    private AuditType type;
    private String action;

    private String entityType;
    private Long entityId;

    private String beforeData;
    private String afterData;


    private LocalDateTime changedAt;
    private String changedByName;
}