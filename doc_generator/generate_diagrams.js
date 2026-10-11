const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'diagrams');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

function renderSvgToPng(svgString, fileName, width = 1200, height = 750) {
    const resvg = new Resvg(svgString, {
        fitTo: { mode: 'width', value: width }
    });
    const pngData = resvg.render();
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, pngData.asPng());
    console.log(`Saved ${fileName} (${fs.statSync(filePath).size} bytes)`);
}

// 1. Architecture Diagram
const architectureSvg = `
<svg width="1200" height="750" viewBox="0 0 1200 750" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradHeader" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
    <linearGradient id="gradBox1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="4" stdDeviation="4" flood-opacity="0.15"/>
    </filter>
    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569"/>
    </marker>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563eb"/>
    </marker>
  </defs>

  <!-- Background -->
  <rect width="1200" height="750" fill="#ffffff"/>
  
  <!-- Outer Title Banner -->
  <rect x="50" y="25" width="1100" height="60" rx="8" fill="url(#gradHeader)" filter="url(#shadow)"/>
  <text x="600" y="62" font-family="'Times New Roman', Times, serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">
    FIGURE 3.1: SYSTEM ARCHITECTURAL DESIGN (3-TIER MVC ARCHITECTURE)
  </text>

  <!-- LAYER 1: CLIENT PRESENTATION LAYER -->
  <rect x="50" y="110" width="1100" height="115" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2" filter="url(#shadow)"/>
  <text x="70" y="135" font-family="'Times New Roman', Times, serif" font-size="16" font-weight="bold" fill="#1e40af">1. PRESENTATION LAYER (CLIENT TIER)</text>
  
  <rect x="80" y="150" width="220" height="60" rx="6" fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"/>
  <text x="190" y="175" font-family="Arial" font-size="13" font-weight="bold" fill="#1e293b" text-anchor="middle">Student Web Interface</text>
  <text x="190" y="195" font-family="Arial" font-size="11" fill="#64748b" text-anchor="middle">Thymeleaf, HTML5, SaaS UI</text>

  <rect x="330" y="150" width="220" height="60" rx="6" fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"/>
  <text x="440" y="175" font-family="Arial" font-size="13" font-weight="bold" fill="#1e293b" text-anchor="middle">Company Recruiter Portal</text>
  <text x="440" y="195" font-family="Arial" font-size="11" fill="#64748b" text-anchor="middle">Applicant Review, Job Forms</text>

  <rect x="580" y="150" width="220" height="60" rx="6" fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"/>
  <text x="690" y="175" font-family="Arial" font-size="13" font-weight="bold" fill="#1e293b" text-anchor="middle">Faculty Tracking Portal</text>
  <text x="690" y="195" font-family="Arial" font-size="11" fill="#64748b" text-anchor="middle">Academic Monitoring, Reports</text>

  <rect x="830" y="150" width="290" height="60" rx="6" fill="#ffffff" stroke="#93c5fd" stroke-width="1.5"/>
  <text x="975" y="175" font-family="Arial" font-size="13" font-weight="bold" fill="#1e293b" text-anchor="middle">Admin Management Console</text>
  <text x="975" y="195" font-family="Arial" font-size="11" fill="#64748b" text-anchor="middle">System Governance, User Audits</text>

  <!-- CONNECTOR LAYER 1 -> 2 -->
  <line x1="600" y1="225" x2="600" y2="255" stroke="#2563eb" stroke-width="2.5" marker-end="url(#arrow-blue)"/>
  <text x="615" y="245" font-family="Arial" font-size="11" font-weight="bold" fill="#2563eb">HTTP/HTTPS REST &amp; MVC Requests</text>

  <!-- LAYER 2: BUSINESS LOGIC / APPLICATION LAYER -->
  <rect x="50" y="260" width="1100" height="230" rx="8" fill="#f8fafc" stroke="#64748b" stroke-width="2" filter="url(#shadow)"/>
  <text x="70" y="285" font-family="'Times New Roman', Times, serif" font-size="16" font-weight="bold" fill="#0f172a">2. APPLICATION &amp; BUSINESS LOGIC LAYER (SPRING BOOT 3.3.0 CORE)</text>

  <!-- Security Filter Sub-block -->
  <rect x="80" y="300" width="1040" height="40" rx="5" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5"/>
  <text x="600" y="325" font-family="Arial" font-size="12" font-weight="bold" fill="#92400e" text-anchor="middle">
    SPRING SECURITY 6: AuthenticationFilter, AuthorizationFilter, BCryptPasswordEncoder, Session Management, Role Hierarchy
  </text>

  <!-- Controllers Sub-block -->
  <rect x="80" y="350" width="500" height="65" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="90" y="370" font-family="Arial" font-size="12" font-weight="bold" fill="#1e293b">Controller Layer (Spring MVC)</text>
  <text x="90" y="390" font-family="Arial" font-size="11" fill="#475569">• StudentController, AuthController, CompanyController</text>
  <text x="90" y="405" font-family="Arial" font-size="11" fill="#475569">• FacultyController, AdminController, ResumeAnalysisController</text>

  <!-- Services Sub-block -->
  <rect x="620" y="350" width="500" height="125" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="630" y="370" font-family="Arial" font-size="12" font-weight="bold" fill="#1e293b">Service Layer (Business Logic &amp; Orchestration)</text>
  <text x="630" y="390" font-family="Arial" font-size="11" fill="#475569">• StudentService (Profile management, dual resume BLOB &amp; disk storage)</text>
  <text x="630" y="405" font-family="Arial" font-size="11" fill="#475569">• AIService (Gemini 1.5 Flash client, prompt engineering, ATS scoring)</text>
  <text x="630" y="420" font-family="Arial" font-size="11" fill="#475569">• ApplicationService (Multi-status application lifecycle workflows)</text>
  <text x="630" y="435" font-family="Arial" font-size="11" fill="#475569">• FileUploadService &amp; EmailService (Apache PDFBox, JavaMailSender OTP)</text>
  <text x="630" y="450" font-family="Arial" font-size="11" fill="#475569">• CompanyService &amp; AuthService (Company analytics, user verification)</text>

  <!-- Data Access Sub-block -->
  <rect x="80" y="425" width="500" height="50" rx="5" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="90" y="445" font-family="Arial" font-size="12" font-weight="bold" fill="#1e293b">Data Access Layer (Spring Data JPA / Hibernate 6)</text>
  <text x="90" y="462" font-family="Arial" font-size="11" fill="#475569">StudentRepository, JobRepository, ResumeRepository, AiAnalysisRepository</text>

  <!-- CONNECTOR LAYER 2 -> 3 -->
  <line x1="330" y1="490" x2="330" y2="520" stroke="#475569" stroke-width="2.5" marker-end="url(#arrow)"/>
  <text x="340" y="510" font-family="Arial" font-size="11" font-weight="bold" fill="#475569">JDBC / SQL</text>

  <line x1="870" y1="490" x2="870" y2="520" stroke="#ea580c" stroke-width="2.5" marker-end="url(#arrow)"/>
  <text x="880" y="510" font-family="Arial" font-size="11" font-weight="bold" fill="#ea580c">HTTPS REST / JSON</text>

  <!-- LAYER 3: DATA PERSISTENCE & EXTERNAL INTEGRATION -->
  <rect x="50" y="525" width="530" height="195" rx="8" fill="#f0fdf4" stroke="#22c55e" stroke-width="2" filter="url(#shadow)"/>
  <text x="70" y="550" font-family="'Times New Roman', Times, serif" font-size="16" font-weight="bold" fill="#15803d">3A. PERSISTENCE LAYER (MYSQL 8.0 &amp; STORAGE)</text>
  
  <rect x="70" y="565" width="230" height="135" rx="6" fill="#ffffff" stroke="#86efac" stroke-width="1.5"/>
  <text x="185" y="585" font-family="Arial" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="middle">MySQL Relational Database</text>
  <text x="80" y="605" font-family="Arial" font-size="10.5" fill="#334155">• users, roles, user_roles</text>
  <text x="80" y="622" font-family="Arial" font-size="10.5" fill="#334155">• students, companies, faculties</text>
  <text x="80" y="639" font-family="Arial" font-size="10.5" fill="#334155">• jobs, applications</text>
  <text x="80" y="656" font-family="Arial" font-size="10.5" fill="#334155">• resumes (BLOB storage)</text>
  <text x="80" y="673" font-family="Arial" font-size="10.5" fill="#334155">• ai_analysis, otp_verifications</text>

  <rect x="320" y="565" width="240" height="135" rx="6" fill="#ffffff" stroke="#86efac" stroke-width="1.5"/>
  <text x="440" y="585" font-family="Arial" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="middle">File System Storage</text>
  <text x="330" y="610" font-family="Arial" font-size="11" fill="#334155">• uploads/resumes/ (PDFs)</text>
  <text x="330" y="630" font-family="Arial" font-size="11" fill="#334155">• uploads/profile-pictures/</text>
  <text x="330" y="650" font-family="Arial" font-size="11" fill="#334155">• uploads/company-logos/</text>
  <text x="330" y="670" font-family="Arial" font-size="11" fill="#334155">• Dual-redundancy storage sync</text>

  <!-- LAYER 3B: EXTERNAL SERVICES & AI ENGINE -->
  <rect x="620" y="525" width="530" height="195" rx="8" fill="#fff7ed" stroke="#ea580c" stroke-width="2" filter="url(#shadow)"/>
  <text x="640" y="550" font-family="'Times New Roman', Times, serif" font-size="16" font-weight="bold" fill="#c2410c">3B. EXTERNAL AI &amp; PARSING SERVICES</text>

  <rect x="640" y="565" width="240" height="135" rx="6" fill="#ffffff" stroke="#fdba74" stroke-width="1.5"/>
  <text x="760" y="585" font-family="Arial" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="middle">Google Gemini 1.5 Flash API</text>
  <text x="650" y="610" font-family="Arial" font-size="10.5" fill="#334155">• Multimodal PDF Base64 Stream</text>
  <text x="650" y="627" font-family="Arial" font-size="10.5" fill="#334155">• Text-based ATS Prompt Engine</text>
  <text x="650" y="644" font-family="Arial" font-size="10.5" fill="#334155">• ATS Match Scoring (0-100%)</text>
  <text x="650" y="661" font-family="Arial" font-size="10.5" fill="#334155">• Skill Gap &amp; Feedback Generation</text>
  <text x="650" y="678" font-family="Arial" font-size="10.5" fill="#334155">• Reactive WebClient (15s Timeout)</text>

  <rect x="900" y="565" width="230" height="135" rx="6" fill="#ffffff" stroke="#fdba74" stroke-width="1.5"/>
  <text x="1015" y="585" font-family="Arial" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="middle">Utilities &amp; Communication</text>
  <text x="910" y="610" font-family="Arial" font-size="10.5" fill="#334155">• Apache PDFBox 3.0.2 Text Extractor</text>
  <text x="910" y="627" font-family="Arial" font-size="10.5" fill="#334155">• JavaMailSender (SMTP TLS)</text>
  <text x="910" y="644" font-family="Arial" font-size="10.5" fill="#334155">• Jackson JSON Parser</text>
  <text x="910" y="661" font-family="Arial" font-size="10.5" fill="#334155">• TwelveMonkeys ImageIO (WEBP)</text>
  <text x="910" y="678" font-family="Arial" font-size="10.5" fill="#334155">• Chart.js Analytics Engine</text>

</svg>
`;

