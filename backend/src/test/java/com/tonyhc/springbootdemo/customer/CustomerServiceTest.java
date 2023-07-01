package com.tonyhc.springbootdemo.customer;

import com.tonyhc.springbootdemo.exception.DuplicateResourceException;
import com.tonyhc.springbootdemo.exception.RequestValidationException;
import com.tonyhc.springbootdemo.exception.ResourceNotFoundException;
import org.assertj.core.api.SoftAssertions;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class CustomerServiceTest {
    private AutoCloseable autoCloseable;

    @Mock
    private CustomerDao customerDao;

    @InjectMocks
    private CustomerService underTest;

    @BeforeEach
    void setUp() {
        autoCloseable = MockitoAnnotations.openMocks(this);
        underTest = new CustomerService(customerDao);
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
        verify(customerDao).findAllCustomers();
    }

    @Test
    void itShouldFindCustomerWhenIdExists() {
        // Given
        Long customerId = 1L;

        Customer customer = new Customer(
                customerId, "Test Users", "testusers@mail.com", 41
        );

        when(customerDao.findCustomerById(customerId)).thenReturn(Optional.of(customer));

        // When
        Customer actual = underTest.findCustomerById(customerId);

        // Then
        assertThat(actual).usingRecursiveComparison()
                .isEqualTo(customer);
    }

    @Test
    void itShouldThrowWhenIdDoesNotExistWhileFindingCustomer() {
        // Given
        Long customerId = 1L;

        when(customerDao.findCustomerById(customerId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> underTest.findCustomerById(customerId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(String.format("Customer with id [%s] was not found", customerId));
    }

    @Test
    void itShouldRegisterCustomer() {
        // Given
        String name = "Test Users";
        String email = "testusers@mail.com";
        int age = 41;

        CustomerRegistrationRequest customerRegistrationRequest = new CustomerRegistrationRequest(
                name, email, age
        );

        when(customerDao.existsCustomerWithEmail(email)).thenReturn(false);

        // When
        underTest.registerCustomer(customerRegistrationRequest);

        // Then
        ArgumentCaptor<Customer> customerArgumentCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(customerDao).registerCustomer(customerArgumentCaptor.capture());
        Customer customerArgumentCaptorValue = customerArgumentCaptor.getValue();

        SoftAssertions softAssertions = new SoftAssertions();

        softAssertions.assertThat(customerArgumentCaptorValue.getId()).isNull();
        softAssertions.assertThat(customerArgumentCaptorValue.getName()).isEqualTo(name);
        softAssertions.assertThat(customerArgumentCaptorValue.getEmail()).isEqualTo(email);
        softAssertions.assertThat(customerArgumentCaptorValue.getAge()).isEqualTo(age);

        softAssertions.assertAll();
    }

    @Test
    void itShouldThrowWhenEmailAlreadyTakenWhileRegisteringCustomer() {
        // Given
        String name = "Test Users";
        String email = "testusers@mail.com";
        int age = 41;

        CustomerRegistrationRequest customerRegistrationRequest = new CustomerRegistrationRequest(
                name, email, age
        );

        Customer customer = new Customer(
                name, email, age
        );

        when(customerDao.existsCustomerWithEmail(email)).thenReturn(true);

        // When
        // Then
        assertThatThrownBy(() -> underTest.registerCustomer(customerRegistrationRequest))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("Email already taken");

        verify(customerDao, never()).registerCustomer(customer);
    }

    @Test
    void itShouldUpdateAllCustomerPropertiesWhenIdExists() {
        // Given
        Long customerId = 1L;
        String newName = "Test Users";
        String newEmail = "testusers@mail.com";
        int newAge = 41;

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest(
                newName, newEmail, newAge
        );

        Customer customer = new Customer(
                customerId, "Dummy Users", "dummyusers@mail.com", 40
        );

        when(customerDao.findCustomerById(customerId)).thenReturn(Optional.of(customer));
        when(customerDao.existsCustomerWithEmail(newEmail)).thenReturn(false);

        // When
        underTest.updateCustomerById(customerUpdateRequest, customerId);

        // Then
        ArgumentCaptor<Customer> customerArgumentCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(customerDao).updateCustomer(customerArgumentCaptor.capture());
        Customer customerArgumentCaptorValue = customerArgumentCaptor.getValue();

        SoftAssertions softAssertions = new SoftAssertions();

        softAssertions.assertThat(customerArgumentCaptorValue.getId()).isEqualTo(customerId);
        softAssertions.assertThat(customerArgumentCaptorValue.getName()).isEqualTo(newName);
        softAssertions.assertThat(customerArgumentCaptorValue.getEmail()).isEqualTo(newEmail);
        softAssertions.assertThat(customerArgumentCaptorValue.getAge()).isEqualTo(newAge);

        softAssertions.assertAll();
    }

    @Test
    void itShouldUpdateCustomerNamePropertyWhenIdExists() {
        // Given
        Long customerId = 1L;
        String newName = "Test Users";

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest(
                newName, null, null
        );

        Customer customer = new Customer(
                customerId, "Dummy Users", "dummyusers@mail.com", 40
        );

        when(customerDao.findCustomerById(customerId)).thenReturn(Optional.of(customer));

        // When
        underTest.updateCustomerById(customerUpdateRequest, customerId);

        // Then
        ArgumentCaptor<Customer> customerArgumentCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(customerDao).updateCustomer(customerArgumentCaptor.capture());
        Customer customerArgumentCaptorValue = customerArgumentCaptor.getValue();

        SoftAssertions softAssertions = new SoftAssertions();

        softAssertions.assertThat(customerArgumentCaptorValue.getId()).isEqualTo(customerId);
        softAssertions.assertThat(customerArgumentCaptorValue.getName()).isEqualTo(newName);
        softAssertions.assertThat(customerArgumentCaptorValue.getEmail()).isEqualTo(customer.getEmail());
        softAssertions.assertThat(customerArgumentCaptorValue.getAge()).isEqualTo(customer.getAge());

        softAssertions.assertAll();
    }

    @Test
    void itShouldUpdateCustomerEmailPropertyWhenIdExists() {
        // Given
        Long customerId = 1L;
        String newEmail = "testusers@mail.com";

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest(
                null, newEmail, null
        );

        Customer customer = new Customer(
                customerId, "Dummy Users", "dummyusers@mail.com", 40
        );

        when(customerDao.findCustomerById(customerId)).thenReturn(Optional.of(customer));
        when(customerDao.existsCustomerWithEmail(newEmail)).thenReturn(false);

        // When
        underTest.updateCustomerById(customerUpdateRequest, customerId);

        // Then
        ArgumentCaptor<Customer> customerArgumentCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(customerDao).updateCustomer(customerArgumentCaptor.capture());
        Customer customerArgumentCaptorValue = customerArgumentCaptor.getValue();

        SoftAssertions softAssertions = new SoftAssertions();

        softAssertions.assertThat(customerArgumentCaptorValue.getId()).isEqualTo(customerId);
        softAssertions.assertThat(customerArgumentCaptorValue.getName()).isEqualTo(customer.getName());
        softAssertions.assertThat(customerArgumentCaptorValue.getEmail()).isEqualTo(newEmail);
        softAssertions.assertThat(customerArgumentCaptorValue.getAge()).isEqualTo(customer.getAge());

        softAssertions.assertAll();
    }

    @Test
    void itShouldUpdateCustomerAgePropertyWhenIdExists() {
        // Given
        Long customerId = 1L;
        int newAge = 41;

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest(
                null, null, newAge
        );

        Customer customer = new Customer(
                customerId, "Dummy Users", "dummyusers@mail.com", 40
        );

        when(customerDao.findCustomerById(customerId)).thenReturn(Optional.of(customer));

        // When
        underTest.updateCustomerById(customerUpdateRequest, customerId);

        // Then
        ArgumentCaptor<Customer> customerArgumentCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(customerDao).updateCustomer(customerArgumentCaptor.capture());
        Customer customerArgumentCaptorValue = customerArgumentCaptor.getValue();

        SoftAssertions softAssertions = new SoftAssertions();

        softAssertions.assertThat(customerArgumentCaptorValue.getId()).isEqualTo(customerId);
        softAssertions.assertThat(customerArgumentCaptorValue.getName()).isEqualTo(customer.getName());
        softAssertions.assertThat(customerArgumentCaptorValue.getEmail()).isEqualTo(customer.getEmail());
        softAssertions.assertThat(customerArgumentCaptorValue.getAge()).isEqualTo(newAge);

        softAssertions.assertAll();
    }

    @Test
    void itShouldThrowWhenEmailAlreadyTakenWhileUpdatingCustomer() {
        // Given
        Long customerId = 1L;
        String newName = "Test Users";
        String newEmail = "testusers@mail.com";
        int newAge = 41;

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest(
                newName, newEmail, newAge
        );

        Customer customer = new Customer(
                customerId, "Dummy Users", "dummyusers@mail.com", 40
        );

        when(customerDao.findCustomerById(customerId)).thenReturn(Optional.of(customer));
        when(customerDao.existsCustomerWithEmail(newEmail)).thenReturn(true);

        // When
        // Then
        assertThatThrownBy(() -> underTest.updateCustomerById(customerUpdateRequest, customerId))
                .isInstanceOf(DuplicateResourceException.class)
                .hasMessageContaining("Email already taken");

        verify(customerDao, never()).updateCustomer(any(Customer.class));
    }

    @Test
    void itShouldThrowWhenNoChangesWereMadeWhileUpdatingCustomer() {
        // Given
        Long customerId = 1L;
        String existingName = "Test Users";
        String existingEmail = "testusers@mail.com";
        int existingAge = 41;

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest(
                existingName, existingEmail, existingAge
        );

        Customer customer = new Customer(
                customerId, existingName, existingEmail, existingAge
        );

        when(customerDao.findCustomerById(customerId)).thenReturn(Optional.of(customer));
        when(customerDao.existsCustomerWithEmail(existingEmail)).thenReturn(false);

        // When
        // Then
        assertThatThrownBy(() -> underTest.updateCustomerById(customerUpdateRequest, customerId))
                .isInstanceOf(RequestValidationException.class)
                .hasMessageContaining("No changes were found");
    }

    @Test
    void itShouldDeleteCustomerById() {
        // Given
        Long customerId = 1L;

        when(customerDao.existsCustomerWithId(customerId)).thenReturn(true);

        // When
        underTest.deleteCustomerById(customerId);

        // Then
        verify(customerDao, times(1)).deleteCustomerById(customerId);
    }

    @Test
    void itShouldThrowWhenCustomerNotFoundWhileIdDoesNotExist() {
        // Given
        Long customerId = 1L;

        when(customerDao.existsCustomerWithId(customerId)).thenReturn(false);

        // When
        // Then
        assertThatThrownBy(() -> underTest.deleteCustomerById(customerId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(String.format("Customer with id %s was not found", customerId));

        verify(customerDao, never()).deleteCustomerById(customerId);
    }
}