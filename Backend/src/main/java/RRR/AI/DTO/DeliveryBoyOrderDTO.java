package RRR.AI.DTO;

import java.util.List;

public class DeliveryBoyOrderDTO {

    private String orderNumber;
    private String status;
    private double deliveryCharge;    // optional if needed
    private String paymentMethod;     // optional
    private Double total;
    private String orderDate;

    private String customerName;
    private String customerPhone;
    private String customerAddress;
    private String customerCity;
    private String customerPincode;

    private List<OrderItemDTO> items;

    public DeliveryBoyOrderDTO()
    {}

    // Constructor
    public DeliveryBoyOrderDTO(String orderNumber, String status, double deliveryCharge,
                               String paymentMethod, Double total, String orderDate,
                               String customerName, String customerPhone,
                               String customerAddress, String customerCity,
                               String customerPincode, List<OrderItemDTO> items) {
        this.orderNumber = orderNumber;
        this.status = status;
        this.deliveryCharge = deliveryCharge;
        this.paymentMethod = paymentMethod;
        this.total = total;
        this.orderDate = orderDate;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.customerAddress = customerAddress;
        this.customerCity = customerCity;
        this.customerPincode = customerPincode;
        this.items = items;
    }

    // Getters and setters (same as AdminOrderDTO)
    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

     public double getDeliveryCharge() {
        return deliveryCharge;
    }

    public void setDeliveryCharge(double deliveryCharge) {
        this.deliveryCharge = deliveryCharge;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public String getCustomerCity() {
        return customerCity;
    }

    public void setCustomerCity(String customerCity) {
        this.customerCity = customerCity;
    }

    public String getCustomerPincode() {
        return customerPincode;
    }

    public void setCustomerPincode(String customerPincode) {
        this.customerPincode = customerPincode;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

}
