package com.tonyhc.springbootdemo.customer;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;

class CustomerJPADataAccessServiceTest {
    private AutoCloseable autoCloseable;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private PaginationUtil paginationUtil;

    @InjectMocks
    private CustomerJPADataAccessService underTest;

    @BeforeEach
    void setUp() {
        autoCloseable = MockitoAnnotations.openMocks(this);
        underTest = new CustomerJPADataAccessService(customerRepository, paginationUtil);
    }

    @AfterEach
    void tearDown() throws Exception {
        autoCloseable.close();
    }

    @Test
    void itShouldFindPageOfCustomers() {
        // Given
        int page = 0;
        int size = 2;
        String sort = "id,ASC";

        // When
        underTest.findPageOfCustomers(page, size, sort);

        // Then
        verify(paginationUtil).createPageable(anyInt(), anyInt(), anyString());
        verify(customerRepository).findPageOfCustomers(any());
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
    void itShouldFindCustomerByEmail() {
        // Given
        String email = "testusers@mail.com";

        // When
        underTest.findCustomerByEmail(email);

        // Then
        verify(customerRepository).findCustomerByEmail(email);
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
                "Test", "Users", "testusers@mail.com", "password", 41, Gender.MALE
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
                "Test", "Users", "testusers@mail.com", "password", 41, Gender.MALE
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