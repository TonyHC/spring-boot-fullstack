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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class CustomerServiceTest {
    @Mock
    private CustomerDao customerDao;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private CustomerDTOMapper customerDTOMapper;

    @InjectMocks
    private CustomerService underTest;

    private AutoCloseable autoCloseable;

    private final PaginationUtil paginationUtil = new PaginationUtil();

    @BeforeEach
    void setUp() {
        autoCloseable = MockitoAnnotations.openMocks(this);
        underTest = new CustomerService(customerDao, passwordEncoder, customerDTOMapper);
    }

    @AfterEach
    void tearDown() throws Exception {
        autoCloseable.close();
    }

    @Test
    void itShouldFindLastCustomers() {
        // Given
        Long customerId = 1L;
        String firstName = "Test";
        String lastName = "Users";
        String email = "testusers@mail.com";
        String password = "password";
        int age = 41;
        Gender gender = Gender.MALE;

        Customer customer = new Customer(
                customerId, firstName, lastName, email, password, age, gender
        );

        CustomerDTO customerDTO = new CustomerDTO(
                customerId, firstName, lastName, email, age, gender, List.of("ROLE_USER"), email
        );

        List<Customer> customers = List.of(customer);

        int page = 0;
        int size = 5;
        String sort = "customer_id,desc";

        Pageable pageable = paginationUtil.createPageable(page, size, sort);
        Page<Customer> customerPage = new PageImpl<>(customers, pageable, customers.size());

        when(customerDao.findPageOfCustomers(page, size, sort)).thenReturn(customerPage);
        when(customerDTOMapper.apply(customer)).thenReturn(customerDTO);

        // When
        List<CustomerDTO> actual = underTest.findLastCustomers(size);

        // Then
        assertThat(actual).hasSize(customerPage.getContent().size());
    }

    @Test
    void itShouldFindPageOfCustomers() {
        // Given
        Long customerId = 1L;
        String firstName = "Test";
        String lastName = "Users";
        String email = "testusers@mail.com";
        String password = "password";
        int age = 41;
        Gender gender = Gender.MALE;

        Customer customer = new Customer(
                customerId, firstName, lastName, email, password, age, gender
        );

        CustomerDTO expected = new CustomerDTO(
                customerId, firstName, lastName, email, age, gender, List.of("ROLE_USER"), email
        );

        List<Customer> customers = List.of(customer);

        int page = 0;
        int size = 2;
        String sort = "customer_id,asc";

        Pageable pageable = paginationUtil.createPageable(page, size, sort);
        Page<Customer> customerPage = new PageImpl<>(customers, pageable, customers.size());

        when(customerDao.findPageOfCustomers(page, size, sort)).thenReturn(customerPage);
        when(customerDTOMapper.apply(customer)).thenReturn(expected);

        // When
        CustomerPageDTO pageOfCustomers = underTest.findPageOfCustomers(page, size, sort);

        // Then
        SoftAssertions softAssertions = new SoftAssertions();

        softAssertions.assertThat(pageOfCustomers.customers()).contains(expected);
        softAssertions.assertThat(pageOfCustomers.currentPage()).isEqualTo(0);
        softAssertions.assertThat(pageOfCustomers.pageSize()).isEqualTo(2);
        softAssertions.assertThat(pageOfCustomers.totalPages()).isEqualTo(1);
        softAssertions.assertThat(pageOfCustomers.totalItems()).isEqualTo(1);

        softAssertions.assertAll();
    }

    @Test
    void itShouldFindCustomerWhenIdExists() {
        // Given
        Long customerId = 1L;
        String firstName = "Test";
        String lastName = "Users";
        String email = "testusers@mail.com";
        String password = "password";
        int age = 41;
        Gender gender = Gender.MALE;

        Customer customer = new Customer(
                customerId, firstName, lastName, email, password, age, gender
        );

        CustomerDTO expected = new CustomerDTO(
                customerId, firstName, lastName, email, age, gender, List.of("ROLE_USER"), email
        );

        when(customerDao.findCustomerById(customerId)).thenReturn(Optional.of(customer));
        when(customerDTOMapper.apply(customer)).thenReturn(expected);

        // When
        CustomerDTO actual = underTest.findCustomerById(customerId);

        // Then
        assertThat(actual).usingRecursiveComparison()
                .isEqualTo(expected);
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
    void itShouldFindCustomerWhenEmailExists() {
        // Given
        Long customerId = 1L;
        String firstName = "Test";
        String lastName = "Users";
        String email = "testusers@mail.com";
        String password = "password";
        int age = 41;
        Gender gender = Gender.MALE;

        Customer customer = new Customer(
                customerId, firstName, lastName, email, password, age, gender
        );

        CustomerDTO expected = new CustomerDTO(
                customerId, firstName, lastName, email, age, gender, List.of("ROLE_USER"), email
        );

        when(customerDao.findCustomerByEmail(email)).thenReturn(Optional.of(customer));
        when(customerDTOMapper.apply(customer)).thenReturn(expected);

        // When
        CustomerDTO actual = underTest.findCustomerByEmail(email);

        // Then
        assertThat(actual).usingRecursiveComparison()
                .isEqualTo(expected);
    }

    @Test
    void itShouldThrowWhenEmailDoesNotExistWhileFindingCustomer() {
        // Given
        String email = "testusers@mail.com";

        when(customerDao.findCustomerByEmail(email)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> underTest.findCustomerByEmail(email))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(String.format("Customer with email [%s] was not found", email));
    }

    @Test
    void itShouldRegisterCustomer() {
        // Given
        String firstName = "Test";
        String lastName = "Users";
        String email = "testusers@mail.com";
        String password = "password";
        String passwordHash = "2adif3nvksd";
        int age = 41;
        Gender gender = Gender.MALE;

        CustomerRegistrationRequest customerRegistrationRequest = new CustomerRegistrationRequest(
                firstName, lastName, email, password, age, gender
        );

        when(customerDao.existsCustomerWithEmail(email)).thenReturn(false);
        when(passwordEncoder.encode(password)).thenReturn(passwordHash);

        // When
        underTest.registerCustomer(customerRegistrationRequest);

        // Then
        ArgumentCaptor<Customer> customerArgumentCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(customerDao).registerCustomer(customerArgumentCaptor.capture());
        Customer customerArgumentCaptorValue = customerArgumentCaptor.getValue();

        SoftAssertions softAssertions = new SoftAssertions();

        softAssertions.assertThat(customerArgumentCaptorValue.getId()).isNull();
        softAssertions.assertThat(customerArgumentCaptorValue.getFirstName()).isEqualTo(firstName);
        softAssertions.assertThat(customerArgumentCaptorValue.getLastName()).isEqualTo(lastName);
        softAssertions.assertThat(customerArgumentCaptorValue.getEmail()).isEqualTo(email);
        softAssertions.assertThat(customerArgumentCaptorValue.getPassword()).isEqualTo(passwordHash);
        softAssertions.assertThat(customerArgumentCaptorValue.getAge()).isEqualTo(age);
        softAssertions.assertThat(customerArgumentCaptorValue.getGender()).isEqualTo(gender);

        softAssertions.assertAll();
    }

    @Test
    void itShouldThrowWhenEmailAlreadyTakenWhileRegisteringCustomer() {
        // Given
        String firstName = "Test";
        String lastName = "Users";
        String email = "testusers@mail.com";
        String password = "password";
        int age = 41;
        Gender gender = Gender.MALE;

        CustomerRegistrationRequest customerRegistrationRequest = new CustomerRegistrationRequest(
                firstName, lastName, email, password, age, gender
        );

        Customer customer = new Customer(
                firstName, lastName, email, password, age, gender
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
    void itShouldNotUpdateCustomerWhenCustomerDoesNotExist() {
        // Given
        Long customerId = -1L;
        String newFirstName = "Test";
        String newLastName = "Tester";
        String newEmail = "testusers@mail.com";
        int newAge = 41;
        Gender newGender = Gender.FEMALE;

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest(
                newFirstName, newLastName, newEmail, newAge, newGender
        );

        when(customerDao.findCustomerById(customerId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> underTest.updateCustomerById(customerUpdateRequest, customerId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining((String.format("Customer with id [%s] was not found", customerId)));
    }

    @Test
    void itShouldUpdateAllCustomerPropertiesButPasswordPropertyWhenIdExists() {
        // Given
        Long customerId = 1L;
        String newFirstName = "Test";
        String newLastName = "Tester";
        String newEmail = "testusers@mail.com";
        int newAge = 41;
        Gender newGender = Gender.FEMALE;

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest(
                newFirstName, newLastName, newEmail, newAge, newGender
        );

        Customer customer = new Customer(
                customerId, "Dummy", "Users", "dummyusers@mail.com",
                "password", 40, Gender.MALE
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
        softAssertions.assertThat(customerArgumentCaptorValue.getFirstName()).isEqualTo(newFirstName);
        softAssertions.assertThat(customerArgumentCaptorValue.getLastName()).isEqualTo(newLastName);
        softAssertions.assertThat(customerArgumentCaptorValue.getEmail()).isEqualTo(newEmail);
        softAssertions.assertThat(customerArgumentCaptorValue.getPassword()).isEqualTo(customer.getPassword());
        softAssertions.assertThat(customerArgumentCaptorValue.getAge()).isEqualTo(newAge);
        softAssertions.assertThat(customerArgumentCaptorValue.getGender()).isEqualTo(newGender);

        softAssertions.assertAll();
    }

    @Test
    void itShouldUpdateCustomerFirstAndLastNamePropertiesWhenIdExists() {
        // Given
        Long customerId = 1L;
        String newFirstName = "Test";
        String newLastName = "Tester";

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest(
                newFirstName, newLastName, null, null, null
        );

        Customer customer = new Customer(
                customerId, "Dummy", "Users", "dummyusers@mail.com",
                "password", 40, Gender.MALE
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
        softAssertions.assertThat(customerArgumentCaptorValue.getFirstName()).isEqualTo(newFirstName);
        softAssertions.assertThat(customerArgumentCaptorValue.getLastName()).isEqualTo(newLastName);
        softAssertions.assertThat(customerArgumentCaptorValue.getEmail()).isEqualTo(customer.getEmail());
        softAssertions.assertThat(customerArgumentCaptorValue.getPassword()).isEqualTo(customer.getPassword());
        softAssertions.assertThat(customerArgumentCaptorValue.getAge()).isEqualTo(customer.getAge());
        softAssertions.assertThat(customerArgumentCaptorValue.getGender()).isEqualTo(customer.getGender());

        softAssertions.assertAll();
    }

    @Test
    void itShouldUpdateCustomerEmailPropertyWhenIdExists() {
        // Given
        Long customerId = 1L;
        String newEmail = "testusers@mail.com";

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest(
                null, null, newEmail, null, null
        );

        Customer customer = new Customer(
                customerId, "Dummy", "Users", "dummyusers@mail.com",
                "password", 40, Gender.MALE
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
        softAssertions.assertThat(customerArgumentCaptorValue.getFirstName()).isEqualTo(customer.getFirstName());
        softAssertions.assertThat(customerArgumentCaptorValue.getLastName()).isEqualTo(customer.getLastName());
        softAssertions.assertThat(customerArgumentCaptorValue.getEmail()).isEqualTo(newEmail);
        softAssertions.assertThat(customerArgumentCaptorValue.getPassword()).isEqualTo(customer.getPassword());
        softAssertions.assertThat(customerArgumentCaptorValue.getAge()).isEqualTo(customer.getAge());
        softAssertions.assertThat(customerArgumentCaptorValue.getGender()).isEqualTo(customer.getGender());

        softAssertions.assertAll();
    }

    @Test
    void itShouldUpdateCustomerAgeAndGenderPropertiesWhenIdExists() {
        // Given
        Long customerId = 1L;
        int newAge = 41;
        Gender newGender = Gender.FEMALE;

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest(
                null, null, null, newAge, newGender
        );

        Customer customer = new Customer(
                customerId, "Dummy", "Users", "dummyusers@mail.com",
                "password", 40, Gender.MALE
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
        softAssertions.assertThat(customerArgumentCaptorValue.getFirstName()).isEqualTo(customer.getFirstName());
        softAssertions.assertThat(customerArgumentCaptorValue.getLastName()).isEqualTo(customer.getLastName());
        softAssertions.assertThat(customerArgumentCaptorValue.getEmail()).isEqualTo(customer.getEmail());
        softAssertions.assertThat(customerArgumentCaptorValue.getPassword()).isEqualTo(customer.getPassword());
        softAssertions.assertThat(customerArgumentCaptorValue.getAge()).isEqualTo(newAge);
        softAssertions.assertThat(customerArgumentCaptorValue.getGender()).isEqualTo(newGender);

        softAssertions.assertAll();
    }


    @Test
    void itShouldThrowWhenEmailAlreadyTakenWhileUpdatingCustomer() {
        // Given
        Long customerId = 1L;
        String newFirstName = "Test";
        String newLastName = "Tester";
        String newEmail = "testusers@mail.com";
        int newAge = 41;
        Gender newGender = Gender.FEMALE;

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest(
                newFirstName, newLastName, newEmail, newAge, newGender
        );

        Customer customer = new Customer(
                customerId, "Dummy", "Users", "dummyusers@mail.com",
                "password", 40, Gender.MALE
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
        String existingFirstName = "Test";
        String existingLastName = "Tester";
        String existingEmail = "testusers@mail.com";
        String existingPassword = "password";
        int existingAge = 41;
        Gender existingGender = Gender.FEMALE;

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest(
                existingFirstName, existingLastName, existingEmail, existingAge, existingGender
        );

        Customer customer = new Customer(
                customerId, existingFirstName, existingLastName, existingEmail, existingPassword, existingAge, existingGender
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
                .hasMessageContaining(String.format("Customer with id [%s] was not found", customerId));

        verify(customerDao, never()).deleteCustomerById(customerId);
    }
}