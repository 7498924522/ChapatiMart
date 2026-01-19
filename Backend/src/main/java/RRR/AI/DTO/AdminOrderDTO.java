package RRR.AI.DTO;

import java.util.List;

public class AdminOrderDTO {

    private String orderNumber;
    private String status;
    private double deliveryCharge;
    private String paymentMethod;
    private Double total;
    private String orderDate;
   private String deliveryBoyPhone;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String customerAddress;
    private String customerCity;
    private String customerPincode;

    private List<OrderItemDTO> items;

    // Default constructor
    public AdminOrderDTO() {}

    // Constructor with all fields
    public AdminOrderDTO(String orderNumber, String status,double deliveryCharge, String paymentMethod, Double total, String orderDate,
                        String deliveryBoyPhone,String customerName, String customerPhone, String customerEmail, String customerAddress,
                         String customerCity, String customerPincode, List<OrderItemDTO> items) {
        this.orderNumber = orderNumber;
        this.status = status;
        this.deliveryCharge=deliveryCharge;
        this.paymentMethod = paymentMethod;
        this.total = total;
        this.orderDate = orderDate;
        this.deliveryBoyPhone=deliveryBoyPhone;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.customerEmail = customerEmail;
        this.customerAddress = customerAddress;
        this.customerCity = customerCity;
        this.customerPincode = customerPincode;
        this.items = items;
    }

    // Getters and Setters
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
    public String getDeliveryBoyPhone() 
    { return deliveryBoyPhone; }

    public void setDeliveryBoyPhone(String deliveryBoyPhone) 
    { this.deliveryBoyPhone = deliveryBoyPhone; }


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

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
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

    // Optional: toString() for debugging
    @Override
    public String toString() {
        return "AdminOrderDTO{" +
                "orderNumber='" + orderNumber + '\'' +
                ", status='" + status + '\'' +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", total=" + total +
                ", orderDate='" + orderDate + '\'' +
                ", customerName='" + customerName + '\'' +
                ", customerPhone='" + customerPhone + '\'' +
                ", customerEmail='" + customerEmail + '\'' +
                ", customerAddress='" + customerAddress + '\'' +
                ", customerCity='" + customerCity + '\'' +
                ", customerPincode='" + customerPincode + '\'' +
                ", items=" + items +
                '}';
    }
}
