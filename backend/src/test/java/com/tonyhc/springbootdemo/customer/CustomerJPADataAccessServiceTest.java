package com.tonyhc.springbootdemo.customer;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.Mockito.verify;

class CustomerJPADataAccessServiceTest {
    private AutoCloseable autoCloseable;

    @Mock
    private CustomerRepository customerRepository;

    @InjectMocks
    private CustomerJPADataAccessService underTest;

    @BeforeEach
    void setUp() {
        autoCloseable = MockitoAnnotations.openMocks(this);
        underTest = new CustomerJPADataAccessService(customerRepository);
    }

    @AfterEach
    void tearDown() throws Exception {
        autoCloseable.close();
    }

    @Test
    void itShouldFindAllCustomers() {
        // Given
        // When
        underTest.findAllCustomers();

        // Then
        verify(customerRepository).findAll();
    }

    @Test
    void itShouldFindCustomerById() {
        // Given
        Long customerId = 1L;

        // When
        underTest.findCustomerById(customerId);

        // Then
        verify(customerRepository).findById(customerId);
    }

    @Test
    void itShouldExistsCustomerWithId() {
        // Given
        Long customerId = 1L;

        // When
        underTest.existsCustomerWithId(customerId);

        // Then
        verify(customerRepository).existsCustomerById(customerId);
    }

    @Test
    void itShouldExistsCustomerWithEmail() {
        // Given
        String email = "testusers@mail.com";

        // When
        underTest.existsCustomerWithEmail(email);

        // Then
        verify(customerRepository).existsCustomerByEmail(email);
    }

    @Test
    void itShouldRegisterCustomer() {
        // Given
        Customer customer = new Customer(
          "Test Users", "testusers@mail.com", 41
        );

        // When
        underTest.registerCustomer(customer);

        // Then
        verify(customerRepository).save(customer);
    }

    @Test
    void itShouldUpdateCustomerById() {
        // Given
        Customer customer = new Customer(
                "Test Users", "testusers@mail.com", 41
        );

        // When
        underTest.updateCustomer(customer);

        // Then
        verify(customerRepository).save(customer);
    }

    @Test
    void itShouldDeleteCustomerById() {
        // Given
        Long customerId = 1L;

        // When
        underTest.deleteCustomerById(customerId);

        // Then
        verify(customerRepository).deleteById(customerId);
    }
}