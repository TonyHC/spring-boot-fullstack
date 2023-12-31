package com.tonyhc.springbootdemo.customer;

import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class CustomerRowMapper implements RowMapper<Customer> {
    @Override
    public Customer mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new Customer(
                rs.getLong("customer_id"),
                rs.getString("first_name"),
                rs.getString("last_name"),
                rs.getString("email"),
                rs.getString("password"),
                rs.getInt("age"),
                Gender.valueOf(rs.getString("gender")),
                rs.getString("profile_image")
        );
    }
}
