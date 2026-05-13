package com.helpdesk.exceptions.comment;

public class EmptyCommentContentException extends RuntimeException{
    public EmptyCommentContentException(){
        super ("Comment content cannot be empty");
    }
}
