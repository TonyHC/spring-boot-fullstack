package com.tonyhc.springbootdemo;

import com.tonyhc.springbootdemo.customer.Customer;
import com.tonyhc.springbootdemo.customer.CustomerRepository;
import com.github.javafaker.Faker;
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
            String fullName = firstName + " " + lastName;
            String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@gmail.com";

            Customer customer = new Customer(
                    fullName,
                    email,
                    faker.number().numberBetween(18, 80)
            );

            // TODO: #208 onwards note take the process of deploying Docker Image to AWS Elastic Beanstalk and other AWS services
            customerRepository.save(customer);
        };
    }
}
