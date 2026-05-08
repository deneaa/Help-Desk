package com.helpdesk.model.interfaces;

import com.helpdesk.model.dto.auditLog.AuditLogResponseDTO;
import com.helpdesk.model.dto.auditLog.CreateAuditLogRequestDTO;
import com.helpdesk.model.entities.AuditLog;
import java.util.List;

public interface AuditLogService {

    AuditLogResponseDTO createLog(CreateAuditLogRequestDTO request);

    List<AuditLogResponseDTO> getLogsByEntity(Long entityId, String entityType);

    List<AuditLogResponseDTO> getVisibleLogsByEntity(Long entityId, String entityType);

    List<AuditLogResponseDTO> getAllLogs();

    List<AuditLogResponseDTO> getLatestByEntity(Long entityId, String type, int limit);
}