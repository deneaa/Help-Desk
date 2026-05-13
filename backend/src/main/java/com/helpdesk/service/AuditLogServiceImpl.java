package com.helpdesk.service;

import com.helpdesk.exceptions.auth.UnauthorizedActionException;
import com.helpdesk.mapper.AuditLogMapper;
import com.helpdesk.model.dto.auditLog.AuditLogResponseDTO;
import com.helpdesk.model.enums.AuditType;
import com.helpdesk.model.enums.Role;
import com.helpdesk.model.interfaces.AuditLogService;
import com.helpdesk.model.entities.User;
import com.helpdesk.repository.AuditLogRepository;
import com.helpdesk.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (!(principal instanceof UserPrincipal userPrincipal)) {
            throw new UnauthorizedActionException("Unauthorized");
        }

        return userPrincipal.getUser();
    }

    @Override
    public List<AuditLogResponseDTO> getAllLogs() {
        User user = getAuthenticatedUser();

        if (user.getRole() != Role.ADMIN) {
            throw new UnauthorizedActionException("Only admins can access all logs");
        }

        return auditLogRepository.findAll()
                .stream()
                .map(AuditLogMapper::toDTO)
                .toList();
    }

    @Override
    public List<AuditLogResponseDTO> getLogsByEntity(Long entityId, String entityType) {
        User user = getAuthenticatedUser();

        // admin vede tot
        if (user.getRole() == Role.ADMIN) {
            return auditLogRepository
                    .findByEntityIdAndEntityType(entityId, entityType)
                    .stream()
                    .map(AuditLogMapper::toDTO)
                    .toList();
        }

        // agent vede tot
        if (user.getRole() == Role.AGENT) {
            return auditLogRepository
                    .findByEntityIdAndEntityType(entityId, entityType)
                    .stream()
                    .map(AuditLogMapper::toDTO)
                    .toList();
        }

        // user normal — fara log-uri interne
        return auditLogRepository
                .findByEntityIdAndEntityTypeAndInternalFalse(entityId, entityType)
                .stream()
                .map(AuditLogMapper::toDTO)
                .toList();
    }

    @Override
    public List<AuditLogResponseDTO> getLogsByUser(Long userId) {
        User user = getAuthenticatedUser();

        // admin vede orice user
        // userul vede doar ale lui
        if (user.getRole() != Role.ADMIN && !user.getId().equals(userId)) {
            throw new UnauthorizedActionException("You cannot view these logs");
        }

        return auditLogRepository
                .findByChangedBy_Id(userId)
                .stream()
                .map(AuditLogMapper::toDTO)
                .toList();
    }

    @Override
    public List<AuditLogResponseDTO> getLogsByType(AuditType type) {
        User user = getAuthenticatedUser();

        if (user.getRole() != Role.ADMIN) {
            throw new UnauthorizedActionException("Only admins can filter by type");
        }

        return auditLogRepository
                .findByType(type)
                .stream()
                .map(AuditLogMapper::toDTO)
                .toList();
    }
}