package com.tonyhc.springbootdemo.customer;

import com.tonyhc.springbootdemo.cloudinary.ImageUpload;
import com.tonyhc.springbootdemo.exception.DuplicateResourceException;
import com.tonyhc.springbootdemo.exception.RequestValidationException;
import com.tonyhc.springbootdemo.exception.ResourceNotFoundException;
import com.tonyhc.springbootdemo.s3.S3Buckets;
import com.tonyhc.springbootdemo.s3.S3Service;
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
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @Mock
    private S3Service s3Service;

    @Mock
    private S3Buckets s3Buckets;

    @Mock
    private ImageUpload imageUpload;

    @InjectMocks
    private CustomerService underTest;

    private AutoCloseable autoCloseable;

    private final PaginationUtil paginationUtil = new PaginationUtil();

    @BeforeEach
    void setUp() {
        autoCloseable = MockitoAnnotations.openMocks(this);
        underTest = new CustomerService(customerDao, passwordEncoder, customerDTOMapper, s3Service, s3Buckets, imageUpload);
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
        String profileImage = "test";

        Customer customer = new Customer(
                customerId, firstName, lastName, email, password, age, gender, profileImage
        );

        CustomerDTO customerDTO = new CustomerDTO(
                customerId, firstName, lastName, email, age, gender, profileImage, List.of("ROLE_USER"),
                email);

        List<Customer> customers = List.of(customer);

        int page = 0;
        int size = 5;
        String sort = "customer_id,desc";

        Pageable pageable = paginationUtil.createPageable(page, size, sort);
        Page<Customer> customerPage = new PageImpl<>(customers, pageable, customers.size());

        when(customerDao.findPageOfCustomers(page, size, sort)).thenReturn(customerPage);
        when(customerDTOMapper.apply(customer)).thenReturn(customerDTO);

        // When
        List<CustomerDTO> actual = underTest.findLatestCustomers(size);

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
        String profileImage = "test";

        Customer customer = new Customer(
                customerId, firstName, lastName, email, password, age, gender, profileImage
        );

        CustomerDTO expected = new CustomerDTO(
                customerId, firstName, lastName, email, age, gender, profileImage, List.of("ROLE_USER"),
                email);

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
        String profileImage = "test";

        Customer customer = new Customer(
                customerId, firstName, lastName, email, password, age, gender, profileImage
        );

        CustomerDTO expected = new CustomerDTO(
                customerId, firstName, lastName, email, age, gender, profileImage, List.of("ROLE_USER"),
                email);

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
        String profileImage = "test";

        Customer customer = new Customer(
                customerId, firstName, lastName, email, password, age, gender, profileImage
        );

        CustomerDTO expected = new CustomerDTO(
                customerId, firstName, lastName, email, age, gender, profileImage, List.of("ROLE_USER"),
                email);

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
                "password", 40, Gender.MALE, "dummy"
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
        softAssertions.assertThat(customerArgumentCaptorValue.getProfileImage()).isEqualTo(customer.getProfileImage());

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
                "password", 40, Gender.MALE, "dummy"
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
        softAssertions.assertThat(customerArgumentCaptorValue.getProfileImage()).isEqualTo(customer.getProfileImage());

        softAssertions.assertAll();
    }

    @Test
    void itShouldUpdateCustomerEmailAndProfileImagePropertyWhenIdExists() {
        // Given
        Long customerId = 1L;
        String newEmail = "testusers@mail.com";

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest(
                null, null, newEmail, null, null
        );

        Customer customer = new Customer(
                customerId, "Dummy", "Users", "dummyusers@mail.com",
                "password", 40, Gender.MALE, "dummy"
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
        softAssertions.assertThat(customerArgumentCaptorValue.getProfileImage()).isEqualTo(customer.getProfileImage());

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
                "password", 40, Gender.MALE, "dummy"
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
        softAssertions.assertThat(customerArgumentCaptorValue.getProfileImage()).isEqualTo(customer.getProfileImage());

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
                "password", 40, Gender.MALE, "dummy"
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
        String existingProfileImage = "test";

        CustomerUpdateRequest customerUpdateRequest = new CustomerUpdateRequest(
                existingFirstName, existingLastName, existingEmail, existingAge, existingGender
        );

        Customer customer = new Customer(
                customerId, existingFirstName, existingLastName, existingEmail, existingPassword, existingAge, existingGender, existingProfileImage
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

    @Test
    void itShouldUploadCustomerProfileImageUsingS3() {
        // Given
        Long customerId = 1L;
        String bucketName = "customer-bucket";
        byte[] file = "test".getBytes();
        MultipartFile multipartFile = new MockMultipartFile("file", file);
        String provider = "s3";

        when(customerDao.existsCustomerWithId(customerId)).thenReturn(true);
        when(s3Buckets.getCustomer()).thenReturn(bucketName);

        // When
        underTest.uploadCustomerProfileImage(customerId, multipartFile, provider);

        // Then
        ArgumentCaptor<String> profileImageCaptor = ArgumentCaptor.forClass(String.class);
        verify(customerDao).updateCustomerProfileImage(profileImageCaptor.capture(), eq(customerId));

        verify(s3Service).uploadObject(
                bucketName,
                "profile-images/%s/%s".formatted(customerId, profileImageCaptor.getValue()),
                file
        );
    }

    @Test
    void itShouldThrowWhenCustomerDoesNotExistWhileUploadingCustomerProfileImage() {
        // Given
        Long customerId = 1L;
        byte[] file = "test".getBytes();
        MultipartFile multipartFile = new MockMultipartFile("file", file);
        String provider = "s3";

        when(customerDao.existsCustomerWithId(customerId)).thenReturn(false);

        // When
        // Then
        assertThatThrownBy(() -> underTest.uploadCustomerProfileImage(customerId, multipartFile, provider))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(String.format("Customer with id [%s] was not found", customerId));

        verify(customerDao).existsCustomerWithId(customerId);
        verifyNoMoreInteractions(customerDao);
        verifyNoInteractions(s3Buckets);
        verifyNoInteractions(s3Service);
    }

    @Test
    void itShouldThrowWhenUploadFailsWhileImageIsAZeroByteFile() throws IOException {
        // Given
        Long customerId = 1L;
        String bucketName = "customer-bucket";
        String provider = "s3";

        MultipartFile multipartFile = mock(MultipartFile.class);
        when(multipartFile.getBytes()).thenThrow(new IOException("Failed to upload profile image"));

        when(customerDao.existsCustomerWithId(customerId)).thenReturn(true);
        when(s3Buckets.getCustomer()).thenReturn(bucketName);

        // When
        // Then
        assertThatThrownBy(() -> underTest.uploadCustomerProfileImage(customerId, multipartFile, provider))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Failed to upload profile image")
                .hasRootCauseInstanceOf(IOException.class);

        verify(customerDao, never()).updateCustomerProfileImage(anyString(), anyLong());
    }

    @Test
    void itShouldUploadCustomerProfileImageUsingCloudinary() throws IOException {
        // Given
        Long customerId = 1L;
        String folderPath = "/profile-images/%s".formatted(customerId);
        String profileImage = "/v1698423094/customer";
        String provider = "cloudinary";
        MultipartFile multipartFile = mock(MultipartFile.class);

        when(customerDao.existsCustomerWithId(customerId)).thenReturn(true);
        when(imageUpload.uploadImage(folderPath, multipartFile)).thenReturn(profileImage);

        // When
        underTest.uploadCustomerProfileImage(customerId, multipartFile, provider);

        // Then
        ArgumentCaptor<String> profileImageCaptor = ArgumentCaptor.forClass(String.class);
        verify(customerDao).updateCustomerProfileImage(profileImageCaptor.capture(), eq(customerId));

        String profileImageCaptorValue = profileImageCaptor.getValue();
        assertThat(profileImageCaptorValue).isEqualTo(profileImage);
    }

    @Test
    void itShouldGetCustomerProfileImage() {
        // Given
        Long customerId = 1L;
        String firstName = "Test";
        String lastName = "Users";
        String email = "testusers@mail.com";
        String password = "password";
        int age = 41;
        Gender gender = Gender.MALE;
        String profileImage = "test";

        Customer customer = new Customer(
                customerId, firstName, lastName, email,
                password, age, gender, profileImage
        );

        CustomerDTO customerDTO = new CustomerDTO(
                customerId, firstName, lastName, email, age, gender, profileImage, List.of("ROLE_USER"), email
        );

        String bucketName = "profile-images";
        String key = "profile-images/%s/%s".formatted(customerId, customer.getProfileImage());
        byte[] image = "SomeImage".getBytes();

        when(customerDao.findCustomerById(customerId)).thenReturn(Optional.of(customer));
        when(customerDTOMapper.apply(customer)).thenReturn(customerDTO);
        when(s3Buckets.getCustomer()).thenReturn(bucketName);
        when(s3Service.downloadObject(bucketName, key)).thenReturn(image);

        // When
        byte[] customerProfileImage = underTest.getCustomerProfileImage(customerId);

        // Then
        assertThat(customerProfileImage).isEqualTo(image);
    }

    @Test
    void itShouldThrowWhenCustomerDTONotFoundWhileIdDoesNotExist() {
        // Given
        Long customerId = 1L;

        when(customerDao.findCustomerById(customerId)).thenReturn(Optional.empty());

        // When
        // Then
        assertThatThrownBy(() -> underTest.getCustomerProfileImage(customerId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(String.format("Customer with id [%s] was not found", customerId));

        verifyNoInteractions(s3Buckets);
        verifyNoInteractions(s3Service);
    }

    @Test
    void itShouldThrowWhenProfileImageIsEmpty() {
        // Given
        Long customerId = 1L;
        String firstName = "Test";
        String lastName = "Users";
        String email = "testusers@mail.com";
        String password = "password";
        int age = 41;
        Gender gender = Gender.MALE;
        String profileImage = "";

        Customer customer = new Customer(
                customerId, firstName, lastName, email,
                password, age, gender, profileImage
        );

        CustomerDTO customerDTO = new CustomerDTO(
                customerId, firstName, lastName, email, age, gender, profileImage, List.of("ROLE_USER"), email
        );

        when(customerDao.findCustomerById(customerId)).thenReturn(Optional.of(customer));
        when(customerDTOMapper.apply(customer)).thenReturn(customerDTO);

        // When
        // Then
        assertThatThrownBy(() -> underTest.getCustomerProfileImage(customerId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining(String.format("Customer with id [%s] profile image was not found", customerId));

        verifyNoInteractions(s3Buckets);
        verifyNoInteractions(s3Service);
    }
}