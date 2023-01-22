package com.project.questapp.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.questapp.entities.Comment;
import com.project.questapp.entities.Post;
import com.project.questapp.entities.User;
import com.project.questapp.repos.CommentRepository;
import com.project.questapp.requests.CommentCreateRequest;
import com.project.questapp.requests.CommentUpdateRequest;

@Service
public class CommentService {
	
	private CommentRepository commentRepository;
	private UserService userService;
	private PostService postService;

	

	public CommentService(CommentRepository commentRepository, UserService userService, PostService postService) {
		this.commentRepository = commentRepository;
		this.userService = userService;
		this.postService = postService;
	}

	public List<Comment> getAllCommentsWithParam(Optional<Long> userId, Optional<Long> postId) {
		if(userId.isPresent()) {
			return commentRepository.findByUserId(userId.get());
		}
		else if(postId.isPresent()) {
			return commentRepository.findByPostId(postId.get());
		}
		else if(userId.isPresent()&& postId.isPresent()) {
			return commentRepository.findByUserIdAndPostId(userId.get(),postId.get());
		}
		else {
			return commentRepository.findAll();
		}
	}

	public Comment getOneComment(Long commentId) {
		return commentRepository.findById(commentId).orElse(null);
	}

	public void deleteOneComment(Long commentId) {
		commentRepository.deleteById(commentId);
	}

	public Comment createOnePost(CommentCreateRequest newCommentRequest) {
		User user=userService.getOneUser(newCommentRequest.getUserId());
		Post post=postService.getOnePost(newCommentRequest.getPostId());
		
		if(user==null){
			return null;
		}			
		else if( post==null) {
			return null;
		}
		Comment toSave = new Comment();
		toSave.setId(newCommentRequest.getId());
		toSave.setText(newCommentRequest.getText());
		toSave.setPost(post);
		toSave.setUser(user);
		return commentRepository.save(toSave);
		
	}

	public Comment updateOneComment(Long commentId, CommentUpdateRequest updateComment) {
		Optional<Comment> comment = commentRepository.findById(commentId);
		if(comment.isPresent()) {
			Comment foundComment=comment.get();
			foundComment.setText(updateComment.getText());
			commentRepository.save(foundComment);
			return foundComment;
		}
		else return null;
	}

}
