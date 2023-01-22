package com.project.questapp.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.questapp.entities.Like;
import com.project.questapp.entities.Post;
import com.project.questapp.entities.User;
import com.project.questapp.repos.LikeRepository;
import com.project.questapp.requests.LikeCreateRequest;
import com.project.questapp.requests.LikeUpdateRequest;
import com.project.questapp.responses.LikeResponse;

@Service
public class LikeService {
	private LikeRepository likeRepository;
	private UserService userService;
	private PostService postService;

	public LikeService(LikeRepository likeRepository, UserService userService, PostService postService) {
		this.likeRepository = likeRepository;
		this.userService = userService;
		this.postService = postService;
	}

	public List<LikeResponse> getAllLikesWithParam(Optional<Long> userId, Optional<Long> postId) {
		List<Like> list;
		if(userId.isPresent()) {
			list = likeRepository.findByUserId(userId.get());
		}
		else if(postId.isPresent()) {
			list = likeRepository.findByPostId(postId.get());
		}
		else if(userId.isPresent()&& postId.isPresent()) {
			list = likeRepository.findByUserIdAndPostId(userId.get(),postId.get());
		}
		else {
			list = likeRepository.findAll();
		}
		
		return list.stream().map(like -> new LikeResponse(like)).collect(Collectors.toList());
	}
	
	public Like getOneLike(Long likeId) {
		return likeRepository.findById(likeId).orElse(null);
	}

	public void deleteOneLike(Long likeId) {
		likeRepository.deleteById(likeId);
	}

	public Like createOneLike(LikeCreateRequest newLikeRequest) {
		User user=userService.getOneUser(newLikeRequest.getUserId());
		Post post=postService.getOnePost(newLikeRequest.getPostId());
		
		if(user==null){
			return null;
		}			
		else if( post==null) {
			return null;
		}
		Like toSave = new Like();
		toSave.setId(newLikeRequest.getId());
		toSave.setPost(post);
		toSave.setUser(user);
		return likeRepository.save(toSave);
		
	}

	public Like updateOneLike(Long likeId, LikeUpdateRequest updateLike) {
		Optional<Like> like = likeRepository.findById(likeId);
		if(like.isPresent()) {
			Like foundLike=like.get();
			likeRepository.save(foundLike);
			return foundLike;
		}
		else return null;
	}

}
