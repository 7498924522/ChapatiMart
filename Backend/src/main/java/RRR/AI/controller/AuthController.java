package RRR.AI.controller;


import RRR.AI.jwt.JwtUtil;
import RRR.AI.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthController(UserService userService,JwtUtil jwtUtil)
    {
        this.userService=userService;
        this.jwtUtil=jwtUtil;
    }

    /* ================= LOGIN ================= */
    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Map<String, String> body) {

    String emailOrUsername = body.get("username"); // matches React
    String password = body.get("password");

    boolean valid = userService.login(emailOrUsername, password);

    if (!valid) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid username/email or password"));
    }

    String token = jwtUtil.generateToken(emailOrUsername); // or username

    Map<String, String> response = new HashMap<>();
    response.put("token", token);

    return ResponseEntity.ok(response);
}
}
