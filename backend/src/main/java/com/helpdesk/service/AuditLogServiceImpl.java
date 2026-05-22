package com.helpdesk.service;

import com.helpdesk.exceptions.auth.UnauthorizedActionException;
import com.helpdesk.exceptions.user.UserNotFoundException;
import com.helpdesk.mapper.AuditLogMapper;
import com.helpdesk.model.dto.auditLog.AuditLogResponseDTO;
import com.helpdesk.model.entities.AuditLog;
import com.helpdesk.model.enums.AuditType;
import com.helpdesk.model.enums.Role;
import com.helpdesk.model.interfaces.AuditLogService;
import com.helpdesk.model.entities.User;
import com.helpdesk.repository.AuditLogRepository;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

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

    private void requireAdminOrAgent(User user) {
        if (user.getRole() != Role.ADMIN && user.getRole() != Role.AGENT) {
            throw new UnauthorizedActionException("Only admins and agents can access logs");
        }
    }

    @Override
    public List<AuditLogResponseDTO> getAllLogs() {
        User user = getAuthenticatedUser();
        requireAdminOrAgent(user);
        return auditLogRepository.findAll()
                .stream()
                .map(AuditLogMapper::toDTO)
                .toList();
    }

    @Override
    public List<AuditLogResponseDTO> getLogsByEntity(Long entityId, String entityType) {
        User user = getAuthenticatedUser();

        if (user.getRole() == Role.ADMIN || user.getRole() == Role.AGENT) {
            return auditLogRepository
                    .findByEntityIdAndEntityType(entityId, entityType)
                    .stream()
                    .map(AuditLogMapper::toDTO)
                    .toList();
        }
        return auditLogRepository
                .findByEntityIdAndEntityTypeAndInternalFalse(entityId, entityType)
                .stream()
                .map(AuditLogMapper::toDTO)
                .toList();
    }

    @Override
    public List<AuditLogResponseDTO> getLogsByUser(Long userId) {
        User authenticatedUser = getAuthenticatedUser();
        requireAdminOrAgent(authenticatedUser);

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("userId", userId.toString()));

        if (authenticatedUser.getRole() == Role.AGENT && targetUser.getRole() == Role.ADMIN) {
            throw new UnauthorizedActionException("Agents cannot view admin logs");
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
        requireAdminOrAgent(user);
        return auditLogRepository
                .findByType(type)
                .stream()
                .map(AuditLogMapper::toDTO)
                .toList();
    }

    @Override
    public List<AuditLogResponseDTO> getLastLogs(int limit) {
        User user = getAuthenticatedUser();
        requireAdminOrAgent(user);
        return auditLogRepository
                .findAllByOrderByChangedAtDesc(PageRequest.of(0, limit))
                .stream()
                .map(AuditLogMapper::toDTO)
                .toList();
    }

    @Override
    public Page<AuditLogResponseDTO> getLogs(
            String changedBy,
            String entityType,
            AuditType type,
            LocalDate date,
            Pageable pageable
    ) {
        User user = getAuthenticatedUser();
        requireAdminOrAgent(user);

        Specification<AuditLog> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (changedBy != null && !changedBy.isBlank()) {
                predicates.add(cb.like(
                        cb.lower(root.get("changedBy").get("name")),
                        "%" + changedBy.trim().toLowerCase() + "%"
                ));
            }

            if (entityType != null && !entityType.isBlank()) {
                predicates.add(cb.equal(
                        cb.lower(root.get("entityType")),
                        entityType.trim().toLowerCase()
                ));
            }

            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }

            if (date != null) {
                predicates.add(cb.equal(
                        cb.function("date", LocalDate.class, root.get("changedAt")),
                        date
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return auditLogRepository.findAll(spec, pageable)
                .map(AuditLogMapper::toDTO);
    }
}