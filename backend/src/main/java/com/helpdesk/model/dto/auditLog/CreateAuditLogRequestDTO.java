package com.helpdesk.model.dto.auditLog;

import com.helpdesk.model.enums.AuditType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateAuditLogRequestDTO {

    @NotNull
    private AuditType type;

    @NotNull
    private String action;

    @NotNull
    private String entityType;

    @NotNull
    private Long entityId;

    private String beforeData;

    private String afterData;
}