package com.tonyhc.springbootdemo.customer;

import org.springframework.data.domain.Page;

import java.util.Optional;

public interface CustomerDao {
    Page<Customer> findPageOfCustomers(int page, int size, String sort);

    Optional<Customer> findCustomerById(Long id);

    Optional<Customer> findCustomerByEmail(String email);

    boolean existsCustomerWithId(Long id);

    boolean existsCustomerWithEmail(String email);

    void registerCustomer(Customer customer);

    void updateCustomer(Customer customer);

    void deleteCustomerById(Long id);
    void updateCustomerProfileImage(String profileImage, Long id);
}
