package com.tonyhc.springbootdemo.customer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CustomerRegistrationRequest(
        @NotBlank(message = "Name cannot be blank")
        String name,

        @Email(
                regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$",
                message = "Must be a valid email"
        )
        String email,

        @Min(
                value = 18,
                message = "Minimum age must be 18"
        )
        Integer age
) {
}
