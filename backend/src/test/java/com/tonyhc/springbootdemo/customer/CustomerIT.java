package com.tonyhc.springbootdemo.customer;

import com.github.javafaker.Faker;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.BodyInserters;
import org.testcontainers.shaded.com.google.common.io.Files;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
class CustomerIT {
    private static final String CUSTOMER_PATH = "/api/v1/customers";

    @Autowired
    private WebTestClient webTestClient;

    @Test
    @Transactional
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
                customerId, firstName, lastName, email, age, gender, null, List.of("ROLE_USER"),
                email);

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

    @Test
    @Transactional
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

        // Send GET request to retrieve the page of customers
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

        // Assert page of customers contains the correct information
        assertThat(actual).usingRecursiveComparison()
                .ignoringFields("totalItems", "totalPages")
                .isEqualTo(expected);
    }

    @Test
    @Transactional
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
                customerId, firstName, lastName, email, age, gender,
                null, List.of("ROLE_USER"), email
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

    @Test
    @Transactional
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

    @Test
    @Transactional
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
                customerId, firstName, lastName, email, updatedAge, gender,
                null, List.of("ROLE_USER"), email
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

    @Test
    @Transactional
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

    @Test
    @Transactional
    void itShouldUploadAndDownloadCustomerProfileImageUsingS3() throws IOException {
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

        // Assert Customer profile image is blank
        CustomerDTO customerDTO = Objects.requireNonNull(responseBody).stream()
                .filter(customer -> customer.email().equals(email))
                .findFirst()
                .orElseThrow();

        assertThat(customerDTO.profileImage()).isNullOrEmpty();

        // Load the profile image from test resources directory
        Resource image = new ClassPathResource("%s.jpg".formatted(gender.name().toLowerCase()));

        MultipartBodyBuilder multipartBodyBuilder = new MultipartBodyBuilder();
        multipartBodyBuilder.part("file", image);

        // Send a POST request to upload the customer profile image
        webTestClient.post()
                .uri(uriBuilder -> uriBuilder.path(CUSTOMER_PATH + "/" + customerDTO.id() + "/profile-image")
                        .queryParam("provider", "s3")
                        .build())
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .body(BodyInserters.fromMultipartData(multipartBodyBuilder.build()))
                .exchange()
                .expectStatus().isOk();

        // Send a GET request to verify customer profile image was populated
        String profileImage = Objects.requireNonNull(webTestClient.get()
                .uri(CUSTOMER_PATH + "/{customerId}", customerDTO.id())
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .exchange()
                .expectStatus().isOk()
                .expectBody(CustomerDTO.class)
                .returnResult()
                .getResponseBody()).profileImage();

        assertThat(profileImage).isNotBlank();

        // Send a GET request to download customer profile image
        byte[] downloadedImage = webTestClient.get()
                .uri(CUSTOMER_PATH + "/{customerId}/profile-image", customerDTO.id())
                .accept(MediaType.IMAGE_JPEG)
                .exchange()
                .expectStatus().isOk()
                .expectBody(byte[].class)
                .returnResult()
                .getResponseBody();

        // Assert download customer profile image is the same image we uploaded earlier
        byte[] actual = Files.toByteArray(image.getFile());
        assertThat(actual).isEqualTo(downloadedImage);
    }

    @Test
    @Transactional
    void itShouldUploadAndDownloadCustomerProfileImageUsingCloudinary() throws IOException {
        // Create customer registration request
        Faker faker = new Faker();

        String firstName = faker.name().firstName();
        String lastName = faker.name().lastName();
        String email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@gmail.com";
        String password = "password";
        int age = faker.number().numberBetween(18, 80);
        Gender gender = Gender.FEMALE;

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

        // Assert Customer profile image is blank
        CustomerDTO customerDTO = Objects.requireNonNull(responseBody).stream()
                .filter(customer -> customer.email().equals(email))
                .findFirst()
                .orElseThrow();

        assertThat(customerDTO.profileImage()).isNullOrEmpty();

        // Load the profile image from test resources directory
        Resource image = new ClassPathResource("%s.jpg".formatted(gender.name().toLowerCase()));

        MultipartBodyBuilder multipartBodyBuilder = new MultipartBodyBuilder();
        multipartBodyBuilder.part("file", image);

        // Send a POST request to upload the customer profile image
        webTestClient.post()
                .uri(uriBuilder -> uriBuilder.path(CUSTOMER_PATH + "/" + customerDTO.id() + "/profile-image")
                        .queryParam("provider", "cloudinary")
                        .build())
                .accept(MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .body(BodyInserters.fromMultipartData(multipartBodyBuilder.build()))
                .exchange()
                .expectStatus().isOk();

        // Send a GET request to verify customer profile image was populated
        String profileImage = Objects.requireNonNull(webTestClient.get()
                .uri(CUSTOMER_PATH + "/{customerId}", customerDTO.id())
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .exchange()
                .expectStatus().isOk()
                .expectBody(CustomerDTO.class)
                .returnResult()
                .getResponseBody()).profileImage();

        assertThat(profileImage).matches(Pattern.compile("\\/v[0-9]{10}\\/profile-images\\/[0-9]{1,}\\/[a-z0-9\\-]*"));
    }

    @Test
    @Transactional
    void itShouldNotResetCustomerPasswordWhenNewPasswordUsedPreviously() {
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

        // Send a GET request to retrieve the registered customer
        CustomerDTO responseBody = webTestClient.get()
                .uri(CUSTOMER_PATH + "/email/{customerEmail}", email)
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .exchange()
                .expectStatus().isOk()
                .expectBody(CustomerDTO.class)
                .returnResult()
                .getResponseBody();

        Long customerId = Objects.requireNonNull(responseBody).id();

        // Create customer reset password request
        String newPassword = "password";
        String confirmPassword = "password";

        CustomerResetPasswordRequest customerResetPasswordRequest = new CustomerResetPasswordRequest(
                newPassword, confirmPassword
        );

        // Send a PATCH request to update password
        webTestClient.patch()
                .uri(CUSTOMER_PATH + "/{customerId}/reset-password", customerId)
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(customerResetPasswordRequest), CustomerResetPasswordRequest.class)
                .exchange()
                .expectStatus().isBadRequest();
    }

    @Test
    @Transactional
    void itShouldNotResetCustomerPasswordWhenCustomerResetPasswordRequestIsInvalid() {
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

        // Send a GET request to retrieve the registered customer
        CustomerDTO responseBody = webTestClient.get()
                .uri(CUSTOMER_PATH + "/email/{customerEmail}", email)
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .exchange()
                .expectStatus().isOk()
                .expectBody(CustomerDTO.class)
                .returnResult()
                .getResponseBody();

        Long customerId = Objects.requireNonNull(responseBody).id();

        // Create customer reset password request
        String newPassword = "tests";
        String confirmPassword = "test s";

        CustomerResetPasswordRequest customerResetPasswordRequest = new CustomerResetPasswordRequest(
                newPassword, confirmPassword
        );

        // Send a PATCH request to update password
        webTestClient.patch()
                .uri(CUSTOMER_PATH + "/{customerId}/reset-password", customerId)
                .accept(MediaType.APPLICATION_JSON)
                .header(AUTHORIZATION, String.format("Bearer %s", jwtToken))
                .contentType(MediaType.APPLICATION_JSON)
                .body(Mono.just(customerResetPasswordRequest), CustomerResetPasswordRequest.class)
                .exchange()
                .expectStatus().isBadRequest();
    }
}