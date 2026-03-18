package com.helpdesk.repository;

import com.helpdesk.model.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTicketId(Long ticketId);
    List<Comment> findByTicketIdAndIsInternal(Long ticketId, boolean isInternal);
}