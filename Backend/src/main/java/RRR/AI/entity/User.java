package RRR.AI.entity;
import java.time.LocalDateTime;

// import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(unique = true)
    private String email;
 
    private String password;
     private String phone;
  
    private String otp;
    private boolean otpVerified;
    private LocalDateTime expiryTime;
    private int resendCount;

   public User() {
    this.otpVerified = false;
    this.resendCount = 0;
}
    
public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
}


    public User(String username, String email, String password,String phone,String otp,boolean otpVerified, LocalDateTime expiryTime,int resentCount) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.otp= otp;
        this.otpVerified= otpVerified;
        this.expiryTime = expiryTime;
        this.resendCount=resentCount;

    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
     public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
    public boolean isOtpVerified() {
    return otpVerified;
}

public void setOtpVerified(boolean otpVerified) {
    this.otpVerified = otpVerified;
}


    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }

    public void setExpiryTime(LocalDateTime expiryDateTime) {
        this.expiryTime = expiryDateTime;
    }

    public int getResendCount() {
        return resendCount;
    }

    public void setResendCount(int resendCount) {
        this.resendCount = resendCount;
    }

    
}