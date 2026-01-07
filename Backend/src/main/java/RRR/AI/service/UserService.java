package RRR.AI.service;

import RRR.AI.entity.User;
import RRR.AI.repository.UserRepository;

import java.time.LocalDateTime;

import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // SIGNUP
    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // LOGIN WITH EMAIL OR USERNAME
    public boolean login(String emailOrUsername, String password) {
        User user;

        // Check if user entered an email
        if (emailOrUsername.contains("@")) {
            user = userRepository.findByEmail(emailOrUsername);
        } else {
            user = userRepository.findByUsername(emailOrUsername);
        }

        if (user == null) return false;

        return passwordEncoder.matches(password, user.getPassword());
    }
    
    private static final String TWILIO_ACCOUNT_SID = "ACf56a4d039b783ddbb9123338315df174";
    private static final String TWILIO_AUTH_TOKEN = "ceb144639f234414859c39b9ba8466b4";
    private static final String TWILIO_PHONE_NUMBER = "+17754023318"; // Your Twilio phone number

    public UserService() {
        Twilio.init(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    }

    
    /* =========================
       SEND OTP SMS
    ========================= */
    private void sendOtpSms(String phone, String otp) {
        String messageBody = "Your OTP is: " + otp;
        Message.creator(
                new PhoneNumber(phone),
                new PhoneNumber(TWILIO_PHONE_NUMBER),
                messageBody
        ).create();
    }

    /* =========================
       SEND / RESEND OTP
    ========================= */
    public void sendOrResendOtp(String phone) {
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        User user = userRepository.findByPhone(phone)
                .orElse(new User());

        if (user.getResendCount() >= 5) {
            throw new RuntimeException("OTP resend limit exceeded");
        }

        user.setPhone(phone);
        user.setOtp(otp);
        user.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        user.setResendCount(user.getResendCount() + 1);
        user.setOtpVerified(false);

        userRepository.save(user);

        sendOtpSms(phone, otp);
    }

    /* =========================
       VERIFY OTP
    ========================= */
    public boolean verifyOtp(String phone, String otp) {
        Optional<User> optionalUser = userRepository.findByPhone(phone);
        if (optionalUser.isEmpty()) return false;

        User user = optionalUser.get();
        if (user.getExpiryTime().isBefore(LocalDateTime.now())) return false;
        if (!user.getOtp().equals(otp)) return false;

        user.setOtpVerified(true);
        user.setOtp(null);
        user.setExpiryTime(null);
        user.setResendCount(0);

        userRepository.save(user);
        return true;
    }
    public User getUserByPhone(String phone) {
    return userRepository.findByPhone(phone)
            .orElseThrow(() -> new RuntimeException("User not found"));
}

   
}