renderSvgToPng(architectureSvg, 'architecture_diagram.png', 1200, 750);

// 2. Flowchart Diagram
const flowchartSvg = `
<svg width="1200" height="850" viewBox="0 0 1200 850" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradFlowTitle" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
    <filter id="shadowF" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="3" stdDeviation="3" flood-opacity="0.12"/>
    </filter>
    <marker id="arrowF" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#334155"/>
    </marker>
  </defs>

  <rect width="1200" height="850" fill="#ffffff"/>

  <!-- Title -->
  <rect x="50" y="20" width="1100" height="55" rx="8" fill="url(#gradFlowTitle)" filter="url(#shadowF)"/>
  <text x="600" y="55" font-family="'Times New Roman', Times, serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">
    FIGURE 5.1: END-TO-END PLACEMENT &amp; AI ATS EVALUATION SYSTEM FLOW CHART
  </text>

  <!-- Start Node -->
  <rect x="520" y="95" width="160" height="40" rx="20" fill="#22c55e" filter="url(#shadowF)"/>
  <text x="600" y="120" font-family="Arial" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">START</text>

  <line x1="600" y1="135" x2="600" y2="160" stroke="#334155" stroke-width="2" marker-end="url(#arrowF)"/>

  <!-- Process: Access System / Registration -->
  <rect x="490" y="160" width="220" height="50" rx="6" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" filter="url(#shadowF)"/>
  <text x="600" y="180" font-family="Arial" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">Access Portal / Login</text>
  <text x="600" y="198" font-family="Arial" font-size="11" fill="#475569" text-anchor="middle">Register &amp; OTP Verification</text>

  <line x1="600" y1="210" x2="600" y2="235" stroke="#334155" stroke-width="2" marker-end="url(#arrowF)"/>

  <!-- Decision: Authenticated & Role -->
  <polygon points="600,235 730,275 600,315 470,275" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5" filter="url(#shadowF)"/>
  <text x="600" y="272" font-family="Arial" font-size="11" font-weight="bold" fill="#92400e" text-anchor="middle">Authenticated &amp;</text>
  <text x="600" y="286" font-family="Arial" font-size="11" font-weight="bold" fill="#92400e" text-anchor="middle">Determine Role?</text>

  <!-- Branches for Roles -->
  <!-- Left Branch: Company Recruiter -->
  <line x1="470" y1="275" x2="220" y2="275" stroke="#334155" stroke-width="2"/>
  <line x1="220" y1="275" x2="220" y2="340" stroke="#334155" stroke-width="2" marker-end="url(#arrowF)"/>
  <text x="320" y="268" font-family="Arial" font-size="11" font-weight="bold" fill="#334155">COMPANY</text>

  <rect x="120" y="340" width="200" height="70" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" filter="url(#shadowF)"/>
  <text x="220" y="360" font-family="Arial" font-size="12" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Recruiter Operations</text>
  <text x="220" y="378" font-family="Arial" font-size="11" fill="#475569" text-anchor="middle">• Post / Edit Job Openings</text>
  <text x="220" y="395" font-family="Arial" font-size="11" fill="#475569" text-anchor="middle">• View Applicants &amp; Resumes</text>

  <line x1="220" y1="410" x2="220" y2="445" stroke="#334155" stroke-width="2" marker-end="url(#arrowF)"/>

  <rect x="120" y="445" width="200" height="60" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" filter="url(#shadowF)"/>
  <text x="220" y="468" font-family="Arial" font-size="11.5" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Update Application Status</text>
  <text x="220" y="488" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">Shortlisted / Selected / Rejected</text>

  <!-- Center Branch: Student -->
  <line x1="600" y1="315" x2="600" y2="340" stroke="#334155" stroke-width="2" marker-end="url(#arrowF)"/>
  <text x="615" y="330" font-family="Arial" font-size="11" font-weight="bold" fill="#334155">STUDENT</text>

  <rect x="500" y="340" width="200" height="60" rx="6" fill="#f0fdf4" stroke="#22c55e" stroke-width="1.5" filter="url(#shadowF)"/>
  <text x="600" y="362" font-family="Arial" font-size="12" font-weight="bold" fill="#166534" text-anchor="middle">Upload Resume (PDF)</text>
  <text x="600" y="382" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">Dual BLOB &amp; Disk Storage</text>

  <line x1="600" y1="400" x2="600" y2="430" stroke="#334155" stroke-width="2" marker-end="url(#arrowF)"/>

  <rect x="480" y="430" width="240" height="65" rx="6" fill="#fff7ed" stroke="#ea580c" stroke-width="1.5" filter="url(#shadowF)"/>
  <text x="600" y="452" font-family="Arial" font-size="12" font-weight="bold" fill="#c2410c" text-anchor="middle">Trigger AI ATS Analysis</text>
  <text x="600" y="470" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">Gemini 1.5 Flash API Call</text>
  <text x="600" y="486" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">Text Extraction / Multimodal Stream</text>

  <line x1="600" y1="495" x2="600" y2="525" stroke="#334155" stroke-width="2" marker-end="url(#arrowF)"/>

  <!-- Decision: AI Score Generated? -->
  <polygon points="600,525 720,560 600,595 480,560" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5" filter="url(#shadowF)"/>
  <text x="600" y="556" font-family="Arial" font-size="11" font-weight="bold" fill="#92400e" text-anchor="middle">AI Analysis Valid?</text>
  <text x="600" y="570" font-family="Arial" font-size="10" fill="#92400e" text-anchor="middle">(Timeout / JSON parsed)</text>

  <!-- Right Branch from Decision: Fallback -->
  <line x1="720" y1="560" x2="800" y2="560" stroke="#ef4444" stroke-width="2"/>
  <line x1="800" y1="560" x2="800" y2="620" stroke="#ef4444" stroke-width="2" marker-end="url(#arrowF)"/>
  <text x="735" y="552" font-family="Arial" font-size="10.5" font-weight="bold" fill="#ef4444">NO (Fallback)</text>

  <rect x="720" y="620" width="160" height="50" rx="6" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5"/>
  <text x="800" y="642" font-family="Arial" font-size="11" font-weight="bold" fill="#991b1b" text-anchor="middle">Fallback Result</text>
  <text x="800" y="658" font-family="Arial" font-size="10" fill="#475569" text-anchor="middle">Heuristic Score &amp; Advice</text>

  <!-- Success from Decision -->
  <line x1="600" y1="595" x2="600" y2="625" stroke="#22c55e" stroke-width="2" marker-end="url(#arrowF)"/>
  <text x="615" y="612" font-family="Arial" font-size="10.5" font-weight="bold" fill="#166534">YES</text>

  <rect x="470" y="625" width="260" height="65" rx="6" fill="#f0fdf4" stroke="#22c55e" stroke-width="1.5" filter="url(#shadowF)"/>
  <text x="600" y="645" font-family="Arial" font-size="12" font-weight="bold" fill="#166534" text-anchor="middle">Render Match &amp; Skill Gap UI</text>
  <text x="600" y="663" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">• Match Score (0-100%) &amp; Matched Skills</text>
  <text x="600" y="679" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">• Missing Skills &amp; AI Recommendations</text>

  <line x1="800" y1="670" x2="800" y2="720" stroke="#334155" stroke-width="2"/>
  <line x1="800" y1="720" x2="600" y2="720" stroke="#334155" stroke-width="2"/>

  <line x1="600" y1="690" x2="600" y2="735" stroke="#334155" stroke-width="2" marker-end="url(#arrowF)"/>

  <!-- Apply for Job -->
  <rect x="500" y="735" width="200" height="45" rx="6" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5" filter="url(#shadowF)"/>
  <text x="600" y="762" font-family="Arial" font-size="12" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Submit Job Application</text>

  <line x1="500" y1="757" x2="320" y2="757" stroke="#334155" stroke-width="1.5"/>
  <line x1="220" y1="505" x2="220" y2="757" stroke="#334155" stroke-width="1.5"/>

  <!-- Right Branch: Faculty / Admin -->
  <line x1="730" y1="275" x2="980" y2="275" stroke="#334155" stroke-width="2"/>
  <line x1="980" y1="275" x2="980" y2="340" stroke="#334155" stroke-width="2" marker-end="url(#arrowF)"/>
  <text x="820" y="268" font-family="Arial" font-size="11" font-weight="bold" fill="#334155">FACULTY / ADMIN</text>

  <rect x="880" y="340" width="200" height="70" rx="6" fill="#faf5ff" stroke="#a855f7" stroke-width="1.5" filter="url(#shadowF)"/>
  <text x="980" y="362" font-family="Arial" font-size="12" font-weight="bold" fill="#6b21a8" text-anchor="middle">Academic &amp; Governance</text>
  <text x="980" y="380" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">• Student Analytics &amp; Reports</text>
  <text x="980" y="396" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">• Company &amp; User Verification</text>

  <!-- Connect to End -->
  <line x1="980" y1="410" x2="980" y2="805" stroke="#334155" stroke-width="2"/>
  <line x1="980" y1="805" x2="680" y2="805" stroke="#334155" stroke-width="2" marker-end="url(#arrowF)"/>

  <line x1="600" y1="780" x2="600" y2="805" stroke="#334155" stroke-width="2"/>
  <line x1="600" y1="805" x2="520" y2="805" stroke="#334155" stroke-width="2"/>

  <!-- End Node -->
  <rect x="520" y="790" width="160" height="35" rx="17.5" fill="#ef4444" filter="url(#shadowF)"/>
  <text x="600" y="812" font-family="Arial" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">END</text>

</svg>
`;

