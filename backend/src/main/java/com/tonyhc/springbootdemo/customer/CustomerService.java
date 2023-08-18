package com.tonyhc.springbootdemo.customer;

import com.tonyhc.springbootdemo.cloudinary.ImageUpload;
import com.tonyhc.springbootdemo.exception.DuplicateResourceException;
import com.tonyhc.springbootdemo.exception.RequestValidationException;
import com.tonyhc.springbootdemo.exception.ResourceNotFoundException;
import com.tonyhc.springbootdemo.s3.S3Buckets;
import com.tonyhc.springbootdemo.s3.S3Service;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {
    private final CustomerDao customerDao;
    private final PasswordEncoder passwordEncoder;
    private final CustomerDTOMapper customerDTOMapper;
    private final S3Service s3Service;
    private final S3Buckets s3Buckets;
    private final ImageUpload imageUpload;


    public CustomerService(@Qualifier("JDBC") CustomerDao customerDao, PasswordEncoder passwordEncoder,
                           CustomerDTOMapper customerDTOMapper, S3Service s3Service, S3Buckets s3Buckets,
                           ImageUpload imageUpload) {
        this.customerDao = customerDao;
        this.passwordEncoder = passwordEncoder;
        this.customerDTOMapper = customerDTOMapper;
        this.s3Service = s3Service;
        this.s3Buckets = s3Buckets;
        this.imageUpload = imageUpload;
    }

    public List<CustomerDTO> findLatestCustomers(int size) {
        return customerDao.findPageOfCustomers(0, size, "customer_id,desc")
                .map(customerDTOMapper)
                .toList();
    }

    public CustomerPageDTO findPageOfCustomers(int page, int size, String sort, String query) {
        Page<CustomerDTO> customerPage = customerDao.findPageOfQueriedCustomers(query, page, size, sort)
                .map(customerDTOMapper);

        return new CustomerPageDTO(
                customerPage.getContent(),
                customerPage.getNumber(),
                customerPage.getTotalElements(),
                customerPage.getTotalPages(),
                customerPage.getSize(),
                sort,
                query
        );
    }

    public CustomerDTO findCustomerById(Long id) {
        return customerDao.findCustomerById(id)
                .map(customerDTOMapper)
                .orElseThrow(
                        () -> new ResourceNotFoundException(String.format("Customer with id [%s] was not found", id))
                );
    }

    public CustomerDTO findCustomerByEmail(String email) {
        return customerDao.findCustomerByEmail(email)
                .map(customerDTOMapper)
                .orElseThrow(
                        () -> new ResourceNotFoundException(String.format("Customer with email [%s] was not found", email))
                );
    }

    public void registerCustomer(CustomerRegistrationRequest customerRegistrationRequest) {
        String email = customerRegistrationRequest.email();
        validateCustomerEmail(email);

        Customer customer = new Customer(
                customerRegistrationRequest.firstName(),
                customerRegistrationRequest.lastName(),
                email,
                passwordEncoder.encode(customerRegistrationRequest.password()),
                customerRegistrationRequest.age(),
                customerRegistrationRequest.gender()
        );

        customerDao.registerCustomer(customer);
    }

    public void updateCustomerById(CustomerUpdateRequest customerUpdateRequest, Long id) {
        Customer existingCustomer = customerDao.findCustomerById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(String.format("Customer with id [%s] was not found", id))
                );

        boolean changes = false;

        if (customerUpdateRequest.firstName() != null && !existingCustomer.getFirstName().equals(customerUpdateRequest.firstName())) {
            existingCustomer.setFirstName(customerUpdateRequest.firstName());
            changes = true;
        }

        if (customerUpdateRequest.lastName() != null && !existingCustomer.getLastName().equals(customerUpdateRequest.lastName())) {
            existingCustomer.setLastName(customerUpdateRequest.lastName());
            changes = true;
        }

        if (customerUpdateRequest.email() != null && !existingCustomer.getEmail().equals(customerUpdateRequest.email())) {
            validateCustomerEmail(customerUpdateRequest.email());
            existingCustomer.setEmail(customerUpdateRequest.email());
            changes = true;
        }

        if (customerUpdateRequest.age() != null && !existingCustomer.getAge().equals(customerUpdateRequest.age())) {
            existingCustomer.setAge(customerUpdateRequest.age());
            changes = true;
        }

        if (customerUpdateRequest.gender() != null && !existingCustomer.getGender().equals(customerUpdateRequest.gender())) {
            existingCustomer.setGender(customerUpdateRequest.gender());
            changes = true;
        }

        if (!changes) {
            throw new RequestValidationException("No changes were found");
        }

        customerDao.updateCustomer(existingCustomer);
    }

    public void deleteCustomerById(Long id) {
        customerExists(id);
        customerDao.deleteCustomerById(id);
    }

    public void uploadCustomerProfileImage(Long customerId, MultipartFile multipartFile, String provider) {
        customerExists(customerId);

        String profileImage;

        if (provider.equals("s3")) {
            profileImage = UUID.randomUUID().toString();

            try {
                s3Service.uploadObject(
                        s3Buckets.getCustomer(),
                        "profile-images/%s/%s".formatted(customerId, profileImage),
                        multipartFile.getBytes()
                );
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        } else {
            profileImage = imageUpload.uploadImage("/profile-images/%s".formatted(customerId), multipartFile);
        }

        customerDao.updateCustomerProfileImage(profileImage, customerId);
    }

    public byte[] getCustomerProfileImage(Long customerId) {
        CustomerDTO existingCustomer = customerDao.findCustomerById(customerId)
                .map(customerDTOMapper)
                .orElseThrow(
                        () -> new ResourceNotFoundException(String.format("Customer with id [%s] was not found", customerId))
                );

        if (StringUtils.isBlank(existingCustomer.profileImage())) {
            throw new ResourceNotFoundException(String.format("Customer with id [%s] profile image was not found", customerId));
        }

        return s3Service.downloadObject(
                s3Buckets.getCustomer(),
                "profile-images/%s/%s".formatted(customerId, existingCustomer.profileImage())
        );
    }

    public void resetCustomerPassword(CustomerResetPasswordRequest customerResetPasswordRequest, Long customerId) {
        Customer customer = customerDao.findCustomerById(customerId).orElseThrow(
                () -> new ResourceNotFoundException(String.format("Customer with id [%s] was not found", customerId))
        );

        if (passwordEncoder.matches(customerResetPasswordRequest.password(), customer.getPassword())) {
            throw new RequestValidationException("Password was used previously");
        }

        customerDao.resetCustomerPassword(passwordEncoder.encode(customerResetPasswordRequest.password()), customerId);
    }

    private void customerExists(Long id) {
        if (!customerDao.existsCustomerWithId(id)) {
            throw new ResourceNotFoundException(String.format("Customer with id [%s] was not found", id));
        }
    }

    private void validateCustomerEmail(String email) {
        if (customerDao.existsCustomerWithEmail(email)) {
            throw new DuplicateResourceException("Email already taken");
        }
    }
}