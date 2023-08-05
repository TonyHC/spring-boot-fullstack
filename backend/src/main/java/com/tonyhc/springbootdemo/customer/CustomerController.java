package com.tonyhc.springbootdemo.customer;

import com.tonyhc.springbootdemo.jwt.JWTUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {
    private final CustomerService customerService;
    private final JWTUtil jwtUtil;

    public CustomerController(CustomerService customerService, JWTUtil jwtUtil) {
        this.customerService = customerService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping()
    public List<CustomerDTO> findLatestCustomers(@RequestParam(value = "size", defaultValue = "5") Integer size) {
        return customerService.findLatestCustomers(size);
    }

    @GetMapping("/page")
    public CustomerPageDTO findCustomersPage(
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size,
            @RequestParam(value = "sort", defaultValue = "customer_id,ASC") String sort
    ) {
        return customerService.findPageOfCustomers(page, size, sort);
    }

    @GetMapping("{customerId}")
    public CustomerDTO findCustomerById(@PathVariable(value = "customerId") Long customerId) {
        return customerService.findCustomerById(customerId);
    }

    @GetMapping("/email/{customerEmail}")
    public CustomerDTO findCustomerByEmail(@PathVariable(value = "customerEmail") String customerEmail) {
        return customerService.findCustomerByEmail(customerEmail);
    }

    @PostMapping
    public ResponseEntity<?> registerCustomer(@Valid @RequestBody CustomerRegistrationRequest customerRegistrationRequest) {
        customerService.registerCustomer(customerRegistrationRequest);
        String jwtToken = jwtUtil.issueToken(customerRegistrationRequest.email(), "ROLE_USER");
        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, jwtToken)
                .build();
    }

    @PatchMapping("{customerId}")
    public void updateCustomerById(@PathVariable(value = "customerId") Long customerId,
                                   @Valid @RequestBody CustomerUpdateRequest customerUpdateRequest) {
        customerService.updateCustomerById(customerUpdateRequest, customerId);
    }

    @DeleteMapping("{customerId}")
    public void deleteCustomerById(@PathVariable(value = "customerId") Long customerId) {
        customerService.deleteCustomerById(customerId);
    }
}
