package com.zaalima.vaultcore.service;

import com.zaalima.vaultcore.domain.Role;
import com.zaalima.vaultcore.domain.User;

import java.util.List;

public interface UserService {
    User saveUser(User user);
    Role saveRole(Role role);
    void addRoleToUser(String username, String roleName);
    User getUser(String username);
    List<User> getUser();

    Role getRole(String roleName);
}
