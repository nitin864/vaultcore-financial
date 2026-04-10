package com.zaalima.vaultcore.repo;

import com.zaalima.vaultcore.domain.Role;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepo extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
