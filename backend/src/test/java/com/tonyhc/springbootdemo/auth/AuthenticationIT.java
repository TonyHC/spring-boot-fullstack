package com.tonyhc.springbootdemo.auth;

import com.github.javafaker.Faker;
import com.tonyhc.springbootdemo.customer.CustomerDTO;
import com.tonyhc.springbootdemo.customer.CustomerRegistrationRequest;
import com.tonyhc.springbootdemo.customer.Gender;
import com.tonyhc.springbootdemo.jwt.JWTUtil;
import org.assertj.core.api.SoftAssertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Objects;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
class AuthenticationIT {
    private static final String AUTH_PATH = "/api/v1/auth";
    private static final String CUSTOMER_PATH = "/api/v1/customers";

    @Autowired
    private WebTestClient webTestClient;

    @Autowired
    private JWTUtil jwtUtil;

    @Test
    void itShouldLoginUser() {
        // Create customer registration request
        Faker faker = new Faker();

        String firstName = faker.name().firstName();
        String lastName = faker.name().lastName();
        String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@gmail.com";
        String password = "password";
        int age = faker.number().numberBetween(18, 80);
        Gender gender = Gender.MALE;

        CustomerRegistrationRequest customerRegistrationRequest = new CustomerRegistrationRequest(
                firstName, lastName, email, password, age, gender
        );

        // Send a POST request to register customer
        webTestClient.post()
                .uri(CUSTOMER_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(customerRegistrationRequest), CustomerRegistrationRequest.class)
                .exchange()
                .expectStatus().isOk();

        // Create authentication request
        AuthenticationRequest authenticationRequest = new AuthenticationRequest(
                email, password
        );

        // Send a POST request to login for the above customer
        EntityExchangeResult<AuthenticationResponse> result = webTestClient.post()
                .uri(AUTH_PATH + "/login")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(authenticationRequest), AuthenticationRequest.class)
                .exchange()
                .expectStatus()
                .isOk()
                .expectBody(new ParameterizedTypeReference<AuthenticationResponse>() {
                })
                .returnResult();

        // Assert the jwt is valid and customerDTO contains the correct customer information
        AuthenticationResponse responseBody = result.getResponseBody();
        String responseToken = Objects.requireNonNull(responseBody).token();
        String token = Objects.requireNonNull(result.getResponseHeaders().get(AUTHORIZATION)).get(0);

        SoftAssertions softAssertions = new SoftAssertions();

        softAssertions.assertThat(responseToken).isEqualTo(token);
        softAssertions.assertThat(jwtUtil.isTokenValid(token, email)).isTrue();

        softAssertions.assertAll();
    }

    @Test
    void itShouldNotLoginUser() {
        // Create authentication request
        Faker faker = new Faker();

        String firstName = faker.name().firstName();
        String lastName = faker.name().lastName();
        String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@gmail.com";
        String password = "password";

        AuthenticationRequest authenticationRequest = new AuthenticationRequest(
                email, password
        );

        // Send a POST request to login
        webTestClient.post()
                .uri(AUTH_PATH + "/login")
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(authenticationRequest), AuthenticationRequest.class)
                .exchange()
                .expectStatus()
                .isUnauthorized();
    }
}