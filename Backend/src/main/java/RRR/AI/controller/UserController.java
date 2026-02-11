package RRR.AI.controller;

import RRR.AI.entity.User;
import RRR.AI.service.UserService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// import org.springframework.web.bind.annotation.CrossOrigin;

// @CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;

  // Signup
    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        userService.registerUser(user);
        return "User registered successfully!";
    }

  

    
   /* =========================
       SEND OTP
    ========================= */
    // @PostMapping("/send-otp")
    // public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> payload) {
    //     try {
    //         String phone = payload.get("phone");
    //         if (phone == null || phone.isEmpty()) {
    //             return ResponseEntity.badRequest().body(Map.of("message", "Phone number is required"));
    //         }

    //         userService.sendOrResendOtp(phone);
    //         return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    //     } catch (Exception e) {
    //         return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
    //     }
    // }

    /* =========================
       VERIFY OTP
    ========================= */
    // @PostMapping("/verify-otp")
    // public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> payload) {
    //     try {
    //         String phone = payload.get("phone");
    //         String otp = payload.get("otp");

    //         if (phone == null || otp == null || phone.isEmpty() || otp.isEmpty()) {
    //             return ResponseEntity.badRequest().body(Map.of("message", "Phone and OTP are required"));
    //         }

    //         boolean verified = userService.verifyOtp(phone, otp);

    //         if (!verified) {
    //             return ResponseEntity.badRequest().body(Map.of("message", "Invalid OTP or expired"));
    //         }

    //         // You can return user info after successful OTP verification
    //         User user = userService.getUserByPhone(phone);

    //         return ResponseEntity.ok(user);
    //     } catch (Exception e) {
    //         return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
    //     }
    // }
}