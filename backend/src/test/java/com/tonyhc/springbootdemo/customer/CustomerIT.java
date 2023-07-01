package com.tonyhc.springbootdemo.customer;

import com.github.javafaker.Faker;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
class CustomerIT {
    private static final String CUSTOMER_URI = "/api/v1/customers";

    @Autowired
    private WebTestClient webTestClient;

    @Transactional
    @Test
    void itShouldRegisterNewCustomer() {
        // Create customer registration request
        Faker faker = new Faker();

        String firstName = faker.name().firstName();
        String lastName = faker.name().lastName();
        String fullName = firstName + " " + lastName;
        String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@gmail.com";
        int age = faker.number().numberBetween(18, 80);

        CustomerRegistrationRequest customerRegistrationRequest = new CustomerRegistrationRequest(
                fullName, email, age
        );

        // Send a POST request to register customer
        webTestClient.post()
                .uri(CUSTOMER_URI)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(customerRegistrationRequest), CustomerRegistrationRequest.class)
                .exchange()
                .expectStatus().isOk();

        // Send a GET request to retrieve all customers
        List<Customer> responseBody = webTestClient.get()
                .uri(CUSTOMER_URI)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(new ParameterizedTypeReference<Customer>() {
                })
                .returnResult()
                .getResponseBody();

        // Assert Customer was inserted into DB
        Customer expectedCustomer = new Customer(
                fullName, email, age
        );

        assertThat(responseBody)
                .usingRecursiveFieldByFieldElementComparatorIgnoringFields("id")
                .contains(expectedCustomer);

        Long customerId = Objects.requireNonNull(responseBody).stream()
                .filter(customer -> customer.getEmail().equals(email))
                .map(Customer::getId)
                .findFirst()
                .orElseThrow();

        expectedCustomer.setId(customerId);

        // Send GET request to verify customer was registered
        webTestClient.get()
                .uri(CUSTOMER_URI + "/{customerId}", customerId)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<Customer>() {
                })
                .isEqualTo(expectedCustomer);
    }

    @Transactional
    @Test
    void itShouldNotRegisterCustomerWhenInvalidEmailSent() {
        // Create customer registration request
        Faker faker = new Faker();

        String firstName = faker.name().firstName();
        String lastName = faker.name().lastName();
        String fullName = firstName + " " + lastName;
        String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@_gmail.com";
        int age = faker.number().numberBetween(18, 80);

        CustomerRegistrationRequest customerRegistrationRequest = new CustomerRegistrationRequest(
                fullName, email, age
        );

        // Send a POST request to register customer
        webTestClient.post()
                .uri(CUSTOMER_URI)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(customerRegistrationRequest), CustomerRegistrationRequest.class)
                .exchange()
                .expectStatus().isBadRequest();
    }

    @Transactional
    @Test
    void itShouldUpdateCustomer() {
        // Create customer registration request
        Faker faker = new Faker();

        String firstName = faker.name().firstName();
        String lastName = faker.name().lastName();
        String fullName = firstName + " " + lastName;
        String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@gmail.com";
        int age = faker.number().numberBetween(18, 80);

        CustomerRegistrationRequest customerRegistrationRequest = new CustomerRegistrationRequest(
                fullName, email, age
        );

        // Send a POST request to register customer
        webTestClient.post()
                .uri(CUSTOMER_URI)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(customerRegistrationRequest), CustomerRegistrationRequest.class)
                .exchange()
                .expectStatus().isOk();

        // Send a GET request to retrieve all customers
        List<Customer> responseBody = webTestClient.get()
                .uri(CUSTOMER_URI)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(new ParameterizedTypeReference<Customer>() {
                })
                .returnResult()
                .getResponseBody();

        // Assert Customer was inserted into DB
        Customer expectedCustomer = new Customer(
                fullName, email, age
        );

        assertThat(responseBody)
                .usingRecursiveFieldByFieldElementComparatorIgnoringFields("id")
                .contains(expectedCustomer);

        Long customerId = Objects.requireNonNull(responseBody).stream()
                .filter(customer -> customer.getEmail().equals(email))
                .map(Customer::getId)
                .findFirst()
                .orElseThrow();

        expectedCustomer.setId(customerId);

        // Create customer update request to update only the age field
        int updatedAge = faker.number().numberBetween(18, 80);

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest(
                null, null, updatedAge
        );

        // Send PUT request to update existing customer
        webTestClient.patch()
                .uri(CUSTOMER_URI + "/{customerId}", customerId)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(customerUpdateRequest), CustomerUpdateRequest.class)
                .exchange()
                .expectStatus().isOk();

        // Send GET request to verify customer was updated
        Customer expectedUpdatedCustomer = new Customer(
                customerId, fullName, email, updatedAge
        );

        Customer actual = webTestClient.get()
                .uri(CUSTOMER_URI + "/{customerId}", customerId)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<Customer>() {
                })
                .returnResult()
                .getResponseBody();

        assertThat(actual)
                .isEqualTo(expectedUpdatedCustomer);
    }

    @Transactional
    @Test
    void itShouldDeleteCustomer() {
        // Create customer registration request
        Faker faker = new Faker();

        String firstName = faker.name().firstName();
        String lastName = faker.name().lastName();
        String fullName = firstName + " " + lastName;
        String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@gmail.com";
        int age = faker.number().numberBetween(18, 80);

        CustomerRegistrationRequest customerRegistrationRequest = new CustomerRegistrationRequest(
                fullName, email, age
        );

        // Send a POST request to register customer
        webTestClient.post()
                .uri(CUSTOMER_URI)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(customerRegistrationRequest), CustomerRegistrationRequest.class)
                .exchange()
                .expectStatus().isOk();

        // Send a GET request to retrieve all customers
        List<Customer> responseBody = webTestClient.get()
                .uri(CUSTOMER_URI)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(new ParameterizedTypeReference<Customer>() {
                })
                .returnResult()
                .getResponseBody();

        Long customerId = Objects.requireNonNull(responseBody).stream()
                .filter(customer -> customer.getEmail().equals(email))
                .map(Customer::getId)
                .findFirst()
                .orElseThrow();

        // Send DELETE request to verify customer registered above was deleted
        webTestClient.delete()
                .uri(CUSTOMER_URI + "/{customerId}", customerId)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<String>() {
                })
                .isEqualTo("Customer was deleted");

        // Send GET request to verify customer registered does not exist
        webTestClient.get()
                .uri(CUSTOMER_URI + "/{customerId}", customerId)
                .accept(MediaType.APPLICATION_JSON)
                .exchange()
                .expectStatus().isNotFound();
    }
}