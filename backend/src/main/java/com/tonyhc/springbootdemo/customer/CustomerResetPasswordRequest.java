package com.tonyhc.springbootdemo.customer;

import com.tonyhc.springbootdemo.validator.FieldsValueMatch;
import com.tonyhc.springbootdemo.validator.ValidPassword;

@FieldsValueMatch.List(
        @FieldsValueMatch(
                field = "password",
                fieldMatch = "confirmPassword",
                message = "Passwords must match!"
        )
)
public record CustomerResetPasswordRequest(
        @ValidPassword
        String password,
        String confirmPassword
) {
}
