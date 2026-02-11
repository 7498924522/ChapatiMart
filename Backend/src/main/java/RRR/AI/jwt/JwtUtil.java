package RRR.AI.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")      // Your Base64-encoded secret from application.properties
    private String SECRET;

    @Value("${jwt.expiration}")  // Expiration in milliseconds, e.g., 3600000 = 1 hour
    private long EXPIRATION;

    // =========================
    // CREATE SIGNING KEY
    // =========================
    private Key getSignKey() {
        // SECRET must be Base64 encoded in application.properties
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // =========================
    // GENERATE TOKEN
    // =========================
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)                    // store username/email inside token
                .setIssuedAt(new Date())                 // current timestamp
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION)) // expiry
                .signWith(getSignKey())                  // sign with secret key
                .compact();
    }

    // =========================
    // EXTRACT USERNAME/EMAIL
    // =========================
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    // =========================
    // VALIDATE TOKEN
    // =========================
    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);  // Throws exception if invalid/expired
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // =========================
    // EXTRACT ALL CLAIMS
    // =========================
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey()) // Set signing key
                .build()
                .parseClaimsJws(token)       // parse the token
                .getBody();                  // get the claims
    }
}
