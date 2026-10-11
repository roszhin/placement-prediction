package com.roshin.placement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "faculty")
@Getter
@Setter
@NoArgsConstructor
public class Faculty extends User {
    
    private String employeeId;
    private String designation;
    private String department;
    
    // Approval flag for faculty accounts
    private boolean isApproved = false;

}
