package RRR.AI.controller;


import RRR.AI.DTO.AdminOrderDTO;
import RRR.AI.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/admin/orders")
    public ResponseEntity<List<AdminOrderDTO>> getAllOrders() {
        return ResponseEntity.ok(adminService.getAllOrders());
    }

    @PutMapping("/{orderNumber}/status")
    public ResponseEntity<AdminOrderDTO> updateStatus(@PathVariable String orderNumber,
                                                      @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(adminService.updateOrderStatus(orderNumber, body.get("status")));
    }
}
