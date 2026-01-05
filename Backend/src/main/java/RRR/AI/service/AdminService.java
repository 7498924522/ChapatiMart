package RRR.AI.service;

import RRR.AI.DTO.AdminOrderDTO;
import RRR.AI.DTO.OrderItemDTO;
import RRR.AI.entity.Order;
import RRR.AI.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final OrderRepository orderRepository;

    public AdminService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<AdminOrderDTO> getAllOrders() {
        return orderRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public AdminOrderDTO updateOrderStatus(String orderNumber, String status) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setDeliveryStatus(status);
        orderRepository.save(order);
        return mapToDTO(order);
    }
    


    private AdminOrderDTO mapToDTO(Order order) {
        AdminOrderDTO dto = new AdminOrderDTO();
        dto.setOrderNumber(order.getOrderNumber());
        dto.setStatus(order.getDeliveryStatus());
        dto.setDeliveryCharge(order.getDeliveryCharge());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setTotal(order.getTotal());
        dto.setOrderDate(order.getOrderDate().toString());

        dto.setCustomerName(order.getCustomer().getName());
        dto.setCustomerPhone(order.getCustomer().getPhone());
        dto.setCustomerEmail(order.getCustomer().getEmail());
        dto.setCustomerAddress(order.getCustomer().getAddress());
        dto.setCustomerCity(order.getCustomer().getCity());
        dto.setCustomerPincode(order.getCustomer().getPincode());

        List<OrderItemDTO> items = order.getItems().stream()
                .map(i -> new OrderItemDTO(i.getProductId(),i.getProductName(),i.getCategory(), i.getPrice(), i.getQuantity()))
                .collect(Collectors.toList());
        dto.setItems(items);

        return dto;
    }
}
