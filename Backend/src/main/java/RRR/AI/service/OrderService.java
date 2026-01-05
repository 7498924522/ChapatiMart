package RRR.AI.service;

import RRR.AI.DTO.OrderItemDTO;
import RRR.AI.DTO.OrderRequestDTO;
import RRR.AI.entity.Customer;
import RRR.AI.entity.Order;
import RRR.AI.entity.OrderItem;
import RRR.AI.repository.CustomerRepository;
import RRR.AI.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    public OrderService(CustomerRepository customerRepository,
                        OrderRepository orderRepository) {
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
    }
    

    @Transactional
    public Order placeOrder(OrderRequestDTO dto) {

        /* =======================
           1️⃣ Save Customer
        ======================== */
        Customer customer = new Customer();
        customer.setName(dto.getCustomer().getName());
        customer.setPhone(dto.getCustomer().getPhone());
        customer.setEmail(dto.getCustomer().getEmail());
        customer.setAddress(dto.getCustomer().getAddress());
        customer.setCity(dto.getCustomer().getCity());
        customer.setPincode(dto.getCustomer().getPincode());

        customer = customerRepository.save(customer);

        /* =======================
           2️⃣ Create Order
        ======================== */
        Order order = new Order();
        order.setOrderNumber(dto.getOrderNumber());
        order.setPaymentMethod(dto.getPaymentMethod());
        order.setSubtotal(dto.getSubtotal());

        // ✅ IMPORTANT FIXES
        order.setDeliveryCharge(dto.getDeliveryCharge());
        order.setDeliveryStatus(
                dto.getDeliveryStatus() != null ? dto.getDeliveryStatus() : "pending"
        );

        order.setTotal(dto.getTotal());
        order.setOrderDate(LocalDateTime.now());
        order.setCustomer(customer);

        /* =======================
           3️⃣ Order Items
        ======================== */
        List<OrderItem> items = new ArrayList<>();

        for (OrderItemDTO itemDTO : dto.getItems()) {
            OrderItem item = new OrderItem();
            item.setProductId(itemDTO.getProductId());
            item.setProductName(itemDTO.getProductName());
            item.setCategory(itemDTO.getCategory());
            item.setPrice(itemDTO.getPrice());
            item.setQuantity(itemDTO.getQuantity());

            // 🔗 Link order
            item.setOrder(order);
            items.add(item);
        }

        order.setItems(items);

        /* =======================
           4️⃣ Save Order + Items
        ======================== */
        return orderRepository.save(order);
        
        
    }
}
