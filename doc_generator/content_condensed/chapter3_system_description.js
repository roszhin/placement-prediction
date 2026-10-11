const path = require('path');
const { p, bullet, chapterHeading, sectionHeading, subSectionHeading, figure, table, codeBlock } = require('../doc_helper');

function getChapter3() {
    const elements = [];

    elements.push(chapterHeading("3. SYSTEM DESCRIPTION"));

    elements.push(
        p("The System Description establishes the physical, infrastructural, and software environment required to engineer, deploy, and operate the Campus Placement Prediction & Skill Gap Analyzer platform. In enterprise software development, documenting runtime parameters, hardware sizing, and software dependencies guarantees seamless deployment, reproducible builds, and operational stability."),
        p("This chapter presents the workstation and server hardware parameters, the complete software technology stack based on Java 21 LTS and Spring Boot 3.3.0, and the overall 3-tier architectural design illustrated in Figure 3.1 alongside production code implementations.")
    );

    elements.push(sectionHeading("3.1 Hardware Description"));

    elements.push(subSectionHeading("3.1.1 Development and Production Hardware Specifications"));
    elements.push(
        p("The platform was developed on a multi-core engineering workstation capable of sustaining concurrent Maven compilation, local MySQL database daemons, and JVM execution. Table 3.1 details the minimum and recommended workstation specifications:"),
        p("")
    );

    const devHwHeaders = ["Hardware Component", "Minimum Requirement", "Recommended Specification", "Operational Purpose"];
    const devHwRows = [
        ["Processor (CPU)", "Intel Core i5 (8th Gen) / AMD Ryzen 5 (4 Cores, 2.5 GHz)", "Intel Core i7 / i9 (12th+ Gen) or AMD Ryzen 7 (8 Cores, 16 Threads)", "Maven compilation, JVM execution, Apache PDFBox document parsing."],
        ["System RAM", "8 GB DDR4 (2400 MHz)", "16 GB – 32 GB DDR4/DDR5 (3200+ MHz)", "Spring Boot context (2 GB heap), MySQL 8.0 daemon, developer tooling."],
        ["Storage (Disk)", "256 GB SATA SSD", "1 TB NVMe M.2 SSD (Read: 3500 MB/s, Write: 3000 MB/s)", "Rapid build artifact generation, local uploads repository, database storage."],
        ["Display Unit", "1366 x 768 Resolution", "1920 x 1080 (Full HD) Dual Display", "Responsive UI layout verification across desktop and mobile viewports."],
        ["Network Interface", "100 Mbps Ethernet / Wi-Fi 4", "Gigabit Ethernet (1 Gbps) / Wi-Fi 6", "Low-latency transmission of REST API calls to Google Gemini AI endpoints."]
    ];

    elements.push(...table(
        devHwHeaders,
        devHwRows,
        [22, 24, 26, 28],
        "Table 3.1: Development Hardware Environment Specifications"
    ));

    elements.push(
        p("For production hosting, the platform is sized to support up to 10,000 active students and 200 corporate recruiting partners across cloud virtual machines or containerized clusters. Table 3.2 outlines the production sizing:"),
        p("")
    );

    const prodHwHeaders = ["Infrastructure Tier", "Server Sizing / Capacity", "Redundancy & Failover", "Operational Role"];
    const prodHwRows = [
        ["Application Tier", "4 vCPU, 8 GB RAM, 50 GB SSD", "Clustered load balancing; active health probes", "Executes Spring Boot 3.3.0 standalone JAR, embedded Tomcat."],
        ["Database Tier", "4 vCPU, 16 GB RAM, 200 GB NVMe SSD", "Automated daily binary snapshots, replication ready", "Hosts MySQL 8.0 RDBMS, InnoDB buffer pool, dual LONGBLOB storage."],
        ["File Storage Tier", "Local NVMe block storage / AWS S3", "RAID-1 / Multi-region geographical replication", "Mirrors uploads/resumes/ and profile pictures on disk."],
        ["Network Uplink", "Dedicated 100 Mbps burst to 1 Gbps", "Dual multihomed ISP routing, DDoS mitigation", "Handles concurrent multipart PDF uploads (max 10MB) and AI streams."]
    ];

    elements.push(...table(
        prodHwHeaders,
        prodHwRows,
        [22, 26, 26, 26],
        "Table 3.2: Production Server Infrastructure Specifications"
    ));

    elements.push(sectionHeading("3.2 Software Description"));

    elements.push(subSectionHeading("3.2.1 Operating System and Enterprise Software Ecosystem"));
    elements.push(
        p("The platform is inherently cross-platform under the OpenJDK 21 64-Bit Server VM. Development was executed on Windows 11 Enterprise (64-bit), while production deployments target Ubuntu Server 22.04 LTS."),
        p("The technology stack leverages modern enterprise libraries: Spring Boot 3.3.0 provides dependency management and embedded Tomcat 10.1; Spring Security 6 enforces role-based access control; Spring Data JPA and Hibernate 6 manage relational persistence; Apache PDFBox 3.0.2 extracts resume text; and Google Gemini 1.5 Flash provides generative AI evaluation. Table 3.3 summarizes the complete software environment:"),
        p("")
    );

    const swHeaders = ["Software Component", "Product / Framework", "Version", "Operational Role & Configuration"];
    const swRows = [
        ["Operating System", "Windows 11 / Ubuntu Server", "64-bit (22.04 LTS)", "Host operating system for development and production hosting."],
        ["Runtime Environment", "OpenJDK (Java SE)", "21 LTS", "Core virtual machine; virtual threads and sequenced collections."],
        ["Enterprise Framework", "Spring Boot", "3.3.0", "Application runtime, dependency injection, embedded Tomcat 10.1."],
        ["Security Framework", "Spring Security", "6.3.0", "Authentication filter chain, BCrypt hashing, role-based authorization."],
        ["Persistence Framework", "Spring Data JPA / Hibernate", "6.5.x", "Object-relational mapping, pooled HikariCP connections."],
        ["Relational Database", "MySQL Community Server", "8.0.x", "Relational persistence, InnoDB engine, LONGBLOB document storage."],
        ["PDF Extraction Tool", "Apache PDFBox", "3.0.2", "Server-side text parsing, magic-byte inspection, font validation."],
        ["Generative AI Engine", "Google Gemini 1.5 Flash", "v1beta", "Multimodal / text-based ATS resume scoring & skill gap analysis."],
        ["Reactive HTTP Client", "Spring WebFlux (WebClient)", "6.1.x", "Non-blocking HTTP calls to Gemini API with 15s timeout."],
        ["Template Engine", "Thymeleaf", "3.1.2", "Server-side HTML5 rendering, Spring Security dialect integration."],
        ["Frontend UI Toolkit", "Bootstrap & Chart.js", "5.3.0 / 4.4", "Responsive SaaS layouts, interactive analytical placement charts."],
        ["Build Tool", "Apache Maven", "3.9.x", "Dependency management, compile lifecycle, executable JAR packaging."]
    ];

    elements.push(...table(
        swHeaders,
        swRows,
        [22, 26, 16, 36],
        "Table 3.3: Software Environment and Technology Stack Components"
    ));

    elements.push(sectionHeading("3.3 Project Architecture and Implementation"));

    elements.push(subSectionHeading("3.3.1 3-Tier MVC Architecture with Generative AI Integration"));
    elements.push(
        p("The platform is structured on a robust 3-Tier Model-View-Controller (MVC) enterprise architecture, divided into distinct operational tiers:"),
        bullet("Presentation Tier: Client browsers render responsive HTML5, Bootstrap 5.3, custom dark-mode CSS, and Chart.js graphics served dynamically via Thymeleaf.", "• Presentation Tier:"),
        bullet("Application & Service Tier: Spring MVC controllers intercept incoming requests, enforce Spring Security 6 role authorization, and delegate business workflows to specialized service beans (`StudentService`, `AIService`, `ApplicationService`, `FileUploadService`).", "• Application Tier:"),
        bullet("Data & External Tier: Spring Data JPA repositories communicate with MySQL 8.0 via Hibernate ORM, while reactive WebClient pipelines manage communication with Google Gemini 1.5 Flash.", "• Data & Integration Tier:"),
        p("Figure 3.1 illustrates the end-to-end system architecture and data pipelines:"),
        p("")
    );

    const archImgPath = path.join(__dirname, '..', 'diagrams', 'architecture_diagram.png');
    elements.push(...figure(
        archImgPath,
        "Figure 3.1: System Architectural Design (3-Tier MVC Architecture with AI Integration)",
        480,
        240
    ));

    elements.push(subSectionHeading("3.3.2 Dual-Redundancy Resume Storage Architecture"));
    elements.push(
        p("To eliminate document loss and path desynchronization during server migrations, the platform implements a Dual-Redundancy Storage Architecture in `StudentService.java`:"),
        bullet("Primary Relational BLOB: The raw file bytes are stored directly inside the `resumes` table in a `LONGBLOB` column (`file_data`), guaranteeing that database backups inherently preserve all student resumes.", "1. Database BLOB:"),
        bullet("Secondary Disk Mirror: Simultaneously, the file is saved to the local directory `uploads/resumes/` using a sanitized filename with UUID prefix, recorded in `file_path`.", "2. Filesystem Mirror:"),
        bullet("Failover Retrieval: When an application or recruiter requests a resume, `StudentService.getResumeFileBytes()` first checks the database `file_data` BLOB; if empty, it instantly reads the mirrored file from the disk path.", "3. Failover Retrieval:")
    );

    elements.push(subSectionHeading("3.3.3 Production Java Source Code Implementation"));
    elements.push(
        p("The following verified code listings illustrate the genuine implementation of the Spring Security 6 filter chain and the reactive Gemini AI evaluation pipeline:"),
        p("")
    );

    const secCode = [
        "@Configuration",
        "@EnableWebSecurity",
        "public class SecurityConfig {",
        "    @Bean",
        "    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {",
        "        http.authorizeHttpRequests(auth -> auth",
        "            .requestMatchers(\"/\", \"/login\", \"/register\", \"/verify-otp\", \"/css/**\", \"/js/**\").permitAll()",
        "            .requestMatchers(\"/student/**\").hasRole(\"STUDENT\")",
        "            .requestMatchers(\"/company/**\").hasRole(\"COMPANY\")",
        "            .requestMatchers(\"/faculty/**\").hasRole(\"FACULTY\")",
        "            .requestMatchers(\"/admin/**\").hasRole(\"ADMIN\")",
        "            .anyRequest().authenticated()",
        "        )",
        "        .formLogin(form -> form.loginPage(\"/login\").successHandler(customSuccessHandler()))",
        "        .logout(logout -> logout.logoutUrl(\"/logout\").logoutSuccessUrl(\"/login?logout\"));",
        "        return http.build();",
        "    }",
        "}"
    ];
    elements.push(...codeBlock(secCode, "Listing 3.1: Spring Security 6 Modular Role-Based Filter Chain (SecurityConfig.java)"));

    const aiCode = [
        "@Service",
        "public class AIService {",
        "    private final WebClient webClient;",
        "    @Value(\"${ai.api.key}\") private String apiKey;",
        "    @Value(\"${ai.api.url}\") private String apiUrl;",
        "",
        "    public ResumeAnalysisDTO analyzeProfileAgainstJob(Student student, Job job) {",
        "        Resume resume = studentService.getActiveResumeForStudent(student).orElse(null);",
        "        byte[] resumeBytes = studentService.getResumeFileBytes(resume);",
        "        Map<String, Object> requestBody = buildGeminiPayload(resume, resumeBytes, job);",
        "        try {",
        "            String response = webClient.post().uri(apiUrl + \"?key=\" + apiKey)",
        "                .contentType(MediaType.APPLICATION_JSON)",
        "                .bodyValue(requestBody)",
        "                .retrieve().bodyToMono(String.class)",
        "                .timeout(Duration.ofSeconds(15))",
        "                .block();",
        "            return parseGeminiResponse(response);",
        "        } catch (Exception ex) {",
        "            logger.error(\"AI API execution failed, returning fallback heuristics\", ex);",
        "            return buildFallbackResult(student, job);",
        "        }",
        "    }",
        "}"
    ];
    elements.push(...codeBlock(aiCode, "Listing 3.2: Reactive Gemini 1.5 Flash Orchestration with Fallback (AIService.java)"));

    return elements;
}

module.exports = { getChapter3 };
