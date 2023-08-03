package com.tonyhc.springbootdemo.customer;

import com.tonyhc.springbootdemo.AbstractTestcontainers;
import com.tonyhc.springbootdemo.TestConfig;
import org.assertj.core.api.SoftAssertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestConfig.class)
class CustomerRepositoryTest extends AbstractTestcontainers {
    @Autowired
    private CustomerRepository underTest;

    @BeforeEach
    void setUp() {
        underTest.deleteAll();
    }

    @Test
    void itShouldFindPageOfCustomers() {
        // Given
        int page = 0;
        int size = 2;
        String sort = "id,ASC";

        PaginationUtil paginationUtil = new PaginationUtil();
        Pageable pageable = paginationUtil.createPageable(page, size, sort);

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

        Customer customerThree = new Customer(
                FAKER.name().firstName(),
                FAKER.name().lastName(),
                FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID(),
                "password",
                FAKER.number().numberBetween(18, 80),
                Gender.MALE
        );

        underTest.saveAll(List.of(customerOne, customerTwo, customerThree));

        // When
        Page<Customer> pageOfCustomers = underTest.findPageOfCustomers(pageable);

        // Then
        SoftAssertions softAssertions = new SoftAssertions();

        softAssertions.assertThat(pageOfCustomers.getTotalElements()).isEqualTo(3);
        softAssertions.assertThat(pageOfCustomers.getTotalPages()).isEqualTo(2);
        softAssertions.assertThat(pageOfCustomers.getContent().size()).isEqualTo(2);
        softAssertions.assertThat(pageOfCustomers.getNumberOfElements()).isEqualTo(2);

        softAssertions.assertAll();
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

        underTest.save(customer);

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
    void itShouldNotFindCustomerWhenEmailDoesNotExist() {
        // Given
        String email = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();

        // When
        Optional<Customer> actual = underTest.findCustomerByEmail(email);

        // Then
        assertThat(actual).isNotPresent();
    }

    @Test
    void itShouldExistsCustomerWhenIdExists() {
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

        underTest.save(customer);

        Long customerId = underTest.findCustomerByEmail(email)
                .map(Customer::getId)
                .orElseThrow();

        // When
        boolean actual = underTest.existsCustomerById(customerId);

        // Then
        assertThat(actual).isTrue();
    }

    @Test
    void itShouldNotExistsCustomerWhenIdDoesNotExist() {
        // Given
        Long customerId = -1L;

        // When
        boolean actual = underTest.existsCustomerById(customerId);

        // Then
        assertThat(actual).isFalse();
    }

    @Test
    void itShouldExistsCustomerWhenEmailExists() {
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

        underTest.save(customer);

        // When
        boolean actual = underTest.existsCustomerByEmail(email);

        // Then
        assertThat(actual).isTrue();
    }

    @Test
    void itShouldNotExistsCustomerWhenEmailDoesNotExist() {
        // Given
        String email = FAKER.internet().safeEmailAddress() + "-" + UUID.randomUUID();

        // When
        boolean actual = underTest.existsCustomerByEmail(email);

        // Then
        assertThat(actual).isFalse();
    }
}