renderSvgToPng(flowchartSvg, 'flowchart_diagram.png', 1200, 850);

// 3. DFD Level 0 (Context Diagram)
const dfd0Svg = `
<svg width="1200" height="750" viewBox="0 0 1200 750" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradDfd0" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#312e81"/>
    </linearGradient>
    <filter id="shadowD0" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="4" stdDeviation="4" flood-opacity="0.15"/>
    </filter>
    <marker id="arrD0" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#1e293b"/>
    </marker>
  </defs>

  <rect width="1200" height="750" fill="#ffffff"/>

  <!-- Title -->
  <rect x="50" y="25" width="1100" height="55" rx="8" fill="url(#gradDfd0)" filter="url(#shadowD0)"/>
  <text x="600" y="60" font-family="'Times New Roman', Times, serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">
    FIGURE 5.2: DATA FLOW DIAGRAM (DFD) LEVEL-0 / CONTEXT DIAGRAM
  </text>

  <!-- Central System Bubble -->
  <circle cx="600" cy="400" r="130" fill="#eff6ff" stroke="#2563eb" stroke-width="3" filter="url(#shadowD0)"/>
  <text x="600" y="375" font-family="Arial" font-size="16" font-weight="bold" fill="#1e3a8a" text-anchor="middle">0.0</text>
  <text x="600" y="398" font-family="Arial" font-size="14" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Campus Placement</text>
  <text x="600" y="416" font-family="Arial" font-size="14" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Prediction &amp; AI ATS</text>
  <text x="600" y="434" font-family="Arial" font-size="14" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Skill Gap Analyzer</text>

  <!-- External Entity 1: STUDENT (Top Left) -->
  <rect x="60" y="160" width="180" height="90" rx="8" fill="#f8fafc" stroke="#334155" stroke-width="2" filter="url(#shadowD0)"/>
  <text x="150" y="210" font-family="Arial" font-size="16" font-weight="bold" fill="#0f172a" text-anchor="middle">STUDENT</text>

  <!-- Flow Student -> System -->
  <path d="M 240 190 Q 420 220 500 320" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#arrD0)"/>
  <text x="310" y="235" font-family="Arial" font-size="11" font-weight="bold" fill="#1e40af">Profile, Resume PDF,</text>
  <text x="310" y="250" font-family="Arial" font-size="11" font-weight="bold" fill="#1e40af">Job Application</text>

  <!-- Flow System -> Student -->
  <path d="M 480 370 Q 350 320 240 230" fill="none" stroke="#059669" stroke-width="2" marker-end="url(#arrD0)"/>
  <text x="260" y="325" font-family="Arial" font-size="11" font-weight="bold" fill="#065f46">ATS Scores, Skill Gaps,</text>
  <text x="260" y="340" font-family="Arial" font-size="11" font-weight="bold" fill="#065f46">Ranked Jobs, App Status</text>

  <!-- External Entity 2: COMPANY RECRUITER (Top Right) -->
  <rect x="960" y="160" width="180" height="90" rx="8" fill="#f8fafc" stroke="#334155" stroke-width="2" filter="url(#shadowD0)"/>
  <text x="1050" y="200" font-family="Arial" font-size="15" font-weight="bold" fill="#0f172a" text-anchor="middle">COMPANY</text>
  <text x="1050" y="222" font-family="Arial" font-size="15" font-weight="bold" fill="#0f172a" text-anchor="middle">RECRUITER</text>

  <!-- Flow Company -> System -->
  <path d="M 960 190 Q 780 220 700 320" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#arrD0)"/>
  <text x="760" y="235" font-family="Arial" font-size="11" font-weight="bold" fill="#1e40af">Job Postings, Deadlines,</text>
  <text x="760" y="250" font-family="Arial" font-size="11" font-weight="bold" fill="#1e40af">Candidate Status Updates</text>

  <!-- Flow System -> Company -->
  <path d="M 720 370 Q 850 320 960 230" fill="none" stroke="#059669" stroke-width="2" marker-end="url(#arrD0)"/>
  <text x="820" y="325" font-family="Arial" font-size="11" font-weight="bold" fill="#065f46">Applicant Profiles, Resumes,</text>
  <text x="820" y="340" font-family="Arial" font-size="11" font-weight="bold" fill="#065f46">ATS Match Statistics</text>

  <!-- External Entity 3: FACULTY / PLACEMENT OFFICER (Bottom Left) -->
  <rect x="60" y="550" width="180" height="90" rx="8" fill="#f8fafc" stroke="#334155" stroke-width="2" filter="url(#shadowD0)"/>
  <text x="150" y="590" font-family="Arial" font-size="15" font-weight="bold" fill="#0f172a" text-anchor="middle">FACULTY /</text>
  <text x="150" y="612" font-family="Arial" font-size="15" font-weight="bold" fill="#0f172a" text-anchor="middle">PLACEMENT CELL</text>

  <!-- Flow Faculty -> System -->
  <path d="M 240 575 Q 380 540 480 470" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#arrD0)"/>
  <text x="270" y="525" font-family="Arial" font-size="11" font-weight="bold" fill="#1e40af">Student Verification,</text>
  <text x="270" y="540" font-family="Arial" font-size="11" font-weight="bold" fill="#1e40af">Department Filters</text>

  <!-- Flow System -> Faculty -->
  <path d="M 500 495 Q 380 590 240 615" fill="none" stroke="#059669" stroke-width="2" marker-end="url(#arrD0)"/>
  <text x="280" y="620" font-family="Arial" font-size="11" font-weight="bold" fill="#065f46">Placement Analytics,</text>
  <text x="280" y="635" font-family="Arial" font-size="11" font-weight="bold" fill="#065f46">Skill Gap Reports</text>

  <!-- External Entity 4: SYSTEM ADMINISTRATOR (Bottom Right) -->
  <rect x="960" y="550" width="180" height="90" rx="8" fill="#f8fafc" stroke="#334155" stroke-width="2" filter="url(#shadowD0)"/>
  <text x="1050" y="590" font-family="Arial" font-size="15" font-weight="bold" fill="#0f172a" text-anchor="middle">SYSTEM</text>
  <text x="1050" y="612" font-family="Arial" font-size="15" font-weight="bold" fill="#0f172a" text-anchor="middle">ADMINISTRATOR</text>

  <!-- Flow Admin -> System -->
  <path d="M 960 575 Q 820 540 720 470" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#arrD0)"/>
  <text x="760" y="525" font-family="Arial" font-size="11" font-weight="bold" fill="#1e40af">User Governance,</text>
  <text x="760" y="540" font-family="Arial" font-size="11" font-weight="bold" fill="#1e40af">System Config, Audits</text>

  <!-- Flow System -> Admin -->
  <path d="M 700 495 Q 820 590 960 615" fill="none" stroke="#059669" stroke-width="2" marker-end="url(#arrD0)"/>
  <text x="770" y="620" font-family="Arial" font-size="11" font-weight="bold" fill="#065f46">System Logs, Audit Trails,</text>
  <text x="770" y="635" font-family="Arial" font-size="11" font-weight="bold" fill="#065f46">Database Health</text>

  <!-- External Entity 5: GOOGLE GEMINI AI API (Top Center) -->
  <rect x="500" y="110" width="200" height="60" rx="6" fill="#fff7ed" stroke="#ea580c" stroke-width="2" filter="url(#shadowD0)"/>
  <text x="600" y="135" font-family="Arial" font-size="13" font-weight="bold" fill="#c2410c" text-anchor="middle">EXTERNAL SERVICE</text>
  <text x="600" y="152" font-family="Arial" font-size="11.5" font-weight="bold" fill="#9a3412" text-anchor="middle">Google Gemini 1.5 Flash</text>

  <line x1="580" y1="270" x2="580" y2="170" stroke="#ea580c" stroke-width="2" marker-end="url(#arrD0)"/>
  <line x1="620" y1="170" x2="620" y2="270" stroke="#ea580c" stroke-width="2" marker-end="url(#arrD0)"/>
  <text x="500" y="220" font-family="Arial" font-size="10" font-weight="bold" fill="#c2410c">PDF/Text Prompt</text>
  <text x="630" y="220" font-family="Arial" font-size="10" font-weight="bold" fill="#c2410c">JSON Evaluation</text>

</svg>
`;

