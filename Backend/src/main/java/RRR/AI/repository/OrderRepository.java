// package RRR.AI.repository;
// import java.util.Optional;
// import java.util.List;
// import RRR.AI.entity.Orders;

// import org.springframework.data.jpa.repository.JpaRepository;


// public interface OrderRepository extends JpaRepository<Orders, Long> {
//     Optional<Orders> findByOrderNumber(String orderNumber);
    
//    List<Orders> findByDeliveryStatus(String deliveryStatus);

//    List<Orders> findByDeliveryBoyPhone(String phone);

//    Optional<Orders> findByRazorpayId(String razorpayId);

//    List<Orders> findByCustomerEmail(String email);
//    List<Orders> findByCustomerId(Long customerId);


// }


package RRR.AI.repository;

import RRR.AI.entity.Orders;
import RRR.AI.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long> {
    
    Optional<Orders> findByOrderNumber(String orderNumber);
    
    Optional<Orders> findByRazorpayId(String razorpayId);
    
    List<Orders> findByDeliveryStatus(String deliveryStatus);
    
    // ✅ CHANGE FROM findByCustomerId to findByCustomer
    List<Orders> findByCustomer(Customer customer);
    
    // ✅ ADD THIS - For delivery boy
    List<Orders> findByDeliveryBoyPhone(String deliveryBoyPhone);
}