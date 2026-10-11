const { p, bullet, chapterHeading, sectionHeading, subSectionHeading, table } = require('../doc_helper');

function getChapter9() {
    const elements = [];

    elements.push(chapterHeading("9. FUTURE ENHANCEMENT"));

    elements.push(
        p("Software engineering is an evolutionary discipline where robust systems serve as foundations for continuous capability expansion. As corporate recruitment integrates autonomous AI screening, multimodal interviews, and decentralized credentialing, placement platforms must evolve proactively to maintain cutting-edge technological readiness."),
        p("This chapter outlines the strategic roadmap for future platform expansion across emerging placement paradigms, five transformative functional capabilities, four architectural upgrades, and a phased 12-month implementation schedule.")
    );

    elements.push(sectionHeading("9.1 Emerging Trends in Recruitment AI"));

    elements.push(subSectionHeading("9.1.1 Evolution of Corporate Hiring Paradigms"));
    elements.push(
        p("Corporate talent acquisition is shifting rapidly toward skills-first hiring, where demonstrated programming competency and verified technical projects supersede rigid GPA thresholds. Recruiters are deploying conversational AI agents to evaluate candidate technical knowledge and behavioral sentiment in real time. To maintain graduate competitiveness, collegiate placement systems must expand beyond static resume screening into interactive talent readiness platforms that simulate every stage of the hiring funnel.")
    );

    elements.push(sectionHeading("9.2 Proposed Functional Enhancements"));

    elements.push(subSectionHeading("9.2.1 Advanced Functional Capabilities Roadmap"));
    elements.push(
        p("Four high-impact functional modules are planned for subsequent iterations:"),
        bullet("Interactive AI Mock Interview Simulator: Leveraging WebRTC and Gemini Multimodal Live APIs to conduct simulated technical and HR interviews, evaluating candidate responses, vocal sentiment, and technical accuracy with instant scorecards.", "1. AI Mock Interview Simulator:"),
        bullet("In-Browser Algorithmic Coding Sandbox: Integrating the Monaco Editor with isolated Docker microVMs (gVisor) to evaluate student code submissions against test cases, measuring runtime execution and algorithmic time complexity.", "2. Coding Sandbox & Evaluator:"),
        bullet("Personalized Learning Roadmap Engine: Dynamically linking identified resume skill gaps to curated educational pathways across Coursera, edX, and official documentation, guiding targeted student upskilling.", "3. Skill Remediation Engine:"),
        bullet("Predictive Salary and Compensation Estimator: Utilizing gradient boosted decision trees (XGBoost) trained on placement datasets to forecast realistic compensation ranges based on candidate CGPA, skills, and target roles.", "4. Predictive Salary Estimator:")
    );

    elements.push(sectionHeading("9.3 Proposed Architectural and Technical Enhancements"));

    elements.push(subSectionHeading("9.3.1 Enterprise Scalability and Cloud Architecture"));
    elements.push(
        p("To support multi-campus institutional federations with tens of thousands of active students, five architectural upgrades will be phased in:"),
        bullet("Microservices Decomposition via Spring Cloud: Decoupling authentication, resume parsing, AI evaluation, and job catalogs into independent microservices governed by Spring Cloud Gateway.", "1. Microservices Architecture:"),
        bullet("Vector Database Integration for Semantic Embeddings: Storing resume and job description embeddings in Milvus or pgvector using Google text-embedding-004, enabling sub-millisecond conceptual candidate matching.", "2. Vector Semantic Search:"),
        bullet("Distributed Messaging via Apache Kafka: Offloading batch resume analysis and background email dispatches into asynchronous message queues to insulate servers during traffic spikes.", "3. Event-Driven Messaging:"),
        bullet("In-Memory Caching via Redis Cluster: Caching active job listings, company profiles, and common ATS evaluations with TTL expiration policies to deliver sub-5ms response latencies.", "4. In-Memory Redis Caching:"),
        bullet("Blockchain-Based Academic Credential Verification: Anchoring student semester grades and certificates on Polygon Layer-2 smart contracts, providing recruiters with instant cryptographic verification.", "5. Decentralized Verification:")
    );

    elements.push(sectionHeading("9.4 Strategic Phased Implementation Roadmap"));

    elements.push(subSectionHeading("9.4.1 Engineering Rollout Schedule"));
    elements.push(
        p("Table 9.1 defines the phased implementation roadmap across a 12-month engineering trajectory:"),
        p("")
    );

    const roadmapHeaders = ["Phase", "Target Capabilities", "Key Technologies", "Timeline", "Milestone Target"];
    const roadmapRows = [
        ["Phase 1: Near-Term Polish", "Redis caching cluster, asynchronous email notifications, mobile UI polish.", "Redis, Spring AMQP, WebSocket Stomp.", "Months 1 – 3", "Sub-10ms job searches, real-time push notifications."],
        ["Phase 2: Semantic AI Upgrades", "Vector database embeddings for resumes, conceptual similarity search.", "Milvus / pgvector, Google text-embedding-004, Kafka.", "Months 4 – 6", "Sub-second conceptual search across 50,000+ resumes."],
        ["Phase 3: Interactive Readiness", "Multimodal AI mock interview simulator, Dockerized in-browser coding sandbox.", "WebRTC MediaStream, Gemini Multimodal, gVisor microVMs.", "Months 7 – 9", "Full-scale behavioral & coding assessment engine."],
        ["Phase 4: Enterprise Scale", "Microservices decomposition, Kubernetes autoscaling, Blockchain credentials.", "Spring Cloud Gateway, Kubernetes HPA, Polygon Smart Contracts.", "Months 10 – 12", "Multi-institution federation supporting 100,000+ candidates."]
    ];

    elements.push(...table(
        roadmapHeaders,
        roadmapRows,
        [20, 26, 24, 12, 18],
        "Table 9.1: Strategic Phased Implementation Roadmap for Future Platform Enhancements"
    ));

    return elements;
}

module.exports = { getChapter9 };
