package RRR.AI.controller;

import RRR.AI.DTO.OrderRequestDTO;
import RRR.AI.entity.Orders;
import RRR.AI.entity.User;
import RRR.AI.entity.Customer;
import RRR.AI.repository.OrderRepository;
import RRR.AI.repository.UserRepository;
import RRR.AI.repository.CustomerRepository;
import RRR.AI.jwt.JwtUtil;
import RRR.AI.service.OrderService;
import RRR.AI.service.RazorpayService;

import java.util.Map;
import java.util.HashMap;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.razorpay.RazorpayException;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*") // Configure appropriately for production
public class OrderController {

    private final OrderService orderService;
    private final RazorpayService razorpayService;
    private final OrderRepository orderRepository;

    // 🔐 JWT dependencies
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;

    public OrderController(OrderService orderService,
                           RazorpayService razorpayService,
                           OrderRepository orderRepository,
                           JwtUtil jwtUtil,
                           UserRepository userRepository,
                           CustomerRepository customerRepository) {

        this.orderService = orderService;
        this.razorpayService = razorpayService;
        this.orderRepository = orderRepository;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
    }

    // ===============================
    // PLACE ORDER (UNCHANGED)
    // ===============================
    @PostMapping("/place")
    public ResponseEntity<Orders> placeOrder(@RequestBody OrderRequestDTO dto) {
        try {
            
            Orders savedOrder = orderService.placeOrder(dto);
            return ResponseEntity.ok(savedOrder);
        } catch (RazorpayException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ===============================
    // VERIFY PAYMENT (UNCHANGED)
    // ===============================
    @PostMapping("/verify-payment")
    public ResponseEntity<String> verifyPayment(@RequestBody Map<String, String> paymentData) {

        System.out.println("DEBUG: Incoming Payment Data -> " + paymentData);

        String razorpayOrderId = paymentData.get("razorpay_order_id");
        String razorpayPaymentId = paymentData.get("razorpay_payment_id");
        String razorpaySignature = paymentData.get("razorpay_signature");

        try {
            razorpayService.verifyPaymentSignature(
                    razorpayOrderId,
                    razorpayPaymentId,
                    razorpaySignature
            );

            System.out.println("========== PAYMENT VERIFICATION ==========");
            System.out.println("Received razorpay_order_id: " + razorpayOrderId);
            System.out.println("Received razorpay_payment_id: " + razorpayPaymentId);
            System.out.println("Received razorpay_signature: " + razorpaySignature);

            Orders order = orderRepository.findByRazorpayId(razorpayOrderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            order.setPaymentStatus("PAID");
            orderRepository.save(order);

            return ResponseEntity.ok("Payment verified successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid payment signature");
        }
    }

    // ===============================
    // GET ORDER STATUS BY ORDER NUMBER
    // ===============================
    @GetMapping("/status/{orderNumber}")
    public ResponseEntity<Map<String, String>> getOrderStatus(@PathVariable String orderNumber) {
        try {
            Orders order = orderService.findOrderByOrderNumber(orderNumber);

            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            Map<String, String> response = new HashMap<>();
            response.put("orderNumber", order.getOrderNumber());
            response.put("deliveryStatus", order.getDeliveryStatus());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ===============================
    // GET FULL ORDER DETAILS
    // ===============================
    @GetMapping("/{orderNumber}")
    public ResponseEntity<Orders> getOrderByOrderNumber(@PathVariable String orderNumber) {
        try {
            Orders order = orderService.findOrderByOrderNumber(orderNumber);

            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            return ResponseEntity.ok(order);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ==========================================================
    // ⭐ NEW API — GET LOGGED IN USER ORDERS (JWT BASED)
    // ==========================================================
  @GetMapping("/my")
public ResponseEntity<?> getMyOrders(
        @RequestHeader("Authorization") String authHeader) {

    try {
        // Remove Bearer prefix
        String token = authHeader.substring(7);

        // Extract username (actually email) from token
        String email = jwtUtil.extractUsername(token);

        // ✅ ADD LOGGING
        System.out.println("🔍 Fetching orders for email: " + email);

        // Fetch user by email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            System.out.println("❌ User not found for email: " + email);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not found"));
        }

        System.out.println("✅ User found: " + user.getUsername());

        Customer customer = user.getCustomer();
        

        // System.out.println("✅ Customer found: " + customer.getName());
        if (customer == null) {
    System.out.println("❌ Customer profile not created for user");

    return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body("Customer profile not created. Please complete profile first.");
}

        List<Orders> orders = orderService.getOrdersByCustomer(customer);

        System.out.println("📦 Orders count: " + orders.size());

        return ResponseEntity.ok(orders);

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
    }
}
}
