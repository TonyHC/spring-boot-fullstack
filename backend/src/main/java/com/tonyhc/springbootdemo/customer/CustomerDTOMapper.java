package com.tonyhc.springbootdemo.customer;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.function.Function;

/* Could use MapStruct instead of this approach  */
@Component
public class CustomerDTOMapper implements Function<Customer, CustomerDTO> {
    @Override
    public CustomerDTO apply(Customer customer) {
        return new CustomerDTO(
                customer.getId(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail(),
                customer.getAge(),
                customer.getGender(),
                customer.getProfileImage(),
                customer.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList(),
                customer.getUsername());
    }
}
