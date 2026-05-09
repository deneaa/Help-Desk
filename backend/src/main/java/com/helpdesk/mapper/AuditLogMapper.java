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
                .beforeData(log.getBeforeData())
                .afterData(log.getAfterData())
                .changedAt(log.getChangedAt())
                .changedByName(
                        log.getChangedBy() != null
                                ? log.getChangedBy().getName()
                                : null
                )
                .build();
    }
}