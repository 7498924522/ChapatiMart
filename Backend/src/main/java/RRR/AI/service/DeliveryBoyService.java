package RRR.AI.service;


import org.springframework.stereotype.Service;
import RRR.AI.entity.DeliveryBoy;
import RRR.AI.repository.DeliveryBRepository;
import java.util.List;

@Service
public class DeliveryBoyService {

    private final DeliveryBRepository deliveryBoyRepository;

    public DeliveryBoyService(DeliveryBRepository deliveryBRepository) {
        this.deliveryBoyRepository = deliveryBRepository;
    }

    public DeliveryBoy createDeliveryBoy(DeliveryBoy boy) {
        return deliveryBoyRepository.save(boy);
    }

    public List<DeliveryBoy> getAllDeliveryBoys() {
        return deliveryBoyRepository.findByActiveTrue();
    }

     public DeliveryBoy updateActiveStatus(Long id, boolean active) {
        DeliveryBoy boy = deliveryBoyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Delivery Boy not found"));

        boy.setActive(active ? "online":"offline");
        return deliveryBoyRepository.save(boy);
    }

    

    // Admin view all
    public List<DeliveryBoy> getAll() {
        return deliveryBoyRepository.findAll();
    }

    
}
