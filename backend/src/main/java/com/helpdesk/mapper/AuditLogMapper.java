package com.helpdesk.mapper;

import com.helpdesk.model.dto.auditLog.AuditLogResponseDTO;
import com.helpdesk.model.entities.AuditLog;

public class AuditLogMapper {

    public static AuditLogResponseDTO toDTO(AuditLog log) {
        return AuditLogResponseDTO.builder()
                .id(log.getId())
                .action(log.getAction().name())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .fieldName(log.getFieldName())
                .oldValue(log.getOldValue())
                .newValue(log.getNewValue())
                .visibleToUser(log.isVisibleToUser())
                .changedAt(log.getChangedAt())
                .changedByName(log.getChangedBy() != null
                        ? log.getChangedBy().getName()
                        : null)
                .build();
    }
}