renderSvgToPng(dfd0Svg, 'dfd0_diagram.png', 1200, 750);

// 4. DFD Level 1 (Overview Diagram)
const dfd1Svg = `
<svg width="1200" height="850" viewBox="0 0 1200 850" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradDfd1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
    <filter id="shadowD1" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="3" stdDeviation="3" flood-opacity="0.12"/>
    </filter>
    <marker id="arrD1" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#334155"/>
    </marker>
  </defs>

  <rect width="1200" height="850" fill="#ffffff"/>

  <!-- Title -->
  <rect x="50" y="20" width="1100" height="50" rx="8" fill="url(#gradDfd1)" filter="url(#shadowD1)"/>
  <text x="600" y="52" font-family="'Times New Roman', Times, serif" font-size="19" font-weight="bold" fill="#ffffff" text-anchor="middle">
    FIGURE 5.3: DATA FLOW DIAGRAM (DFD) LEVEL-1 (TOP-LEVEL PROCESS DECOMPOSITION)
  </text>

  <!-- Process 1.0 -->
  <circle cx="200" cy="160" r="55" fill="#eff6ff" stroke="#2563eb" stroke-width="2" filter="url(#shadowD1)"/>
  <text x="200" y="150" font-family="Arial" font-size="12" font-weight="bold" fill="#1e3a8a" text-anchor="middle">1.0</text>
  <text x="200" y="167" font-family="Arial" font-size="11" font-weight="bold" fill="#1e3a8a" text-anchor="middle">User Auth &amp;</text>
  <text x="200" y="182" font-family="Arial" font-size="11" font-weight="bold" fill="#1e3a8a" text-anchor="middle">OTP Verify</text>

  <!-- Data Store D1: Users -->
  <rect x="130" y="260" width="140" height="35" rx="3" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
  <line x1="160" y1="260" x2="160" y2="295" stroke="#64748b" stroke-width="1.5"/>
  <text x="145" y="282" font-family="Arial" font-size="11" font-weight="bold" fill="#475569">D1</text>
  <text x="170" y="282" font-family="Arial" font-size="11" font-weight="bold" fill="#1e293b">users / roles</text>

  <!-- Process 2.0 -->
  <circle cx="450" cy="160" r="55" fill="#eff6ff" stroke="#2563eb" stroke-width="2" filter="url(#shadowD1)"/>
  <text x="450" y="150" font-family="Arial" font-size="12" font-weight="bold" fill="#1e3a8a" text-anchor="middle">2.0</text>
  <text x="450" y="167" font-family="Arial" font-size="11" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Profile &amp;</text>
  <text x="450" y="182" font-family="Arial" font-size="11" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Resume Mgmt</text>

  <!-- Data Store D2: Students / Resumes -->
  <rect x="380" y="260" width="140" height="35" rx="3" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
  <line x1="410" y1="260" x2="410" y2="295" stroke="#64748b" stroke-width="1.5"/>
  <text x="395" y="282" font-family="Arial" font-size="11" font-weight="bold" fill="#475569">D2</text>
  <text x="420" y="282" font-family="Arial" font-size="10" font-weight="bold" fill="#1e293b">students / resumes</text>

  <!-- Process 3.0 -->
  <circle cx="750" cy="160" r="55" fill="#eff6ff" stroke="#2563eb" stroke-width="2" filter="url(#shadowD1)"/>
  <text x="750" y="150" font-family="Arial" font-size="12" font-weight="bold" fill="#1e3a8a" text-anchor="middle">3.0</text>
  <text x="750" y="167" font-family="Arial" font-size="11" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Job Posting &amp;</text>
  <text x="750" y="182" font-family="Arial" font-size="11" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Company Mgmt</text>

  <!-- Data Store D3: Jobs / Companies -->
  <rect x="680" y="260" width="140" height="35" rx="3" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
  <line x1="710" y1="260" x2="710" y2="295" stroke="#64748b" stroke-width="1.5"/>
  <text x="695" y="282" font-family="Arial" font-size="11" font-weight="bold" fill="#475569">D3</text>
  <text x="720" y="282" font-family="Arial" font-size="10" font-weight="bold" fill="#1e293b">jobs / companies</text>

  <!-- Process 4.0: AI ATS Evaluation -->
  <circle cx="450" cy="460" r="65" fill="#fff7ed" stroke="#ea580c" stroke-width="2.5" filter="url(#shadowD1)"/>
  <text x="450" y="445" font-family="Arial" font-size="13" font-weight="bold" fill="#c2410c" text-anchor="middle">4.0</text>
  <text x="450" y="465" font-family="Arial" font-size="12" font-weight="bold" fill="#c2410c" text-anchor="middle">AI ATS Engine &amp;</text>
  <text x="450" y="482" font-family="Arial" font-size="12" font-weight="bold" fill="#c2410c" text-anchor="middle">Skill Gap Analyzer</text>

  <!-- External Gemini Service -->
  <rect x="360" y="600" width="180" height="50" rx="6" fill="#fff7ed" stroke="#ea580c" stroke-width="1.5"/>
  <text x="450" y="622" font-family="Arial" font-size="11" font-weight="bold" fill="#9a3412" text-anchor="middle">Google Gemini API</text>
  <text x="450" y="638" font-family="Arial" font-size="10" fill="#c2410c" text-anchor="middle">gemini-1.5-flash</text>

  <!-- Data Store D4: AI Analysis -->
  <rect x="130" y="440" width="140" height="35" rx="3" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
  <line x1="160" y1="440" x2="160" y2="475" stroke="#64748b" stroke-width="1.5"/>
  <text x="145" y="462" font-family="Arial" font-size="11" font-weight="bold" fill="#475569">D4</text>
  <text x="170" y="462" font-family="Arial" font-size="10.5" font-weight="bold" fill="#1e293b">ai_analysis</text>

  <!-- Process 5.0: Application Workflow -->
  <circle cx="750" cy="460" r="60" fill="#eff6ff" stroke="#2563eb" stroke-width="2" filter="url(#shadowD1)"/>
  <text x="750" y="448" font-family="Arial" font-size="13" font-weight="bold" fill="#1e3a8a" text-anchor="middle">5.0</text>
  <text x="750" y="468" font-family="Arial" font-size="11.5" font-weight="bold" fill="#1e3a8a" text-anchor="middle">Job Application</text>
  <text x="750" y="485" font-family="Arial" font-size="11.5" font-weight="bold" fill="#1e3a8a" text-anchor="middle">&amp; Tracking</text>

  <!-- Data Store D5: Applications -->
  <rect x="680" y="600" width="140" height="35" rx="3" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
  <line x1="710" y1="600" x2="710" y2="635" stroke="#64748b" stroke-width="1.5"/>
  <text x="695" y="622" font-family="Arial" font-size="11" font-weight="bold" fill="#475569">D5</text>
  <text x="720" y="622" font-family="Arial" font-size="10.5" font-weight="bold" fill="#1e293b">applications</text>

  <!-- Process 6.0: Placement Analytics -->
  <circle cx="1020" cy="310" r="55" fill="#f0fdf4" stroke="#22c55e" stroke-width="2" filter="url(#shadowD1)"/>
  <text x="1020" y="300" font-family="Arial" font-size="12" font-weight="bold" fill="#166534" text-anchor="middle">6.0</text>
  <text x="1020" y="318" font-family="Arial" font-size="11" font-weight="bold" fill="#166534" text-anchor="middle">Analytics &amp;</text>
  <text x="1020" y="333" font-family="Arial" font-size="11" font-weight="bold" fill="#166534" text-anchor="middle">Prediction</text>

  <!-- Inter-process & Data Store Arrows -->
  <line x1="200" y1="215" x2="200" y2="260" stroke="#334155" stroke-width="1.5" marker-end="url(#arrD1)"/>
  <line x1="450" y1="215" x2="450" y2="260" stroke="#334155" stroke-width="1.5" marker-end="url(#arrD1)"/>
  <line x1="750" y1="215" x2="750" y2="260" stroke="#334155" stroke-width="1.5" marker-end="url(#arrD1)"/>

  <!-- Resume to AI Engine -->
  <path d="M 450 295 L 450 395" fill="none" stroke="#ea580c" stroke-width="2" marker-end="url(#arrD1)"/>
  <text x="455" y="350" font-family="Arial" font-size="10.5" font-weight="bold" fill="#c2410c">Resume Text / BLOB</text>

  <!-- Jobs to AI Engine -->
  <path d="M 680 280 Q 550 340 495 410" fill="none" stroke="#2563eb" stroke-width="1.5" marker-end="url(#arrD1)"/>
  <text x="575" y="340" font-family="Arial" font-size="10" font-weight="bold" fill="#1e40af">Job Requirements</text>

  <!-- AI to Gemini -->
  <line x1="430" y1="525" x2="430" y2="600" stroke="#ea580c" stroke-width="2" marker-end="url(#arrD1)"/>
  <line x1="470" y1="600" x2="470" y2="525" stroke="#ea580c" stroke-width="2" marker-end="url(#arrD1)"/>

  <!-- AI to D4 -->
  <line x1="385" y1="460" x2="270" y2="460" stroke="#334155" stroke-width="1.5" marker-end="url(#arrD1)"/>
  <text x="280" y="452" font-family="Arial" font-size="10" font-weight="bold" fill="#334155">Store Scores</text>

  <!-- AI to Process 5 (Apply) -->
  <line x1="515" y1="460" x2="690" y2="460" stroke="#334155" stroke-width="1.5" marker-end="url(#arrD1)"/>
  <text x="540" y="452" font-family="Arial" font-size="10" font-weight="bold" fill="#334155">Matched Score</text>

  <!-- Process 5 to D5 -->
  <line x1="750" y1="520" x2="750" y2="600" stroke="#334155" stroke-width="1.5" marker-end="url(#arrD1)"/>

  <!-- Data to Analytics (Process 6.0) -->
  <path d="M 820 615 Q 980 600 1020 365" fill="none" stroke="#22c55e" stroke-width="1.5" marker-end="url(#arrD1)"/>
  <text x="910" y="520" font-family="Arial" font-size="10" font-weight="bold" fill="#166534">Application Data</text>

</svg>
`;

