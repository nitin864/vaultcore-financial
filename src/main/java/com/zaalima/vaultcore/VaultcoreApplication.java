package com.zaalima.vaultcore;

import com.zaalima.vaultcore.domain.Role;
import com.zaalima.vaultcore.domain.User;
import com.zaalima.vaultcore.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;

@SpringBootApplication
public class VaultcoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(VaultcoreApplication.class, args);
	}

	@Bean
	CommandLineRunner run(UserService userService) {
		return args -> {

			// Save roles only if they don't already exist
			if (userService.getRole("ROLE_USER") == null)       userService.saveRole(new Role(null, "ROLE_USER"));
			if (userService.getRole("ROLE_MANAGER") == null)    userService.saveRole(new Role(null, "ROLE_MANAGER"));
			if (userService.getRole("ROLE_ADMIN") == null)      userService.saveRole(new Role(null, "ROLE_ADMIN"));
			if (userService.getRole("ROLE_SUPER_ADMIN") == null) userService.saveRole(new Role(null, "ROLE_SUPER_ADMIN"));

			// Save users only if they don't already exist
			if (userService.getUser("nitin") == null)
				userService.saveUser(new User(null, "Nitin", "nitin", "1234", new ArrayList<>()));
			if (userService.getUser("admin") == null)
				userService.saveUser(new User(null, "Admin", "admin", "admin", new ArrayList<>()));
			if (userService.getUser("root") == null)
				userService.saveUser(new User(null, "Root", "root", "root", new ArrayList<>()));
			if (userService.getUser("manager") == null)
				userService.saveUser(new User(null, "Manager", "manager", "manager", new ArrayList<>()));

			// Assign roles only if the user has no roles yet
			User nitin = userService.getUser("nitin");
			if (nitin != null && nitin.getRoles().isEmpty())
				userService.addRoleToUser("nitin", "ROLE_USER");

			User admin = userService.getUser("admin");
			if (admin != null && admin.getRoles().isEmpty())
				userService.addRoleToUser("admin", "ROLE_ADMIN");

			User root = userService.getUser("root");
			if (root != null && root.getRoles().isEmpty())
				userService.addRoleToUser("root", "ROLE_SUPER_ADMIN");

			User manager = userService.getUser("manager");
			if (manager != null && manager.getRoles().isEmpty())
				userService.addRoleToUser("manager", "ROLE_MANAGER");
		};
	}
}