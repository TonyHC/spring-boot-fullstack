package com.tonyhc.springbootdemo.customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
@Transactional(readOnly = true)
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    @Query("SELECT customer FROM Customer customer WHERE customer.email = :email")
    Optional<Customer> findCustomerByEmail(String email);

    @Query("SELECT customer FROM Customer customer")
    Page<Customer> findPageOfCustomers(Pageable pageable);

    @Query("SELECT customer FROM Customer customer WHERE customer.email LIKE CONCAT('%', :query, '%')")
    Page<Customer> findPageOfQueriedCustomers(Pageable pageable, String query);

    @Query("SELECT CASE WHEN (COUNT(customer) > 0) THEN TRUE ELSE FALSE END FROM " +
            "Customer customer WHERE customer.id = :id")
    boolean existsCustomerById(Long id);

    @Query("SELECT CASE WHEN (COUNT(customer) > 0) THEN TRUE ELSE FALSE END FROM " +
            "Customer customer WHERE customer.email = :email")
    boolean existsCustomerByEmail(String email);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Customer customer SET customer.profileImage = :profileImage WHERE customer.id = :id")
    int updateProfileImage(String profileImage, Long id);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Customer customer SET customer.password = :password WHERE customer.id = :id")
    int resetCustomerPassword(String password, Long id);
}
