package com.tonyhc.springbootdemo.customer;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomerUserDetailsService implements UserDetailsService {
    private final CustomerDao customerDao;

    public CustomerUserDetailsService(@Qualifier("JDBC") CustomerDao customerDao) {
        this.customerDao = customerDao;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return customerDao.findCustomerByEmail(username).orElseThrow(
                () -> new UsernameNotFoundException(String.format("Username %s was not found", username))
        );
    }
}
