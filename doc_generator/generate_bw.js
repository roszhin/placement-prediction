const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

const bwDir = path.join(__dirname, 'diagrams', 'bw');
if (!fs.existsSync(bwDir)) {
    fs.mkdirSync(bwDir, { recursive: true });
}

function renderSvgToPng(svgString, fileName, width = 1200) {
    const resvg = new Resvg(svgString, {
        fitTo: { mode: 'width', value: width }
    });
    const pngData = resvg.render();
    const filePath = path.join(bwDir, fileName);
    fs.writeFileSync(filePath, pngData.asPng());
    console.log(`Saved BW: ${fileName} (${fs.statSync(filePath).size} bytes)`);
}

// 1. Flowchart Diagram (Black & White)
const flowchartBwSvg = `
<svg width="1000" height="900" viewBox="0 0 1000 900" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#000000"/>
    </marker>
  </defs>

  <rect width="1000" height="900" fill="#ffffff"/>

  <!-- Start -->
  <rect x="420" y="30" width="160" height="40" rx="20" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="500" y="55" font-family="'Times New Roman', Arial" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">START</text>
  <line x1="500" y1="70" x2="500" y2="100" stroke="#000000" stroke-width="2" marker-end="url(#arr)"/>

  <!-- Process: Access / Login -->
  <rect x="380" y="100" width="240" height="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="500" y="128" font-family="'Times New Roman', Arial" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">User Access / Login / Registration</text>
  <line x1="500" y1="145" x2="500" y2="175" stroke="#000000" stroke-width="2" marker-end="url(#arr)"/>

  <!-- Decision: Authenticated & Role -->
  <polygon points="500,175 640,215 500,255 360,215" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="500" y="212" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">Authenticated &amp;</text>
  <text x="500" y="226" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">Role Type?</text>

  <!-- Left: Recruiter -->
  <line x1="360" y1="215" x2="180" y2="215" stroke="#000000" stroke-width="2"/>
  <line x1="180" y1="215" x2="180" y2="280" stroke="#000000" stroke-width="2" marker-end="url(#arr)"/>
  <text x="240" y="205" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000">COMPANY</text>

  <rect x="70" y="280" width="220" height="50" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="180" y="302" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">Post Jobs &amp; Set Cutoffs</text>
  <text x="180" y="318" font-family="'Times New Roman', Arial" font-size="11" fill="#000000" text-anchor="middle">(CGPA, Dept, Required Skills)</text>
  <line x1="180" y1="330" x2="180" y2="370" stroke="#000000" stroke-width="2" marker-end="url(#arr)"/>

  <rect x="70" y="370" width="220" height="50" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="180" y="392" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">Review Candidates &amp; Resumes</text>
  <text x="180" y="408" font-family="'Times New Roman', Arial" font-size="11" fill="#000000" text-anchor="middle">Screen with AI ATS Scores</text>
  <line x1="180" y1="420" x2="180" y2="460" stroke="#000000" stroke-width="2" marker-end="url(#arr)"/>

  <rect x="70" y="460" width="220" height="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="180" y="488" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">Update Status (Shortlist / Reject)</text>

  <!-- Center: Student -->
  <line x1="500" y1="255" x2="500" y2="280" stroke="#000000" stroke-width="2" marker-end="url(#arr)"/>
  <text x="515" y="270" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000">STUDENT</text>

  <rect x="390" y="280" width="220" height="50" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="500" y="302" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">Upload Resume &amp; Manage Profile</text>
  <text x="500" y="318" font-family="'Times New Roman', Arial" font-size="11" fill="#000000" text-anchor="middle">(PDF / Image Parsing via PDFBox)</text>
  <line x1="500" y1="330" x2="500" y2="370" stroke="#000000" stroke-width="2" marker-end="url(#arr)"/>

  <rect x="390" y="370" width="220" height="50" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="500" y="392" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">AI Job Match &amp; Skill Analysis</text>
  <text x="500" y="408" font-family="'Times New Roman', Arial" font-size="11" fill="#000000" text-anchor="middle">(Gemini Multimodal / Local Fallback)</text>
  <line x1="500" y1="420" x2="500" y2="460" stroke="#000000" stroke-width="2" marker-end="url(#arr)"/>

  <!-- Decision: Eligible & Satisfied -->
  <polygon points="500,460 620,495 500,530 380,495" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="500" y="492" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">Meets Criteria &amp;</text>
  <text x="500" y="506" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">Apply for Job?</text>

  <line x1="500" y1="530" x2="500" y2="570" stroke="#000000" stroke-width="2" marker-end="url(#arr)"/>
  <text x="510" y="550" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000">YES</text>

  <rect x="390" y="570" width="220" height="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="500" y="598" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">Submit Job Application</text>

  <line x1="380" y1="495" x2="330" y2="495" stroke="#000000" stroke-width="1.5"/>
  <line x1="330" y1="495" x2="330" y2="650" stroke="#000000" stroke-width="1.5"/>
  <line x1="330" y1="650" x2="500" y2="650" stroke="#000000" stroke-width="1.5"/>
  <text x="340" y="485" font-family="'Times New Roman', Arial" font-size="10" font-weight="bold" fill="#000000">NO (Skill Gap View)</text>

  <line x1="500" y1="615" x2="500" y2="670" stroke="#000000" stroke-width="2" marker-end="url(#arr)"/>

  <rect x="390" y="670" width="220" height="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="500" y="698" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">Track Application Status</text>

  <!-- Right: Faculty / Admin -->
  <line x1="640" y1="215" x2="820" y2="215" stroke="#000000" stroke-width="2"/>
  <line x1="820" y1="215" x2="820" y2="280" stroke="#000000" stroke-width="2" marker-end="url(#arr)"/>
  <text x="700" y="205" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000">FACULTY / ADMIN</text>

  <rect x="710" y="280" width="220" height="50" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="820" y="302" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">Verify Students &amp; Companies</text>
  <text x="820" y="318" font-family="'Times New Roman', Arial" font-size="11" fill="#000000" text-anchor="middle">Monitor Placement Readiness</text>
  <line x1="820" y1="330" x2="820" y2="370" stroke="#000000" stroke-width="2" marker-end="url(#arr)"/>

  <rect x="710" y="370" width="220" height="50" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="820" y="392" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">Generate Reports &amp; Analytics</text>
  <text x="820" y="408" font-family="'Times New Roman', Arial" font-size="11" fill="#000000" text-anchor="middle">Institutional Placement Governance</text>

  <!-- Connect to Logout / End -->
  <line x1="180" y1="505" x2="180" y2="760" stroke="#000000" stroke-width="2"/>
  <line x1="180" y1="760" x2="420" y2="760" stroke="#000000" stroke-width="2" marker-end="url(#arr)"/>

  <line x1="500" y1="715" x2="500" y2="745" stroke="#000000" stroke-width="2" marker-end="url(#arr)"/>

  <line x1="820" y1="420" x2="820" y2="760" stroke="#000000" stroke-width="2"/>
  <line x1="820" y1="760" x2="580" y2="760" stroke="#000000" stroke-width="2" marker-end="url(#arr)"/>

  <!-- Logout / End -->
  <rect x="420" y="745" width="160" height="35" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="500" y="768" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">User Logout</text>
  <line x1="500" y1="780" x2="500" y2="815" stroke="#000000" stroke-width="2" marker-end="url(#arr)"/>

  <rect x="420" y="815" width="160" height="40" rx="20" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="500" y="840" font-family="'Times New Roman', Arial" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">END</text>

</svg>
`;

