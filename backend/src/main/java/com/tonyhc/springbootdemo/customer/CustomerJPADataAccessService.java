package com.tonyhc.springbootdemo.customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository("JPA")
public class CustomerJPADataAccessService implements CustomerDao {
    private final CustomerRepository customerRepository;
    private final PaginationUtil paginationUtil;

    public CustomerJPADataAccessService(CustomerRepository customerRepository, PaginationUtil paginationUtil) {
        this.customerRepository = customerRepository;
        this.paginationUtil = paginationUtil;
    }

    @Override
    public Page<Customer> findPageOfCustomers(int page, int size, String sort) {
        Pageable pageable = paginationUtil.createPageable(page, size, sort);
        return customerRepository.findPageOfCustomers(pageable);
    }

    @Override
    public Optional<Customer> findCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    @Override
    public Optional<Customer> findCustomerByEmail(String email) {
        return customerRepository.findCustomerByEmail(email);
    }

    @Override
    public boolean existsCustomerWithId(Long id) {
        return customerRepository.existsCustomerById(id);
    }

    @Override
    public boolean existsCustomerWithEmail(String email) {
        return customerRepository.existsCustomerByEmail(email);
    }

    @Override
    public void registerCustomer(Customer customer) {
        customerRepository.save(customer);
    }

    @Override
    public void updateCustomer(Customer customer) {
        customerRepository.save(customer);
    }

    @Override
    public void deleteCustomerById(Long id) {
        customerRepository.deleteById(id);
    }

    @Override
    public void updateCustomerProfileImage(String profileImage, Long id) {
        customerRepository.updateProfileImage(profileImage, id);
    }
}
