package com.tonyhc.springbootdemo.customer;

public record CustomerUpdateRequest(
        String firstName,
        String lastName,
        String email,
        Integer age,
        Gender gender
) {
}