renderSvgToPng(flowchartBwSvg, 'flowchart_diagram_bw.png', 1000);

// 2. DFD Level 0 (Context Diagram - Black & White)
const dfd0BwSvg = `
<svg width="1000" height="650" viewBox="0 0 1000 650" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr0" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#000000"/>
    </marker>
  </defs>

  <rect width="1000" height="650" fill="#ffffff"/>

  <!-- Central Bubble 0.0 -->
  <circle cx="500" cy="325" r="110" fill="#ffffff" stroke="#000000" stroke-width="2.5"/>
  <text x="500" y="305" font-family="'Times New Roman', Arial" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">0.0</text>
  <text x="500" y="325" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">AI Integrated Placement</text>
  <text x="500" y="342" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">Prediction and Skill Gap</text>
  <text x="500" y="359" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">Analyzer System</text>

  <!-- Entity 1: Student -->
  <rect x="60" y="100" width="160" height="70" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="140" y="140" font-family="'Times New Roman', Arial" font-size="14" font-weight="bold" fill="#000000" text-anchor="middle">STUDENT</text>

  <line x1="220" y1="120" x2="420" y2="240" stroke="#000000" stroke-width="1.5" marker-end="url(#arr0)"/>
  <text x="240" y="170" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">Profile, Resume, Application</text>

  <line x1="400" y1="270" x2="220" y2="155" stroke="#000000" stroke-width="1.5" marker-end="url(#arr0)"/>
  <text x="240" y="235" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">ATS Scores, Jobs, Status</text>

  <!-- Entity 2: Company -->
  <rect x="780" y="100" width="160" height="70" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="860" y="132" font-family="'Times New Roman', Arial" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">COMPANY</text>
  <text x="860" y="150" font-family="'Times New Roman', Arial" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">RECRUITER</text>

  <line x1="780" y1="120" x2="580" y2="240" stroke="#000000" stroke-width="1.5" marker-end="url(#arr0)"/>
  <text x="640" y="170" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">Job Postings, Criteria</text>

  <line x1="600" y1="270" x2="780" y2="155" stroke="#000000" stroke-width="1.5" marker-end="url(#arr0)"/>
  <text x="640" y="235" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">Applicants, ATS Match Data</text>

  <!-- Entity 3: Faculty -->
  <rect x="60" y="470" width="160" height="70" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="140" y="502" font-family="'Times New Roman', Arial" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">FACULTY /</text>
  <text x="140" y="520" font-family="'Times New Roman', Arial" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">COORDINATOR</text>

  <line x1="220" y1="490" x2="410" y2="390" stroke="#000000" stroke-width="1.5" marker-end="url(#arr0)"/>
  <text x="220" y="435" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">Verification, Filters</text>

  <line x1="430" y1="420" x2="220" y2="525" stroke="#000000" stroke-width="1.5" marker-end="url(#arr0)"/>
  <text x="240" y="485" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">Reports, Readiness Data</text>

  <!-- Entity 4: Admin -->
  <rect x="780" y="470" width="160" height="70" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="860" y="502" font-family="'Times New Roman', Arial" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">SYSTEM</text>
  <text x="860" y="520" font-family="'Times New Roman', Arial" font-size="13" font-weight="bold" fill="#000000" text-anchor="middle">ADMINISTRATOR</text>

  <line x1="780" y1="490" x2="590" y2="390" stroke="#000000" stroke-width="1.5" marker-end="url(#arr0)"/>
  <text x="650" y="435" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">Company Approval, Config</text>

  <line x1="570" y1="420" x2="780" y2="525" stroke="#000000" stroke-width="1.5" marker-end="url(#arr0)"/>
  <text x="650" y="485" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">Audit Logs, Placement Stats</text>

  <!-- Entity 5: AI Engine (Top) -->
  <rect x="410" y="40" width="180" height="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="500" y="67" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">Google Gemini AI Engine</text>

  <line x1="480" y1="215" x2="480" y2="85" stroke="#000000" stroke-width="1.5" marker-end="url(#arr0)"/>
  <line x1="520" y1="85" x2="520" y2="215" stroke="#000000" stroke-width="1.5" marker-end="url(#arr0)"/>
  <text x="390" y="150" font-family="'Times New Roman', Arial" font-size="10" fill="#000000">Resume/Prompt</text>
  <text x="530" y="150" font-family="'Times New Roman', Arial" font-size="10" fill="#000000">Evaluation JSON</text>

</svg>
`;

