package com.tonyhc.springbootdemo.customer;

import com.tonyhc.springbootdemo.exception.DuplicateResourceException;
import com.tonyhc.springbootdemo.exception.RequestValidationException;
import com.tonyhc.springbootdemo.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    private final CustomerDao customerDao;

    public CustomerService(@Qualifier("JDBC") CustomerDao customerDao) {
        this.customerDao = customerDao;
    }

    public List<Customer> findAllCustomers() {
        return customerDao.findAllCustomers();
    }

    public Customer findCustomerById(Long id) {
        return customerDao.findCustomerById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(String.format("Customer with id [%s] was not found", id))
                );
    }

    public void registerCustomer(CustomerRegistrationRequest customerRegistrationRequest) {
        String email = customerRegistrationRequest.email();
        validateCustomerEmail(email);

        Customer customer = new Customer(
                customerRegistrationRequest.name(),
                email,
                customerRegistrationRequest.age()
        );

        customerDao.registerCustomer(customer);
    }

    public void updateCustomerById(CustomerUpdateRequest customerUpdateRequest, Long id) {
        Customer existingCustomer = findCustomerById(id);
        boolean changes = false;

        if (customerUpdateRequest.name() != null && !existingCustomer.getName().equals(customerUpdateRequest.name())) {
            existingCustomer.setName(customerUpdateRequest.name());
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

        if (!changes) {
            throw new RequestValidationException("No changes were found");
        }

        customerDao.updateCustomer(existingCustomer);
    }

    public void deleteCustomerById(Long id) {
        if (!customerDao.existsCustomerWithId(id)) {
            throw new ResourceNotFoundException(String.format("Customer with id %s was not found", id));
        }

        customerDao.deleteCustomerById(id);
    }

    private void validateCustomerEmail(String email) {
        if (customerDao.existsCustomerWithEmail(email)) {
            throw new DuplicateResourceException("Email already taken");
        }
    }
}
