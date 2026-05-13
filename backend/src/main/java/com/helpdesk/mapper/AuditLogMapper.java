package com.helpdesk.mapper;

import com.helpdesk.model.dto.auditLog.AuditLogResponseDTO;
import com.helpdesk.model.entities.AuditLog;

public class AuditLogMapper {

    public static AuditLogResponseDTO toDTO(AuditLog log) {
        return AuditLogResponseDTO.builder()
                .id(log.getId())
                .type(log.getType())
                .action(log.getAction())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .changedBy(log.getChangedBy() != null
                        ? log.getChangedBy().getEmail()
                        : "system")
                .newValue(log.getNewValue())
                .internal(log.isInternal())
                .changedAt(log.getChangedAt())
                .build();
    }
}