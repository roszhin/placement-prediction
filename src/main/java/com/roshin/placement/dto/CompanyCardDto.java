package com.roshin.placement.dto;

import com.roshin.placement.entity.Company;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CompanyCardDto {
    private Company company;
    private Long companyId;
    private String companyName;
    private String industry;
    private String location;
    private String website;
    private String companySize;
    private String foundedYear;
    private String companyDescription;
    private String profilePicture;
    private long openJobCount;

    public CompanyCardDto(Company company, long openJobCount) {
        this.company = company;
        this.openJobCount = openJobCount;
        if (company != null) {
            this.companyId = company.getId();
            this.companyName = company.getCompanyName() != null ? company.getCompanyName() : company.getName();
            this.industry = company.getIndustry();
            this.location = company.getAddress();
            this.website = company.getWebsite();
            this.companySize = company.getCompanySize();
            this.foundedYear = company.getFoundedYear();
            this.companyDescription = company.getCompanyDescription();
            this.profilePicture = company.getProfilePicture();
        }
    }
}
