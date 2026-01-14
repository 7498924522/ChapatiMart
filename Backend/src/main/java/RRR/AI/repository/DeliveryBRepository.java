package RRR.AI.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import RRR.AI.entity.DeliveryBoy;
import java.util.List;
import java.util.Optional;
;

public interface DeliveryBRepository extends JpaRepository<DeliveryBoy, Long> {

    List<DeliveryBoy> findByActiveTrue();   // ONLINE boys
    List<DeliveryBoy> findByActiveFalse();  // OFFLINE boys
    Optional<DeliveryBoy> findByPhoneAndPassword(String phone, String password);
       Optional<DeliveryBoy> findByPhone(String phone);

   
}
