package RRR.AI.controller;

import RRR.AI.DTO.OrderRequestDTO;
import RRR.AI.entity.Order;
import RRR.AI.service.OrderService;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
// @CrossOrigin(origins = "http://localhost:5173")
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
        Order savedOrder = orderService.placeOrder(dto);
        return ResponseEntity.ok(savedOrder);
    }
    
    
}
