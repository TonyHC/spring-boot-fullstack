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
        when(mockResultSet.getString("name")).thenReturn("Test Users");
        when(mockResultSet.getString("email")).thenReturn("testusers@mail.com");
        when(mockResultSet.getInt("age")).thenReturn(31);

        // When
        Customer actual = underTest.mapRow(mockResultSet, 1);

        // Then
        Customer expected = new Customer(
            1L, "Test Users", "testusers@mail.com", 31
        );

        assertThat(actual).usingRecursiveComparison()
                .isEqualTo(expected);
    }
}