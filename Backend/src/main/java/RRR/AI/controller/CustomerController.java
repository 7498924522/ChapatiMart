package RRR.AI.controller;

import RRR.AI.entity.Customer;
import RRR.AI.repository.CustomerRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerController {

    private final CustomerRepository customerRepository;

    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    // ===============================
    // GET CUSTOMER BY PHONE
    // ===============================
    @GetMapping("/phone/{phone}")
    public ResponseEntity<Customer> getCustomerByPhone(@PathVariable String phone) {
        Optional<Customer> customer = customerRepository.findByPhone(phone);

        return customer
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
