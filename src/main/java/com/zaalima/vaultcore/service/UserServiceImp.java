package com.zaalima.vaultcore.service;

import com.zaalima.vaultcore.domain.Role;
import com.zaalima.vaultcore.domain.User;
import com.zaalima.vaultcore.repo.RoleRepo;
import com.zaalima.vaultcore.repo.UserRepo;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service @RequiredArgsConstructor

public class UserServiceImp implements UserService {
    private final UserRepo userRepo;
    private final RoleRepo roleRepo;
    @Override
    public User saveUser(User user) {
        return null;
    }

    @Override
    public Role saveRole(Role role) {
        return null;
    }

    @Override
    public void addRoleToUser(String username, String roleName) {

    }

    @Override
    public User getUser(String username) {
        return null;
    }

    @Override
    public List<User> getUser() {
        return List.of();
    }
}
