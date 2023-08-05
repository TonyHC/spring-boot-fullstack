package com.tonyhc.springbootdemo.customer;

import com.tonyhc.springbootdemo.exception.DuplicateResourceException;
import com.tonyhc.springbootdemo.exception.RequestValidationException;
import com.tonyhc.springbootdemo.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    private final CustomerDao customerDao;
    private final PasswordEncoder passwordEncoder;
    private final CustomerDTOMapper customerDTOMapper;


    public CustomerService(@Qualifier("JDBC") CustomerDao customerDao, PasswordEncoder passwordEncoder,
                           CustomerDTOMapper customerDTOMapper) {
        this.customerDao = customerDao;
        this.passwordEncoder = passwordEncoder;
        this.customerDTOMapper = customerDTOMapper;
    }

    public List<CustomerDTO> findLatestCustomers(int size) {
        return customerDao.findPageOfCustomers(0, size, "customer_id,desc")
                .map(customerDTOMapper)
                .toList();
    }

    public CustomerPageDTO findPageOfCustomers(int page, int size, String sort) {
        Page<CustomerDTO> customerPage = customerDao.findPageOfCustomers(page, size, sort)
                .map(customerDTOMapper);

        return new CustomerPageDTO(
                customerPage.getContent(),
                customerPage.getNumber(),
                customerPage.getTotalElements(),
                customerPage.getTotalPages(),
                customerPage.getSize(),
                sort
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
        if (!customerDao.existsCustomerWithId(id)) {
            throw new ResourceNotFoundException(String.format("Customer with id [%s] was not found", id));
        }

        customerDao.deleteCustomerById(id);
    }

    private void validateCustomerEmail(String email) {
        if (customerDao.existsCustomerWithEmail(email)) {
            throw new DuplicateResourceException("Email already taken");
        }
    }
}