renderSvgToPng(dfd0BwSvg, 'dfd0_diagram_bw.png', 1000);

// 3. DFD Level 1 (Top Level Decomposition - Black & White)
const dfd1BwSvg = `
<svg width="1000" height="750" viewBox="0 0 1000 750" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr1" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#000000"/>
    </marker>
  </defs>

  <rect width="1000" height="750" fill="#ffffff"/>

  <!-- P1.0 -->
  <circle cx="180" cy="120" r="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="180" y="115" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">1.0</text>
  <text x="180" y="132" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">Auth &amp; OTP</text>

  <rect x="110" y="210" width="140" height="30" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
  <line x1="140" y1="210" x2="140" y2="240" stroke="#000000" stroke-width="1.5"/>
  <text x="125" y="230" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000">D1</text>
  <text x="150" y="230" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">users / roles</text>
  <line x1="180" y1="165" x2="180" y2="210" stroke="#000000" stroke-width="1.5" marker-end="url(#arr1)"/>

  <!-- P2.0 -->
  <circle cx="450" cy="120" r="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="450" y="115" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">2.0</text>
  <text x="450" y="132" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">Profile/Resume</text>

  <rect x="380" y="210" width="140" height="30" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
  <line x1="410" y1="210" x2="410" y2="240" stroke="#000000" stroke-width="1.5"/>
  <text x="395" y="230" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000">D2</text>
  <text x="420" y="230" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">students/resumes</text>
  <line x1="450" y1="165" x2="450" y2="210" stroke="#000000" stroke-width="1.5" marker-end="url(#arr1)"/>

  <!-- P3.0 -->
  <circle cx="750" cy="120" r="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="750" y="115" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">3.0</text>
  <text x="750" y="132" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">Job Mgmt</text>

  <rect x="680" y="210" width="140" height="30" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
  <line x1="710" y1="210" x2="710" y2="240" stroke="#000000" stroke-width="1.5"/>
  <text x="695" y="230" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000">D3</text>
  <text x="720" y="230" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">jobs/companies</text>
  <line x1="750" y1="165" x2="750" y2="210" stroke="#000000" stroke-width="1.5" marker-end="url(#arr1)"/>

  <!-- P4.0: AI ATS Evaluation -->
  <circle cx="450" cy="390" r="55" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="450" y="380" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">4.0</text>
  <text x="450" y="398" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">AI ATS Engine &amp;</text>
  <text x="450" y="414" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">Skill Gap Analyzer</text>

  <line x1="450" y1="240" x2="450" y2="335" stroke="#000000" stroke-width="1.5" marker-end="url(#arr1)"/>
  <text x="455" y="290" font-family="'Times New Roman', Arial" font-size="10" fill="#000000">Resume Data</text>

  <line x1="680" y1="230" x2="505" y2="350" stroke="#000000" stroke-width="1.5" marker-end="url(#arr1)"/>
  <text x="580" y="280" font-family="'Times New Roman', Arial" font-size="10" fill="#000000">Job Requirements</text>

  <!-- External Gemini Service -->
  <rect x="360" y="520" width="180" height="40" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
  <text x="450" y="545" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">Google Gemini API</text>
  <line x1="430" y1="445" x2="430" y2="520" stroke="#000000" stroke-width="1.5" marker-end="url(#arr1)"/>
  <line x1="470" y1="520" x2="470" y2="445" stroke="#000000" stroke-width="1.5" marker-end="url(#arr1)"/>

  <!-- D4: AI Analysis -->
  <rect x="110" y="375" width="140" height="30" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
  <line x1="140" y1="375" x2="140" y2="405" stroke="#000000" stroke-width="1.5"/>
  <text x="125" y="395" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000">D4</text>
  <text x="150" y="395" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">ai_analysis</text>
  <line x1="395" y1="390" x2="250" y2="390" stroke="#000000" stroke-width="1.5" marker-end="url(#arr1)"/>

  <!-- P5.0: Application Workflow -->
  <circle cx="750" cy="390" r="50" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="750" y="385" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">5.0</text>
  <text x="750" y="402" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">Application Mgmt</text>

  <line x1="505" y1="390" x2="700" y2="390" stroke="#000000" stroke-width="1.5" marker-end="url(#arr1)"/>
  <text x="560" y="380" font-family="'Times New Roman', Arial" font-size="10" fill="#000000">ATS Match</text>

  <!-- D5: Applications -->
  <rect x="680" y="520" width="140" height="30" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
  <line x1="710" y1="520" x2="710" y2="550" stroke="#000000" stroke-width="1.5"/>
  <text x="695" y="540" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000">D5</text>
  <text x="720" y="540" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">applications</text>
  <line x1="750" y1="440" x2="750" y2="520" stroke="#000000" stroke-width="1.5" marker-end="url(#arr1)"/>

  <!-- P6.0: Placement Analytics -->
  <circle cx="890" cy="270" r="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="890" y="265" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">6.0</text>
  <text x="890" y="282" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">Analytics</text>
  <line x1="820" y1="535" x2="890" y2="315" stroke="#000000" stroke-width="1.5" marker-end="url(#arr1)"/>

</svg>
`;

