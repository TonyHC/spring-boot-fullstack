package com.tonyhc.springbootdemo.customer;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

@Component
public class PaginationUtil {
    public Pageable createPageable(int page, int size, String sort) {
        String[] sortOptions = sort.split(",");
        Sort.Order order = new Sort.Order(getDirection(sortOptions[1]), sortOptions[0]);
        return PageRequest.of(page, size, Sort.by(order));
    }

    private Sort.Direction getDirection(String direction) {
        return direction.equals("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
    }
}
