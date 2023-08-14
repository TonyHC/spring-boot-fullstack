package com.tonyhc.springbootdemo.customer;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Repository("JDBC")
public class CustomerJDBCDataAccessService implements CustomerDao {
    private final JdbcTemplate jdbcTemplate;
    private final CustomerRowMapper customerRowMapper;
    private final PaginationUtil paginationUtil;

    public CustomerJDBCDataAccessService(JdbcTemplate jdbcTemplate, CustomerRowMapper customerRowMapper, PaginationUtil paginationUtil) {
        this.jdbcTemplate = jdbcTemplate;
        this.customerRowMapper = customerRowMapper;
        this.paginationUtil = paginationUtil;
    }

    @Override
    public Page<Customer> findPageOfCustomers(int page, int size, String sort) {
        Pageable pageable = paginationUtil.createPageable(page, size, sort);
        String[] sortOptions = sort.split(",");

        String sql = "SELECT customer_id, first_name, last_name, email, password, age, gender, profile_image FROM CUSTOMER"
                + " ORDER BY " + sortOptions[0] + " " + sortOptions[1].toUpperCase() + " LIMIT ?" + " OFFSET ?";

        List<Customer> query = jdbcTemplate.query(
                sql,
                customerRowMapper,
                size,
                pageable.getOffset()
        );

        return new PageImpl<>(query, pageable, getNumberOfRows());
    }

    @Override
    public Optional<Customer> findCustomerById(Long id) {
        String sql = """
                SELECT customer_id, first_name, last_name, email, password, age, gender, profile_image
                FROM customer
                WHERE customer_id = ?;
                """;

        return jdbcTemplate.query(sql, customerRowMapper, id)
                .stream().findFirst();
    }

    @Override
    public Optional<Customer> findCustomerByEmail(String email) {
        String sql = """
                SELECT customer_id, first_name, last_name, email, password, age, gender, profile_image
                FROM customer
                WHERE email = ?;
                """;

        return jdbcTemplate.query(sql, customerRowMapper, email)
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
                INSERT INTO customer (first_name, last_name, email, password, age, gender)
                VALUES (?, ?, ?, ?, ?, ?);
                """;

        int result = jdbcTemplate.update(
                sql,
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail(),
                customer.getPassword(),
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

    @Override
    public void updateCustomerProfileImage(String profileImage, Long id) {
        String sql = """
                UPDATE customer
                SET profile_image = ?
                WHERE customer_id = ?
                """;

        jdbcTemplate.update(sql, profileImage, id);
    }

    @Override
    public void resetCustomerPassword(String password, Long id) {
        String sql = """
                UPDATE customer
                SET password = ?
                WHERE customer_id = ?
                """;

        jdbcTemplate.update(sql, password, id);
    }

    private int getNumberOfRows() {
        String sql = """
                SELECT COUNT(*) FROM customer;
                """;

        return Objects.requireNonNull(jdbcTemplate.queryForObject(sql, Integer.class));
    }
}
