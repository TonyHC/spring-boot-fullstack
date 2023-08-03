package com.tonyhc.springbootdemo.customer;

import com.github.javafaker.Faker;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Objects;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
class CustomerIT {
    private static final String CUSTOMER_PATH = "/api/v1/customers";

    @Autowired
    private WebTestClient webTestClient;

    @Transactional
    @Test
    void itShouldFindExistingCustomerWhenEmailExists() {
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

        // Send a POST request to register customer and retrieve the JWT
        String jwtToken = Objects.requireNonNull(webTestClient.post()
                .uri(CUSTOMER_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(customerRegistrationRequest), CustomerRegistrationRequest.class)
                .exchange()
                .expectStatus().isOk()
                .returnResult(Void.class)
                .getResponseHeaders()
                .get(AUTHORIZATION)).get(0);

        // Send a GET request to retrieve last five customers
        List<CustomerDTO> responseBody = webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path(CUSTOMER_PATH).queryParam("size", 5).build())
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(new ParameterizedTypeReference<CustomerDTO>() {
                })
                .returnResult()
                .getResponseBody();

        // Assert Customer was inserted into DB
        Long customerId = Objects.requireNonNull(responseBody).stream()
                .filter(customer -> customer.email().equals(email))
                .map(CustomerDTO::id)
                .findFirst()
                .orElseThrow();

        CustomerDTO expectedCustomer = new CustomerDTO(
                customerId, firstName, lastName, email, age, gender, List.of("ROLE_USER"), email
        );

        assertThat(responseBody).contains(expectedCustomer);