renderSvgToPng(dfd1Svg, 'dfd1_diagram.png', 1200, 850);

// 5. DFD Level 2 (AI Resume Analysis Subsystem)
const dfd2Svg = `
<svg width="1200" height="750" viewBox="0 0 1200 750" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradDfd2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7c2d12"/>
      <stop offset="100%" stop-color="#c2410c"/>
    </linearGradient>
    <filter id="shadowD2" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="3" stdDeviation="3" flood-opacity="0.12"/>
    </filter>
    <marker id="arrD2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#334155"/>
    </marker>
  </defs>

  <rect width="1200" height="750" fill="#ffffff"/>

  <!-- Title -->
  <rect x="50" y="25" width="1100" height="55" rx="8" fill="url(#gradDfd2)" filter="url(#shadowD2)"/>
  <text x="600" y="60" font-family="'Times New Roman', Times, serif" font-size="19" font-weight="bold" fill="#ffffff" text-anchor="middle">
    FIGURE 5.4: DFD LEVEL-2 (PROCESS 4.0 - AI ATS RESUME EVALUATION &amp; SKILL GAP SUBSYSTEM)
  </text>

  <!-- Process 4.1 -->
  <circle cx="180" cy="220" r="55" fill="#fff7ed" stroke="#ea580c" stroke-width="2" filter="url(#shadowD2)"/>
  <text x="180" y="208" font-family="Arial" font-size="12" font-weight="bold" fill="#9a3412" text-anchor="middle">4.1</text>
  <text x="180" y="226" font-family="Arial" font-size="11" font-weight="bold" fill="#9a3412" text-anchor="middle">PDF Extraction</text>
  <text x="180" y="241" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">(Apache PDFBox)</text>

  <!-- Process 4.2 -->
  <circle cx="420" cy="220" r="55" fill="#fff7ed" stroke="#ea580c" stroke-width="2" filter="url(#shadowD2)"/>
  <text x="420" y="208" font-family="Arial" font-size="12" font-weight="bold" fill="#9a3412" text-anchor="middle">4.2</text>
  <text x="420" y="226" font-family="Arial" font-size="11" font-weight="bold" fill="#9a3412" text-anchor="middle">Cache Purge</text>
  <text x="420" y="241" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">(Delete Stale Rows)</text>

  <!-- Process 4.3 -->
  <circle cx="660" cy="220" r="55" fill="#fff7ed" stroke="#ea580c" stroke-width="2" filter="url(#shadowD2)"/>
  <text x="660" y="208" font-family="Arial" font-size="12" font-weight="bold" fill="#9a3412" text-anchor="middle">4.3</text>
  <text x="660" y="226" font-family="Arial" font-size="11" font-weight="bold" fill="#9a3412" text-anchor="middle">Prompt Engine</text>
  <text x="660" y="241" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">(Multimodal/JSON)</text>

  <!-- Process 4.4 -->
  <circle cx="900" cy="220" r="55" fill="#fff7ed" stroke="#ea580c" stroke-width="2" filter="url(#shadowD2)"/>
  <text x="900" y="208" font-family="Arial" font-size="12" font-weight="bold" fill="#9a3412" text-anchor="middle">4.4</text>
  <text x="900" y="226" font-family="Arial" font-size="11" font-weight="bold" fill="#9a3412" text-anchor="middle">Gemini Call</text>
  <text x="900" y="241" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">(WebClient 15s)</text>

  <!-- Bottom Row: Process 4.5 & 4.6 -->
  <circle cx="660" cy="460" r="55" fill="#fff7ed" stroke="#ea580c" stroke-width="2" filter="url(#shadowD2)"/>
  <text x="660" y="448" font-family="Arial" font-size="12" font-weight="bold" fill="#9a3412" text-anchor="middle">4.5</text>
  <text x="660" y="466" font-family="Arial" font-size="11" font-weight="bold" fill="#9a3412" text-anchor="middle">Response Parse</text>
  <text x="660" y="481" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">(Regex JSON Clean)</text>

  <circle cx="420" cy="460" r="55" fill="#fff7ed" stroke="#ea580c" stroke-width="2" filter="url(#shadowD2)"/>
  <text x="420" y="448" font-family="Arial" font-size="12" font-weight="bold" fill="#9a3412" text-anchor="middle">4.6</text>
  <text x="420" y="466" font-family="Arial" font-size="11" font-weight="bold" fill="#9a3412" text-anchor="middle">Persist Scores</text>
  <text x="420" y="481" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">(Save AiAnalysis)</text>

  <!-- External AI Entity -->
  <rect x="810" y="380" width="180" height="60" rx="6" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5"/>
  <text x="900" y="405" font-family="Arial" font-size="12" font-weight="bold" fill="#991b1b" text-anchor="middle">Google Generative AI</text>
  <text x="900" y="425" font-family="Arial" font-size="11" fill="#7f1d1d" text-anchor="middle">gemini-1.5-flash</text>

  <!-- Data Store D_AI -->
  <rect x="110" y="440" width="140" height="40" rx="3" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
  <line x1="145" y1="440" x2="145" y2="480" stroke="#64748b" stroke-width="1.5"/>
  <text x="125" y="465" font-family="Arial" font-size="11" font-weight="bold" fill="#475569">D4</text>
  <text x="155" y="465" font-family="Arial" font-size="11" font-weight="bold" fill="#1e293b">ai_analysis</text>

  <!-- Connectors -->
  <line x1="235" y1="220" x2="365" y2="220" stroke="#334155" stroke-width="1.5" marker-end="url(#arrD2)"/>
  <line x1="475" y1="220" x2="605" y2="220" stroke="#334155" stroke-width="1.5" marker-end="url(#arrD2)"/>
  <line x1="715" y1="220" x2="845" y2="220" stroke="#334155" stroke-width="1.5" marker-end="url(#arrD2)"/>

  <line x1="900" y1="275" x2="900" y2="380" stroke="#ea580c" stroke-width="1.5" marker-end="url(#arrD2)"/>
  <line x1="850" y1="440" x2="715" y2="460" stroke="#ea580c" stroke-width="1.5" marker-end="url(#arrD2)"/>

  <line x1="605" y1="460" x2="475" y2="460" stroke="#334155" stroke-width="1.5" marker-end="url(#arrD2)"/>
  <line x1="365" y1="460" x2="250" y2="460" stroke="#334155" stroke-width="1.5" marker-end="url(#arrD2)"/>

  <!-- Annotations -->
  <text x="300" y="210" font-family="Arial" font-size="10" fill="#64748b">Raw Text</text>
  <text x="540" y="210" font-family="Arial" font-size="10" fill="#64748b">Clean State</text>
  <text x="780" y="210" font-family="Arial" font-size="10" fill="#64748b">Payload</text>
  <text x="770" y="475" font-family="Arial" font-size="10" fill="#64748b">JSON Body</text>
  <text x="530" y="475" font-family="Arial" font-size="10" fill="#64748b">Validated DTO</text>

</svg>
`;

