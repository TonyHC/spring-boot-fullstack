package com.tonyhc.springbootdemo.customer;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.stream.Stream;

@Converter(autoApply = true)
public class GenderConverter implements AttributeConverter<Gender, String> {
    @Override
    public String convertToDatabaseColumn(Gender gender) {
        if (gender == null) {
            return null;
        }

        return gender.getIdentity();
    }

    @Override
    public Gender convertToEntityAttribute(String identity) {
        if (identity == null) {
            return null;
        }

        return Stream.of(Gender.values())
                .filter(gender -> gender.getIdentity().equals(identity))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
