package com.helpdesk.controller;

import com.helpdesk.model.dto.auditLog.AuditLogResponseDTO;
import com.helpdesk.model.enums.AuditType;
import com.helpdesk.model.interfaces.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping("/all")
    public List<AuditLogResponseDTO> getAll() {
        return auditLogService.getAllLogs();
    }

    @GetMapping("/entity/{type}/{id}")
    public List<AuditLogResponseDTO> getByEntity(
            @PathVariable String type,
            @PathVariable Long id
    ) {
        return auditLogService.getLogsByEntity(id, type);
    }

    @GetMapping("/user/{userId}")
    public List<AuditLogResponseDTO> getByUser(@PathVariable Long userId) {
        return auditLogService.getLogsByUser(userId);
    }

    @GetMapping("/type/{type}")
    public List<AuditLogResponseDTO> getByType(@PathVariable AuditType type) {
        return auditLogService.getLogsByType(type);
    }

    // ── GET /api/audit-logs?changedBy=&entityType=&type=&date=&page=&size=
    //
    // Toti parametrii sunt optionali. Exemple:
    //   /api/audit-logs
    //   /api/audit-logs?changedBy=alice
    //   /api/audit-logs?entityType=Ticket&type=UPDATE
    //   /api/audit-logs?date=2026-05-20&page=0&size=20

    @GetMapping
    public Page<AuditLogResponseDTO> getLogs(
            @RequestParam(required = false) String changedBy,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) AuditType type,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PageableDefault(
                    size = 20,
                    sort = "changedAt",
                    direction = Sort.Direction.DESC
            ) Pageable pageable
    ) {
        return auditLogService.getLogs(changedBy, entityType, type, date, pageable);
    }
}