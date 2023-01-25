package com.project.questapp.security;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.project.questapp.services.UserDetailsServiceImpl;

public class JwtAuthenticationFilter extends OncePerRequestFilter{

	@Autowired
	JwtTokenProvider jwtTokenProvider;
	
	@Autowired
	UserDetailsServiceImpl userDetailsService;
	
	// Jwt filter ekliyoruz, bu request authorize olmuş mu? authorize : unauthorize
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		try {
			// request headerı ile gelen tokenı extract ediyoruz
			String jwtToken = extractJwtFromRequest(request);
			//token içi dolu mu?(Bearer kısmını atmıştık)
			// ve aynı zamanda token valid mi diye kontrol ediyoruz
			// eğer böyleyse userımızı çekiyoruz
			if(StringUtils.hasText(jwtToken) && jwtTokenProvider.validateToken(jwtToken)) {
				// bu tokenı verip içerisinden userımızı alıyoruz
				Long id = jwtTokenProvider.getUserIdFromJwt(jwtToken);
				//bulduğumuz id'den userı getiriyoruz
				UserDetails user = userDetailsService.loadUSerById(id);
				//böyle bi userımız varsa, o zaman authenticate ediyoruz
				if(user != null) {
					//buradaki (Object principal, Object credentials, Collection<? extends GrantedAuthority> authorities)
					// principal = user
					//
					// auth mı?
					UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
					auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
					//Securityle alakalı bilgileri localStorage gibi saklıyor diyebiliriz. Local thread objesi yaratıyor. (username,password gibi bilgileri tutuyor)
					//Böylece gelen request authenticate oldu
					SecurityContextHolder.getContext().setAuthentication(auth);			}
			}
		}
		catch(Exception e) {
			return;
		}
		filterChain.doFilter(request, response);		
	}

	private String extractJwtFromRequest(HttpServletRequest request) {
		// Headerda - Bearer ...(token)... geldiği için extract ediyoruz
		String bearer = request.getHeader("Authorization");
		// token dolu mu geldi? bunu kontrol ediyoruz
		if(StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
			//Bearer kısmından sonrasını dönüyoruz
			return bearer.substring("Bearer".length() +1);
		}
		return null;
	}

}
