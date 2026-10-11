package com.roshin.placement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "admin")
@Getter
@Setter
@NoArgsConstructor
public class Admin extends User {
    
    // Admins don't register, they are seeded into the database directly.
    private String adminLevel; // e.g., SUPER_ADMIN, MODERATOR

}
