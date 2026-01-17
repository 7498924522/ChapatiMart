package RRR.AI.controller;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import RRR.AI.entity.Order;
import RRR.AI.DTO.DeliveryBoyOrderDTO;
import RRR.AI.entity.DeliveryBoy;
import RRR.AI.repository.DeliveryBRepository;
import RRR.AI.repository.OrderRepository;
import RRR.AI.service.DeliveryBoyService;



@RestController
@RequestMapping("/admin")
// @CrossOrigin(origins = "http://localhost:5173")
public class DeliveryBoyController {

    private DeliveryBoyService service;
    @Autowired
    private DeliveryBRepository deliveryBoyRepository;
    @Autowired
    private OrderRepository orderRepo;

    public DeliveryBoyController(DeliveryBoyService service) {
        this.service = service;
    }

    // CREATE DELIVERY BOY
    @PostMapping("/delivery-boy")
    public DeliveryBoy createDeliveryBoy(@RequestBody DeliveryBoy user) {
        return service.createDeliveryBoy(user);
    }

    // GET ALL DELIVERY BOYS
    @GetMapping("/delivery-boys")
    public List<DeliveryBoy> getDeliveryBoys() {
        return deliveryBoyRepository.findAll();
    }

    // DELIVERY DASHBOARD → online/offline
    @PutMapping("/status")
    public ResponseEntity<?> updateStatus(@RequestParam String phone, @RequestParam boolean active) {
        return deliveryBoyRepository.findByPhone(phone)
                .map(boy -> {
                    boy.setActive(active ? "online": "offline");  // true = online, false = offline
                    deliveryBoyRepository.save(boy);
                    return ResponseEntity.ok("Status updated to " + (active ? "Online" : "Offline"));
                })
                .orElseGet(() -> ResponseEntity.status(404).body("Delivery Boy not found"));
    }

   




   @PostMapping("/deliveryBoy/login")
public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
    String phone = credentials.get("phone");
    String password = credentials.get("password");

    Optional<DeliveryBoy> boyOpt = deliveryBoyRepository.findByPhoneAndPassword(phone, password);

    if (boyOpt.isPresent()) {
        return ResponseEntity.ok(boyOpt.get()); // DeliveryBoy found
    } else {
        return ResponseEntity.status(401).body("Invalid phone or password"); // not found
    }
}


     @GetMapping("/delivery/orders/{phone}")
    public ResponseEntity<List<DeliveryBoyOrderDTO>> getOrders(
            @PathVariable String phone) {

        List<DeliveryBoyOrderDTO> orders = service.getOrdersForDeliveryBoy(phone);

        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(orders);
    }
  
    // UPDATE STATUS
    // @PutMapping("/update-status")
    // public ResponseEntity<?> updateStatus(@RequestBody Map<String, String> req) {

    //     Order order = orderRepo.findByOrderNumber(req.get("orderNumber"))
    //             .orElseThrow(() -> new RuntimeException("Order not found"));

    //     // order.setStatus(req.get("status"));
    //     orderRepo.save(order);

    //     return ResponseEntity.ok("Status Updated");
    // }

   
}