renderSvgToPng(dfd1BwSvg, 'dfd1_diagram_bw.png', 1000);

// 4. DFD Level 2 (AI Subsystem - Black & White)
const dfd2BwSvg = `
<svg width="1000" height="550" viewBox="0 0 1000 550" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr2" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#000000"/>
    </marker>
  </defs>

  <rect width="1000" height="550" fill="#ffffff"/>

  <!-- Process 4.1 -->
  <circle cx="150" cy="150" r="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="150" y="145" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">4.1</text>
  <text x="150" y="160" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000" text-anchor="middle">PDF Extraction</text>
  <text x="150" y="174" font-family="'Times New Roman', Arial" font-size="9.5" fill="#000000" text-anchor="middle">(Apache PDFBox)</text>

  <!-- Process 4.2 -->
  <circle cx="380" cy="150" r="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="380" y="145" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">4.2</text>
  <text x="380" y="160" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000" text-anchor="middle">Cache Purge</text>
  <text x="380" y="174" font-family="'Times New Roman', Arial" font-size="9.5" fill="#000000" text-anchor="middle">(Delete Old Rows)</text>

  <!-- Process 4.3 -->
  <circle cx="610" cy="150" r="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="610" y="145" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">4.3</text>
  <text x="610" y="160" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000" text-anchor="middle">Prompt Builder</text>
  <text x="610" y="174" font-family="'Times New Roman', Arial" font-size="9.5" fill="#000000" text-anchor="middle">(Multimodal/JSON)</text>

  <!-- Process 4.4 -->
  <circle cx="840" cy="150" r="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="840" y="145" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">4.4</text>
  <text x="840" y="160" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000" text-anchor="middle">Gemini Call</text>
  <text x="840" y="174" font-family="'Times New Roman', Arial" font-size="9.5" fill="#000000" text-anchor="middle">(WebClient API)</text>

  <!-- Bottom: 4.5 & 4.6 -->
  <circle cx="610" cy="370" r="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="610" y="365" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">4.5</text>
  <text x="610" y="380" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000" text-anchor="middle">Parse Response</text>
  <text x="610" y="394" font-family="'Times New Roman', Arial" font-size="9.5" fill="#000000" text-anchor="middle">(JSON Extractor)</text>

  <circle cx="380" cy="370" r="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="380" y="365" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">4.6</text>
  <text x="380" y="380" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000" text-anchor="middle">Persist Scores</text>
  <text x="380" y="394" font-family="'Times New Roman', Arial" font-size="9.5" fill="#000000" text-anchor="middle">(Save Result)</text>

  <!-- External AI -->
  <rect x="760" y="280" width="160" height="40" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
  <text x="840" y="305" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000" text-anchor="middle">Google Generative AI</text>

  <!-- D4 Store -->
  <rect x="80" y="355" width="140" height="30" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
  <line x1="110" y1="355" x2="110" y2="385" stroke="#000000" stroke-width="1.5"/>
  <text x="95" y="375" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000">D4</text>
  <text x="120" y="375" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">ai_analysis</text>

  <!-- Lines -->
  <line x1="195" y1="150" x2="335" y2="150" stroke="#000000" stroke-width="1.5" marker-end="url(#arr2)"/>
  <line x1="425" y1="150" x2="565" y2="150" stroke="#000000" stroke-width="1.5" marker-end="url(#arr2)"/>
  <line x1="655" y1="150" x2="795" y2="150" stroke="#000000" stroke-width="1.5" marker-end="url(#arr2)"/>
  <line x1="840" y1="195" x2="840" y2="280" stroke="#000000" stroke-width="1.5" marker-end="url(#arr2)"/>
  <line x1="795" y1="320" x2="655" y2="360" stroke="#000000" stroke-width="1.5" marker-end="url(#arr2)"/>
  <line x1="565" y1="370" x2="425" y2="370" stroke="#000000" stroke-width="1.5" marker-end="url(#arr2)"/>
  <line x1="335" y1="370" x2="220" y2="370" stroke="#000000" stroke-width="1.5" marker-end="url(#arr2)"/>

</svg>
`;

