package com.tonyhc.springbootdemo.customer;

import java.util.List;

public record CustomerPageDTO(
        List<CustomerDTO> customers,
        Integer currentPage,
        Long totalItems,
        Integer totalPages,
        Integer pageSize,
        String sort,
        String query
) {
}
