package com.zaalima.vaultcore.repo;

import com.zaalima.vaultcore.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Long> {
    User findByUsername(String username);


}
