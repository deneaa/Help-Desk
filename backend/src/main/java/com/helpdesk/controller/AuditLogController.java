package com.helpdesk.controller;

import com.helpdesk.model.dto.auditLog.AuditLogResponseDTO;
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
    public List<AuditLogResponseDTO> getAll() {
        return auditLogService.getAllLogs();
    }

    @GetMapping("/entity/{type}/{id}")
    public List<AuditLogResponseDTO> getByEntity(
            @PathVariable String type,
            @PathVariable Long id) {
        return auditLogService.getLogsByEntity(id, type);
    }

    @GetMapping("/entity/{type}/{id}/visible")
    public List<AuditLogResponseDTO> getVisibleByEntity(
            @PathVariable String type,
            @PathVariable Long id) {
        return auditLogService.getVisibleLogsByEntity(id, type);
    }

    @GetMapping("/entity/{type}/{id}/latest")
    public List<AuditLogResponseDTO> getLatest(
            @PathVariable String type,
            @PathVariable Long id,
            @RequestParam(defaultValue = "10") int limit) {

        return auditLogService.getLatestByEntity(id, type, limit);
    }
}