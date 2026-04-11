package com.zaalima.vaultcore;

import com.zaalima.vaultcore.domain.Role;
import com.zaalima.vaultcore.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VaultcoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(VaultcoreApplication.class, args);
	}

	CommandLineRunner run(UserService userService){
		return args -> {

			//save roles
			userService.saveRole(new Role(null, "ROLE_USER"));
			userService.saveRole(new Role(null, "ROLE_MANAGER"));
			userService.saveRole(new Role(null, "ROLE_ADMIN"));
			userService.saveRole(new Role(null, "ROLE_SUPER_ADMIN"));

		}
	}

}

