package RRR.AI.repository;

import RRR.AI.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // Find customer by phone number
    Optional<Customer> findByPhone(String phone);

}