renderSvgToPng(dfd2Svg, 'dfd2_diagram.png', 1200, 750);

// 6. DFD Level 3 (Application & Recruiter Workflow)
const dfd3Svg = `
<svg width="1200" height="750" viewBox="0 0 1200 750" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradDfd3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14532d"/>
      <stop offset="100%" stop-color="#15803d"/>
    </linearGradient>
    <filter id="shadowD3" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="3" stdDeviation="3" flood-opacity="0.12"/>
    </filter>
    <marker id="arrD3" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#334155"/>
    </marker>
  </defs>

  <rect width="1200" height="750" fill="#ffffff"/>

  <!-- Title -->
  <rect x="50" y="25" width="1100" height="55" rx="8" fill="url(#gradDfd3)" filter="url(#shadowD3)"/>
  <text x="600" y="60" font-family="'Times New Roman', Times, serif" font-size="19" font-weight="bold" fill="#ffffff" text-anchor="middle">
    FIGURE 5.5: DFD LEVEL-3 (PROCESS 5.0 - JOB APPLICATION &amp; RECRUITER LIFECYCLE)
  </text>

  <!-- Process 5.1: Eligibility Check & Apply -->
  <circle cx="200" cy="240" r="55" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" filter="url(#shadowD3)"/>
  <text x="200" y="228" font-family="Arial" font-size="12" font-weight="bold" fill="#14532d" text-anchor="middle">5.1</text>
  <text x="200" y="246" font-family="Arial" font-size="11" font-weight="bold" fill="#14532d" text-anchor="middle">Check Eligibility</text>
  <text x="200" y="261" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">&amp; Submit App</text>

  <!-- Process 5.2: Recruiter Review & Screening -->
  <circle cx="500" cy="240" r="55" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" filter="url(#shadowD3)"/>
  <text x="500" y="228" font-family="Arial" font-size="12" font-weight="bold" fill="#14532d" text-anchor="middle">5.2</text>
  <text x="500" y="246" font-family="Arial" font-size="11" font-weight="bold" fill="#14532d" text-anchor="middle">Review Candidates</text>
  <text x="500" y="261" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">&amp; ATS Scores</text>

  <!-- Process 5.3: Status Update -->
  <circle cx="800" cy="240" r="55" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" filter="url(#shadowD3)"/>
  <text x="800" y="228" font-family="Arial" font-size="12" font-weight="bold" fill="#14532d" text-anchor="middle">5.3</text>
  <text x="800" y="246" font-family="Arial" font-size="11" font-weight="bold" fill="#14532d" text-anchor="middle">Update Status</text>
  <text x="800" y="261" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">(Shortlist/Select)</text>

  <!-- Process 5.4: Notification & Reporting -->
  <circle cx="800" cy="480" r="55" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" filter="url(#shadowD3)"/>
  <text x="800" y="468" font-family="Arial" font-size="12" font-weight="bold" fill="#14532d" text-anchor="middle">5.4</text>
  <text x="800" y="486" font-family="Arial" font-size="11" font-weight="bold" fill="#14532d" text-anchor="middle">Student Notify</text>
  <text x="800" y="501" font-family="Arial" font-size="10.5" fill="#475569" text-anchor="middle">&amp; Analytics Sync</text>

  <!-- Data Store D5: Applications -->
  <rect x="420" y="460" width="160" height="40" rx="3" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
  <line x1="455" y1="460" x2="455" y2="500" stroke="#64748b" stroke-width="1.5"/>
  <text x="435" y="485" font-family="Arial" font-size="11" font-weight="bold" fill="#475569">D5</text>
  <text x="470" y="485" font-family="Arial" font-size="11" font-weight="bold" fill="#1e293b">applications</text>

  <!-- Connectors -->
  <line x1="255" y1="240" x2="445" y2="240" stroke="#334155" stroke-width="1.5" marker-end="url(#arrD3)"/>
  <line x1="555" y1="240" x2="745" y2="240" stroke="#334155" stroke-width="1.5" marker-end="url(#arrD3)"/>
  <line x1="800" y1="295" x2="800" y2="425" stroke="#334155" stroke-width="1.5" marker-end="url(#arrD3)"/>

  <line x1="745" y1="480" x2="580" y2="480" stroke="#334155" stroke-width="1.5" marker-end="url(#arrD3)"/>
  <path d="M 500 295 L 500 460" fill="none" stroke="#334155" stroke-width="1.5" marker-end="url(#arrD3)"/>

  <!-- Labels -->
  <text x="320" y="230" font-family="Arial" font-size="10.5" fill="#475569">New Application</text>
  <text x="630" y="230" font-family="Arial" font-size="10.5" fill="#475569">Decision Event</text>
  <text x="810" y="360" font-family="Arial" font-size="10.5" fill="#475569">Status Change</text>

</svg>
`;

