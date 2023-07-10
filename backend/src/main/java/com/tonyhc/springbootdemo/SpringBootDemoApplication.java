package com.tonyhc.springbootdemo;

import com.tonyhc.springbootdemo.customer.Customer;
import com.tonyhc.springbootdemo.customer.CustomerRepository;
import com.github.javafaker.Faker;
import com.tonyhc.springbootdemo.customer.Gender;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SpringBootDemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringBootDemoApplication.class, args);
    }

    @Bean
    CommandLineRunner commandLineRunner(CustomerRepository customerRepository) {
        return args -> {
            Faker faker = new Faker();

            String firstName = faker.name().firstName();
            String lastName = faker.name().lastName();
            String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@gmail.com";
            Gender gender = Math.round(Math.random()) == 0 ? Gender.MALE : Gender.FEMALE;

            Customer customer = new Customer(
                    firstName,
                    lastName,
                    email,
                    faker.number().numberBetween(18, 80),
                    gender
            );

            customerRepository.save(customer);
        };
    }
}
