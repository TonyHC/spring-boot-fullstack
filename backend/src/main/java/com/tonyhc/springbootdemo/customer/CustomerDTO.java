package com.tonyhc.springbootdemo.customer;

import java.util.List;

public record CustomerDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        Integer age,
        Gender gender,
        List<String> roles,
        String username
) {
}
