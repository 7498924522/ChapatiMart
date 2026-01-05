package RRR.AI.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import RRR.AI.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByUsername(String username);
}