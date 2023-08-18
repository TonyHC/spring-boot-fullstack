package com.tonyhc.springbootdemo.customer;

import com.tonyhc.springbootdemo.AbstractTestcontainers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class CustomerJDBCDataAccessServiceTest extends AbstractTestcontainers {
    private final CustomerRowMapper customerRowMapper = new CustomerRowMapper();
    private final PaginationUtil paginationUtil = new PaginationUtil();

    private CustomerJDBCDataAccessService underTest;

    @BeforeEach
    void setUp() {
        underTest = new CustomerJDBCDataAccessService(getJdbcTemplate(), customerRowMapper, paginationUtil);
    }

    @Test
    void itShouldFindPageOfCustomers() {
        // Given
        String query = "@";
        int page = 0;
        int size = 5;
        String sort = "customer_id,ASC";

        Customer customerOne = new Customer(
                FAKER.name().firstName(),
                FAKER.name().lastName(),
                FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID(),
                "password",
                FAKER.number().numberBetween(18, 80),
                Gender.MALE
        );

        Customer customerTwo = new Customer(
                FAKER.name().firstName(),
                FAKER.name().lastName(),
                FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID(),
                "password",
                FAKER.number().numberBetween(18, 80),
                Gender.MALE
        );

        underTest.registerCustomer(customerOne);
        underTest.registerCustomer(customerTwo);

        // When
        Page<Customer> pageOfCustomers = underTest.findPageOfCustomers(page, size, sort);
        Page<Customer> pageOfQueriedCustomers = underTest.findPageOfQueriedCustomers(query, page, size, sort);

        // Then
        assertThat(pageOfCustomers).isNotNull();
        assertThat(pageOfQueriedCustomers).isNotNull();
    }

    @Test
    void itShouldFindCustomerById() {
        // Given
        String email = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();

        Customer customer = new Customer(
                FAKER.name().firstName(),
                FAKER.name().lastName(),
                email,
                "password",
                FAKER.number().numberBetween(18, 80),
                Gender.MALE
        );

        underTest.registerCustomer(customer);

        Long customerId = underTest.findCustomerByEmail(email)
                .map(Customer::getId)
                .orElseThrow();

        // When
        Optional<Customer> actual = underTest.findCustomerById(customerId);

        // Then
        assertThat(actual).isPresent()
                .hasValueSatisfying(c -> {
                    assertThat(c.getId()).isEqualTo(customerId);
                    assertThat(c.getFirstName()).isEqualTo(customer.getFirstName());
                    assertThat(c.getLastName()).isEqualTo(customer.getLastName());
                    assertThat(c.getEmail()).isEqualTo(customer.getEmail());
                    assertThat(c.getPassword()).isEqualTo(customer.getPassword());
                    assertThat(c.getAge()).isEqualTo(customer.getAge());
                    assertThat(c.getGender()).isEqualTo(customer.getGender());
                });
    }

    @Test
    void itShouldFindCustomerByEmail() {
        // Given
        String email = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();

        Customer customer = new Customer(
                FAKER.name().firstName(),
                FAKER.name().lastName(),
                email,
                "password",
                FAKER.number().numberBetween(18, 80),
                Gender.MALE
        );

        underTest.registerCustomer(customer);

        // When
        Optional<Customer> actual = underTest.findCustomerByEmail(email);

        // Then
        assertThat(actual).isPresent()
                .hasValueSatisfying(c -> {
                    assertThat(c.getFirstName()).isEqualTo(customer.getFirstName());
                    assertThat(c.getLastName()).isEqualTo(customer.getLastName());
                    assertThat(c.getEmail()).isEqualTo(customer.getEmail());
                    assertThat(c.getPassword()).isEqualTo(customer.getPassword());
                    assertThat(c.getAge()).isEqualTo(customer.getAge());
                    assertThat(c.getGender()).isEqualTo(customer.getGender());
                });
    }

    @Test
    void itShouldNotFindCustomerByIdAndEmail() {
        // Given
        Long customerId = -1L;
        String email = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();

        // When
        Optional<Customer> customerById = underTest.findCustomerById(customerId);
        Optional<Customer> customerByEmail = underTest.findCustomerByEmail(email);

        // Then
        assertThat(customerById).isEmpty();
        assertThat(customerByEmail).isEmpty();
    }

    @Test
    void itShouldExistsCustomerWithIdAndEmail() {
        // Given
        String email = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();

        Customer customer = new Customer(
                FAKER.name().firstName(),
                FAKER.name().lastName(),
                email,
                "password",
                FAKER.number().numberBetween(18, 80),
                Gender.MALE
        );

        underTest.registerCustomer(customer);

        Long customerId = underTest.findCustomerByEmail(email)
                .map(Customer::getId)
                .orElseThrow();

        // When
        boolean resultWithId = underTest.existsCustomerWithId(customerId);
        boolean resultWithEmail = underTest.existsCustomerWithEmail(email);

        // Then
        assertThat(resultWithId).isTrue();
        assertThat(resultWithEmail).isTrue();
    }

    @Test
    void itShouldNotExistsCustomerWithIdAndEmail() {
        // Given
        Long customerId = -1L;
        String email = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();

        // When
        boolean resultWithId = underTest.existsCustomerWithId(customerId);
        boolean resultWithEmail = underTest.existsCustomerWithEmail(email);

        // Then
        assertThat(resultWithId).isFalse();
        assertThat(resultWithEmail).isFalse();
    }

    @Test
    void itShouldRegisterCustomer() {
        // Given
        String email = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();

        Customer customer = new Customer(
                FAKER.name().firstName(),
                FAKER.name().lastName(),
                email,
                "password",
                FAKER.number().numberBetween(18, 80),
                Gender.MALE
        );

        // When
        underTest.registerCustomer(customer);

        Long customerId = underTest.findCustomerByEmail(email)
                .map(Customer::getId)
                .orElseThrow();

        // Then
        Optional<Customer> optionalCustomer = underTest.findCustomerById(customerId);
        assertThat(optionalCustomer).isPresent()
                .hasValueSatisfying(c -> {
                    assertThat(c.getFirstName()).isEqualTo(customer.getFirstName());
                    assertThat(c.getLastName()).isEqualTo(customer.getLastName());
                    assertThat(c.getEmail()).isEqualTo(customer.getEmail());
                    assertThat(c.getPassword()).isEqualTo(customer.getPassword());
                    assertThat(c.getAge()).isEqualTo(customer.getAge());
                    assertThat(c.getGender()).isEqualTo(customer.getGender());
                });
    }

    @Test
    void itShouldUpdateCustomerFirstNameLastNameAndEmailProperties() {
        // Given
        String email = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();

        Customer customer = new Customer(
                FAKER.name().firstName(),
                FAKER.name().lastName(),
                email,
                "password",
                FAKER.number().numberBetween(18, 80),
                Gender.MALE
        );

        underTest.registerCustomer(customer);

        Long customerId = underTest.findCustomerByEmail(email)
                .map(Customer::getId)
                .orElseThrow();

        // When
        String updatedFirstName = FAKER.name().firstName();
        String updatedLastName = FAKER.name().lastName();
        String updatedEmail = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();

        Customer updatedCustomer = new Customer();

        updatedCustomer.setId(customerId);
        updatedCustomer.setFirstName(updatedFirstName);
        updatedCustomer.setLastName(updatedLastName);
        updatedCustomer.setEmail(updatedEmail);

        underTest.updateCustomer(updatedCustomer);

        // Then
        Optional<Customer> optionalCustomer = underTest.findCustomerById(customerId);
        assertThat(optionalCustomer).isPresent()
                .hasValueSatisfying(c -> {
                    assertThat(c.getId()).isEqualTo(customerId);
                    assertThat(c.getFirstName()).isEqualTo(updatedFirstName);
                    assertThat(c.getLastName()).isEqualTo(updatedLastName);
                    assertThat(c.getEmail()).isEqualTo(updatedEmail);
                    assertThat(c.getPassword()).isEqualTo(customer.getPassword());
                    assertThat(c.getAge()).isEqualTo(customer.getAge());
                    assertThat(c.getGender()).isEqualTo(customer.getGender());
                });
    }

    @Test
    void itShouldUpdateCustomerAgeAndGenderProperties() {
        // Given
        String email = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();

        Customer customer = new Customer(
                FAKER.name().firstName(),
                FAKER.name().lastName(),
                email,
                "password",
                FAKER.number().numberBetween(18, 80),
                Gender.MALE
        );

        underTest.registerCustomer(customer);

        Long customerId = underTest.findCustomerByEmail(email)
                .map(Customer::getId)
                .orElseThrow();

        // When
        int updatedAge = FAKER.number().numberBetween(18, 80);
        Gender updatedGender = Gender.FEMALE;

        Customer updatedCustomer = new Customer();

        updatedCustomer.setId(customerId);
        updatedCustomer.setAge(updatedAge);
        updatedCustomer.setGender(updatedGender);

        underTest.updateCustomer(updatedCustomer);

        // Then
        Optional<Customer> optionalCustomer = underTest.findCustomerById(customerId);
        assertThat(optionalCustomer).isPresent()
                .hasValueSatisfying(c -> {
                    assertThat(c.getId()).isEqualTo(customerId);
                    assertThat(c.getFirstName()).isEqualTo(customer.getFirstName());
                    assertThat(c.getLastName()).isEqualTo(customer.getLastName());
                    assertThat(c.getEmail()).isEqualTo(customer.getEmail());
                    assertThat(c.getPassword()).isEqualTo(customer.getPassword());
                    assertThat(c.getAge()).isEqualTo(updatedAge);
                    assertThat(c.getGender()).isEqualTo(updatedGender);
                });
    }

    @Test
    void itShouldUpdateAllCustomerPropertiesButPasswordProperty() {
        // Given
        String email = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();
        String password = "password";

        Customer customer = new Customer(
                FAKER.name().firstName(),
                FAKER.name().lastName(),
                email,
                password,
                FAKER.number().numberBetween(18, 80),
                Gender.MALE
        );

        underTest.registerCustomer(customer);

        Long customerId = underTest.findCustomerByEmail(email)
                .map(Customer::getId)
                .orElseThrow();

        // When
        String updatedFirstName = FAKER.name().firstName();
        String updatedLastName = FAKER.name().lastName();
        String updatedEmail = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();
        int updatedAge = FAKER.number().numberBetween(18, 80);
        Gender updatedGender = Gender.FEMALE;

        Customer updatedCustomer = new Customer();

        updatedCustomer.setId(customerId);
        updatedCustomer.setFirstName(updatedFirstName);
        updatedCustomer.setLastName(updatedLastName);
        updatedCustomer.setEmail(updatedEmail);
        updatedCustomer.setPassword(password);
        updatedCustomer.setAge(updatedAge);
        updatedCustomer.setGender(updatedGender);

        underTest.updateCustomer(updatedCustomer);

        // Then
        Optional<Customer> optionalCustomer = underTest.findCustomerById(customerId);
        assertThat(optionalCustomer).isPresent()
                .hasValue(updatedCustomer);
    }

    @Test
    void itShouldDeleteCustomer() {
        // Given
        String email = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();

        Customer customer = new Customer(
                FAKER.name().firstName(),
                FAKER.name().lastName(),
                email,
                "password",
                FAKER.number().numberBetween(18, 80),
                Gender.MALE
        );

        underTest.registerCustomer(customer);

        Long customerId = underTest.findCustomerByEmail(email)
                .map(Customer::getId)
                .orElseThrow();

        // When
        underTest.deleteCustomerById(customerId);

        // Then
        Optional<Customer> optionalCustomer = underTest.findCustomerById(customerId);
        assertThat(optionalCustomer).isNotPresent();
    }

    @Test
    void itShouldUpdateCustomerProfileImage() {
        // Given
        String email = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();
        String updatedProfileImage = "test";

        Customer customer = new Customer(
                FAKER.name().firstName(),
                FAKER.name().lastName(),
                email,
                "password",
                FAKER.number().numberBetween(18, 80),
                Gender.MALE
        );

        underTest.registerCustomer(customer);

        Long customerId = underTest.findCustomerByEmail(email)
                .map(Customer::getId)
                .orElseThrow();

        // When
        underTest.updateCustomerProfileImage(updatedProfileImage, customerId);

        // Then
        Optional<Customer> optionalCustomer = underTest.findCustomerById(customerId);
        assertThat(optionalCustomer).isPresent()
                .hasValueSatisfying(c -> {
                    assertThat(c.getId()).isEqualTo(customerId);
                    assertThat(c.getFirstName()).isEqualTo(customer.getFirstName());
                    assertThat(c.getLastName()).isEqualTo(customer.getLastName());
                    assertThat(c.getEmail()).isEqualTo(customer.getEmail());
                    assertThat(c.getPassword()).isEqualTo(customer.getPassword());
                    assertThat(c.getAge()).isEqualTo(customer.getAge());
                    assertThat(c.getGender()).isEqualTo(customer.getGender());
                    assertThat(c.getProfileImage()).isEqualTo(updatedProfileImage);
                });
    }

    @Test
    void itShouldResetCustomerPassword() {
        // Given
        String email = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();
        String updatedPassword = "tester";

        Customer customer = new Customer(
                FAKER.name().firstName(),
                FAKER.name().lastName(),
                email,
                "password",
                FAKER.number().numberBetween(18, 80),
                Gender.MALE
        );

        underTest.registerCustomer(customer);

        Long customerId = underTest.findCustomerByEmail(email)
                .map(Customer::getId)
                .orElseThrow();

        // When
        underTest.resetCustomerPassword(updatedPassword, customerId);

        // Then
        Optional<Customer> optionalCustomer = underTest.findCustomerById(customerId);
        assertThat(optionalCustomer).isPresent()
                .hasValueSatisfying(c -> {
                    assertThat(c.getId()).isEqualTo(customerId);
                    assertThat(c.getFirstName()).isEqualTo(customer.getFirstName());
                    assertThat(c.getLastName()).isEqualTo(customer.getLastName());
                    assertThat(c.getEmail()).isEqualTo(customer.getEmail());
                    assertThat(c.getPassword()).isEqualTo(updatedPassword);
                    assertThat(c.getAge()).isEqualTo(customer.getAge());
                    assertThat(c.getGender()).isEqualTo(customer.getGender());
                    assertThat(c.getProfileImage()).isEqualTo(customer.getProfileImage());
                });
    }
}