renderSvgToPng(dfd3Svg, 'dfd3_diagram.png', 1200, 750);

// 7. Complete Entity-Relationship (E-R) Diagram
const erSvg = `
<svg width="1300" height="900" viewBox="0 0 1300 900" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradEr" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
    <filter id="shadowEr" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="2" dy="3" stdDeviation="3" flood-opacity="0.12"/>
    </filter>
  </defs>

  <rect width="1300" height="900" fill="#ffffff"/>

  <!-- Title -->
  <rect x="50" y="20" width="1200" height="50" rx="8" fill="url(#gradEr)" filter="url(#shadowEr)"/>
  <text x="650" y="52" font-family="'Times New Roman', Times, serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">
    FIGURE 5.6: COMPLETE ENTITY-RELATIONSHIP (E-R) DIAGRAM
  </text>

  <!-- TABLE 1: USERS -->
  <rect x="50" y="100" width="220" height="180" rx="6" fill="#f8fafc" stroke="#1e3a8a" stroke-width="2" filter="url(#shadowEr)"/>
  <rect x="50" y="100" width="220" height="30" rx="6" fill="#1e3a8a"/>
  <text x="160" y="121" font-family="Arial" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">USERS</text>
  <text x="60" y="148" font-family="Arial" font-size="10.5" font-weight="bold" fill="#dc2626">PK  id: BIGINT</text>
  <text x="60" y="166" font-family="Arial" font-size="10.5" fill="#334155">email: VARCHAR(100)</text>
  <text x="60" y="184" font-family="Arial" font-size="10.5" fill="#334155">password: VARCHAR(255)</text>
  <text x="60" y="202" font-family="Arial" font-size="10.5" fill="#334155">role: VARCHAR(20)</text>
  <text x="60" y="220" font-family="Arial" font-size="10.5" fill="#334155">enabled: BOOLEAN</text>
  <text x="60" y="238" font-family="Arial" font-size="10.5" fill="#334155">created_at: DATETIME</text>
  <text x="60" y="256" font-family="Arial" font-size="10.5" fill="#334155">updated_at: DATETIME</text>

  <!-- TABLE 2: STUDENTS -->
  <rect x="350" y="100" width="240" height="230" rx="6" fill="#f8fafc" stroke="#2563eb" stroke-width="2" filter="url(#shadowEr)"/>
  <rect x="350" y="100" width="240" height="30" rx="6" fill="#2563eb"/>
  <text x="470" y="121" font-family="Arial" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">STUDENTS</text>
  <text x="360" y="148" font-family="Arial" font-size="10.5" font-weight="bold" fill="#dc2626">PK  id: BIGINT</text>
  <text x="360" y="166" font-family="Arial" font-size="10.5" font-weight="bold" fill="#2563eb">FK  user_id: BIGINT</text>
  <text x="360" y="184" font-family="Arial" font-size="10.5" fill="#334155">full_name: VARCHAR(100)</text>
  <text x="360" y="202" font-family="Arial" font-size="10.5" fill="#334155">register_number: VARCHAR(30)</text>
  <text x="360" y="220" font-family="Arial" font-size="10.5" fill="#334155">department: VARCHAR(50)</text>
  <text x="360" y="238" font-family="Arial" font-size="10.5" fill="#334155">cgpa: DOUBLE</text>
  <text x="360" y="256" font-family="Arial" font-size="10.5" fill="#334155">skills: TEXT</text>
  <text x="360" y="274" font-family="Arial" font-size="10.5" fill="#334155">phone: VARCHAR(15)</text>
  <text x="360" y="292" font-family="Arial" font-size="10.5" fill="#334155">graduation_year: INT</text>
  <text x="360" y="310" font-family="Arial" font-size="10.5" fill="#334155">profile_image: VARCHAR(255)</text>

  <!-- TABLE 3: RESUMES -->
  <rect x="350" y="380" width="240" height="210" rx="6" fill="#f8fafc" stroke="#059669" stroke-width="2" filter="url(#shadowEr)"/>
  <rect x="350" y="380" width="240" height="30" rx="6" fill="#059669"/>
  <text x="470" y="401" font-family="Arial" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">RESUMES</text>
  <text x="360" y="428" font-family="Arial" font-size="10.5" font-weight="bold" fill="#dc2626">PK  id: BIGINT</text>
  <text x="360" y="446" font-family="Arial" font-size="10.5" font-weight="bold" fill="#2563eb">FK  student_id: BIGINT</text>
  <text x="360" y="464" font-family="Arial" font-size="10.5" fill="#334155">file_name: VARCHAR(255)</text>
  <text x="360" y="482" font-family="Arial" font-size="10.5" fill="#334155">file_type: VARCHAR(50)</text>
  <text x="360" y="500" font-family="Arial" font-size="10.5" fill="#334155">file_size: BIGINT</text>
  <text x="360" y="518" font-family="Arial" font-size="10.5" fill="#334155">file_path: VARCHAR(500)</text>
  <text x="360" y="536" font-family="Arial" font-size="10.5" fill="#334155">file_data: LONGBLOB</text>
  <text x="360" y="554" font-family="Arial" font-size="10.5" fill="#334155">is_active: BOOLEAN</text>
  <text x="360" y="572" font-family="Arial" font-size="10.5" fill="#334155">uploaded_at: DATETIME</text>

  <!-- TABLE 4: COMPANIES -->
  <rect x="700" y="100" width="240" height="210" rx="6" fill="#f8fafc" stroke="#d97706" stroke-width="2" filter="url(#shadowEr)"/>
  <rect x="700" y="100" width="240" height="30" rx="6" fill="#d97706"/>
  <text x="820" y="121" font-family="Arial" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">COMPANIES</text>
  <text x="710" y="148" font-family="Arial" font-size="10.5" font-weight="bold" fill="#dc2626">PK  id: BIGINT</text>
  <text x="710" y="166" font-family="Arial" font-size="10.5" font-weight="bold" fill="#2563eb">FK  user_id: BIGINT</text>
  <text x="710" y="184" font-family="Arial" font-size="10.5" fill="#334155">company_name: VARCHAR(150)</text>
  <text x="710" y="202" font-family="Arial" font-size="10.5" fill="#334155">industry: VARCHAR(100)</text>
  <text x="710" y="220" font-family="Arial" font-size="10.5" fill="#334155">website: VARCHAR(200)</text>
  <text x="710" y="238" font-family="Arial" font-size="10.5" fill="#334155">location: VARCHAR(100)</text>
  <text x="710" y="256" font-family="Arial" font-size="10.5" fill="#334155">contact_person: VARCHAR(100)</text>
  <text x="710" y="274" font-family="Arial" font-size="10.5" fill="#334155">logo_url: VARCHAR(255)</text>

  <!-- TABLE 5: JOBS -->
  <rect x="700" y="380" width="240" height="230" rx="6" fill="#f8fafc" stroke="#d97706" stroke-width="2" filter="url(#shadowEr)"/>
  <rect x="700" y="380" width="240" height="30" rx="6" fill="#d97706"/>
  <text x="820" y="401" font-family="Arial" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">JOBS</text>
  <text x="710" y="428" font-family="Arial" font-size="10.5" font-weight="bold" fill="#dc2626">PK  id: BIGINT</text>
  <text x="710" y="446" font-family="Arial" font-size="10.5" font-weight="bold" fill="#2563eb">FK  company_id: BIGINT</text>
  <text x="710" y="464" font-family="Arial" font-size="10.5" fill="#334155">title: VARCHAR(150)</text>
  <text x="710" y="482" font-family="Arial" font-size="10.5" fill="#334155">description: TEXT</text>
  <text x="710" y="500" font-family="Arial" font-size="10.5" fill="#334155">department: VARCHAR(50)</text>
  <text x="710" y="518" font-family="Arial" font-size="10.5" fill="#334155">required_skills: TEXT</text>
  <text x="710" y="536" font-family="Arial" font-size="10.5" fill="#334155">min_cgpa: DOUBLE</text>
  <text x="710" y="554" font-family="Arial" font-size="10.5" fill="#334155">salary_package: VARCHAR(50)</text>
  <text x="710" y="572" font-family="Arial" font-size="10.5" fill="#334155">status: VARCHAR(20) [OPEN]</text>
  <text x="710" y="590" font-family="Arial" font-size="10.5" fill="#334155">deadline: DATE</text>

  <!-- TABLE 6: AI_ANALYSIS (Center Bottom) -->
  <rect x="350" y="660" width="240" height="200" rx="6" fill="#f8fafc" stroke="#dc2626" stroke-width="2" filter="url(#shadowEr)"/>
  <rect x="350" y="660" width="240" height="30" rx="6" fill="#dc2626"/>
  <text x="470" y="681" font-family="Arial" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">AI_ANALYSIS</text>
  <text x="360" y="708" font-family="Arial" font-size="10.5" font-weight="bold" fill="#dc2626">PK  id: BIGINT</text>
  <text x="360" y="726" font-family="Arial" font-size="10.5" font-weight="bold" fill="#2563eb">FK  student_id: BIGINT</text>
  <text x="360" y="744" font-family="Arial" font-size="10.5" font-weight="bold" fill="#2563eb">FK  job_id: BIGINT</text>
  <text x="360" y="762" font-family="Arial" font-size="10.5" fill="#334155">overall_match: INT</text>
  <text x="360" y="780" font-family="Arial" font-size="10.5" fill="#334155">matched_skills: TEXT</text>
  <text x="360" y="798" font-family="Arial" font-size="10.5" fill="#334155">missing_skills: TEXT</text>
  <text x="360" y="816" font-family="Arial" font-size="10.5" fill="#334155">ai_feedback: LONGTEXT</text>
  <text x="360" y="834" font-family="Arial" font-size="10.5" fill="#334155">analyzed_at: DATETIME</text>

  <!-- TABLE 7: APPLICATIONS (Right Bottom) -->
  <rect x="700" y="660" width="240" height="180" rx="6" fill="#f8fafc" stroke="#7c3aed" stroke-width="2" filter="url(#shadowEr)"/>
  <rect x="700" y="660" width="240" height="30" rx="6" fill="#7c3aed"/>
  <text x="820" y="681" font-family="Arial" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">APPLICATIONS</text>
  <text x="710" y="708" font-family="Arial" font-size="10.5" font-weight="bold" fill="#dc2626">PK  id: BIGINT</text>
  <text x="710" y="726" font-family="Arial" font-size="10.5" font-weight="bold" fill="#2563eb">FK  student_id: BIGINT</text>
  <text x="710" y="744" font-family="Arial" font-size="10.5" font-weight="bold" fill="#2563eb">FK  job_id: BIGINT</text>
  <text x="710" y="762" font-family="Arial" font-size="10.5" fill="#334155">status: VARCHAR(30)</text>
  <text x="710" y="780" font-family="Arial" font-size="10.5" fill="#334155">applied_at: DATETIME</text>
  <text x="710" y="798" font-family="Arial" font-size="10.5" fill="#334155">recruiter_notes: TEXT</text>

  <!-- TABLE 8: OTP_VERIFICATION (Top Right) -->
  <rect x="1030" y="100" width="220" height="160" rx="6" fill="#f8fafc" stroke="#64748b" stroke-width="2" filter="url(#shadowEr)"/>
  <rect x="1030" y="100" width="220" height="30" rx="6" fill="#64748b"/>
  <text x="1140" y="121" font-family="Arial" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">OTP_VERIFICATION</text>
  <text x="1040" y="148" font-family="Arial" font-size="10.5" font-weight="bold" fill="#dc2626">PK  id: BIGINT</text>
  <text x="1040" y="166" font-family="Arial" font-size="10.5" fill="#334155">email: VARCHAR(100)</text>
  <text x="1040" y="184" font-family="Arial" font-size="10.5" fill="#334155">otp_code: VARCHAR(6)</text>
  <text x="1040" y="202" font-family="Arial" font-size="10.5" fill="#334155">expiry_time: DATETIME</text>
  <text x="1040" y="220" font-family="Arial" font-size="10.5" fill="#334155">is_verified: BOOLEAN</text>
  <text x="1040" y="238" font-family="Arial" font-size="10.5" fill="#334155">created_at: DATETIME</text>

  <!-- TABLE 9: FACULTIES (Bottom Left) -->
  <rect x="50" y="380" width="220" height="170" rx="6" fill="#f8fafc" stroke="#0284c7" stroke-width="2" filter="url(#shadowEr)"/>
  <rect x="50" y="380" width="220" height="30" rx="6" fill="#0284c7"/>
  <text x="160" y="401" font-family="Arial" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">FACULTIES</text>
  <text x="60" y="428" font-family="Arial" font-size="10.5" font-weight="bold" fill="#dc2626">PK  id: BIGINT</text>
  <text x="60" y="446" font-family="Arial" font-size="10.5" font-weight="bold" fill="#2563eb">FK  user_id: BIGINT</text>
  <text x="60" y="464" font-family="Arial" font-size="10.5" fill="#334155">faculty_name: VARCHAR(100)</text>
  <text x="60" y="482" font-family="Arial" font-size="10.5" fill="#334155">department: VARCHAR(50)</text>
  <text x="60" y="500" font-family="Arial" font-size="10.5" fill="#334155">designation: VARCHAR(50)</text>
  <text x="60" y="518" font-family="Arial" font-size="10.5" fill="#334155">employee_code: VARCHAR(30)</text>

  <!-- Relationships Lines with Cardinalities -->
  <!-- User to Student (1:1) -->
  <line x1="270" y1="150" x2="350" y2="150" stroke="#334155" stroke-width="2"/>
  <text x="280" y="142" font-family="Arial" font-size="11" font-weight="bold" fill="#334155">1</text>
  <text x="335" y="142" font-family="Arial" font-size="11" font-weight="bold" fill="#334155">1</text>

  <!-- User to Company (1:1) -->
  <path d="M 160 280 L 160 340 L 750 340 L 750 310" fill="none" stroke="#334155" stroke-width="2"/>
  <text x="170" y="300" font-family="Arial" font-size="11" font-weight="bold" fill="#334155">1</text>
  <text x="735" y="330" font-family="Arial" font-size="11" font-weight="bold" fill="#334155">1</text>

  <!-- Student to Resume (1:N) -->
  <line x1="470" y1="330" x2="470" y2="380" stroke="#334155" stroke-width="2"/>
  <text x="455" y="345" font-family="Arial" font-size="11" font-weight="bold" fill="#334155">1</text>
  <text x="455" y="375" font-family="Arial" font-size="11" font-weight="bold" fill="#334155">N</text>

  <!-- Company to Job (1:N) -->
  <line x1="820" y1="310" x2="820" y2="380" stroke="#334155" stroke-width="2"/>
  <text x="805" y="330" font-family="Arial" font-size="11" font-weight="bold" fill="#334155">1</text>
  <text x="805" y="375" font-family="Arial" font-size="11" font-weight="bold" fill="#334155">N</text>

  <!-- Student & Job to Application (1:N and 1:N) -->
  <path d="M 590 280 Q 650 350 710 660" fill="none" stroke="#7c3aed" stroke-width="2"/>
  <text x="600" y="300" font-family="Arial" font-size="11" font-weight="bold" fill="#7c3aed">1</text>
  <text x="700" y="650" font-family="Arial" font-size="11" font-weight="bold" fill="#7c3aed">N</text>

  <line x1="820" y1="610" x2="820" y2="660" stroke="#7c3aed" stroke-width="2"/>
  <text x="805" y="625" font-family="Arial" font-size="11" font-weight="bold" fill="#7c3aed">1</text>
  <text x="805" y="655" font-family="Arial" font-size="11" font-weight="bold" fill="#7c3aed">N</text>

  <!-- Student & Job to AiAnalysis (1:N and 1:N) -->
  <line x1="470" y1="590" x2="470" y2="660" stroke="#dc2626" stroke-width="2"/>
  <text x="455" y="610" font-family="Arial" font-size="11" font-weight="bold" fill="#dc2626">1</text>
  <text x="455" y="655" font-family="Arial" font-size="11" font-weight="bold" fill="#dc2626">N</text>

  <path d="M 700 550 Q 620 570 590 680" fill="none" stroke="#dc2626" stroke-width="2"/>
  <text x="680" y="540" font-family="Arial" font-size="11" font-weight="bold" fill="#dc2626">1</text>
  <text x="600" y="675" font-family="Arial" font-size="11" font-weight="bold" fill="#dc2626">N</text>

</svg>
`;

renderSvgToPng(erSvg, 'er_diagram.png', 1300, 900);

console.log("All 7 technical diagrams generated successfully!");
