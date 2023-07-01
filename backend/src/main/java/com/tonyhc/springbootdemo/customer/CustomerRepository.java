package com.tonyhc.springbootdemo.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
@Transactional(readOnly = true)
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    @Query("SELECT customer FROM Customer customer WHERE customer.email = :email")
    Optional<Customer> findCustomerByEmail(String email);

    @Query("SELECT CASE WHEN (COUNT(customer) > 0) THEN TRUE ELSE FALSE END FROM " +
            "Customer customer WHERE customer.id = :id")
    boolean existsCustomerById(Long id);

    @Query("SELECT CASE WHEN (COUNT(customer) > 0) THEN TRUE ELSE FALSE END FROM " +
            "Customer customer WHERE customer.email = :email")
    boolean existsCustomerByEmail(String email);
}
