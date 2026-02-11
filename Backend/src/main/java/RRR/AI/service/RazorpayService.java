package RRR.AI.service;
import com.razorpay.Utils;



import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public void verifyPaymentSignature(String orderId, String paymentId, String signature) throws Exception {
    if (orderId == null || paymentId == null || signature == null) {
        throw new IllegalArgumentException("Payment attributes cannot be null");
    }

    JSONObject json = new JSONObject();
    json.put("razorpay_order_id", orderId.trim());
    json.put("razorpay_payment_id", paymentId.trim());
    json.put("razorpay_signature", signature.trim());

    Utils.verifyPaymentSignature(json, keySecret);
}

}
