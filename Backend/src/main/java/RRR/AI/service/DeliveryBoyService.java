package RRR.AI.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import RRR.AI.DTO.DeliveryBoyOrderDTO;
import RRR.AI.DTO.OrderItemDTO;
import RRR.AI.entity.Customer;
import RRR.AI.entity.DeliveryBoy;
import RRR.AI.entity.Orders;
import RRR.AI.repository.DeliveryBRepository;
import RRR.AI.repository.OrderRepository;

import java.util.List;

@Service
public class DeliveryBoyService {

    private final DeliveryBRepository deliveryBoyRepository;
    
    @Autowired
    private OrderRepository orderRepository;

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


     public List<DeliveryBoyOrderDTO> getOrdersForDeliveryBoy(String phone) {

        List<Orders> orders = orderRepository.findByDeliveryBoyPhone(phone);

        return orders.stream().map(order -> {

            Customer c = order.getCustomer();

            // Convert OrderItem → OrderItemDTO
            List<OrderItemDTO> itemDTOs = order.getItems().stream()
                    .map(item -> new OrderItemDTO(
                           item.getProductId(),
                            item.getProductName(),

                            item.getQuantity(),
                            item.getPrice(),
                            item.getCategory()

                          
                          
                    ))
                    .toList();

            return new DeliveryBoyOrderDTO(
                    order.getOrderNumber(),
                    order.getDeliveryStatus(),
                    order.getDeliveryCharge(),
                    order.getPaymentMethod(),
                    order.getTotal(),
                    order.getOrderDate().toString(), // format if needed
                    c.getName(),
                    c.getPhone(),
                    c.getAddress(),
                    c.getCity(),
                    c.getPincode(),
                    itemDTOs
            );

        }).toList();
    }
    
}
