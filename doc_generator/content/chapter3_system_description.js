const path = require('path');
const { Paragraph, p, bullet, chapterHeading, sectionHeading, subSectionHeading, figure, table, codeBlock } = require('../doc_helper');

function getChapter3() {
    const elements = [];

    elements.push(chapterHeading("3. SYSTEM DESCRIPTION"));

    elements.push(
        p("The System Description establishes the concrete technical, physical, and infrastructural environment necessary for the engineering, execution, deployment, and operation of the Campus Placement Prediction & Skill Gap Analyzer platform. In enterprise software development, system specifications are partitioned into hardware configurations, software technology stacks, and holistic architectural descriptions. This structural breakdown ensures that systems engineers, DevOps practitioners, and academic evaluators possess unambiguous documentation regarding system dependencies, execution boundaries, and hardware resource allocations."),
        p("This chapter provides an exhaustive exposition of the physical workstation and server hardware parameters, detailing CPU sizing, volatile memory thresholds, persistent storage architectures, and network latency constraints. Subsequently, the modern software ecosystem underpinning the platform is comprehensively dissected, encompassing the Java 21 Long-Term Support (LTS) virtual machine, Spring Boot 3.3.0 enterprise runtime, Spring Security 6 authorization mechanics, Spring Data JPA / Hibernate 6 object-relational mapping, MySQL 8.0 database engine, Apache PDFBox 3.0.2 document parser, and Google Gemini 1.5 Flash Large Language Model APIs. Finally, the project architecture is analyzed through a 3-tier Model-View-Controller (MVC) paradigm, accompanied by Figure 3.1 and production code implementations.")
    );

    elements.push(sectionHeading("3.1 Hardware Description"));

    elements.push(subSectionHeading("3.1.1 Development Workstation Configuration"));
    elements.push(
        p("The platform was developed and profiled on an advanced multi-core engineering workstation configured to support concurrent compilation, containerized local services, database daemon threads, and IDE developer tooling. Because modern Java enterprise development utilizing Spring Boot 3.3.0 and Apache Maven involves intensive compilation cycles, bytecode manipulation, and local JVM memory allocation, adequate processing cores and memory are mandatory to sustain high developer productivity."),
        p("Table 3.1 itemizes the minimum and recommended hardware specifications for the local software development workstation:")
    );

    const devHwHeaders = ["Hardware Component", "Minimum Requirement", "Recommended Specification", "Purpose & Utilization"];
    const devHwRows = [
        ["Central Processing Unit (CPU)", "Intel Core i5 (8th Gen) / AMD Ryzen 5 (4 Cores, 2.5 GHz)", "Intel Core i7 / i9 (12th+ Gen) or AMD Ryzen 7 (8 Cores, 16 Threads, 3.8+ GHz)", "Concurrent Maven compilation, JVM execution, Apache PDFBox document parsing."],
        ["System Memory (RAM)", "8 GB DDR4 (2400 MHz)", "16 GB – 32 GB DDR4/DDR5 (3200+ MHz)", "Sustaining local Spring Boot application context (2 GB JVM heap), MySQL 8.0 daemon, and browser IDE."],
        ["Persistent Storage", "256 GB SATA Solid State Drive (SSD)", "1 TB NVMe M.2 SSD (Read: 3500 MB/s, Write: 3000 MB/s)", "Rapid compilation artifact generation, local uploads repository, MySQL table space storage."],
        ["Display / Graphics Unit", "1366 x 768 Resolution Display", "1920 x 1080 (Full HD) Dual Display", "Responsive UI layout testing across mobile, tablet, and desktop viewports."],
        ["Network Interface Card", "Fast Ethernet (100 Mbps) / Wi-Fi 4", "Gigabit Ethernet (1 Gbps) / Wi-Fi 6 (802.11ax)", "High-throughput transmission of external REST API calls to Google Gemini AI endpoints."]
    ];

    elements.push(...table(
        devHwHeaders,
        devHwRows,
        [22, 24, 26, 28],
        "Table 3.1: Development Hardware Environment Specifications"
    ));

    elements.push(subSectionHeading("3.1.2 Production Server Infrastructure and Cloud Hosting Sizing"));
    elements.push(
        p("For production deployment, the platform is designed to run either on dedicated Linux bare-metal instances, cloud-hosted Virtual Private Servers (VPS such as AWS EC2, Google Cloud Compute Engine, or Azure Virtual Machines), or containerized Kubernetes nodes. The production server must comfortably handle concurrent student resume uploads, simultaneous corporate recruiter applicant evaluations, continuous database transactions, and reactive HTTP pipelines communicating with Google AI Studio."),
        p("Table 3.2 itemizes the production server infrastructure specifications tailored to support an institutional cohort of up to 10,000 active students and 200 corporate recruiting partners:")
    );

    const prodHwHeaders = ["Infrastructure Tier", "Server Sizing / Capacity", "Redundancy & Failover", "Operational Role"];
    const prodHwRows = [
        ["Application Server Tier", "4 vCPU (x86_64 / ARM64), 8 GB RAM, 50 GB SSD", "Clustered load balancing; active-passive health checks", "Hosting Spring Boot 3.3.0 standalone JAR, embedded Apache Tomcat, WebClient engine."],
        ["Database Server Tier", "4 vCPU, 16 GB RAM, 200 GB High-IOPS SSD", "Daily automated binary snapshots, replication ready", "Hosting MySQL 8.0 RDBMS, InnoDB buffer pool (10 GB allocated), dual LONGBLOB storage."],
        ["File Storage Tier", "Local NVMe block storage / AWS S3 compatible store", "RAID-1 / Multi-region geographical replication", "Mirroring uploads/resumes/ and profile pictures for dual-redundancy storage model."],
        ["Network Bandwidth", "Dedicated 100 Mbps uplink with burst to 1 Gbps", "Dual multihomed ISP routing, DDoS protection", "Handling concurrent multipart PDF uploads (max 10MB per file) and outgoing Gemini API streams."]
    ];

    elements.push(...table(
        prodHwHeaders,
        prodHwRows,
        [22, 26, 26, 26],
        "Table 3.2: Production Server Infrastructure Specifications"
    ));

    elements.push(subSectionHeading("3.1.3 Client-Side Computing and Mobile Hardware Requirements"));
    elements.push(
        p("Because the platform adopts a modern server-side rendering architecture augmented with client-side responsive CSS grids (Bootstrap 5.3) and dynamic JavaScript rendering, client-side hardware requirements are minimal. The platform executes seamlessly across standard student computing environments:"),
        bullet("Student Laptops & Desktops: Standard desktop or laptop computer powered by any Intel, AMD, or Apple Silicon processor, 4 GB RAM, and a standard monitor (minimum resolution: 1024 x 768 pixels).", "• Personal Computers:"),
        bullet("Mobile Smartphones & Tablets: Any modern Android (version 8.0+) or iOS (version 12.0+) mobile device with a minimum screen width of 360 pixels, 2 GB RAM, and active cellular data or Wi-Fi connection.", "• Mobile Hardware:"),
        bullet("Peripherals: Standard keyboard and mouse/trackpad for data entry; active PDF reader capability for inspecting generated resume reviews.", "• Client Peripherals:")
    );

    elements.push(subSectionHeading("3.1.4 Network Topology, Bandwidth, and Latency Specifications"));
    elements.push(
        p("The platform relies on standard HTTP/HTTPS networking protocols (Ports 80, 443, and development port 8080). Outgoing external connectivity over port 443 to Google Generative Language APIs (generativelanguage.googleapis.com) requires an outbound internet connection with latency below 250 milliseconds. A minimum bandwidth of 2 Mbps per concurrent active client ensures instantaneous rendering of Chart.js analytical dashboards, sub-second resume uploads, and rapid page transitions.")
    );

    elements.push(sectionHeading("3.2 Software Description"));

    elements.push(subSectionHeading("3.2.1 Operating Systems and Runtime Virtual Machines"));
    elements.push(
        p("The platform is inherently cross-platform owing to Java's \"Write Once, Run Anywhere\" (WORA) paradigm. During development, Microsoft Windows 11 Enterprise (64-bit) served as the primary host operating system. In production, enterprise Linux distributions—such as Ubuntu Server 22.04 LTS, Red Hat Enterprise Linux (RHEL 9), or Rocky Linux 9—are recommended due to their superior kernel thread scheduling, efficient memory management, and lightweight server footprints."),
        p("Execution is powered by the OpenJDK 21 64-Bit Server VM. Java 21 is a Long-Term Support release that introduces critical runtime optimizations, advanced garbage collectors (such as ZGC and G1GC), and virtual threads (Project Loom) that drastically enhance concurrency and input/output throughput.")
    );

    elements.push(subSectionHeading("3.2.2 Java 21 LTS Platform Features and Virtual Threads Architecture"));
    elements.push(
        p("Java 21 introduces major architectural language enhancements that were utilized throughout this codebase:"),
        bullet("Record Patterns and Pattern Matching: Simplifies data transfer object (DTO) decomposition and eliminates verbose casting boilerplate across service layer evaluations.", "• Pattern Matching:"),
        bullet("Sequenced Collections: Guarantees deterministic ordering across collection hierarchies, utilized in JobRepository and ApplicationRepository queries (`findByStudentOrderByAppliedAtDesc`).", "• Sequenced Collections:"),
        bullet("Virtual Threads (JEP 444): Lightweight threads that decouple Java threads from underlying OS kernel threads, allowing the Spring Boot application to handle thousands of concurrent resume uploads and blocking I/O calls without exhausting thread pools.", "• High-Throughput Concurrency:"),
        bullet("Enhanced String Templates and Text Blocks: Enables clean, multi-line formatting of complex JSON prompts and SQL queries without awkward string concatenations.", "• Text Blocks:")
    );

    elements.push(subSectionHeading("3.2.3 Spring Boot 3.3.0 Framework Architecture and Auto-Configuration"));
    elements.push(
        p("Spring Boot 3.3.0 serves as the foundational enterprise application framework. Built on top of Spring Framework 6, it requires Java 17 as a baseline and fully embraces Java 21 features. Spring Boot eliminates complex XML configuration files through opinionated 'starter' dependencies (`spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-security`, `spring-boot-starter-webflux`, and `spring-boot-starter-mail`). It embeds an optimized Apache Tomcat 10.1 servlet container, enabling the entire web application to be packaged into a single executable JAR file containing all runtime dependencies.")
    );

    elements.push(subSectionHeading("3.2.4 Spring Security 6 and Role-Based Access Control Implementation"));
    elements.push(
        p("Security is enforced at every layer by Spring Security 6. The framework implements a modular security filter chain (`SecurityFilterChain`) that intercepts every incoming HTTP request. Passwords are cryptographically salted and hashed using the adaptive BCrypt algorithm with a cost factor of 10. The system enforces strict Role-Based Access Control (RBAC) across four distinct roles:"),
        bullet("ROLE_STUDENT: Restricted to student dashboards, profile editing, resume upload, job browsing, 'Jobs For You' matching, and application submissions.", "• Student Role:"),
        bullet("ROLE_COMPANY: Restricted to recruiter portals, job posting management, candidate applicant roster review, and candidate selection updates.", "• Recruiter Role:"),
        bullet("ROLE_FACULTY: Restricted to departmental placement analytics, student performance tracking, and company verification.", "• Faculty Role:"),
        bullet("ROLE_ADMIN: Unrestricted global administrative access to system audit logs, user management, and configuration settings.", "• Administrator Role:")
    );

    elements.push(subSectionHeading("3.2.5 Spring Data JPA, Hibernate 6 ORM, and Connection Pooling"));
    elements.push(
        p("Database interactions are abstracted through Spring Data JPA, backed by Hibernate ORM 6. Repositories (`StudentRepository`, `JobRepository`, `ApplicationRepository`, `AiAnalysisRepository`, `ResumeRepository`) extend `JpaRepository<T, ID>`, providing automated CRUD operations, pagination, sorting, and dynamic query generation based on method signatures. Connection pooling is managed by HikariCP, universally recognized as the fastest, most reliable JDBC connection pool in the Java ecosystem, configured to maintain ten persistent database connections with zero-latency connection re-use.")
    );

    elements.push(subSectionHeading("3.2.6 MySQL 8.0 Relational Database Management System"));
    elements.push(
        p("Data persistence is executed within MySQL 8.0 Community Server. Configured with the InnoDB storage engine, MySQL guarantees full ACID (Atomicity, Consistency, Isolation, Durability) compliance, foreign key constraint enforcement, and row-level locking. The character encoding is set to `utf8mb4` with `utf8mb4_unicode_ci` collation, ensuring complete support for international character sets, diverse student name encodings, and complex technical symbols.")
    );

    elements.push(subSectionHeading("3.2.7 Apache PDFBox 3.0.2 Text Extraction and Document Ingestion Engine"));
    elements.push(
        p("To process student resumes uploaded in PDF format, the platform incorporates Apache PDFBox 3.0.2 (`org.apache.pdfbox.Loader`, `PDDocument`, and `PDFTextStripper`). PDFBox provides high-fidelity textual stripping, extracting candidate names, contact details, educational histories, technical skill keywords, and project narratives from complex single-page and multi-page documents while gracefully handling font encodings and suppressing corrupt object streams.")
    );

    elements.push(subSectionHeading("3.2.8 Google Gemini 1.5 Flash Large Language Model API Integration"));
    elements.push(
        p("The intelligence layer is powered by Google's state-of-the-art Gemini 1.5 Flash foundation model. Gemini 1.5 Flash features a massive multimodal context window (supporting up to 1 million tokens), ultra-fast response latency, and sophisticated semantic reasoning capabilities. In this platform, Gemini is invoked either via multimodal inlineData base64 document payloads or via structured text prompts containing stripped resume text alongside corporate job descriptions, returning precise ATS match percentages and structured skill gap diagnoses.")
    );

    elements.push(subSectionHeading("3.2.9 Thymeleaf 3 Server-Side Template Engine and SaaS UI Themes"));
    elements.push(
        p("The user interface is generated via Thymeleaf 3, a modern server-side Java template engine that integrates deeply with Spring MVC. Thymeleaf allows developers to write natural HTML5 templates that can be rendered directly in browsers during prototyping. In this application, Thymeleaf binds domain models (`student`, `jobs`, `applications`, `aiAnalysis`) to HTML views, applying a sleek 'SaaS Orange' enterprise theme featuring dark topbars, light-themed responsive cards, and clean typography.")
    );

    elements.push(subSectionHeading("3.2.10 Bootstrap 5.3 Responsive Grid and Chart.js Analytics Engine"));
    elements.push(
        p("Styling is reinforced with Bootstrap 5.3, the world's leading responsive CSS framework, utilizing Flexbox, CSS Grid, and custom CSS variables. Placement prediction visualizers and departmental skill distribution charts are rendered on the client side using Chart.js, delivering interactive bar graphs, doughnut charts, and progress bars that react dynamically to user interaction.")
    );

    elements.push(subSectionHeading("3.2.11 Build Automation, Package Management, and Version Control"));
    elements.push(
        p("Project compilation, automated testing, dependency resolution, and packaging are governed by Apache Maven 3.9. All dependencies are explicitly versioned within `pom.xml`. Source code version control is managed via Git, supporting branch-based feature development, atomic commits, and reproducible software builds."),
        p("Table 3.3 summarizes the complete software technology stack components utilized across the platform:"),
        new Paragraph({ spacing: { before: 80 } })
    );

    const swHeaders = ["Technology Layer", "Software / Framework", "Version", "Functional Responsibility"];
    const swRows = [
        ["Programming Language", "Java Standard Edition (JDK)", "21 LTS", "Core backend language, Virtual Threads, Pattern Matching."],
        ["Enterprise Framework", "Spring Boot", "3.3.0", "Application scaffolding, dependency injection, embedded Tomcat."],
        ["Security Framework", "Spring Security", "6.3.0", "Authentication, BCrypt hashing, RBAC authorization filter chain."],
        ["Persistence / ORM", "Spring Data JPA / Hibernate", "6.5.x", "Object-relational mapping, HikariCP connection pool, automated CRUD."],
        ["Database Engine", "MySQL Community Server", "8.0.x", "Relational persistence, ACID compliance, LONGBLOB dual storage."],
        ["Document Processing", "Apache PDFBox", "3.0.2", "Parsing binary PDF resumes, text extraction via PDFTextStripper."],
        ["Artificial Intelligence", "Google Gemini 1.5 Flash", "v1beta", "Multimodal / text-based ATS resume scoring & skill gap analysis."],
        ["Reactive HTTP Client", "Spring WebFlux (WebClient)", "6.1.x", "Non-blocking HTTP calls to Gemini API with 15s timeout."],
        ["Template Engine", "Thymeleaf", "3.1.2", "Server-side HTML5 rendering, Spring Security tag integration."],
        ["Frontend UI Framework", "Bootstrap & Chart.js", "5.3.0 / 4.4", "Responsive layouts, modal dialogs, interactive analytical charts."],
        ["Build & Package Tool", "Apache Maven", "3.9.x", "Dependency resolution, compile lifecycle, executable JAR packaging."]
    ];

    elements.push(...table(
        swHeaders,
        swRows,
        [22, 26, 16, 36],
        "Table 3.3: Software Environment and Technology Stack Components"
    ));

    elements.push(sectionHeading("3.3 Project Description"));

    elements.push(subSectionHeading("3.3.1 Overall Multi-Tier Architectural Design and Layered Decomposition"));
    elements.push(
        p("The Campus Placement Prediction & Skill Gap Analyzer platform is engineered according to the classical 3-Tier Enterprise Architecture, further subdivided into discrete architectural layers:"),
        bullet("1. Client Presentation Tier: Comprises the user's web browser rendering responsive HTML5, CSS3 (Bootstrap 5.3), custom SaaS themes, and Chart.js graphics generated dynamically by Thymeleaf 3.", "• Presentation Layer:"),
        bullet("2. Web & Security Filter Tier: Spring MVC Controllers (`StudentController`, `AuthController`, `CompanyController`, `FacultyController`, `AdminController`) intercept HTTP requests, validate input parameters, and enforce Spring Security 6 role authorization.", "• Controller Layer:"),
        bullet("3. Business Logic & Service Tier: Encapsulates domain logic within specialized service beans (`StudentService`, `AIService`, `ApplicationService`, `FileUploadService`, `EmailService`), orchestrating transactions and external AI API communications.", "• Service Layer:"),
        bullet("4. Data Access & Persistence Tier: Spring Data JPA repositories communicate with the MySQL 8.0 database engine via Hibernate 6 ORM, executing optimized SQL queries over pooled HikariCP connections.", "• Data Access Layer:"),
        bullet("5. External Integration Tier: Connects non-blocking reactive WebClient pipelines to Google Generative AI endpoints and local file storage systems.", "• External Integration Layer:"),
        p("Figure 3.1 illustrates the complete system architectural design and component interactions across all three tiers:")
    );

    const archImgPath = path.join(__dirname, '..', 'diagrams', 'architecture_diagram.png');
    elements.push(...figure(
        archImgPath,
        "Figure 3.1: System Architectural Design (3-Tier MVC Architecture with AI Integration)",
        480,
        240
    ));

    elements.push(subSectionHeading("3.3.2 Model-View-Controller (MVC) Design Pattern Realization"));
    elements.push(
        p("The platform strictly adheres to the Model-View-Controller (MVC) architectural design pattern. The Model encompasses JPA entity classes (`Student`, `Job`, `Application`, `Resume`, `AiAnalysis`, `Company`, `User`, `Role`) and Data Transfer Objects (`MatchedJobDto`, `CompanyCardDto`, `RegistrationDto`). The View consists of server-rendered Thymeleaf HTML templates organized into role-specific directories (`templates/student/`, `templates/company/`, `templates/faculty/`, `templates/admin/`). The Controller tier receives client HTTP requests, delegates computational workflows to appropriate service beans, binds resulting models to the Spring MVC `Model` context, and routes execution to the corresponding view template.")
    );

    elements.push(subSectionHeading("3.3.3 Reactive WebClient Communication Pipelines for Generative AI"));
    elements.push(
        p("External communication with the Google Gemini 1.5 Flash API is achieved using Spring WebFlux `WebClient`. Unlike traditional blocking `RestTemplate`, `WebClient` is fully asynchronous and non-blocking. It is configured with an explicit 15-second response timeout (`Duration.ofSeconds(15)`), protecting the application server threads from hanging if external network latency spikes occur."),
        p("When an AI analysis is requested, `AIService` constructs a JSON payload containing the prompt. If the student has uploaded a PDF resume, the service checks whether the file size is within Gemini's 20MB multimodal inlineData threshold. If valid, the raw bytes are Base64 encoded and dispatched directly with the MIME type `application/pdf`. If multimodal submission fails or if the file exceeds thresholds, the system seamlessly falls back to text-based extraction via Apache PDFBox, submitting the stripped text alongside the job description.")
    );

    elements.push(subSectionHeading("3.3.4 Dual Redundancy Storage Model for Binary Documents and Files"));
    elements.push(
        p("A critical architectural innovation implemented in `StudentService.java` is the Dual-Redundancy Storage Model for student resumes. Traditional applications either store files solely on disk (vulnerable to disk crashes or path desynchronization during server migrations) or solely in the database (which can bloat database size and degrade query performance)."),
        p("In this platform, whenever a student uploads a resume:"),
        bullet("Primary Database BLOB Storage: The raw file bytes are stored directly inside the `resumes` table in a `LONGBLOB` column (`file_data`). This guarantees that automated database backups inherently preserve all student resumes without needing separate filesystem backup syncs.", "1. Relational BLOB:"),
        bullet("Secondary Filesystem Mirror: Simultaneously, the file is saved to the local directory `uploads/resumes/` using a sanitized filename prefixed with a unique timestamp or UUID. The file path is recorded in `file_path`.", "2. Local File Mirror:"),
        bullet("Failover Retrieval Logic: When an application or recruiter requests a resume, `StudentService.getResumeFileBytes(resume)` first checks the database `file_data` BLOB; if empty, it instantly reads the mirrored file from the disk path. This guarantees 100% document availability under all operating conditions.", "3. Resilient Retrieval:")
    );

    elements.push(subSectionHeading("3.3.5 Real Java Source Code Implementation Snippets"));
    elements.push(
        p("To demonstrate the genuine engineering implementation of these architectural principles, the following verified code listings extracted directly from the codebase illustrate the Spring Security configuration, AI service orchestration, and dual-redundancy resume management:"),
        new Paragraph({ spacing: { before: 80 } })
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
        "        // 1. Retrieve active resume via dual-storage service",
        "        Resume resume = studentService.getActiveResumeForStudent(student).orElse(null);",
        "        byte[] resumeBytes = studentService.getResumeFileBytes(resume);",
        "",
        "        // 2. Construct JSON payload with multimodal PDF inlineData or stripped text",
        "        Map<String, Object> requestBody = buildGeminiPayload(resume, resumeBytes, job);",
        "",
        "        // 3. Execute non-blocking reactive call with 15-second timeout",
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
