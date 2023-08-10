package com.tonyhc.springbootdemo;

import com.github.javafaker.Faker;
import com.tonyhc.springbootdemo.customer.Customer;
import com.tonyhc.springbootdemo.customer.CustomerRepository;
import com.tonyhc.springbootdemo.customer.Gender;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class SpringBootDemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringBootDemoApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            createCustomer(customerRepository, passwordEncoder);
        };
    }

    private static void createCustomer(CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        Faker faker = new Faker();

        String firstName = faker.name().firstName();
        String lastName = faker.name().lastName();
        String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@gmail.com";
        Gender gender = Math.round(Math.random()) == 0 ? Gender.MALE : Gender.FEMALE;

        Customer customer = new Customer(
                firstName,
                lastName,
                email,
                passwordEncoder.encode("password"),
                faker.number().numberBetween(18, 80),
                gender
        );

        customerRepository.save(customer);
    }
}
