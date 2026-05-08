package com.helpdesk.service;

import com.helpdesk.mapper.AuditLogMapper;
import com.helpdesk.model.dto.auditLog.AuditLogResponseDTO;
import com.helpdesk.model.dto.auditLog.CreateAuditLogRequestDTO;
import com.helpdesk.model.entities.AuditLog;
import com.helpdesk.model.entities.User;
import com.helpdesk.model.interfaces.AuditLogService;
import com.helpdesk.repository.AuditLogRepository;
import com.helpdesk.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;


    @Override
    public AuditLogResponseDTO createLog(CreateAuditLogRequestDTO request) {

        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User user = userPrincipal.getUser();
        AuditLog auditLog = AuditLog.builder()
                .action(request.getAction())
                .entityType(request.getEntityType())
                .entityId(request.getEntityId())
                .fieldName(request.getFieldName())
                .oldValue(request.getOldValue())
                .newValue(request.getNewValue())
                .isVisibleToUser(request.isVisibleToUser())
                .changedBy(user)
                .build();

        AuditLog saved = auditLogRepository.save(auditLog);

        return AuditLogMapper.toDTO(saved);
    }

    @Override
    public List<AuditLogResponseDTO> getAllLogs() {
        return auditLogRepository.findAll()
                .stream()
                .map(AuditLogMapper::toDTO)
                .toList();
    }

    @Override
    public List<AuditLogResponseDTO> getLogsByEntity(Long entityId, String entityType){
        return auditLogRepository
                .findByEntityIdAndEntityType(entityId, entityType)
                .stream()
                .map(AuditLogMapper::toDTO)
                .toList();

    }

    @Override
    public List<AuditLogResponseDTO> getVisibleLogsByEntity(Long entityId, String entityType){
        return auditLogRepository
                .findByEntityIdAndEntityTypeAndVisibleToUser(entityId, entityType, true)
                .stream()
                .map(AuditLogMapper::toDTO)
                .toList();
    }

    @Override
    public List<AuditLogResponseDTO> getLatestByEntity(Long entityId, String entityType, int limit){
        return auditLogRepository
                .findByEntityIdAndEntityTypeOrderByChangedAtDesc(entityId, entityType, PageRequest.of(0, limit))
                .stream()
                .map(AuditLogMapper::toDTO)
                .toList();
    }

}