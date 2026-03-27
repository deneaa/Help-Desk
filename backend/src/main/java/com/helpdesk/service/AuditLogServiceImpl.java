package com.helpdesk.service;

import com.helpdesk.model.entities.AuditLog;
import com.helpdesk.model.interfaces.AuditLogService;
import com.helpdesk.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    public AuditLog createLog(AuditLog auditLog) {
        auditLog.setChangedAt(LocalDateTime.now());
        return auditLogRepository.save(auditLog);
    }
    @Override
    public List<AuditLog> getAllLogs() {
        return auditLogRepository.findAll();
    }

    @Override
    public List<AuditLog> getLogsByTicket(Long ticketId) {
        return auditLogRepository.findByTicketId(ticketId);
    }

    @Override
    public List<AuditLog> getVisibleLogsByTicket(Long ticketId) {
        return auditLogRepository.findByTicketIdAndIsVisibleToUser(ticketId, true);
    }
}