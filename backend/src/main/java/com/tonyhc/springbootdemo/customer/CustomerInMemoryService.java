package com.tonyhc.springbootdemo.customer;

import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository("InMemory")
public class CustomerInMemoryService implements CustomerDao {
    private static final List<Customer> customers;

    static {
        customers = new ArrayList<>();

        customers.add(
                new Customer(
                        1L, "Thomas", "thomas@mail.com", 49
                )
        );

        customers.add(
                new Customer(
                        2L, "Shu", "shu@gmail.com", 34
                )
        );

    }

    @Override
    public List<Customer> findAllCustomers() {
        return customers;
    }

    @Override
    public Optional<Customer> findCustomerById(Long id) {
        return customers.stream()
                .filter(customer -> customer.getId().equals(id))
                .findFirst();
    }

    @Override
    public boolean existsCustomerWithId(Long id) {
        return customers.stream()
                .anyMatch(customer -> customer.getId().equals(id));
    }

    @Override
    public boolean existsCustomerWithEmail(String email) {
        return customers.stream()
                .anyMatch(customer -> customer.getEmail().equals(email));
    }

    @Override
    public void registerCustomer(Customer customer) {
        customers.add(customer);
    }

    @Override
    public void updateCustomer(Customer customer) {
        for (int i = 0; i < customers.size(); i++) {
            if (customers.get(i).equals(customer)) {
                customers.set(i, customer);
            }
        }
    }

    @Override
    public void deleteCustomerById(Long id) {
        customers.stream()
                .filter(customer -> customer.getId().equals(id))
                .findFirst()
                .ifPresent(customers::remove);
    }
}
