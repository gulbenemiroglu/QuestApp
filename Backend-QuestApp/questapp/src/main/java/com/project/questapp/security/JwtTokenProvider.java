package com.project.questapp.security;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

@Component
public class JwtTokenProvider {
	
	//Tokenımızın bu applicatona özel bir keyi, buna özel token oluşturulacak
	@Value("${questapp.app.secret}")	
	private String APP_SECRET;
	
	//kaç saniyede bu tokenlar expires oluyor, geçerliliğini yitiriyor?
	@Value("${questapp.expires.in}")
	private long EXPIRES_IN;
	
	
	public String generateJwtToken(Authentication auth) {
		//getPrinciplipal = authenticate edeceğimiz user demek
		JwtUserDetails userDetails= (JwtUserDetails) auth.getPrincipal();
		Date expireDate = new Date(new Date().getTime()+ EXPIRES_IN);
		return Jwts.builder()
				.setSubject(Long.toString(userDetails.getId()))
				.setIssuedAt(new Date()).setExpiration(expireDate)
				.signWith(SignatureAlgorithm.HS512, APP_SECRET).compact();
	}
	
	//extract
	//oluşturulan tokenı çözümleyerek buradan userId yi alabiliriz bu yüzden bu methodu oluşturuyoruz.
	public Long getUserIdFromJwt(String token) {
		Claims claims = Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(token).getBody();
		return Long.parseLong(claims.getSubject());
	}

	//Validation
	//geçerli bi token mı? expire olmuş mu? doğru bi kullanıcı mı?
	public boolean validateToken(String token) {
		try {
			Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(token);
			return !isTokenExpired(token);
		}
		catch(SignatureException e) {
			return false;
		}
		catch(MalformedJwtException e) {
			return false;
		}
		catch(ExpiredJwtException e){
			return false;
		}
		catch(UnsupportedJwtException e){
			return false;
		}
		catch(IllegalArgumentException e){
			return false;
		}
		
	}

	private boolean isTokenExpired(String token) {
		Date expiration = Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(token).getBody().getExpiration();
		return expiration.before(new Date());
	}
}
