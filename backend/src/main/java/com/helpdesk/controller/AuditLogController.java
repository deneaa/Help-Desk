package com.helpdesk.controller;

import com.helpdesk.model.entities.AuditLog;
import com.helpdesk.model.interfaces.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public List<AuditLog> getAll() {
        return auditLogService.getAllLogs();
    }

    @GetMapping("/ticket/{ticketId}")
    public List<AuditLog> getByTicket(@PathVariable Long ticketId) {
        return auditLogService.getLogsByTicket(ticketId);
    }

    @GetMapping("/ticket/{ticketId}/visible")
    public List<AuditLog> getVisibleByTicket(@PathVariable Long ticketId) {
        return auditLogService.getVisibleLogsByTicket(ticketId);
    }
}