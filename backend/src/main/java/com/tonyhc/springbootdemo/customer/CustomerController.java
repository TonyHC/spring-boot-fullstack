package com.tonyhc.springbootdemo.customer;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<Customer> findAllCustomers() {
        return customerService.findAllCustomers();
    }

    @GetMapping("{customerId}")
    public Customer findCustomerById(@PathVariable(value = "customerId") Long customerId) {
        return customerService.findCustomerById(customerId);
    }

    @PostMapping
    public void registerCustomer(@Valid @RequestBody CustomerRegistrationRequest customerRegistrationRequest) {
        customerService.registerCustomer(customerRegistrationRequest);
    }

    @PatchMapping("{customerId}")
    public void updateCustomerById(@PathVariable(value = "customerId") Long customerId,
                                           @Valid @RequestBody CustomerUpdateRequest customerUpdateRequest) {
        customerService.updateCustomerById(customerUpdateRequest, customerId);
    }

    @DeleteMapping("{customerId}")
    public ResponseEntity<String> deleteCustomerById(@PathVariable(value = "customerId") Long customerId) {
        customerService.deleteCustomerById(customerId);
        return new ResponseEntity<>("Customer was deleted", HttpStatus.OK);
    }
}
