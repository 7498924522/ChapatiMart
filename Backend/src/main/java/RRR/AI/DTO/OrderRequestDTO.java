package RRR.AI.DTO;

import java.util.List;

public class OrderRequestDTO {

    private String orderNumber;
    private CustomerDTO customer;
    private List<OrderItemDTO> items;

    private double subtotal;
    private double deliveryCharge;
    private double total;

    private String paymentMethod;
    private String deliveryStatus;

    /* ================= Order Number ================= */
    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    /* ================= Customer ================= */
    public CustomerDTO getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerDTO customer) {
        this.customer = customer;
    }

    /* ================= Items ================= */
    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    /* ================= Subtotal ================= */
    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    /* ================= Delivery Charge ================= */
    public double getDeliveryCharge() {
        return deliveryCharge;
    }

    public void setDeliveryCharge(double deliveryCharge) {
        this.deliveryCharge = deliveryCharge;
    }

    /* ================= Delivery Status ================= */
    public String getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(String deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    /* ================= Total ================= */
    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    /* ================= Payment Method ================= */
    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
