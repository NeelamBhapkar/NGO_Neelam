package com.cdac.admin_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
//
@SpringBootApplication
@EnableDiscoveryClient
public class SpringbootAdminBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringbootAdminBackendApplication.class, args);
	}

}
