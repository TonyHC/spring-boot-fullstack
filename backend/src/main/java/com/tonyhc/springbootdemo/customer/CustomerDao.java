package com.tonyhc.springbootdemo.customer;

import java.util.List;
import java.util.Optional;

public interface CustomerDao {
    List<Customer> findAllCustomers();
    Optional<Customer> findCustomerById(Long id);
    boolean existsCustomerWithId(Long id);
    boolean existsCustomerWithEmail(String email);
    void registerCustomer(Customer customer);
    void updateCustomer(Customer customer);
    void deleteCustomerById(Long id);
}
