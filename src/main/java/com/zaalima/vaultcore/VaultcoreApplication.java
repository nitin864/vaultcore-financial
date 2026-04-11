package com.zaalima.vaultcore;

import com.zaalima.vaultcore.domain.Role;
import com.zaalima.vaultcore.domain.User;
import com.zaalima.vaultcore.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;

@SpringBootApplication
public class VaultcoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(VaultcoreApplication.class, args);
	}

    @Bean
	PasswordEncoder passwordEncoder(){
		return new BCryptPasswordEncoder();
	}


	CommandLineRunner run(UserService userService){
		return args -> {

			//save roles

			userService.saveRole(new Role(null, "ROLE_USER"));
			userService.saveRole(new Role(null, "ROLE_MANAGER"));
			userService.saveRole(new Role(null, "ROLE_ADMIN"));
			userService.saveRole(new Role(null, "ROLE_SUPER_ADMIN"));

			// Create users
			userService.saveUser(new User(null, "Nitin", "nitin", "1234", new ArrayList<>()));
			userService.saveUser(new User(null, "Admin", "admin", "admin", new ArrayList<>()));
			userService.saveUser(new User(null, "Root", "root", "root", new ArrayList<>()));
			userService.saveUser(new User(null, "Manager", "manager", "manager", new ArrayList<>()));

			//Assigning Roles
			userService.addRoleToUser("nitin", "ROLE_USER");
			userService.addRoleToUser("admin", "ROLE_ADMIN");
			userService.addRoleToUser("root", "ROLE_SUPER_ADMIN");
			userService.addRoleToUser("manager", "ROLE_MANAGER");

		};
	}

}

