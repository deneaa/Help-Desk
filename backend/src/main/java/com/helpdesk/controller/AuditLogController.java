package com.helpdesk.controller;

import com.helpdesk.model.dto.auditLog.AuditLogResponseDTO;
import com.helpdesk.model.enums.AuditType;
import com.helpdesk.model.interfaces.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    public ResponseEntity<List<AuditLogResponseDTO>> getAll() {
        return ResponseEntity.ok(auditLogService.getAllLogs());
    }

    @GetMapping("/entity/{type}/{id}")
    public ResponseEntity<List<AuditLogResponseDTO>> getByEntity(
            @PathVariable String type,
            @PathVariable Long id) {
        return ResponseEntity.ok(auditLogService.getLogsByEntity(id, type));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AuditLogResponseDTO>> getByUser(
            @PathVariable Long userId) {
        return ResponseEntity.ok(auditLogService.getLogsByUser(userId));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<AuditLogResponseDTO>> getByType(
            @PathVariable AuditType type) {
        return ResponseEntity.ok(auditLogService.getLogsByType(type));
    }
}