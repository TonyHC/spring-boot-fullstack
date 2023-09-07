package com.tonyhc.springbootdemo.customer;

import com.tonyhc.springbootdemo.jwt.JWTUtil;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public CustomerPageDTO findPageOfCustomers(
            @RequestParam(value = "query", defaultValue = "") String query,
            @RequestParam(value = "page", defaultValue = "0") Integer page,
            @RequestParam(value = "size", defaultValue = "10") Integer size,
            @RequestParam(value = "sort", defaultValue = "customer_id,ASC") String sort
    ) {
        return customerService.findPageOfCustomers(page, size, sort, query);
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

    @PostMapping(
            value = "{customerId}/profile-image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public void uploadCustomerProfileImage(
            @PathVariable(value = "customerId") Long customerId,
            @RequestParam(value = "file") MultipartFile multipartFile,
            @RequestParam(value = "provider") String provider
    ) {
        customerService.uploadCustomerProfileImage(customerId, multipartFile, provider);
    }

    @GetMapping(
            value = "{customerId}/profile-image",
            produces = MediaType.IMAGE_JPEG_VALUE
    )
    public byte[] getCustomerProfileImage(@PathVariable(value = "customerId") Long customerId) {
        return customerService.getCustomerProfileImage(customerId);
    }

    @PatchMapping("{customerId}/reset-password")
    public void resetCustomerPassword(@PathVariable(value = "customerId") Long customerId,
                                   @Valid @RequestBody CustomerResetPasswordRequest customerResetPasswordRequest) {
        customerService.resetCustomerPassword(customerResetPasswordRequest, customerId);
    }
}