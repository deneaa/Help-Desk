package com.helpdesk.model.interfaces;

import com.helpdesk.model.entities.AuditLog;
import java.util.List;

public interface AuditLogService {
    AuditLog createLog(AuditLog auditLog);
    List<AuditLog> getLogsByTicket(Long ticketId);
    List<AuditLog> getVisibleLogsByTicket(Long ticketId);
    List<AuditLog> getAllLogs();

}