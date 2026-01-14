package RRR.AI.repository;
import java.util.Optional;
import java.util.List;
import RRR.AI.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    
   List<Order> findByDeliveryStatus(String deliveryStatus);

   List<Order> findByDeliveryBoyPhone(String phone);

}