        // Send GET request to verify customer was registered
        webTestClient.get()
                .uri(CUSTOMER_PATH + "/email/{customerEmail}", email)
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<CustomerDTO>() {
                })
                .isEqualTo(expectedCustomer);
    }

    @Transactional
    @Test
    void itShouldFindPageOfCustomers() {
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

        // Send a POST request to register customer and retrieve the JWT
        String jwtToken = Objects.requireNonNull(webTestClient.post()
                .uri(CUSTOMER_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(customerRegistrationRequest), CustomerRegistrationRequest.class)
                .exchange()
                .expectStatus().isOk()
                .returnResult(Void.class)
                .getResponseHeaders()
                .get(AUTHORIZATION)).get(0);

        // Send a GET request to retrieve last five customers
        List<CustomerDTO> responseBody = webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path(CUSTOMER_PATH).queryParam("size", 5).build())
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(new ParameterizedTypeReference<CustomerDTO>() {
                })
                .returnResult()
                .getResponseBody();

        // Create CustomerPageDTO
        PaginationUtil paginationUtil = new PaginationUtil();

        int page = 0;
        int size = 5;
        String sort = "customer_id,desc";

        List<CustomerDTO> customerDTOS = Objects.requireNonNull(responseBody).subList(0, size);
        Pageable pageable = paginationUtil.createPageable(page, size, sort);
        Page<CustomerDTO> customerDTOPage = new PageImpl<>(customerDTOS, pageable, customerDTOS.size());

        CustomerPageDTO expected = new CustomerPageDTO(
                customerDTOPage.getContent(),
                customerDTOPage.getNumber(),
                customerDTOPage.getTotalElements(),
                customerDTOPage.getTotalPages(),
                customerDTOPage.getSize(),
                sort
        );

        // Send GET request to verify the page of customers
        CustomerPageDTO actual = webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path(CUSTOMER_PATH + "/page")
                        .queryParam("page", page)
                        .queryParam("size", size)
                        .queryParam("sort", sort)
                        .build())
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<CustomerPageDTO>() {
                })
                .returnResult()
                .getResponseBody();

        assertThat(actual).usingRecursiveComparison()
                .ignoringFields("totalItems", "totalPages")
                .isEqualTo(expected);
    }

    @Transactional
    @Test
    void itShouldRegisterNewCustomer() {
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

        // Send a POST request to register customer and retrieve the JWT
        String jwtToken = Objects.requireNonNull(webTestClient.post()
                .uri(CUSTOMER_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(customerRegistrationRequest), CustomerRegistrationRequest.class)
                .exchange()
                .expectStatus().isOk()
                .returnResult(Void.class)
                .getResponseHeaders()
                .get(AUTHORIZATION)).get(0);

        // Send a GET request to retrieve last five customers
        List<CustomerDTO> responseBody = webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path(CUSTOMER_PATH).queryParam("size", 5).build())
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(new ParameterizedTypeReference<CustomerDTO>() {
                })
                .returnResult()
                .getResponseBody();

        // Assert Customer was inserted into DB
        Long customerId = Objects.requireNonNull(responseBody).stream()
                .filter(customer -> customer.email().equals(email))
                .map(CustomerDTO::id)
                .findFirst()
                .orElseThrow();

        CustomerDTO expectedCustomer = new CustomerDTO(
                customerId, firstName, lastName, email, age, gender, List.of("ROLE_USER"), email
        );

        assertThat(responseBody).contains(expectedCustomer);

        // Send GET request to verify customer was registered
        webTestClient.get()
                .uri(CUSTOMER_PATH + "/{customerId}", customerId)
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<CustomerDTO>() {
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
        String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@usa_gov.com";
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
                .expectStatus().isBadRequest();
    }

    @Transactional
    @Test
    void itShouldUpdateCustomer() {
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

        // Send a POST request to register customer and retrieve the JWT
        String jwtToken = Objects.requireNonNull(webTestClient.post()
                .uri(CUSTOMER_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(customerRegistrationRequest), CustomerRegistrationRequest.class)
                .exchange()
                .expectStatus().isOk()
                .returnResult(Void.class)
                .getResponseHeaders()
                .get(AUTHORIZATION)).get(0);

        // Send a GET request to retrieve last five customers
        List<CustomerDTO> responseBody = webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path(CUSTOMER_PATH).queryParam("size", 5).build())
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(new ParameterizedTypeReference<CustomerDTO>() {
                })
                .returnResult()
                .getResponseBody();

        // Assert Customer was inserted into DB
        Long customerId = Objects.requireNonNull(responseBody).stream()
                .filter(customer -> customer.email().equals(email))
                .map(CustomerDTO::id)
                .findFirst()
                .orElseThrow();

        // Create customer update request to update only the age field
        int updatedAge = faker.number().numberBetween(18, 80);

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest(
                null, null, null, updatedAge, null
        );

        // Send PUT request to update existing customer
        webTestClient.patch()
                .uri(CUSTOMER_PATH + "/{customerId}", customerId)
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(customerUpdateRequest), CustomerUpdateRequest.class)
                .exchange()
                .expectStatus().isOk();

        // Send GET request to verify customer was updated
        CustomerDTO expectedUpdatedCustomer = new CustomerDTO(
                customerId, firstName, lastName, email, updatedAge, gender, List.of("ROLE_USER"), email
        );

        CustomerDTO actual = webTestClient.get()
                .uri(CUSTOMER_PATH + "/{customerId}", customerId)
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .exchange()
                .expectStatus().isOk()
                .expectBody(new ParameterizedTypeReference<CustomerDTO>() {
                })
                .returnResult()
                .getResponseBody();

        assertThat(actual).isEqualTo(expectedUpdatedCustomer);
    }

    @Transactional
    @Test
    void itShouldDeleteCustomer() {
        // Create customer registration request
        Faker faker = new Faker();

        String firstName = faker.name().firstName();
        String lastName = faker.name().lastName();
        String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@gmail.com";
        String password = "password";
        int age = faker.number().numberBetween(18, 80);
        Gender gender = Gender.MALE;

        CustomerRegistrationRequest customerRegistrationRequestOne = new CustomerRegistrationRequest(
                firstName, lastName, email, password, age, gender
        );

        CustomerRegistrationRequest customerRegistrationRequestTwo = new CustomerRegistrationRequest(
                firstName, lastName, email + "s", password, age, gender
        );

        // Send a POST request to register customer to be deleted later
        Objects.requireNonNull(webTestClient.post()
                .uri(CUSTOMER_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(customerRegistrationRequestOne), CustomerRegistrationRequest.class)
                .exchange()
                .expectStatus().isOk()
                .returnResult(Void.class)
                .getResponseHeaders()
                .get(AUTHORIZATION)).get(0);

        // Send a POST request to register customer and retrieve the JWT
        String jwtToken = Objects.requireNonNull(webTestClient.post()
                .uri(CUSTOMER_PATH)
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(customerRegistrationRequestTwo), CustomerRegistrationRequest.class)
                .exchange()
                .expectStatus().isOk()
                .returnResult(Void.class)
                .getResponseHeaders()
                .get(AUTHORIZATION)).get(0);

        // Send a GET request to retrieve last five customers
        List<CustomerDTO> responseBody = webTestClient.get()
                .uri(uriBuilder -> uriBuilder.path(CUSTOMER_PATH).queryParam("size", 5).build())
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(new ParameterizedTypeReference<CustomerDTO>() {
                })
                .returnResult()
                .getResponseBody();

        Long customerId = Objects.requireNonNull(responseBody).stream()
                .filter(customer -> customer.email().equals(email))
                .map(CustomerDTO::id)
                .findFirst()
                .orElseThrow();

        // Send DELETE request to verify customer registered above was deleted
        webTestClient.delete()
                .uri(CUSTOMER_PATH + "/{customerId}", customerId)
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .exchange()
                .expectStatus().isOk();

        // Send GET request to verify customer registered does not exist
        webTestClient.get()
                .uri(CUSTOMER_PATH + "/{customerId}", customerId)
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .exchange()
                .expectStatus().isNotFound();
    }
}