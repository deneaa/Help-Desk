package com.helpdesk.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.helpdesk.audit.Auditable;
import com.helpdesk.exceptions.auth.UnauthorizedActionException;
import com.helpdesk.exceptions.comment.*;
import com.helpdesk.exceptions.ticket.TicketAlreadyClosedException;
import com.helpdesk.exceptions.ticket.TicketNotFoundException;
import com.helpdesk.mapper.CommentMapper;
import com.helpdesk.model.dto.comment.CommentResponseDTO;
import com.helpdesk.model.dto.comment.CreateCommentRequestDTO;
import com.helpdesk.model.dto.comment.EditCommentRequestDTO;
import com.helpdesk.model.dto.notification.CreateNotificationDTO;
import com.helpdesk.model.entities.AuditLog;
import com.helpdesk.model.entities.Comment;
import com.helpdesk.model.entities.Ticket;
import com.helpdesk.model.entities.User;
import com.helpdesk.model.enums.*;
import com.helpdesk.model.interfaces.CommentService;
import com.helpdesk.model.interfaces.NotificationService;
import com.helpdesk.repository.AuditLogRepository;
import com.helpdesk.repository.CommentRepository;
import com.helpdesk.repository.TicketRepository;
import com.helpdesk.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final AuditLogRepository auditLogRepository;
    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            return "{}";
        }
    }

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

    private void checkCommentEditTime(Comment comment) {
        LocalDateTime limit = comment.getCreatedAt().plusMinutes(15);

        if (LocalDateTime.now().isAfter(limit)) {
            throw new CommentEditTimeExpiredException();
        }
    }

    private Comment getComment(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new CommentNotFoundException(id));
    }

    private Ticket getTicket(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new TicketNotFoundException(id));
    }

    @Override
    public CommentResponseDTO addComment(CreateCommentRequestDTO dto) {
        User authenticatedUser = getAuthenticatedUser();
        Ticket ticket = getTicket(dto.getTicketId());

        if (ticket.getStatus() == Status.CLOSED)
            throw new TicketAlreadyClosedException();

        if (dto.isInternal() && authenticatedUser.getRole() == Role.USER)
            throw new UnauthorizedActionException("Only agents or admins can create internal comments");

        Comment comment = CommentMapper.toEntity(dto);
        comment.setAuthor(authenticatedUser);
        comment.setTicket(ticket);

        CommentResponseDTO saved = CommentMapper.toDTO(commentRepository.save(comment));

        auditLogRepository.save(AuditLog.builder()
                .type(AuditType.INSERT)
                .action("CREATED")
                .entityType("Comment")
                .entityId(saved.getId())
                .newValue(toJson(saved))
                .internal(dto.isInternal())
                .changedBy(authenticatedUser)
                .build());

        notificationService.createNotification(CreateNotificationDTO.builder()
                .recipientId(ticket.getCreatedBy().getId())
                .message("Un comentariu nou a fost adaugat pe ticketul tau: \"" + ticket.getTitle() + "\"")
                .type(NotificationType.COMMENT_ADDED)
                .referenceType(NotificationReferenceType.COMMENT)
                .referenceId(saved.getId())
                .redirectUrl("/tickets/" + ticket.getId())
                .build());

        if (ticket.getAssignedTo() != null &&
                !ticket.getAssignedTo().getId().equals(ticket.getCreatedBy().getId())) {
            notificationService.createNotification(CreateNotificationDTO.builder()
                    .recipientId(ticket.getAssignedTo().getId())
                    .message("Un comentariu nou a fost adaugat pe ticketul \"" + ticket.getTitle() + "\"")
                    .type(NotificationType.COMMENT_ADDED)
                    .referenceType(NotificationReferenceType.COMMENT)
                    .referenceId(saved.getId())
                    .redirectUrl("/tickets/" + ticket.getId())
                    .build());
        }

        return saved;
    }

    @Override
    public List<CommentResponseDTO> getAllComments() {
        User authenticatedUser = getAuthenticatedUser();

        if (authenticatedUser.getRole() != Role.ADMIN)
            throw new UnauthorizedActionException("Only admins can view all the comments");

        return commentRepository.findAll()
                .stream()
                .map(CommentMapper::toDTO)
                .toList();
    }

    @Override
    public List<CommentResponseDTO> getCommentsByTicket(Long ticketId) {
        User authenticatedUser = getAuthenticatedUser();

        if (authenticatedUser.getRole() != Role.ADMIN && authenticatedUser.getRole() != Role.AGENT)
            throw new UnauthorizedActionException("Only Admins and Agents can get all the comments");

        return commentRepository.findByTicket_Id(ticketId)
                .stream()
                .map(CommentMapper::toDTO)
                .toList();
    }

    @Override
    public List<CommentResponseDTO> getPublicCommentsByTicket(Long ticketId) {
        User authenticatedUser = getAuthenticatedUser();
        Ticket ticket = getTicket(ticketId);

        if (ticket.getAssignedTo() == null ||
                !ticket.getAssignedTo().getId().equals(authenticatedUser.getId()))
            throw new UnauthorizedActionException("You're not allowed to get the comments");

        return commentRepository
                .findByTicket_IdAndIsInternal(ticketId, false)
                .stream()
                .map(CommentMapper::toDTO)
                .toList();
    }

    @Override
    @Auditable(action = "DELETED_COMMENT", entityType = "Comment", auditType = AuditType.DELETE)
    public void deleteComment(Long id) {
        User authenticatedUser = getAuthenticatedUser();
        Comment comment = getComment(id);

        boolean isOwner = comment.getAuthor().getId().equals(authenticatedUser.getId());
        boolean isAdmin = authenticatedUser.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin)
            throw new ForbiddenCommentActionException();
        if (!isAdmin)
            checkCommentEditTime(comment);
        if (comment.getTicket().getStatus() == Status.CLOSED)
            throw new TicketAlreadyClosedException();

        commentRepository.delete(comment);
    }

    @Override
    @Auditable(action = "UPDATED_COMMENT", entityType = "Comment", auditType = AuditType.UPDATE)
    public CommentResponseDTO updateComment(Long commentId, EditCommentRequestDTO dto) {
        User authenticatedUser = getAuthenticatedUser();
        Comment comment = getComment(commentId);

        boolean isOwner = comment.getAuthor().getId().equals(authenticatedUser.getId());
        boolean isAdmin = authenticatedUser.getRole() == Role.ADMIN;

        if (!isAdmin && !isOwner)
            throw new ForbiddenCommentActionException();
        if (!isAdmin)
            checkCommentEditTime(comment);
        if (comment.getTicket().getStatus() == Status.CLOSED)
            throw new TicketAlreadyClosedException();
        if (dto.getContent() == null || dto.getContent().isBlank())
            throw new EmptyCommentContentException();

        comment.setContent(dto.getContent());
        return CommentMapper.toDTO(commentRepository.save(comment));
    }
}