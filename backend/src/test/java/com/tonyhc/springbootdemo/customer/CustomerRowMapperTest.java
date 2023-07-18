package com.tonyhc.springbootdemo.customer;

import org.junit.jupiter.api.Test;

import java.sql.ResultSet;
import java.sql.SQLException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class CustomerRowMapperTest {
    @Test
    void itShouldMapRow() throws SQLException {
        // Given
        CustomerRowMapper underTest = new CustomerRowMapper();

        ResultSet mockResultSet = mock(ResultSet.class);

        when(mockResultSet.getLong("customer_id")).thenReturn(1L);
        when(mockResultSet.getString("first_name")).thenReturn("Test");
        when(mockResultSet.getString("last_name")).thenReturn("Users");
        when(mockResultSet.getString("email")).thenReturn("testusers@mail.com");
        when(mockResultSet.getString("password")).thenReturn("password");
        when(mockResultSet.getInt("age")).thenReturn(31);
        when(mockResultSet.getString("gender")).thenReturn("MALE");

        // When
        Customer actual = underTest.mapRow(mockResultSet, 1);

        // Then
        Customer expected = new Customer(
            1L,"Test", "Users",  "testusers@mail.com", "password",
                31,Gender.valueOf("MALE")
        );

        assertThat(actual).usingRecursiveComparison()
                .isEqualTo(expected);
    }
}