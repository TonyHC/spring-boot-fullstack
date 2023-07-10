package com.tonyhc.springbootdemo.customer;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository("JDBC")
public class CustomerJDBCDataAccessService implements CustomerDao {
    private final JdbcTemplate jdbcTemplate;
    private final CustomerRowMapper customerRowMapper;

    public CustomerJDBCDataAccessService(JdbcTemplate jdbcTemplate, CustomerRowMapper customerRowMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.customerRowMapper = customerRowMapper;
    }

    @Override
    public List<Customer> findAllCustomers() {
        String sql = """
                SELECT customer_id, first_name, last_name, email, age, gender
                FROM customer;
                """;

        return jdbcTemplate.query(sql, customerRowMapper);
    }

    @Override
    public Optional<Customer> findCustomerById(Long id) {
        String sql = """
                SELECT customer_id, first_name, last_name, email, age, gender
                FROM customer
                WHERE customer_id = ?;
                """;

        return jdbcTemplate.query(sql, customerRowMapper, id)
                .stream().findFirst();
    }

    @Override
    public boolean existsCustomerWithId(Long id) {
        String sql = """
                SELECT COUNT(customer_id)
                FROM customer
                WHERE customer_id = ?;
                """;

        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return count != null && count > 0;
    }

    @Override
    public boolean existsCustomerWithEmail(String email) {
        String sql = """
                SELECT COUNT(customer_id)
                FROM customer
                WHERE email = ?;
                """;

        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    @Override
    public void registerCustomer(Customer customer) {
        String sql = """
                INSERT INTO customer (first_name, last_name, email, age, gender)
                VALUES (?, ?, ?, ?, ?);
                """;

        int result = jdbcTemplate.update(
                sql,
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail(),
                customer.getAge(),
                customer.getGender().getIdentity()
        );

        System.out.println("jdbcTemplate.update = " + result);
    }

    @Override
    public void updateCustomer(Customer customer) {
        if (customer.getFirstName() != null) {
            String sql = """
                UPDATE customer
                SET first_name = ?
                WHERE customer_id = ?
                """;

            int result = jdbcTemplate.update(
                    sql,
                    customer.getFirstName(),
                    customer.getId()
            );

            System.out.println("jdbcTemplate.update = " + result);
        }

        if (customer.getLastName() != null) {
            String sql = """
                UPDATE customer
                SET last_name = ?
                WHERE customer_id = ?
                """;

            int result = jdbcTemplate.update(
                    sql,
                    customer.getLastName(),
                    customer.getId()
            );

            System.out.println("jdbcTemplate.update = " + result);
        }

        if (customer.getEmail() != null) {
            String sql = """
                UPDATE customer
                SET email = ?
                WHERE customer_id = ?
                """;

            int result = jdbcTemplate.update(
                    sql,
                    customer.getEmail(),
                    customer.getId()
            );

            System.out.println("jdbcTemplate.update = " + result);
        }

        if (customer.getAge() != null) {
            String sql = """
                UPDATE customer
                SET age = ?
                WHERE customer_id = ?
                """;

            int result = jdbcTemplate.update(
                    sql,
                    customer.getAge(),
                    customer.getId()
            );

            System.out.println("jdbcTemplate.update = " + result);
        }

        if (customer.getGender() != null) {
            String sql = """
                UPDATE customer
                SET gender = ?
                WHERE customer_id = ?
                """;

            int result = jdbcTemplate.update(
                    sql,
                    customer.getGender().getIdentity(),
                    customer.getId()
            );

            System.out.println("jdbcTemplate.update = " + result);
        }
    }

    @Override
    public void deleteCustomerById(Long id) {
        String sql = """
                DELETE FROM customer
                WHERE customer_id = ?;
                """;

        int result = jdbcTemplate.update(sql, id);

        System.out.println("jdbcTemplate.update = " + result);
    }
}
