package RRR.AI.controller;


import RRR.AI.DTO.AdminOrderDTO;
import RRR.AI.repository.OrderRepository;
import RRR.AI.service.AdminService;
import RRR.AI.entity.Orders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AdminController {

      private final AdminService adminService;
       @Autowired
       private OrderRepository orderRepo;
  

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }


    //Admin get the Customer Data From the Database
    @GetMapping("/admin/orders")
    public ResponseEntity<List<AdminOrderDTO>> getAllOrders() {
        return ResponseEntity.ok(adminService.getAllOrders());
    }

    //Admin Update Order Vise  Status confirmed ready deliverind delivered
    @PutMapping("/{orderNumber}/status")
    public ResponseEntity<AdminOrderDTO> updateStatus(@PathVariable String orderNumber,
                                                      @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(adminService.updateOrderStatus(orderNumber, body.get("status")));
    }

    // Here The Admin ASSIGNED Order to the Delivery Boy
    @PutMapping("/assign-order")
    public ResponseEntity<?> assignOrder(@RequestBody Map<String, String> req) {

        Orders order = orderRepo.findByOrderNumber(req.get("orderNumber"))
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setDeliveryBoyPhone(req.get("deliveryBoyPhone"));
      
        order.setAssignedAt(LocalDateTime.now());

        orderRepo.save(order);
        return ResponseEntity.ok("Order Assigned");
    }

    
}
