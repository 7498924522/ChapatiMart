package RRR.AI.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
    
    private String phone;
    private String email;
    private String address;
    private String city;
    private String pincode;

    // Bidirectional One-to-One with User
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    @JsonIgnore
    private User user;

    // Bidirectional relationship with Orders
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference(value = "customer-orders")
    private List<Orders> orders = new ArrayList<>();

    // Constructors
    public Customer() {}

    // Helper methods for bidirectional relationships
    public void addOrder(Orders order) {
        orders.add(order);
        order.setCustomer(this);
    }

    public void removeOrder(Orders order) {
        orders.remove(order);
        order.setCustomer(null);
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<Orders> getOrders() { return orders; }
    public void setOrders(List<Orders> orders) { this.orders = orders; }
}