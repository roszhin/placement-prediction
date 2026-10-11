package com.roshin.placement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
public class Company extends User {
    
    private String companyName;
    private String website;
    private String industry;
    private String companySize;
    private String foundedYear;
    private String companyDescription;
    
    // Approval flag for company accounts
    private boolean isApproved = false;

}
