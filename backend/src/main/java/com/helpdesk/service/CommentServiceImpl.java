package com.helpdesk.service;

import com.helpdesk.exceptions.auth.UnauthorizedActionException;
import com.helpdesk.exceptions.ticket.TicketNotFoundException;
import com.helpdesk.exceptions.user.NotAnAgentException;
import com.helpdesk.mapper.CommentMapper;
import com.helpdesk.model.dto.comment.CommentResponseDTO;
import com.helpdesk.model.dto.comment.CreateCommentRequestDTO;
import com.helpdesk.model.entities.Comment;
import com.helpdesk.model.entities.Ticket;
import com.helpdesk.model.entities.User;
import com.helpdesk.model.enums.Role;
import com.helpdesk.model.interfaces.CommentService;
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
    private final TicketRepository ticketRepository;

    @Override
    public CommentResponseDTO addComment(CreateCommentRequestDTO dto) {

        UserPrincipal userPrincipal =
                (UserPrincipal) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal();

        User user = userPrincipal.getUser();

        Ticket ticket = ticketRepository.findById(dto.getTicketId())
                .orElseThrow(() -> new TicketNotFoundException(dto.getTicketId()));

        if (dto.isInternal() && user.getRole() != Role.AGENT) {
            throw new UnauthorizedActionException("Only agents can create internal comments");
        }

        Comment comment = CommentMapper.toEntity(dto);
        comment.setAuthor(user);
        comment.setTicket(ticket);

        Comment saved = commentRepository.save(comment);

        return CommentMapper.toDTO(saved);
    }

    @Override
    public List<CommentResponseDTO> getAllComments() {
        return commentRepository.findAll()
                .stream()
                .map(CommentMapper::toDTO)
                .toList();
    }

    @Override
    public List<CommentResponseDTO> getCommentsByTicket(Long ticketId) {
        return commentRepository.findByTicket_Id(ticketId)
                .stream()
                .map(CommentMapper::toDTO)
                .toList();
    }

    @Override
    public List<CommentResponseDTO> getPublicCommentsByTicket(Long ticketId) {
        return commentRepository.findByTicket_IdAndIsInternal(ticketId, false)
                .stream()
                .map(CommentMapper::toDTO)
                .toList();
    }

    @Override
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}