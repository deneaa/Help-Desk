package com.helpdesk.exceptions.comment;

public class CommentEditTimeExpiredException extends RuntimeException{
    public CommentEditTimeExpiredException(){
        super("Comments can be edited or deleted withing 15 minutes");
    }
}
