-- ==============================================================================
-- Seed Script: 9 Plausible Startup Companies & 20 Fresher / Entry-Level Job Postings
-- Specifically designed for recent MCA, BCA, B.Tech/B.E. CS/IT graduates (0-1 Years)
-- ==============================================================================

USE placement_db;

-- 1. FinPulse Technologies (Fintech)
INSERT INTO users (name, email, password, phone_number, address, role_id, is_active, created_at, updated_at)
VALUES ('FinPulse HR', 'careers@finpulse.tech', '$2a$10$YAEaF8SYeSJYPxTRu1WHyOwpzw0wvIpzrsHV/GcZnyWZdlfRZ7NVC', '9876500001', 'Bengaluru, Karnataka', 3, 1, NOW(), NOW());
SET @c1_id = LAST_INSERT_ID();

INSERT INTO companies (id, company_name, website, industry, company_size, founded_year, company_description, is_approved)
VALUES (@c1_id, 'FinPulse Technologies', 'https://finpulse.tech', 'Fintech', '30-60 employees', '2022', 'Next-gen micro-lending and digital payments platform for SMBs.', 1);

INSERT INTO jobs (company_id, job_title, package_offered, salary_lpa, location, work_mode, employment_type, department, experience_requirement, minimum_qualification, minimum_cgpa, last_date_to_apply, job_description, responsibilities, required_skills, preferred_skills, vacancies, is_active, created_at, eligibility_criteria)
VALUES 
(@c1_id, 'Junior Java Developer', '4.8 LPA', 5, 'Bengaluru', 'Hybrid', 'Full Time', 'Software Engineering', 'Fresher (0-1 Years)', 'B.Tech / B.E / MCA / BCA', 6.0, '2026-10-30 23:59:59',
 'FinPulse is looking for an enthusiastic Junior Java Developer to join our core transaction processing team. You will write clean Java code, implement core business logic, and collaborate on high-frequency payment microservices.',
 'Develop backend RESTful APIs using Java and Spring Boot; Write efficient SQL queries for payment transaction logging; Participate in code reviews and agile sprint standups.',
 'Java, OOP, MySQL, Git, REST API',
 'Spring Boot basics, Postman, Linux basics', 4, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA'),

(@c1_id, 'Associate Quality Assurance (QA) Tester', '3.8 LPA', 4, 'Bengaluru', 'On-site', 'Full Time', 'Quality Assurance', 'Fresher (0-1 Years)', 'BCA / MCA / B.Tech / B.Sc CS', 6.0, '2026-10-30 23:59:59',
 'Join FinPulse QA team to ensure our financial transaction workflows are bug-free, secure, and user-friendly. You will work closely with developers to validate web application features.',
 'Author test cases and test scenarios from feature specifications; Execute functional, regression, and smoke tests; Report and verify defects using JIRA.',
 'Manual Testing, Test Cases, SQL basics, Bug Tracking, JIRA',
 'Selenium basics, Postman API testing, Core Java', 3, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA');


-- 2. LearnSphere Edutech (Edtech)
INSERT INTO users (name, email, password, phone_number, address, role_id, is_active, created_at, updated_at)
VALUES ('LearnSphere Talent', 'talent@learnsphere.io', '$2a$10$YAEaF8SYeSJYPxTRu1WHyOwpzw0wvIpzrsHV/GcZnyWZdlfRZ7NVC', '9876500002', 'Hyderabad, Telangana', 3, 1, NOW(), NOW());
SET @c2_id = LAST_INSERT_ID();

INSERT INTO companies (id, company_name, website, industry, company_size, founded_year, company_description, is_approved)
VALUES (@c2_id, 'LearnSphere Edutech', 'https://learnsphere.io', 'Edtech', '25-50 employees', '2021', 'AI-assisted interactive learning and skill assessment portal for universities.', 1);

INSERT INTO jobs (company_id, job_title, package_offered, salary_lpa, location, work_mode, employment_type, department, experience_requirement, minimum_qualification, minimum_cgpa, last_date_to_apply, job_description, responsibilities, required_skills, preferred_skills, vacancies, is_active, created_at, eligibility_criteria)
VALUES 
(@c2_id, 'Frontend Developer (Fresher)', '4.5 LPA', 5, 'Hyderabad', 'Hybrid', 'Full Time', 'Frontend Engineering', 'Fresher (0-1 Years)', 'B.Tech / B.E / MCA / BCA', 6.0, '2026-10-28 23:59:59',
 'LearnSphere seeks a creative Frontend Developer to craft engaging, responsive user interfaces for student and tutor portals. Freshers with strong web fundamentals are welcome.',
 'Build responsive React components matching Figma wireframes; Connect UI components with backend REST APIs; Optimize page load speeds across desktop and mobile.',
 'HTML5, CSS3, JavaScript, React basics, Git',
 'Tailwind CSS, Responsive Web Design, REST API integration', 5, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA'),

(@c2_id, 'Associate Customer Support Engineer', '3.6 LPA', 4, 'Remote', 'Remote', 'Full Time', 'Technical Support', 'Fresher (0-1 Years)', 'BCA / MCA / B.Tech / Any Graduate', 6.0, '2026-10-28 23:59:59',
 'Provide Tier-1 and Tier-2 technical support to educators and institutions using LearnSphere LMS platforms. Great entry-level role for tech grads with good communication.',
 'Diagnose and resolve technical tickets raised by partner schools; Write reproducible bug reports for developers; Maintain customer knowledge-base documentation.',
 'Troubleshooting, Basic SQL, Customer Communication, Problem Solving, Windows/Linux basics',
 'ITIL foundation, Ticketing tools (Zendesk/Freshdesk), Networking basics', 4, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA');


-- 3. CareSync Health Solutions (Healthtech)
INSERT INTO users (name, email, password, phone_number, address, role_id, is_active, created_at, updated_at)
VALUES ('CareSync People Team', 'hr@caresync.health', '$2a$10$YAEaF8SYeSJYPxTRu1WHyOwpzw0wvIpzrsHV/GcZnyWZdlfRZ7NVC', '9876500003', 'Chennai, Tamil Nadu', 3, 1, NOW(), NOW());
SET @c3_id = LAST_INSERT_ID();

INSERT INTO companies (id, company_name, website, industry, company_size, founded_year, company_description, is_approved)
VALUES (@c3_id, 'CareSync Health Solutions', 'https://caresync.health', 'Healthtech', '40-80 employees', '2020', 'Telemedicine and electronic health record management for clinics and hospitals.', 1);

INSERT INTO jobs (company_id, job_title, package_offered, salary_lpa, location, work_mode, employment_type, department, experience_requirement, minimum_qualification, minimum_cgpa, last_date_to_apply, job_description, responsibilities, required_skills, preferred_skills, vacancies, is_active, created_at, eligibility_criteria)
VALUES 
(@c3_id, 'Junior Full Stack Developer', '5.0 LPA', 5, 'Chennai', 'Hybrid', 'Full Time', 'Product Development', 'Fresher (0-1 Years)', 'B.Tech / B.E / MCA', 6.0, '2026-10-25 23:59:59',
 'Help build modern telehealth applications connecting doctors and patients seamlessly and securely. Freshers with enthusiasm for full-stack JavaScript will thrive here.',
 'Develop full stack web features using Node.js and React; Maintain database schemas and perform data validations; Write unit and integration tests.',
 'JavaScript, Node.js, React, MongoDB, Git',
 'Express.js, TypeScript, Docker basics', 4, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA'),

(@c3_id, 'Junior Python Developer', '4.2 LPA', 4, 'Chennai', 'On-site', 'Full Time', 'Healthcare Informatics', 'Fresher (0-1 Years)', 'B.Tech / B.E / MCA / BCA', 6.0, '2026-10-25 23:59:59',
 'CareSync is looking for an entry-level Python developer to build and maintain healthcare data pipelines and web services.',
 'Write clean, modular Python scripts to parse medical records; Build lightweight Flask web endpoints; Collaborate with clinical domain experts to validate data accuracy.',
 'Python, OOP, Flask, PostgreSQL, Git',
 'Pandas, REST APIs, JSON parsing', 3, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA');


-- 4. CloudOpsis Software (SaaS / Cloud Infrastructure)
INSERT INTO users (name, email, password, phone_number, address, role_id, is_active, created_at, updated_at)
VALUES ('CloudOpsis Recruiting', 'hiring@cloudopsis.dev', '$2a$10$YAEaF8SYeSJYPxTRu1WHyOwpzw0wvIpzrsHV/GcZnyWZdlfRZ7NVC', '9876500004', 'Pune, Maharashtra', 3, 1, NOW(), NOW());
SET @c4_id = LAST_INSERT_ID();

INSERT INTO companies (id, company_name, website, industry, company_size, founded_year, company_description, is_approved)
VALUES (@c4_id, 'CloudOpsis Software', 'https://cloudopsis.dev', 'SaaS', '20-40 employees', '2023', 'Cloud cost optimization and automated container monitoring SaaS platform.', 1);

INSERT INTO jobs (company_id, job_title, package_offered, salary_lpa, location, work_mode, employment_type, department, experience_requirement, minimum_qualification, minimum_cgpa, last_date_to_apply, job_description, responsibilities, required_skills, preferred_skills, vacancies, is_active, created_at, eligibility_criteria)
VALUES 
(@c4_id, 'Junior DevOps / Cloud Trainee', '5.2 LPA', 5, 'Pune', 'Remote', 'Full Time', 'Cloud Infrastructure', 'Fresher (0-1 Years)', 'B.Tech / B.E / MCA', 6.0, '2026-10-31 23:59:59',
 'CloudOpsis is hiring a curious Cloud Trainee eager to master Linux systems, containerization, and automated deployment pipelines in a fast-paced SaaS environment.',
 'Assist in configuring and monitoring Linux server instances; Build container images using Dockerfiles; Maintain continuous integration build runners.',
 'Linux, Bash Scripting, Docker basics, Git, Networking fundamentals',
 'AWS Cloud Practitioner, CI/CD pipelines, Kubernetes basics', 3, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA'),

(@c4_id, 'Associate Technical Documentation Specialist', '3.5 LPA', 4, 'Remote', 'Remote', 'Full Time', 'Product Engineering', 'Fresher (0-1 Years)', 'BCA / MCA / B.Tech / B.Sc / BA', 6.0, '2026-10-31 23:59:59',
 'Document our cloud tools, developer SDKs, and REST APIs to provide world-class developer onboarding. Great starting role for detail-oriented computer science graduates.',
 'Author step-by-step developer tutorials and API references; Review code changes to update developer guides; Work closely with software engineers to test documentation accuracy.',
 'Technical Writing, Markdown, Git, API Documentation, English Communication',
 'Postman collections, Swagger/OpenAPI, Basic Python', 2, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA');


-- 5. ShopKwik Commerce (E-Commerce)
INSERT INTO users (name, email, password, phone_number, address, role_id, is_active, created_at, updated_at)
VALUES ('ShopKwik Talent', 'jobs@shopkwik.in', '$2a$10$YAEaF8SYeSJYPxTRu1WHyOwpzw0wvIpzrsHV/GcZnyWZdlfRZ7NVC', '9876500005', 'Bengaluru, Karnataka', 3, 1, NOW(), NOW());
SET @c5_id = LAST_INSERT_ID();

INSERT INTO companies (id, company_name, website, industry, company_size, founded_year, company_description, is_approved)
VALUES (@c5_id, 'ShopKwik Commerce', 'https://shopkwik.in', 'E-Commerce', '50-100 employees', '2022', 'Hyperlocal quick-commerce logistics and merchant storefront platform.', 1);

INSERT INTO jobs (company_id, job_title, package_offered, salary_lpa, location, work_mode, employment_type, department, experience_requirement, minimum_qualification, minimum_cgpa, last_date_to_apply, job_description, responsibilities, required_skills, preferred_skills, vacancies, is_active, created_at, eligibility_criteria)
VALUES 
(@c5_id, 'Trainee Software Engineer', '4.5 LPA', 5, 'Bengaluru', 'On-site', 'Full Time', 'Core Platform', 'Fresher (0-1 Years)', 'B.Tech / B.E / MCA / BCA', 6.0, '2026-10-27 23:59:59',
 'Kickstart your software engineering career at ShopKwik, building high-throughput merchant and order processing systems for millions of shoppers.',
 'Implement core business logic and inventory tracking algorithms; Write and run automated unit test suites; Debug and troubleshoot application logs during peak sales events.',
 'Java, Data Structures, OOP, SQL, Git',
 'Spring Boot, REST APIs, Redis basics', 6, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA'),

(@c5_id, 'Associate Operations Analyst', '4.0 LPA', 4, 'Bengaluru', 'On-site', 'Full Time', 'Logistics & Supply Chain', 'Fresher (0-1 Years)', 'BCA / MCA / B.Tech / B.Sc / B.Com', 6.0, '2026-10-27 23:59:59',
 'Analyze daily delivery fulfillment rates, rider dispatch timelines, and merchant inventory turnarounds to streamline warehouse operations.',
 'Extract and summarize delivery telemetry data via SQL; Prepare daily operational performance reports; Identify bottleneck fulfillment hubs and suggest route improvements.',
 'Advanced Excel, SQL queries, Data Analysis, Reporting, Problem Solving',
 'Power BI, Python basics, Supply chain metrics', 4, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA');


-- 6. RouteLogix Solutions (Logistics-Tech)
INSERT INTO users (name, email, password, phone_number, address, role_id, is_active, created_at, updated_at)
VALUES ('RouteLogix HR', 'careers@routelogix.in', '$2a$10$YAEaF8SYeSJYPxTRu1WHyOwpzw0wvIpzrsHV/GcZnyWZdlfRZ7NVC', '9876500006', 'Coimbatore, Tamil Nadu', 3, 1, NOW(), NOW());
SET @c6_id = LAST_INSERT_ID();

INSERT INTO companies (id, company_name, website, industry, company_size, founded_year, company_description, is_approved)
VALUES (@c6_id, 'RouteLogix Solutions', 'https://routelogix.in', 'Logistics-Tech', '35-70 employees', '2021', 'Intelligent freight dispatching, route optimization and fleet telematics.', 1);

INSERT INTO jobs (company_id, job_title, package_offered, salary_lpa, location, work_mode, employment_type, department, experience_requirement, minimum_qualification, minimum_cgpa, last_date_to_apply, job_description, responsibilities, required_skills, preferred_skills, vacancies, is_active, created_at, eligibility_criteria)
VALUES 
(@c6_id, 'Junior Mobile App Developer (Flutter / Android)', '4.2 LPA', 4, 'Coimbatore', 'Hybrid', 'Full Time', 'Mobile Engineering', 'Fresher (0-1 Years)', 'B.Tech / B.E / MCA / BCA', 6.0, '2026-10-29 23:59:59',
 'Build robust and intuitive mobile apps used by truck drivers and warehouse managers across India. Exciting opportunity for freshers interested in cross-platform mobile apps.',
 'Create responsive mobile UI screens using Flutter; Integrate location services and real-time GPS tracking; Test app compatibility across various Android device form factors.',
 'Dart, Flutter basics, Java/Kotlin basics, REST API integration, Git',
 'Google Maps API, SQLite/Room, State management (Bloc/Provider)', 3, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA'),

(@c6_id, 'Junior System Administrator / IT Support', '3.5 LPA', 4, 'Coimbatore', 'On-site', 'Full Time', 'IT Infrastructure', 'Fresher (0-1 Years)', 'BCA / B.Sc CS / B.Tech / Diploma in IT', 6.0, '2026-10-29 23:59:59',
 'Ensure smooth IT operations across our regional logistics hubs and headquarters. Hands-on learning with corporate networking and system setups.',
 'Install and configure operating systems and company software; Troubleshoot LAN, Wi-Fi, and VPN connection issues; Maintain IT asset inventory and security access controls.',
 'Windows Server, Linux basics, Networking (TCP/IP, DNS), Hardware Troubleshooting, Active Directory',
 'Firewall configuration, Backup management, Shell scripting', 2, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA');


-- 7. EcoVolt CleanTech (CleanTech & IoT)
INSERT INTO users (name, email, password, phone_number, address, role_id, is_active, created_at, updated_at)
VALUES ('EcoVolt HR', 'talent@ecovolt.energy', '$2a$10$YAEaF8SYeSJYPxTRu1WHyOwpzw0wvIpzrsHV/GcZnyWZdlfRZ7NVC', '9876500007', 'Hyderabad, Telangana', 3, 1, NOW(), NOW());
SET @c7_id = LAST_INSERT_ID();

INSERT INTO companies (id, company_name, website, industry, company_size, founded_year, company_description, is_approved)
VALUES (@c7_id, 'EcoVolt CleanTech', 'https://ecovolt.energy', 'CleanTech & IoT', '25-50 employees', '2022', 'Smart EV battery swapping network telematics and energy grid management.', 1);

INSERT INTO jobs (company_id, job_title, package_offered, salary_lpa, location, work_mode, employment_type, department, experience_requirement, minimum_qualification, minimum_cgpa, last_date_to_apply, job_description, responsibilities, required_skills, preferred_skills, vacancies, is_active, created_at, eligibility_criteria)
VALUES 
(@c7_id, 'Embedded Systems / IoT Trainee', '4.8 LPA', 5, 'Hyderabad', 'On-site', 'Full Time', 'Hardware & Firmware', 'Fresher (0-1 Years)', 'B.Tech (ECE/EEE/CS) / MCA', 6.0, '2026-10-26 23:59:59',
 'Work on firmware for smart EV battery stations and real-time telemetry sensors. Perfect role for freshers passionate about hardware-software intersection.',
 'Write embedded C/C++ code for microcontroller sensors; Collect and transmit battery telematics to cloud endpoints; Test hardware-software integration on testing rigs.',
 'Embedded C, C++, Microcontrollers, IoT protocols (MQTT/HTTP), Git',
 'Arduino/ESP32, PCB basics, UART/I2C communication', 3, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA'),

(@c7_id, 'Junior Web Developer', '4.0 LPA', 4, 'Hyderabad', 'Hybrid', 'Full Time', 'Digital Products', 'Fresher (0-1 Years)', 'BCA / MCA / B.Tech', 6.0, '2026-10-26 23:59:59',
 'Build internal portals and customer dashboards displaying clean energy metrics and battery health.',
 'Create and maintain database-driven web pages; Implement form validations and responsive layouts; Fix UI defects and optimize SQL queries.',
 'HTML, CSS, JavaScript, PHP or Python, MySQL, Git',
 'Bootstrap, jQuery, REST APIs', 4, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA');


-- 8. DevFlow Automation (Developer Tools & AI)
INSERT INTO users (name, email, password, phone_number, address, role_id, is_active, created_at, updated_at)
VALUES ('DevFlow Recruiting', 'jobs@devflow.ai', '$2a$10$YAEaF8SYeSJYPxTRu1WHyOwpzw0wvIpzrsHV/GcZnyWZdlfRZ7NVC', '9876500008', 'Bengaluru, Karnataka', 3, 1, NOW(), NOW());
SET @c8_id = LAST_INSERT_ID();

INSERT INTO companies (id, company_name, website, industry, company_size, founded_year, company_description, is_approved)
VALUES (@c8_id, 'DevFlow Automation', 'https://devflow.ai', 'Developer Tools & AI', '15-35 employees', '2023', 'Automated code review pipelines and developer productivity tooling.', 1);

INSERT INTO jobs (company_id, job_title, package_offered, salary_lpa, location, work_mode, employment_type, department, experience_requirement, minimum_qualification, minimum_cgpa, last_date_to_apply, job_description, responsibilities, required_skills, preferred_skills, vacancies, is_active, created_at, eligibility_criteria)
VALUES 
(@c8_id, 'Associate Software Developer (Python & AI Tools)', '5.5 LPA', 6, 'Bengaluru', 'Hybrid', 'Full Time', 'AI Engineering', 'Fresher (0-1 Years)', 'B.Tech / B.E / MCA', 6.0, '2026-10-28 23:59:59',
 'Join DevFlow to help develop cutting-edge developer assistance bots and automated code quality tools. Great role for freshers eager to work with modern Python and AI APIs.',
 'Write modular Python services for analyzing source code; Integrate external AI model APIs for automated summary generation; Participate in architecture discussions and sprint reviews.',
 'Python, OOP, Data Structures, Git, REST APIs',
 'OpenAI/LLM APIs, FastAPI, Linux environment', 4, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA'),

(@c8_id, 'Software Development Engineer Intern-to-Full-Time', '4.5 LPA', 5, 'Bengaluru', 'On-site', 'Full Time', 'Engineering', 'Fresher (0-1 Years)', 'B.Tech / B.E / MCA / BCA', 6.0, '2026-10-28 23:59:59',
 '6-month intensive trainee internship transitioning directly into a full-time software engineer role upon successful completion. Focus on core engineering craftsmanship.',
 'Learn our engineering stack under senior mentorship; Complete end-to-end coding assignments and feature tickets; Participate in team code reviews and documentation.',
 'Java, DSA, DBMS, Problem Solving, Git',
 'Spring Boot, React basics, Unit testing', 5, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA'),

(@c8_id, 'Junior Automated Test Engineer', '4.2 LPA', 4, 'Remote', 'Remote', 'Full Time', 'Quality Engineering', 'Fresher (0-1 Years)', 'B.Tech / B.E / MCA / BCA', 6.0, '2026-10-28 23:59:59',
 'Automate browser regression testing and API validation suites for our web applications. Ideal entry role for coding enthusiasts who enjoy QA automation.',
 'Write automated test scripts in Selenium with Java/Python; Run regression test suites before major releases; Maintain test documentation and track bug resolutions.',
 'Java or Python, Selenium, TestNG/PyTest, Git, OOP',
 'CI/CD integration, Postman, API testing', 3, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA');


-- 9. DataNest Analytics (Data Analytics)
INSERT INTO users (name, email, password, phone_number, address, role_id, is_active, created_at, updated_at)
VALUES ('DataNest People Operations', 'hr@datanest.io', '$2a$10$YAEaF8SYeSJYPxTRu1WHyOwpzw0wvIpzrsHV/GcZnyWZdlfRZ7NVC', '9876500009', 'Pune, Maharashtra', 3, 1, NOW(), NOW());
SET @c9_id = LAST_INSERT_ID();

INSERT INTO companies (id, company_name, website, industry, company_size, founded_year, company_description, is_approved)
VALUES (@c9_id, 'DataNest Analytics', 'https://datanest.io', 'Data Analytics', '30-60 employees', '2022', 'Self-service business intelligence dashboards and operational analytics.', 1);

INSERT INTO jobs (company_id, job_title, package_offered, salary_lpa, location, work_mode, employment_type, department, experience_requirement, minimum_qualification, minimum_cgpa, last_date_to_apply, job_description, responsibilities, required_skills, preferred_skills, vacancies, is_active, created_at, eligibility_criteria)
VALUES 
(@c9_id, 'Associate Data Analyst', '4.6 LPA', 5, 'Pune', 'Hybrid', 'Full Time', 'Business Analytics', 'Fresher (0-1 Years)', 'B.Tech / B.E / MCA / BCA / B.Sc Stats', 6.0, '2026-10-31 23:59:59',
 'Transform complex client datasets into actionable visual insights and business intelligence dashboards. Great starting role for data-savvy freshers.',
 'Write complex SQL queries to clean and aggregate client data; Build interactive dashboards in Power BI/Tableau; Present data trends and findings to project managers.',
 'SQL, Python (Pandas), Excel, Data Visualization, Statistics basics',
 'Power BI, Tableau, Data cleaning techniques', 5, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA'),

(@c9_id, 'Junior Database / SQL Developer', '4.2 LPA', 4, 'Pune', 'On-site', 'Full Time', 'Database Operations', 'Fresher (0-1 Years)', 'BCA / MCA / B.Tech', 6.0, '2026-10-31 23:59:59',
 'DataNest is seeking an entry-level SQL developer to support our database clustering and analytics pipelines.',
 'Design relational schemas, foreign keys, and indexes; Write stored procedures, views, and migration scripts; Assist in regular database maintenance and performance tuning.',
 'SQL, MySQL/PostgreSQL, RDBMS concepts, Indexing basics, Stored Procedures',
 'Python scripting, Database backup/restore, Query optimization', 3, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA'),

(@c9_id, 'Junior Business Analyst (Fresher)', '4.4 LPA', 4, 'Pune', 'Hybrid', 'Full Time', 'Consulting & Solutions', 'Fresher (0-1 Years)', 'B.Tech / MCA / BCA / MBA', 6.0, '2026-10-31 23:59:59',
 'Bridge the gap between non-technical clients and our engineering teams by documenting clear functional specifications and workflows.',
 'Interview clients and project stakeholders to capture business requirements; Create workflow diagrams, mockups, and user stories; Assist QA team during User Acceptance Testing (UAT).',
 'Requirements Gathering, UML Diagrams, User Stories, Excel, Communication',
 'Agile/Scrum basics, JIRA, Wireframing tools (Figma/Draw.io)', 3, 1, NOW(), 'Fresher (0-1 Years), 60% / 6.0 CGPA');
