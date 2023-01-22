package com.project.questapp.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.questapp.entities.Post;
import com.project.questapp.entities.User;
import com.project.questapp.repos.PostRepository;
import com.project.questapp.requests.PostCreateRequest;
import com.project.questapp.requests.PostUpdateRequest;
import com.project.questapp.responses.LikeResponse;
import com.project.questapp.responses.PostResponse;

@Service
public class PostService {
	
	private PostRepository postRepository;
	private UserService userService;
	private LikeService likeService;

	public PostService(PostRepository postRepository, UserService userService) {
		this.postRepository = postRepository;
		this.userService = userService;
	}
	
	@Autowired
	public void setLikeService(LikeService likeService) {
		this.likeService=likeService;
	}
	
	public List<PostResponse> getAllPosts(Optional<Long> userId){
		List<Post> list;
		if(userId.isPresent()) {
			//user varsa userın postlarını liste atıyorum
			list = postRepository.findByUserId(userId.get());
		}
		// user yoksa bütün postları atıyorum
		list= postRepository.findAll();
		return list.stream().map(p -> {
			List<LikeResponse> likes = likeService.getAllLikesWithParam(Optional.ofNullable(null), Optional.of(p.getId()));
			return new PostResponse(p, likes);}).collect(Collectors.toList());
	}
	
	public Post getOnePost(Long postId) {
		return postRepository.findById(postId).orElse(null);
	}
	
	public Post createOnePost(PostCreateRequest newPostRequest) {
		User user = userService.getOneUser(newPostRequest.getUserId());
		if(user==null) {
			return null;
		}
		
		Post toSave = new Post();
		toSave.setId(newPostRequest.getId());
		toSave.setTitle(newPostRequest.getTitle());
		toSave.setText(newPostRequest.getText());
		toSave.setUser(user);
		return postRepository.save(toSave);
	}
	
	
	
	public Post updateOnePost(Long postId, PostUpdateRequest updatePost) {
		Optional<Post> post = postRepository.findById(postId);
		if(post.isPresent()) {
			Post foundPost = post.get();
			foundPost.setTitle(updatePost.getTitle());
			foundPost.setText(updatePost.getText());
			postRepository.save(foundPost);
			return foundPost;
		}
		else return null;
	}
	
	public void deleteOnePost(Long postId) {
		postRepository.deleteById(postId);
	}
}
