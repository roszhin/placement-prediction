package com.roshin.placement.util;

import com.roshin.placement.entity.Company;
import com.roshin.placement.entity.Job;
import com.roshin.placement.entity.Role;
import com.roshin.placement.repository.CompanyRepository;
import com.roshin.placement.repository.JobRepository;
import com.roshin.placement.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Order(10)
public class FresherJobSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if already seeded
        if (companyRepository.findByCompanyNameIgnoreCase("FinPulse Technologies").isPresent()) {
            return;
        }

        Role companyRole = roleRepository.findByName("ROLE_COMPANY")
                .orElseGet(() -> roleRepository.save(new Role("ROLE_COMPANY")));

        String defaultCompanyPassword = passwordEncoder.encode("password123");

        // 1. FinPulse Technologies (Fintech)
        Company c1 = createCompany("FinPulse Technologies", "FinPulse HR", "careers@finpulse.tech",
                "Bengaluru, Karnataka", "Fintech", "https://finpulse.tech", "30-60 employees", "2022",
                "Next-gen micro-lending and digital payments platform for SMBs.", defaultCompanyPassword, companyRole);

        createJob(c1, "Junior Java Developer", "4.8 LPA", 5, "Bengaluru", "Hybrid", "Full Time",
                "Software Engineering", "Fresher (0-1 Years)", "B.Tech / B.E / MCA / BCA", 6.0,
                LocalDateTime.now().plusMonths(1),
                "FinPulse is looking for an enthusiastic Junior Java Developer to join our core transaction processing team. You will write clean Java code, implement core business logic, and collaborate on high-frequency payment microservices.",
                "Develop backend RESTful APIs using Java and Spring Boot; Write efficient SQL queries for payment transaction logging; Participate in code reviews and agile sprint standups.",
                "Java, OOP, MySQL, Git, REST API",
                "Spring Boot basics, Postman, Linux basics", 4);

        createJob(c1, "Associate Quality Assurance (QA) Tester", "3.8 LPA", 4, "Bengaluru", "On-site", "Full Time",
                "Quality Assurance", "Fresher (0-1 Years)", "BCA / MCA / B.Tech / B.Sc CS", 6.0,
                LocalDateTime.now().plusMonths(1),
                "Join FinPulse QA team to ensure our financial transaction workflows are bug-free, secure, and user-friendly. You will work closely with developers to validate web application features.",
                "Author test cases and test scenarios from feature specifications; Execute functional, regression, and smoke tests; Report and verify defects using JIRA.",
                "Manual Testing, Test Cases, SQL basics, Bug Tracking, JIRA",
                "Selenium basics, Postman API testing, Core Java", 3);

        // 2. LearnSphere Edutech (Edtech)
        Company c2 = createCompany("LearnSphere Edutech", "LearnSphere Talent", "talent@learnsphere.io",
                "Hyderabad, Telangana", "Edtech", "https://learnsphere.io", "25-50 employees", "2021",
                "AI-assisted interactive learning and skill assessment portal for universities.", defaultCompanyPassword, companyRole);

        createJob(c2, "Frontend Developer (Fresher)", "4.5 LPA", 5, "Hyderabad", "Hybrid", "Full Time",
                "Frontend Engineering", "Fresher (0-1 Years)", "B.Tech / B.E / MCA / BCA", 6.0,
                LocalDateTime.now().plusMonths(1),
                "LearnSphere seeks a creative Frontend Developer to craft engaging, responsive user interfaces for student and tutor portals. Freshers with strong web fundamentals are welcome.",
                "Build responsive React components matching Figma wireframes; Connect UI components with backend REST APIs; Optimize page load speeds across desktop and mobile.",
                "HTML5, CSS3, JavaScript, React basics, Git",
                "Tailwind CSS, Responsive Web Design, REST API integration", 5);

        createJob(c2, "Associate Customer Support Engineer", "3.6 LPA", 4, "Remote", "Remote", "Full Time",
                "Technical Support", "Fresher (0-1 Years)", "BCA / MCA / B.Tech / Any Graduate", 6.0,
                LocalDateTime.now().plusMonths(1),
                "Provide Tier-1 and Tier-2 technical support to educators and institutions using LearnSphere LMS platforms. Great entry-level role for tech grads with good communication.",
                "Diagnose and resolve technical tickets raised by partner schools; Write reproducible bug reports for developers; Maintain customer knowledge-base documentation.",
                "Troubleshooting, Basic SQL, Customer Communication, Problem Solving, Windows/Linux basics",
                "ITIL foundation, Ticketing tools (Zendesk/Freshdesk), Networking basics", 4);

        // 3. CareSync Health Solutions (Healthtech)
        Company c3 = createCompany("CareSync Health Solutions", "CareSync People Team", "hr@caresync.health",
                "Chennai, Tamil Nadu", "Healthtech", "https://caresync.health", "40-80 employees", "2020",
                "Telemedicine and electronic health record management for clinics and hospitals.", defaultCompanyPassword, companyRole);

        createJob(c3, "Junior Full Stack Developer", "5.0 LPA", 5, "Chennai", "Hybrid", "Full Time",
                "Product Development", "Fresher (0-1 Years)", "B.Tech / B.E / MCA", 6.0,
                LocalDateTime.now().plusMonths(1),
                "Help build modern telehealth applications connecting doctors and patients seamlessly and securely. Freshers with enthusiasm for full-stack JavaScript will thrive here.",
                "Develop full stack web features using Node.js and React; Maintain database schemas and perform data validations; Write unit and integration tests.",
                "JavaScript, Node.js, React, MongoDB, Git",
                "Express.js, TypeScript, Docker basics", 4);

        createJob(c3, "Junior Python Developer", "4.2 LPA", 4, "Chennai", "On-site", "Full Time",
                "Healthcare Informatics", "Fresher (0-1 Years)", "B.Tech / B.E / MCA / BCA", 6.0,
                LocalDateTime.now().plusMonths(1),
                "CareSync is looking for an entry-level Python developer to build and maintain healthcare data pipelines and web services.",
                "Write clean, modular Python scripts to parse medical records; Build lightweight Flask web endpoints; Collaborate with clinical domain experts to validate data accuracy.",
                "Python, OOP, Flask, PostgreSQL, Git",
                "Pandas, REST APIs, JSON parsing", 3);

        // 4. CloudOpsis Software (SaaS)
        Company c4 = createCompany("CloudOpsis Software", "CloudOpsis Recruiting", "hiring@cloudopsis.dev",
                "Pune, Maharashtra", "SaaS", "https://cloudopsis.dev", "20-40 employees", "2023",
                "Cloud cost optimization and automated container monitoring SaaS platform.", defaultCompanyPassword, companyRole);

        createJob(c4, "Junior DevOps / Cloud Trainee", "5.2 LPA", 5, "Pune", "Remote", "Full Time",
                "Cloud Infrastructure", "Fresher (0-1 Years)", "B.Tech / B.E / MCA", 6.0,
                LocalDateTime.now().plusMonths(1),
                "CloudOpsis is hiring a curious Cloud Trainee eager to master Linux systems, containerization, and automated deployment pipelines in a fast-paced SaaS environment.",
                "Assist in configuring and monitoring Linux server instances; Build container images using Dockerfiles; Maintain continuous integration build runners.",
                "Linux, Bash Scripting, Docker basics, Git, Networking fundamentals",
                "AWS Cloud Practitioner, CI/CD pipelines, Kubernetes basics", 3);

        createJob(c4, "Associate Technical Documentation Specialist", "3.5 LPA", 4, "Remote", "Remote", "Full Time",
                "Product Engineering", "Fresher (0-1 Years)", "BCA / MCA / B.Tech / B.Sc / BA", 6.0,
                LocalDateTime.now().plusMonths(1),
                "Document our cloud tools, developer SDKs, and REST APIs to provide world-class developer onboarding. Great starting role for detail-oriented computer science graduates.",
                "Author step-by-step developer tutorials and API references; Review code changes to update developer guides; Work closely with software engineers to test documentation accuracy.",
                "Technical Writing, Markdown, Git, API Documentation, English Communication",
                "Postman collections, Swagger/OpenAPI, Basic Python", 2);

        // 5. ShopKwik Commerce (E-Commerce)
        Company c5 = createCompany("ShopKwik Commerce", "ShopKwik Talent", "jobs@shopkwik.in",
                "Bengaluru, Karnataka", "E-Commerce", "https://shopkwik.in", "50-100 employees", "2022",
                "Hyperlocal quick-commerce logistics and merchant storefront platform.", defaultCompanyPassword, companyRole);

        createJob(c5, "Trainee Software Engineer", "4.5 LPA", 5, "Bengaluru", "On-site", "Full Time",
                "Core Platform", "Fresher (0-1 Years)", "B.Tech / B.E / MCA / BCA", 6.0,
                LocalDateTime.now().plusMonths(1),
                "Kickstart your software engineering career at ShopKwik, building high-throughput merchant and order processing systems for millions of shoppers.",
                "Implement core business logic and inventory tracking algorithms; Write and run automated unit test suites; Debug and troubleshoot application logs during peak sales events.",
                "Java, Data Structures, OOP, SQL, Git",
                "Spring Boot, REST APIs, Redis basics", 6);

        createJob(c5, "Associate Operations Analyst", "4.0 LPA", 4, "Bengaluru", "On-site", "Full Time",
                "Logistics & Supply Chain", "Fresher (0-1 Years)", "BCA / MCA / B.Tech / B.Sc / B.Com", 6.0,
                LocalDateTime.now().plusMonths(1),
                "Analyze daily delivery fulfillment rates, rider dispatch timelines, and merchant inventory turnarounds to streamline warehouse operations.",
                "Extract and summarize delivery telemetry data via SQL; Prepare daily operational performance reports; Identify bottleneck fulfillment hubs and suggest route improvements.",
                "Advanced Excel, SQL queries, Data Analysis, Reporting, Problem Solving",
                "Power BI, Python basics, Supply chain metrics", 4);

        // 6. RouteLogix Solutions (Logistics-Tech)
        Company c6 = createCompany("RouteLogix Solutions", "RouteLogix HR", "careers@routelogix.in",
                "Coimbatore, Tamil Nadu", "Logistics-Tech", "https://routelogix.in", "35-70 employees", "2021",
                "Intelligent freight dispatching, route optimization and fleet telematics.", defaultCompanyPassword, companyRole);

        createJob(c6, "Junior Mobile App Developer (Flutter / Android)", "4.2 LPA", 4, "Coimbatore", "Hybrid", "Full Time",
                "Mobile Engineering", "Fresher (0-1 Years)", "B.Tech / B.E / MCA / BCA", 6.0,
                LocalDateTime.now().plusMonths(1),
                "Build robust and intuitive mobile apps used by truck drivers and warehouse managers across India. Exciting opportunity for freshers interested in cross-platform mobile apps.",
                "Create responsive mobile UI screens using Flutter; Integrate location services and real-time GPS tracking; Test app compatibility across various Android device form factors.",
                "Dart, Flutter basics, Java/Kotlin basics, REST API integration, Git",
                "Google Maps API, SQLite/Room, State management (Bloc/Provider)", 3);

        createJob(c6, "Junior System Administrator / IT Support", "3.5 LPA", 4, "Coimbatore", "On-site", "Full Time",
                "IT Infrastructure", "Fresher (0-1 Years)", "BCA / B.Sc CS / B.Tech / Diploma in IT", 6.0,
                LocalDateTime.now().plusMonths(1),
                "Ensure smooth IT operations across our regional logistics hubs and headquarters. Hands-on learning with corporate networking and system setups.",
                "Install and configure operating systems and company software; Troubleshoot LAN, Wi-Fi, and VPN connection issues; Maintain IT asset inventory and security access controls.",
                "Windows Server, Linux basics, Networking (TCP/IP, DNS), Hardware Troubleshooting, Active Directory",
                "Firewall configuration, Backup management, Shell scripting", 2);

        // 7. EcoVolt CleanTech (CleanTech & IoT)
        Company c7 = createCompany("EcoVolt CleanTech", "EcoVolt HR", "talent@ecovolt.energy",
                "Hyderabad, Telangana", "CleanTech & IoT", "https://ecovolt.energy", "25-50 employees", "2022",
                "Smart EV battery swapping network telematics and energy grid management.", defaultCompanyPassword, companyRole);

        createJob(c7, "Embedded Systems / IoT Trainee", "4.8 LPA", 5, "Hyderabad", "On-site", "Full Time",
                "Hardware & Firmware", "Fresher (0-1 Years)", "B.Tech (ECE/EEE/CS) / MCA", 6.0,
                LocalDateTime.now().plusMonths(1),
                "Work on firmware for smart EV battery stations and real-time telemetry sensors. Perfect role for freshers passionate about hardware-software intersection.",
                "Write embedded C/C++ code for microcontroller sensors; Collect and transmit battery telematics to cloud endpoints; Test hardware-software integration on testing rigs.",
                "Embedded C, C++, Microcontrollers, IoT protocols (MQTT/HTTP), Git",
                "Arduino/ESP32, PCB basics, UART/I2C communication", 3);

        createJob(c7, "Junior Web Developer", "4.0 LPA", 4, "Hyderabad", "Hybrid", "Full Time",
                "Digital Products", "Fresher (0-1 Years)", "BCA / MCA / B.Tech", 6.0,
                LocalDateTime.now().plusMonths(1),
                "Build internal portals and customer dashboards displaying clean energy metrics and battery health.",
                "Create and maintain database-driven web pages; Implement form validations and responsive layouts; Fix UI defects and optimize SQL queries.",
                "HTML, CSS, JavaScript, PHP or Python, MySQL, Git",
                "Bootstrap, jQuery, REST APIs", 4);

        // 8. DevFlow Automation (Developer Tools & AI)
        Company c8 = createCompany("DevFlow Automation", "DevFlow Recruiting", "jobs@devflow.ai",
                "Bengaluru, Karnataka", "Developer Tools & AI", "https://devflow.ai", "15-35 employees", "2023",
                "Automated code review pipelines and developer productivity tooling.", defaultCompanyPassword, companyRole);

        createJob(c8, "Associate Software Developer (Python & AI Tools)", "5.5 LPA", 6, "Bengaluru", "Hybrid", "Full Time",
                "AI Engineering", "Fresher (0-1 Years)", "B.Tech / B.E / MCA", 6.0,
                LocalDateTime.now().plusMonths(1),
                "Join DevFlow to help develop cutting-edge developer assistance bots and automated code quality tools. Great role for freshers eager to work with modern Python and AI APIs.",
                "Write modular Python services for analyzing source code; Integrate external AI model APIs for automated summary generation; Participate in architecture discussions and sprint reviews.",
                "Python, OOP, Data Structures, Git, REST APIs",
                "OpenAI/LLM APIs, FastAPI, Linux environment", 4);

        createJob(c8, "Software Development Engineer Intern-to-Full-Time", "4.5 LPA", 5, "Bengaluru", "On-site", "Full Time",
                "Engineering", "Fresher (0-1 Years)", "B.Tech / B.E / MCA / BCA", 6.0,
                LocalDateTime.now().plusMonths(1),
                "6-month intensive trainee internship transitioning directly into a full-time software engineer role upon successful completion. Focus on core engineering craftsmanship.",
                "Learn our engineering stack under senior mentorship; Complete end-to-end coding assignments and feature tickets; Participate in team code reviews and documentation.",
                "Java, DSA, DBMS, Problem Solving, Git",
                "Spring Boot, React basics, Unit testing", 5);

        createJob(c8, "Junior Automated Test Engineer", "4.2 LPA", 4, "Remote", "Remote", "Full Time",
                "Quality Engineering", "Fresher (0-1 Years)", "B.Tech / B.E / MCA / BCA", 6.0,
                LocalDateTime.now().plusMonths(1),
                "Automate browser regression testing and API validation suites for our web applications. Ideal entry role for coding enthusiasts who enjoy QA automation.",
                "Write automated test scripts in Selenium with Java/Python; Run regression test suites before major releases; Maintain test documentation and track bug resolutions.",
                "Java or Python, Selenium, TestNG/PyTest, Git, OOP",
                "CI/CD integration, Postman, API testing", 3);

        // 9. DataNest Analytics (Data Analytics)
        Company c9 = createCompany("DataNest Analytics", "DataNest People Operations", "hr@datanest.io",
                "Pune, Maharashtra", "Data Analytics", "https://datanest.io", "30-60 employees", "2022",
                "Self-service business intelligence dashboards and operational analytics.", defaultCompanyPassword, companyRole);

        createJob(c9, "Associate Data Analyst", "4.6 LPA", 5, "Pune", "Hybrid", "Full Time",
                "Business Analytics", "Fresher (0-1 Years)", "B.Tech / B.E / MCA / BCA / B.Sc Stats", 6.0,
                LocalDateTime.now().plusMonths(1),
                "Transform complex client datasets into actionable visual insights and business intelligence dashboards. Great starting role for data-savvy freshers.",
                "Write complex SQL queries to clean and aggregate client data; Build interactive dashboards in Power BI/Tableau; Present data trends and findings to project managers.",
                "SQL, Python (Pandas), Excel, Data Visualization, Statistics basics",
                "Power BI, Tableau, Data cleaning techniques", 5);

        createJob(c9, "Junior Database / SQL Developer", "4.2 LPA", 4, "Pune", "On-site", "Full Time",
                "Database Operations", "Fresher (0-1 Years)", "BCA / MCA / B.Tech", 6.0,
                LocalDateTime.now().plusMonths(1),
                "DataNest is seeking an entry-level SQL developer to support our database clustering and analytics pipelines.",
                "Design relational schemas, foreign keys, and indexes; Write stored procedures, views, and migration scripts; Assist in regular database maintenance and performance tuning.",
                "SQL, MySQL/PostgreSQL, RDBMS concepts, Indexing basics, Stored Procedures",
                "Python scripting, Database backup/restore, Query optimization", 3);

        createJob(c9, "Junior Business Analyst (Fresher)", "4.4 LPA", 4, "Pune", "Hybrid", "Full Time",
                "Consulting & Solutions", "Fresher (0-1 Years)", "B.Tech / MCA / BCA / MBA", 6.0,
                LocalDateTime.now().plusMonths(1),
                "Bridge the gap between non-technical clients and our engineering teams by documenting clear functional specifications and workflows.",
                "Interview clients and project stakeholders to capture business requirements; Create workflow diagrams, mockups, and user stories; Assist QA team during User Acceptance Testing (UAT).",
                "Requirements Gathering, UML Diagrams, User Stories, Excel, Communication",
                "Agile/Scrum basics, JIRA, Wireframing tools (Figma/Draw.io)", 3);
    }

    private Company createCompany(String companyName, String hrName, String email, String location,
                                  String industry, String website, String companySize, String foundedYear,
                                  String description, String password, Role role) {
        Company company = new Company();
        company.setCompanyName(companyName);
        company.setName(hrName);
        company.setEmail(email);
        company.setAddress(location);
        company.setIndustry(industry);
        company.setWebsite(website);
        company.setCompanySize(companySize);
        company.setFoundedYear(foundedYear);
        company.setCompanyDescription(description);
        company.setPassword(password);
        company.setRole(role);
        company.setActive(true);
        company.setApproved(true);
        return companyRepository.save(company);
    }

    private Job createJob(Company company, String title, String packageOffered, Integer salaryLpa,
                          String location, String workMode, String employmentType, String department,
                          String expRequirement, String minQualification, Double minCgpa,
                          LocalDateTime lastDate, String desc, String responsibilities,
                          String requiredSkills, String preferredSkills, Integer vacancies) {
        Job job = new Job();
        job.setCompany(company);
        job.setJobTitle(title);
        job.setPackageOffered(packageOffered);
        job.setSalaryLpa(salaryLpa);
        job.setLocation(location);
        job.setWorkMode(workMode);
        job.setEmploymentType(employmentType);
        job.setDepartment(department);
        job.setExperienceRequirement(expRequirement);
        job.setMinimumQualification(minQualification);
        job.setMinimumCgpa(minCgpa);
        job.setEligibilityCriteria(expRequirement + ", " + minCgpa + " CGPA");
        job.setLastDateToApply(lastDate);
        job.setJobDescription(desc);
        job.setResponsibilities(responsibilities);
        job.setRequiredSkills(requiredSkills);
        job.setPreferredSkills(preferredSkills);
        job.setVacancies(vacancies);
        job.setActive(true);
        job.setCreatedAt(LocalDateTime.now());
        return jobRepository.save(job);
    }
}
