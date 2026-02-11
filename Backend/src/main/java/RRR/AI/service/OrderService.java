package RRR.AI.service;

import RRR.AI.DTO.OrderItemDTO;
import RRR.AI.DTO.OrderRequestDTO;
import RRR.AI.entity.Customer;
import RRR.AI.entity.Orders;
import RRR.AI.entity.OrderItem;
import RRR.AI.entity.User;
import RRR.AI.repository.CustomerRepository;
import RRR.AI.repository.OrderRepository;
import RRR.AI.repository.UserRepository;

import jakarta.annotation.PostConstruct;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private RazorpayClient razorpayclient;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;
    
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository; // ✅ ADD THIS

    @PostConstruct
    public void init() throws Exception {
        this.razorpayclient = new RazorpayClient(keyId, keySecret);
        System.out.println("Razorpay Client Initialized ✅");
    }

    // ✅ UPDATE CONSTRUCTOR
    public OrderService(CustomerRepository customerRepository, 
                       OrderRepository orderRepository,
                       UserRepository userRepository) {
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

 @Transactional
public Orders placeOrder(OrderRequestDTO dto) throws RazorpayException {

    /* ======================= 1️⃣ Save/Update Customer ======================== */
    Customer customer;
    
    // ✅ CHECK IF CUSTOMER ALREADY EXISTS BY EMAIL
    User user = userRepository.findByEmail(dto.getCustomer().getEmail());
    
    if (user != null && user.getCustomer() != null) {
        // Customer exists - update details
        customer = user.getCustomer();
        customer.setName(dto.getCustomer().getName());
        customer.setPhone(dto.getCustomer().getPhone());
        customer.setAddress(dto.getCustomer().getAddress());
        customer.setCity(dto.getCustomer().getCity());
        customer.setPincode(dto.getCustomer().getPincode());
        customer = customerRepository.save(customer);
        
    } else if (user != null && user.getCustomer() == null) {
        // ✅ User exists but no customer profile
        customer = new Customer();
        customer.setName(dto.getCustomer().getName());
        customer.setPhone(dto.getCustomer().getPhone());
        customer.setEmail(dto.getCustomer().getEmail());
        customer.setAddress(dto.getCustomer().getAddress());
        customer.setCity(dto.getCustomer().getCity());
        customer.setPincode(dto.getCustomer().getPincode());
        
        // ⭐ CRITICAL: Set BOTH sides BEFORE saving
        customer.setUser(user);
        user.setCustomer(customer);
        
        // ✅ Now save User (cascade will save Customer too)
        userRepository.save(user);
        
        // ✅ Refresh customer reference if needed
        customer = user.getCustomer();
        
        System.out.println("✅ Linked User ID: " + user.getId() + " to Customer ID: " + customer.getId());
        
    } else {
        // No user found - create new customer (guest order)
        customer = new Customer();
        customer.setName(dto.getCustomer().getName());
        customer.setPhone(dto.getCustomer().getPhone());
        customer.setEmail(dto.getCustomer().getEmail());
        customer.setAddress(dto.getCustomer().getAddress());
        customer.setCity(dto.getCustomer().getCity());
        customer.setPincode(dto.getCustomer().getPincode());
        customer = customerRepository.save(customer);
        
        System.out.println("⚠️ Guest order created - no user linked");
    }

    /* ======================= 2️⃣ Create Order ======================== */
    Orders order = new Orders();
    order.setOrderNumber(dto.getOrderNumber());
    order.setPaymentMethod(dto.getPaymentMethod());
    order.setSubtotal(dto.getSubtotal());
    order.setDeliveryCharge(dto.getDeliveryCharge());
    order.setDeliveryStatus(
        dto.getDeliveryStatus() != null ? dto.getDeliveryStatus() : "PENDING"
    );
    order.setTotal(dto.getTotal());
    order.setOrderDate(LocalDateTime.now());
    order.setCustomer(customer);

    /* ======================= 3️⃣ Order Items ======================== */
    List<OrderItem> items = new ArrayList<>();
    for (OrderItemDTO itemDTO : dto.getItems()) {
        OrderItem item = new OrderItem();
        item.setProductId(itemDTO.getProductId());
        item.setProductName(itemDTO.getProductName());
        item.setCategory(itemDTO.getCategory());
        item.setPrice(itemDTO.getPrice());
        item.setQuantity(itemDTO.getQuantity());
        item.setOrder(order);
        items.add(item);
    }
    order.setItems(items);

    /* ======================= 4️⃣ Handle Payment ======================== */
    if (!dto.getPaymentMethod().equalsIgnoreCase("Cash on Delivery")) {
        int amountInPaise = dto.getTotal() * 100;

        JSONObject json = new JSONObject();
        json.put("amount", amountInPaise);
        json.put("currency", "INR");
        json.put("receipt", order.getOrderNumber());

        com.razorpay.Order razorpayOrder = razorpayclient.orders.create(json);

        System.out.println("========== RAZORPAY ORDER CREATION ==========");
        System.out.println("DB Order Number: " + order.getOrderNumber());
        System.out.println("Amount (Paise): " + amountInPaise);
        System.out.println("Razorpay Order ID: " + razorpayOrder.get("id"));
        System.out.println("=============================================");

        order.setRazorpayId(razorpayOrder.get("id"));
        order.setPaymentStatus("CREATED");
    } else {
        order.setPaymentStatus("Cash_On_Delivery");
    }

    /* ======================= 5️⃣ Save Order + Items ======================== */
    Orders savedOrder = orderRepository.save(order);
    
    System.out.println("📦 Order saved: " + savedOrder.getOrderNumber() + 
                       " for Customer: " + customer.getName() + 
                       " (User ID: " + (customer.getUser() != null ? customer.getUser().getId() : "NULL") + ")");
    
    return savedOrder;   
}

    public Orders findOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber).orElse(null);
    }

    public List<Orders> findAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public Orders updateOrderStatus(String orderNumber, String newStatus) {
        Orders order = orderRepository.findByOrderNumber(orderNumber).orElse(null);
        if (order != null) {
            order.setDeliveryStatus(newStatus);
            return orderRepository.save(order);
        }
        return null;
    }

    public List<Orders> findOrdersByStatus(String status) {
        return orderRepository.findByDeliveryStatus(status);
    }

    // ✅ FIX THIS METHOD - Use Customer object, not ID
    public List<Orders> getOrdersByCustomer(Customer customer) {
        return orderRepository.findByCustomer(customer);
    }
}