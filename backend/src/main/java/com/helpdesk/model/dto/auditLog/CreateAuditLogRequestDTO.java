package com.helpdesk.model.dto.auditLog;

import com.helpdesk.model.enums.AuditAction;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateAuditLogRequestDTO {

    @NotNull
    private AuditAction action;

    @NotNull
    private String entityType;

    @NotNull
    private Long entityId;

    @NotBlank
    private String fieldName;

    private String oldValue;

    private String newValue;

    private boolean visibleToUser;
}