package com.tonyhc.springbootdemo.customer;

import com.tonyhc.springbootdemo.validator.GenderIdentitySubset;
import com.tonyhc.springbootdemo.validator.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CustomerRegistrationRequest(
        @NotBlank(message = "First name cannot be blank")
        String firstName,

        @NotBlank(message = "Last name cannot be blank")
        String lastName,

        @Email(
                regexp = "^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$",
                message = "Must be a valid email"
        )
        String email,

        @NotBlank(message = "Password cannot be blank")
        @ValidPassword
        String password,

        @Min(
                value = 18,
                message = "Minimum age must be 18"
        )
        Integer age,

        @GenderIdentitySubset(anyOf = {Gender.MALE, Gender.FEMALE})
        Gender gender
) {
}
