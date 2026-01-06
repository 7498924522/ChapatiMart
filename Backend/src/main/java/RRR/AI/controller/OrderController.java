package RRR.AI.controller;

import RRR.AI.DTO.OrderRequestDTO;
import RRR.AI.entity.Order;
import RRR.AI.service.OrderService;
import java.util.Map;
import java.util.HashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*") // Configure appropriately for production
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ===============================
    // PLACE ORDER (Chapati/Wheat/Flour)
    // ===============================
    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequestDTO dto) {
        try {
            Order savedOrder = orderService.placeOrder(dto);
            return ResponseEntity.ok(savedOrder);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    // ===============================
    // GET ORDER STATUS BY ORDER NUMBER
    // ===============================
    @GetMapping("/status/{orderNumber}")
    public ResponseEntity<Map<String, String>> getOrderStatus(@PathVariable String orderNumber) {
        try {
            Order order = orderService.findOrderByOrderNumber(orderNumber);
            
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
    // GET FULL ORDER DETAILS BY ORDER NUMBER (Optional)
    // ===============================
    @GetMapping("/{orderNumber}")
    public ResponseEntity<Order> getOrderByOrderNumber(@PathVariable String orderNumber) {
        try {
            Order order = orderService.findOrderByOrderNumber(orderNumber);
            
            if (order == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    
}