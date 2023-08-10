package com.tonyhc.springbootdemo.customer;

import java.util.List;

public record CustomerDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        Integer age,
        Gender gender,
        String profileImage,
        List<String> roles,
        String username
) {
}
