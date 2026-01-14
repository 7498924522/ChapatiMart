package RRR.AI.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
@Table(name = "delivery_data")
public class DeliveryBoy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String email;
    private String password;
    @Column(nullable = false)
    @JsonProperty
    private String active;
    private String Delivery_Status;

    // constructors
    public DeliveryBoy() {}

    // getters & setters
    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getActive() { return active; }
    public void setActive(String active) { this.active = active; }
    public String getDeliveryStatus() { return Delivery_Status; }
    public void setDeliveryStatus(String Delivery_Status) { this.Delivery_Status = Delivery_Status; }

}
