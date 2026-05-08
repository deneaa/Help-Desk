package com.helpdesk.repository;

import com.helpdesk.model.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByTicket_Id(Long ticketId);

    List<Comment> findByTicket_IdAndIsInternal(Long ticketId, boolean isInternal);

    List<Comment> findByAuthor_Id(Long authorId);
}