renderSvgToPng(dfd2BwSvg, 'dfd2_diagram_bw.png', 1000);

// 5. DFD Level 3 (Application Lifecycle - Black & White)
const dfd3BwSvg = `
<svg width="1000" height="550" viewBox="0 0 1000 550" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arr3" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#000000"/>
    </marker>
  </defs>

  <rect width="1000" height="550" fill="#ffffff"/>

  <!-- 5.1 -->
  <circle cx="180" cy="160" r="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="180" y="155" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">5.1</text>
  <text x="180" y="170" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000" text-anchor="middle">Check Eligibility</text>
  <text x="180" y="184" font-family="'Times New Roman', Arial" font-size="9.5" fill="#000000" text-anchor="middle">&amp; Submit</text>

  <!-- 5.2 -->
  <circle cx="450" cy="160" r="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="450" y="155" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">5.2</text>
  <text x="450" y="170" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000" text-anchor="middle">Recruiter Review</text>
  <text x="450" y="184" font-family="'Times New Roman', Arial" font-size="9.5" fill="#000000" text-anchor="middle">&amp; Screening</text>

  <!-- 5.3 -->
  <circle cx="720" cy="160" r="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="720" y="155" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">5.3</text>
  <text x="720" y="170" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000" text-anchor="middle">Status Update</text>
  <text x="720" y="184" font-family="'Times New Roman', Arial" font-size="9.5" fill="#000000" text-anchor="middle">(Shortlist/Reject)</text>

  <!-- 5.4 -->
  <circle cx="720" cy="380" r="45" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <text x="720" y="375" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">5.4</text>
  <text x="720" y="390" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000" text-anchor="middle">Notify Student &amp;</text>
  <text x="720" y="404" font-family="'Times New Roman', Arial" font-size="9.5" fill="#000000" text-anchor="middle">Update Records</text>

  <!-- D5 Store -->
  <rect x="380" y="365" width="140" height="30" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
  <line x1="410" y1="365" x2="410" y2="395" stroke="#000000" stroke-width="1.5"/>
  <text x="395" y="385" font-family="'Times New Roman', Arial" font-size="11" font-weight="bold" fill="#000000">D5</text>
  <text x="420" y="385" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">applications</text>

  <line x1="225" y1="160" x2="405" y2="160" stroke="#000000" stroke-width="1.5" marker-end="url(#arr3)"/>
  <line x1="495" y1="160" x2="675" y2="160" stroke="#000000" stroke-width="1.5" marker-end="url(#arr3)"/>
  <line x1="720" y1="205" x2="720" y2="335" stroke="#000000" stroke-width="1.5" marker-end="url(#arr3)"/>
  <line x1="675" y1="380" x2="520" y2="380" stroke="#000000" stroke-width="1.5" marker-end="url(#arr3)"/>
  <line x1="450" y1="205" x2="450" y2="365" stroke="#000000" stroke-width="1.5" marker-end="url(#arr3)"/>

</svg>
`;

