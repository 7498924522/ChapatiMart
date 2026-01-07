package RRR.AI.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import RRR.AI.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByUsername(String username);
     Optional<User> findByPhone(String phone);
}