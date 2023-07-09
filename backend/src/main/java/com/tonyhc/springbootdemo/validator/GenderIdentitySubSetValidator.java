package com.tonyhc.springbootdemo.validator;

import com.tonyhc.springbootdemo.customer.Gender;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Arrays;

public class GenderIdentitySubSetValidator implements ConstraintValidator<GenderIdentitySubset, Gender> {
    private Gender[] subset;

    @Override
    public void initialize(GenderIdentitySubset constraint) {
        this.subset = constraint.anyOf();
    }

    @Override
    public boolean isValid(Gender gender, ConstraintValidatorContext constraintValidatorContext) {
        return Arrays.asList(subset).contains(gender);
    }
}