renderSvgToPng(dfd3BwSvg, 'dfd3_diagram_bw.png', 1000);

// 6. Complete E-R Diagram (Black & White)
const erBwSvg = `
<svg width="1100" height="850" viewBox="0 0 1100 850" xmlns="http://www.w3.org/2000/svg">
  <rect width="1100" height="850" fill="#ffffff"/>

  <!-- USERS -->
  <rect x="50" y="50" width="200" height="170" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <rect x="50" y="50" width="200" height="28" fill="#f1f5f9" stroke="#000000" stroke-width="1"/>
  <text x="150" y="70" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">USERS</text>
  <text x="60" y="95" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000">PK  id: BIGINT</text>
  <text x="60" y="112" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">email: VARCHAR(100)</text>
  <text x="60" y="129" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">password: VARCHAR(255)</text>
  <text x="60" y="146" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">role_id: BIGINT</text>
  <text x="60" y="163" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">is_active: BIT</text>
  <text x="60" y="180" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">created_at: DATETIME</text>

  <!-- STUDENTS -->
  <rect x="330" y="50" width="220" height="220" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <rect x="330" y="50" width="220" height="28" fill="#f1f5f9" stroke="#000000" stroke-width="1"/>
  <text x="440" y="70" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">STUDENTS</text>
  <text x="340" y="95" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000">PK  id: BIGINT (FK)</text>
  <text x="340" y="112" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">roll_number: VARCHAR(50)</text>
  <text x="340" y="129" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">course: VARCHAR(50)</text>
  <text x="340" y="146" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">department: VARCHAR(50)</text>
  <text x="340" y="163" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">cgpa: DOUBLE</text>
  <text x="340" y="180" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">passing_year: VARCHAR(20)</text>
  <text x="340" y="197" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">technical_skills: TEXT</text>
  <text x="340" y="214" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">certifications: TEXT</text>

  <!-- COMPANIES -->
  <rect x="630" y="50" width="220" height="200" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <rect x="630" y="50" width="220" height="28" fill="#f1f5f9" stroke="#000000" stroke-width="1"/>
  <text x="740" y="70" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">COMPANIES</text>
  <text x="640" y="95" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000">PK  id: BIGINT (FK)</text>
  <text x="640" y="112" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">company_name: VARCHAR(255)</text>
  <text x="640" y="129" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">industry: VARCHAR(255)</text>
  <text x="640" y="146" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">website: VARCHAR(255)</text>
  <text x="640" y="163" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">company_size: VARCHAR(255)</text>
  <text x="640" y="180" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">is_approved: BIT</text>

  <!-- RESUMES -->
  <rect x="330" y="320" width="220" height="190" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <rect x="330" y="320" width="220" height="28" fill="#f1f5f9" stroke="#000000" stroke-width="1"/>
  <text x="440" y="340" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">RESUMES</text>
  <text x="340" y="365" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000">PK  id: BIGINT</text>
  <text x="340" y="382" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000">FK  student_id: BIGINT</text>
  <text x="340" y="399" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">file_name: VARCHAR(255)</text>
  <text x="340" y="416" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">file_data: LONGBLOB</text>
  <text x="340" y="433" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">file_type: VARCHAR(255)</text>
  <text x="340" y="450" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">is_active: BIT</text>

  <!-- JOBS -->
  <rect x="630" y="320" width="220" height="220" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <rect x="630" y="320" width="220" height="28" fill="#f1f5f9" stroke="#000000" stroke-width="1"/>
  <text x="740" y="340" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">JOBS</text>
  <text x="640" y="365" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000">PK  id: BIGINT</text>
  <text x="640" y="382" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000">FK  company_id: BIGINT</text>
  <text x="640" y="399" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">job_title: VARCHAR(255)</text>
  <text x="640" y="416" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">required_skills: VARCHAR(255)</text>
  <text x="640" y="433" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">package_offered: VARCHAR(255)</text>
  <text x="640" y="450" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">minimum_cgpa: DOUBLE</text>
  <text x="640" y="467" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">last_date_to_apply: DATETIME</text>

  <!-- AI_ANALYSIS -->
  <rect x="330" y="580" width="220" height="200" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <rect x="330" y="580" width="220" height="28" fill="#f1f5f9" stroke="#000000" stroke-width="1"/>
  <text x="440" y="600" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">AI_ANALYSIS</text>
  <text x="340" y="625" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000">PK  id: BIGINT</text>
  <text x="340" y="642" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000">FK  student_id: BIGINT</text>
  <text x="340" y="659" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000">FK  job_id: BIGINT</text>
  <text x="340" y="676" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">overall_match: DOUBLE</text>
  <text x="340" y="693" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">skill_match_score: DOUBLE</text>
  <text x="340" y="710" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">missing_skills: VARCHAR(255)</text>
  <text x="340" y="727" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">ai_feedback: LONGTEXT</text>

  <!-- APPLICATIONS -->
  <rect x="630" y="580" width="220" height="190" fill="#ffffff" stroke="#000000" stroke-width="2"/>
  <rect x="630" y="580" width="220" height="28" fill="#f1f5f9" stroke="#000000" stroke-width="1"/>
  <text x="740" y="600" font-family="'Times New Roman', Arial" font-size="12" font-weight="bold" fill="#000000" text-anchor="middle">APPLICATIONS</text>
  <text x="640" y="625" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000">PK  id: BIGINT</text>
  <text x="640" y="642" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000">FK  student_id: BIGINT</text>
  <text x="640" y="659" font-family="'Times New Roman', Arial" font-size="10.5" font-weight="bold" fill="#000000">FK  job_id: BIGINT</text>
  <text x="640" y="676" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">status: VARCHAR(255)</text>
  <text x="640" y="693" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">applied_at: DATETIME</text>
  <text x="640" y="710" font-family="'Times New Roman', Arial" font-size="10.5" fill="#000000">ats_score: DOUBLE</text>

  <!-- Relationships with clean lines -->
  <line x1="250" y1="110" x2="330" y2="110" stroke="#000000" stroke-width="1.5"/>
  <text x="260" y="102" font-family="Arial" font-size="10" font-weight="bold">1:1</text>

  <path d="M 150 220 L 150 250 L 740 250" fill="none" stroke="#000000" stroke-width="1.5"/>
  <text x="160" y="242" font-family="Arial" font-size="10" font-weight="bold">1:1</text>

  <line x1="440" y1="270" x2="440" y2="320" stroke="#000000" stroke-width="1.5"/>
  <text x="445" y="300" font-family="Arial" font-size="10" font-weight="bold">1:N</text>

  <line x1="740" y1="250" x2="740" y2="320" stroke="#000000" stroke-width="1.5"/>
  <text x="745" y="290" font-family="Arial" font-size="10" font-weight="bold">1:N</text>

  <line x1="440" y1="510" x2="440" y2="580" stroke="#000000" stroke-width="1.5"/>
  <text x="445" y="550" font-family="Arial" font-size="10" font-weight="bold">1:N</text>

  <line x1="740" y1="540" x2="740" y2="580" stroke="#000000" stroke-width="1.5"/>
  <text x="745" y="565" font-family="Arial" font-size="10" font-weight="bold">1:N</text>

  <line x1="550" y1="440" x2="630" y2="620" stroke="#000000" stroke-width="1.5"/>
  <text x="590" y="530" font-family="Arial" font-size="10" font-weight="bold">1:N</text>

</svg>
`;

renderSvgToPng(erBwSvg, 'er_diagram_bw.png', 1100);

console.log("All BW technical diagrams rendered successfully!");
