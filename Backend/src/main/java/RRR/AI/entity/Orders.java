package RRR.AI.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String orderNumber;
    
    private String paymentMethod;
    private Double subtotal;
    private Double deliveryCharge;
    private int total; // Changed to Double for consistency
    
    @Column(nullable = false)
    private String deliveryStatus = "PENDING"; // Default status
    
    @Column(nullable = false)
    private LocalDateTime orderDate = LocalDateTime.now();
    
    private String deliveryBoyPhone;
    private LocalDateTime assignedAt;
    
    private String razorpayId;
    private String paymentStatus = "PENDING"; // Fixed naming convention
    
    // Bidirectional relationship with Customer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    @JsonManagedReference(value = "customer-orders")
    private Customer customer;

    // Bidirectional relationship with OrderItem
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "order-items")
    private List<OrderItem> items = new ArrayList<>();

    // Constructors
    public Orders() {}

    // Helper methods for bidirectional relationship
    public void addOrderItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeOrderItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }

    public Double getDeliveryCharge() { return deliveryCharge; }
    public void setDeliveryCharge(Double deliveryCharge) { this.deliveryCharge = deliveryCharge; }

    public int getTotal() { return total; }
    public void setTotal(int total) { this.total = total; }

    public String getDeliveryBoyPhone() { return deliveryBoyPhone; }
    public void setDeliveryBoyPhone(String deliveryBoyPhone) { this.deliveryBoyPhone = deliveryBoyPhone; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }

    public String getDeliveryStatus() { return deliveryStatus; }
    public void setDeliveryStatus(String deliveryStatus) { this.deliveryStatus = deliveryStatus; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public String getRazorpayId() { return razorpayId; }
    public void setRazorpayId(String razorpayId) { this.razorpayId = razorpayId; }
   
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}