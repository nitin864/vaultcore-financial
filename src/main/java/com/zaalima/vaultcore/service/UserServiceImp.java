package com.zaalima.vaultcore.service;

import com.zaalima.vaultcore.domain.Role;
import com.zaalima.vaultcore.domain.User;
import com.zaalima.vaultcore.repo.RoleRepo;
import com.zaalima.vaultcore.repo.UserRepo;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service @RequiredArgsConstructor @Transactional @Slf4j

public class UserServiceImp implements UserService {
    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    @Override
    public User saveUser(User user) {
        log.info("Saving new user {} to DB", user.getName());
        return userRepo.save(user);
    }

    @Override
    public Role saveRole(Role role) {
        log.info("Saving new role {} to DB", role.getName());
        return roleRepo.save(role);
    }

    @Override
    public void addRoleToUser(String username, String roleName) {
        log.info("Adding role {} to user {}", roleName, username);
        User user = userRepo.findbyUsername(username);
        Role role = roleRepo.findbyName(roleName);
        user.getRoles().add(role);
    }

    @Override
    public User getUser(String username) {
        log.info("Fetching users {}",username);
        return userRepo.findbyUsername((username));
    }

    @Override
    public List<User> getUser() {
        log.info("Fetching all users");
        return userRepo.findAll();
    }
}
