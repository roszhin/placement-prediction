package com.roshin.placement.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegistrationDto {
    private String name;
    private String email;
    private String password;
    private String confirmPassword;
    private String phoneNumber;
    private String otp;
    private String gender;
    private String dateOfBirth;
    private String address;
    private String role; // "STUDENT", "FACULTY", "COMPANY"
    
    // Student specific
    private String rollNumber;
    private String course;
    private String passingYear;
    private Double cgpa;
    
    // Faculty specific
    private String employeeId;
    private String designation;
    
    // Company specific
    private String companyName;
    private String website;
    private String industry;
    private String companyDescription;
    
    // Common
    private String department;
}
