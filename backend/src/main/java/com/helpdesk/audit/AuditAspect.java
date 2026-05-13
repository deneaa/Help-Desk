package com.helpdesk.audit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.helpdesk.model.entities.AuditLog;
import com.helpdesk.model.entities.User;
import com.helpdesk.repository.AuditLogRepository;
import com.helpdesk.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
@Order(1)
public class AuditAspect {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    @Around("@annotation(auditable)")
    public Object audit(ProceedingJoinPoint pjp, Auditable auditable) throws Throwable {

        Object result = pjp.proceed();

        try {
            AuditLog.AuditLogBuilder builder = AuditLog.builder()
                    .type(auditable.auditType())
                    .action(auditable.action())
                    .entityType(auditable.entityType())
                    .internal(auditable.internal())
                    .changedBy(getAuthenticatedUser());

            if (result != null) {
                builder.entityId(extractId(result));
                builder.newValue(toJson(result));
            } else {
                Object[] args = pjp.getArgs();
                if (args.length > 0 && args[0] instanceof Long id) {
                    builder.entityId(id);
                    builder.newValue(null);
                }
            }

            auditLogRepository.save(builder.build());

        } catch (Exception e) {
            log.error("Audit logging failed: action={} entityType={}",
                    auditable.action(), auditable.entityType(), e);
        }

        return result;
    }
    private User getAuthenticatedUser() {
        try {
            Authentication auth = SecurityContextHolder
                    .getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof UserPrincipal userPrincipal) {
                return userPrincipal.getUser();
            }
        } catch (Exception e) {
            log.warn("Could not extract authenticated user for audit");
        }
        return null;
    }

    private Long extractId(Object obj) {
        try {
            return (Long) obj.getClass()
                    .getMethod("getId")
                    .invoke(obj);
        } catch (Exception e) {
            return null;
        }
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "{}";
        }
    }
}