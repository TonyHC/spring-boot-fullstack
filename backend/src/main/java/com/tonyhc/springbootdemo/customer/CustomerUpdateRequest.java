package com.tonyhc.springbootdemo.customer;

public record CustomerUpdateRequest(
        String name,
        String email,
        Integer age
) {
}
