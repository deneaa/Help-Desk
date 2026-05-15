package com.helpdesk.model.interfaces;

import com.helpdesk.model.dto.auditLog.AuditLogResponseDTO;
import com.helpdesk.model.enums.AuditType;
import java.util.List;

public interface AuditLogService {

    List<AuditLogResponseDTO> getAllLogs();

    List<AuditLogResponseDTO> getLogsByEntity(Long entityId, String entityType);

    List<AuditLogResponseDTO> getLogsByUser(Long userId);

    List<AuditLogResponseDTO> getLogsByType(AuditType type);

    List<AuditLogResponseDTO> getLastLogs(int limit);
}