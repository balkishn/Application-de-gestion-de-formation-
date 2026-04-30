package abh.formation.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private long jwtExpirationMs;
    
    public String generateJwtToken(Authentication authentication) {
        String username = authentication.getName();
        String role = authentication.getAuthorities().iterator().next().getAuthority();
        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + jwtExpirationMs);
        
        return Jwts.builder()
            .subject(username)
            .claim("role", role)
            .issuedAt(issuedAt)
            .expiration(expiration)
            .signWith(key())
            .compact();
    }
    
    public String generateTokenFromUsername(String username, String role) {
        Date issuedAt = new Date();
        Date expiration = new Date(issuedAt.getTime() + jwtExpirationMs);

        return Jwts.builder()
            .subject(username)
            .claim("role", role)
            .issuedAt(issuedAt)
            .expiration(expiration)
            .signWith(key())
            .compact();
    }
    
    private SecretKey key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
    
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser()
            .verifyWith(key())
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
    }
    
    public String getRoleFromJwtToken(String token) {
        Claims claims = Jwts.parser()
            .verifyWith(key())
            .build()
            .parseSignedClaims(token)
            .getPayload();
        return claims.get("role", String.class);
    }
    
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
