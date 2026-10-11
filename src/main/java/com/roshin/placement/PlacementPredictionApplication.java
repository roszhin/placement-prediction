package com.roshin.placement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class PlacementPredictionApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlacementPredictionApplication.class, args);
    }

    @Bean
    public CommandLineRunner fixLegacyDatabaseColumns(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                // Fix for: Field 'resume_id' doesn't have a default value
                jdbcTemplate.execute("ALTER TABLE applications MODIFY COLUMN resume_id BIGINT DEFAULT NULL");
                System.out.println("Successfully updated legacy resume_id column to allow nulls.");
                
                // Fix for: Data truncation: Data too long for column 'profile_picture'
                jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN profile_picture LONGTEXT");
                System.out.println("Successfully updated legacy profile_picture column to LONGTEXT.");
                
            } catch (Exception e) {
                // Ignore if column doesn't exist or already modified
            }
        };
    }
}
