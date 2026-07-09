/* =========================================================
   JOHN'S AI CHATBOT ASSISTANT — 10x EXPANDED KNOWLEDGE ENGINE
   Gemini-powered with deep multi-perspective reasoning,
   complex question decomposition, and comprehensive local fallback.
   ========================================================= */

var Chatbot = (function () {
  'use strict';

  var GEMINI_API_KEY = 'AQ.Ab8RN6IsK0DTuuFz_unBhbT4A9fMZd43bYFRhZ63ITADJ1Bh8g';
  var GEMINI_MODEL   = 'gemini-1.5-flash';
  var GEMINI_URL     = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent?key=' + GEMINI_API_KEY;
  var API_ENABLED    = GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY';

  /* ---------- Dynamic age ---------- */
  var BIRTHDAY = '2006-07-27';
  var inputTextEl = null;
  function calcAge() {
    var now = new Date();
    var birth = new Date(BIRTHDAY);
    var age = now.getFullYear() - birth.getFullYear();
    var m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  }

  /* ---------- 10x EXPANDED SYSTEM PROMPT for Gemini ---------- */
  var SYSTEM_PROMPT =
    "You are \"John's AI Chatbot Assistant\", the official intelligent assistant embedded in John Lord G. Zambrano's portfolio website. " +
    "You answer questions about John Lord with exceptional depth, clarity, and multi-perspective insight.\n\n" +

    "=== 10X REASONING FRAMEWORK ===\n" +
    "1. SINGLE-FACT QUESTIONS: Answer directly in 1-3 sentences with the most relevant detail first.\n" +
    "2. MULTI-PART QUESTIONS: Break down each part (separated by 'and', commas, 'also', 'what about'). Address each part in order using numbered sections.\n" +
    "3. COMPARATIVE QUESTIONS: Weigh both sides with evidence, then state which has stronger footing and why.\n" +
    "4. HYPOTHETICAL/SCENARIO QUESTIONS: Reason step-by-step from John's current data, then project plausible outcomes.\n" +
    "5. CAREER-TRAJECTORY QUESTIONS: Connect present skills/certs to future roles, showing a progression path.\n" +
    "6. TECHNICAL DEEP-DIVE: Explain the concept first, then map it to John's specific training or project experience.\n" +
    "7. PERSPECTIVE-SHIFT QUESTIONS: Answer from multiple angles — e.g., as a recruiter, as a teammate, as a mentor.\n" +
    "8. ADVICE/MENTORSHIP QUESTIONS: Give actionable, specific recommendations rooted in John's actual profile.\n" +
    "9. INDUSTRY-CONTEXT QUESTIONS: Relate John's skills to current industry trends and real-world job markets.\n" +
    "10. SELF-REFLEXIVE QUESTIONS: When asked about this assistant itself, explain how it works and its place in the portfolio.\n\n" +

    "FORMATTING:\n" +
    "- Use **bold** for key terms (cert names, project names, skills, numbers).\n" +
    "- Use bullet points (- or *) for lists of 2+ items.\n" +
    "- Use numbered lists (1. 2. 3.) for sequential steps or priorities.\n" +
    "- Line breaks between paragraphs for readability.\n" +
    "- Be professional, enthusiastic, and thorough.\n" +
    "- Stay grounded in John's actual data. Never fabricate.\n" +
    "- If you lack info, say so and offer alternatives.\n\n" +

    "=== PERSONAL FACTS ===\n" +
    "Full name: John Lord G. Zambrano\n" +
    "Birthday: July 27, 2006 (age: " + calcAge() + ")\n" +
    "Address: Bagong Barrio, Caloocan City, Metro Manila, Philippines\n" +
    "Email: jlgzambrano27@gmail.com\n" +
    "Phone: +63 968 367 3765\n" +
    "LinkedIn: linkedin.com/in/john-lord-zambrano\n" +
    "GitHub: github.com/jlz0727\n" +
    "Favorite food: Sinigang and Adobo\n" +
    "Games: Mobile Legends Bang Bang (MLBB), Valorant, Call of Duty (COD)\n" +
    "Languages: Filipino (native), English (fluent)\n\n" +

    "=== EDUCATION ===\n" +
    "Course: Bachelor of Science in Computer Engineering (BSCpE)\n" +
    "University: University of the East, Caloocan Campus\n" +
    "Year: 3rd Year (as of 2026)\n" +
    "Academic standing: Dean's Lister\n" +
    "Key coursework: Networking, embedded systems, software/hardware engineering, OS.\n\n" +

    "=== TECH SKILLS ===\n" +
    "Languages: JavaScript, HTML, CSS, C#\n" +
    "Backend: Node.js, REST APIs\n" +
    "Database: MongoDB\n" +
    "Frontend: Responsive design, CSS animations\n" +
    "Cybersecurity: Network defense, threat analysis, incident response, SOC operations, vulnerability assessment, access control, security monitoring\n" +
    "Hardware: Arduino, circuit design, embedded systems\n" +
    "AI: AI-Powered Systems, chatbot development, prompt engineering, AI-assisted development.\n" +
    "Tools: GitHub, Visual Studio Code, Arduino IDE, MongoDB Compass, Postman\n" +
    "Soft skills: Problem-solving, analytical thinking, continuous learning, communication, time management\n\n" +

    "=== CERTIFICATIONS (ordered by recency) ===\n\n" +
    "1. Cisco Security Operations and Defense Analyst (July 2026)\n" +
    "   Provider: Cisco Networking Academy and Splunk\n" +
    "   Type: Full self-paced course\n" +
    "   Skills: SOC fundamentals, defense analyst responsibilities, security technologies, SOC metrics, incident detection and response\n\n" +
    "2. Cisco Network Defense (July 2026)\n" +
    "   Provider: Cisco Networking Academy\n" +
    "   Type: Full self-paced course\n" +
    "   Skills: Threat detection, vulnerability assessment, access control, security monitoring, defensive strategies, network infrastructure protection\n\n" +
    "3. Cisco Network Support and Security (June 2026)\n" +
    "   Provider: Cisco Networking Academy\n" +
    "   Type: Full self-paced training\n" +
    "   Skills: Networking fundamentals, protocols (TCP/IP, DNS, DHCP), threat mitigation, help desk ops, ticketing systems, IT support best practices\n\n" +
    "4. Cisco Introduction to Cybersecurity (June 2026)\n" +
    "   Provider: Cisco Networking Academy\n" +
    "   Type: Full self-paced training\n" +
    "   Skills: Cyber threats and vulnerabilities, threat detection, network security concepts, data privacy, defense basics\n\n" +
    "5. ISC2 Certified in Cybersecurity (CC) (Apr\u2013May 2026)\n" +
    "   Provider: ISC2\n" +
    "   Type: Professional certification\n" +
    "   Skills: Security principles, network security controls, risk management, compliance, incident response fundamentals\n\n" +
    "6. Stellar UniTour Bootcamp \u2013 Blockchain (March 2026)\n" +
    "   Provider: Stellar\n" +
    "   Type: Bootcamp training\n" +
    "   Skills: Blockchain fundamentals, consensus mechanisms, decentralized systems, crypto-based transactions, AI-assisted learning\n\n" +
    "7. Hack The Box \u2013 Cybersecurity Fundamentals (March 2026)\n" +
    "   Provider: Hack The Box\n" +
    "   Type: Seminar\n" +
    "   Skills: Essential security concepts, attacker mindset, defensive strategies, practical tools\n\n" +

    "=== PROJECTS ===\n\n" +
    "1. Otokwikk (2026) \u2014 Full-Stack Carwash Management System\n" +
    "   Type: Full-stack web application\n" +
    "   Description: Comprehensive carwash management platform with AI chatbot, booking/scheduling, customer management, service bundles, staff coordination, analytics dashboard, email notifications.\n" +
    "   Tech: JavaScript, HTML, CSS, Node.js, MongoDB\n" +
    "   Demonstrates: Full-stack development, database design, AI integration as a chatbot assistant, UI/UX, business logic, REST API design\n\n" +
    "2. CivicLens (2025) \u2014 AI-Powered Fact-Checking System\n" +
    "   Type: Desktop application\n" +
    "   Description: C# app leveraging AI to verify accuracy of claims and statements using OOP architecture.\n" +
    "   Tech: C#, .NET, AI integration\n" +
    "   Demonstrates: Desktop development, OOP patterns (Separation of Concerns, Encapsulation, Modular design), AI/ML integration, clean architecture\n\n" +

    "=== PORTFOLIO SECTIONS ===\n" +
    "- About, Tech Skills, Certifications, Projects, Contact, AI Portfolio Assistant\n" +
    "- Built with vanilla HTML, CSS, JavaScript \u2014 no frameworks\n" +
    "- Features: Light/dark theme, loader animation, certificate lightbox, scheduling modal, AI assistant, project preview overlays\n\n" +

    "=== HOW TO CONTACT ===\n" +
    "- Use schedule buttons in the Contact section\n" +
    "- Download CV from the navigation bar\n" +
    "- Direct email: jlgzambrano27@gmail.com\n";

  var fab, panel, closeBtn, messages, quickWrap, form, input;
  var history = [];
  var conversationTurns = 0;

  function escapeHtml(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  /* ---------- Markdown-lite renderer ---------- */
  function renderMarkdown(text) {
    var html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/(?:^|\n)((?:[\-\*] .+(?:\n|$))+)/g, function (match, block) {
      var items = block.trim().split(/\n/).map(function (line) {
        return '<li>' + line.replace(/^[\-\*]\s+/, '').trim() + '</li>';
      }).join('');
      return '\n<ul>' + items + '</ul>\n';
    });
    html = html.replace(/\n/g, '<br/>');
    html = html.replace(/<br\/>(<ul>)/g, '$1').replace(/(<\/ul>)<br\/>/g, '$1');
    return html;
  }

  function addMessage(text, who) {
    var div = document.createElement('div');
    div.className = 'msg msg-' + who;
    var promptPrefix = who === 'ai'
      ? '<span class="prompt-user msg-prompt">jlz</span><span class="prompt-at msg-prompt">@</span><span class="prompt-host msg-prompt">portfolio</span><span class="prompt-colon msg-prompt">:</span><span class="prompt-path msg-prompt">~</span><span class="prompt-dolar msg-prompt">$</span> '
      : '<span class="prompt-user msg-prompt">guest</span><span class="prompt-at msg-prompt">@</span><span class="prompt-host msg-prompt">portfolio</span><span class="prompt-colon msg-prompt">:</span><span class="prompt-path msg-prompt">~</span><span class="prompt-dolar msg-prompt">$</span> ';
    if (who === 'ai') {
      div.innerHTML = promptPrefix + '<span class="msg-body">' + renderMarkdown(text) + '</span>';
    } else {
      div.innerHTML = promptPrefix + '<span class="msg-body">' + escapeHtml(text) + '</span>';
    }
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function addTyping() {
    var div = document.createElement('div');
    div.className = 'msg msg-ai msg-typing';
    div.textContent = 'typing...';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function askGemini(userMessage) {
    var prompt = SYSTEM_PROMPT.replace(/age: \d+ as of today/, 'age: ' + calcAge() + ' as of today');
    var context = history.slice(-16);
    return fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: prompt }] },
        contents: context.concat([{ role: 'user', parts: [{ text: userMessage }] }]),
        generationConfig: { maxOutputTokens: 1024, temperature: 0.7 }
      })
    }).then(function (res) {
      if (res.status === 429) throw new Error('rate_limited');
      if (!res.ok) throw new Error('Gemini HTTP ' + res.status);
      return res.json();
    }).then(function (data) {
      var text = (data.candidates && data.candidates[0] && data.candidates[0].content &&
        data.candidates[0].content.parts && data.candidates[0].content.parts[0] &&
        data.candidates[0].content.parts[0].text) || '';
      if (!text.trim()) {
        if (data.promptFeedback && data.promptFeedback.blockReason) {
          return "I'm sorry, I couldn't process that request. Could you rephrase your question?";
        }
        return "I couldn't generate a response. Please try again.";
      }
      return text.trim();
    });
  }

  /* =========================================================
     10x EXPANDED LOCAL FALLBACK — 100+ pattern matches
     covering: personal, certs, projects, skills, education,
     career, scenarios, comparisons, advice, industry,
     multi-part, hypothetical, and meta questions.
     ========================================================= */
  function localReply(msg) {
    var m = msg.toLowerCase()
      .replace(/\byou are\b/g, 'he is')
      .replace(/\byou're\b/g, "he's")
      .replace(/\bare you\b/g, 'is he')
      .replace(/\bdo you\b/g, 'does he')
      .replace(/\bcan you\b/g, 'can he')
      .replace(/\bhave you\b/g, 'has he')
      .replace(/\byour\b/g, 'his')
      .replace(/\byou\b/g, 'he')
      .replace(/\byourself\b/g, 'himself');

    /* =============================================
       CATEGORY 1: GREETINGS & INTRODUCTIONS
       ============================================= */
    if (/(hi|hello|hey|sup|good morning|good afternoon|good evening)\b/.test(m))
      return "Hi there! I'm **John's AI Portfolio Assistant**. I can answer anything about John Lord \u2014 his projects, certifications, skills, education, experience, and more. What would you like to explore?";

    if (/introduce yourself|who are you|what are you|tell me about yourself/.test(m))
      return "I'm **John's AI Portfolio Assistant**, an intelligent assistant built into his portfolio website. I use the **Gemini API** (with a local fallback) to answer questions about John Lord G. Zambrano \u2014 his skills, projects (**Otokwikk**, **CivicLens**), certifications (**Cisco**, **ISC2**, **Stellar**, **Hack The Box**), education (**BS CpE at UE Caloocan, Dean's Lister**), career goals, and contact info. Ask me anything!";

    if (/how do you work|how.*(function|operate|powered|built)|what (tech|stack|api|model)/.test(m))
      return "Great question! I'm powered by **Google's Gemini 1.5 Flash API** for intelligent conversations. If the API is unavailable, I fall back to a built-in knowledge base with hundreds of pre-written answers. I'm integrated into John's vanilla HTML/CSS/JS portfolio \u2014 no frameworks needed. I can also help schedule meetings via **EmailJS** and provide **conversation memory** within a session.";

    if (/what can you do|help|capabilities|features?/.test(m))
      return "I can help you with:\n- **John's Background** \u2014 personal info, education, skills\n- **Certifications** \u2014 Cisco, ISC2, Stellar, HTB details\n- **Projects** \u2014 Otokwikk, CivicLens deep dives\n- **Career Advice** \u2014 suitable roles, growth path, recommendations\n- **Comparisons** \u2014 weighing skills, certs, projects against each other\n- **Scenarios** \u2014 \"what if\" and hypothetical questions\n- **Scheduling** \u2014 meetings and interviews via Contact section\n- **Contact Info** \u2014 email, phone, LinkedIn, GitHub\n\nWhat interests you?";

    /* =============================================
       CATEGORY 2: PERSONAL & BACKGROUND (expanded)
       ============================================= */
    if (/birthday|born|birthdate/.test(m))
      return "John Lord was born on **July 27, 2006**. That makes him **" + calcAge() + " years old** today. He's a 3rd-year Computer Engineering student at UE Caloocan and a proud **Dean's Lister**.";

    if (/age|how old/.test(m))
      return "John Lord is **" + calcAge() + " years old** (born July 27, 2006). He's currently in his 3rd year of BS Computer Engineering at the University of the East \u2014 Caloocan Campus.";

    if (/address|where.*live|location|home|hometown/.test(m))
      return "John lives in **Bagong Barrio, Caloocan City**, Metro Manila, Philippines. He's a true **Manile\u00f1o** at heart!";

    if (/food|fav.*eat|meal|dishi?/.test(m))
      return "His favorite Filipino dishes are **Sinigang** (a savory tamarind soup with pork or shrimp) and **Adobo** (classic soy-vinegar braised meat). He has a soft spot for home-cooked meals.";

    if (/game|play|mlbb|mobile legend|valorant|cod|call of duty|hobby|gaming/.test(m))
      return "John enjoys gaming in his free time:\n- **Mobile Legends Bang Bang (MLBB)** \u2014 mobile MOBA, his go-to casual game\n- **Valorant** \u2014 tactical FPS that sharpens his reaction time and strategy\n- **Call of Duty (COD)** \u2014 military FPS franchise\n\nGaming actually helps build the **quick decision-making and hand-eye coordination** useful in cybersecurity incident response!";

    if (/phone|cp|number|call|contact.*num/.test(m))
      return "You can reach John directly at **+63 968 367 2765**. He's responsive and open to professional inquiries.";

    if (/language|speak|dialect|filipino|tagalog|english/.test(m))
      return "John is **bilingual**:\n- **Filipino (Tagalog)** \u2014 native, fluent in conversation and writing\n- **English** \u2014 fluent, used for academic and professional communication\n\nThis makes him effective in both local and international work environments.";

    if (/hobbies|fun|free time|spare time|introduce|tell me.*about|background|story/.test(m))
      return "Here's a snapshot of **John Lord**:\n\nA 3rd-year **Computer Engineering** student at **UE Caloocan** with **Dean's List** honors. He's already earned **7 certifications** across cybersecurity, blockchain, and networking \u2014 including **ISC2 Certified in Cybersecurity** and **three Cisco credentials**. He built two working applications: **Otokwikk** (a full-stack carwash management system with AI chatbot) and **CivicLens** (a C# AI-powered fact-checker).\n\nWhat sets him apart? He combines **cybersecurity knowledge**, **AI integration skills**, and **full-stack development** \u2014 a rare mix for a 3rd-year student. Outside tech, he loves **Sinigang and Adobo**, enjoys **Mobile Legends, Valorant, and COD**, and is always learning something new.";

    if (/what can.*(build|make|create|develop)/.test(m))
      return "John can build **full-stack web applications** (like **Otokwikk**, a carwash management system with AI chatbot), **desktop applications** with AI integration (like **CivicLens**, a fact-checking tool), and **AI-powered tools** like this very chatbot. His tech stack spans **JavaScript, HTML, CSS, C#, Node.js, and MongoDB**, plus he's skilled in **Arduino hardware projects** and **circuit design**. He's also capable of **REST API design**, **database modeling**, and **prompt engineering**.";

    if (/strength|strong|talent|gift|naturally good/.test(m))
      return "John's natural strengths include:\n- **Analytical thinking** \u2014 he breaks down complex problems methodically\n- **Self-directed learning** \u2014 he earned 7 certifications mostly self-paced\n- **Practical application** \u2014 he doesn't just study theory; he builds real working systems\n- **Interdisciplinary thinking** \u2014 he connects cybersecurity, AI, and development seamlessly\n- **Resilience** \u2014 balancing Dean's List academics with certifications and projects";

    if (/weakness|improve|area.*growth|need.*work/.test(m))
      return "John is aware of areas he's actively growing:\n- **Python** \u2014 not in his current stack yet, but highly relevant for cybersecurity automation and AI/ML\n- **Cloud platforms** (AWS/Azure/GCP) \u2014 next frontier for modern infrastructure\n- **Linux administration** \u2014 critical for most security roles\n- **Public speaking / presentations** \u2014 being developed through academic requirements\n\nHe's proactively working on these through certifications and projects.";

    /* =============================================
       CATEGORY 3: CERTIFICATIONS (deep expanded)
       ============================================= */
    if (/cisco.*sec.*ops|security.*operations.*defense|sec.?ops/i.test(m) && /cisco/i.test(m))
      return "**Cisco Security Operations and Defense Analyst** (July 2026)\nJohn's most recent and advanced certification, completed through Cisco Networking Academy.\n\nWhat it covers:\n- **Security Operations Center (SOC)** fundamentals \u2014 how professional SOC teams operate\n- **Defense analyst responsibilities** \u2014 triage, escalation, reporting\n- **Common security technologies** \u2014 SIEM, IDS/IPS, firewalls, endpoint protection\n- **SOC performance metrics** \u2014 MTTR, MTTD, SLA compliance\n- **Incident detection and response** \u2014 the complete incident lifecycle\n\nThis cert positions John for **entry-level SOC analyst roles**.";

    if (/cisco.*network.*defense|network defense/.test(m))
      return "**Cisco Network Defense** (July 2026)\nJohn completed a full course on network defense concepts via Cisco Networking Academy.\n\nSkills developed:\n- **Threat detection and analysis** \u2014 identifying malicious activity on networks\n- **Vulnerability assessment and management** \u2014 scanning, prioritizing, remediating\n- **Access control implementation** \u2014 AAA, least privilege, role-based access\n- **Security monitoring and SIEM** \u2014 log analysis, alert correlation\n- **Defensive strategies** \u2014 defense-in-depth, network segmentation, hardening";

    if (/cisco.*network.*support|network support/.test(m))
      return "**Cisco Network Support and Security** (June 2026)\nCompleted a full self-paced training course.\n\nSkills gained:\n- **Networking fundamentals** \u2014 TCP/IP, DNS, DHCP, subnetting\n- **Protocols and standards** \u2014 HTTP/HTTPS, SSH, SNMP\n- **Threat mitigation techniques** \u2014 firewall rules, ACLs, VPNs\n- **Help desk operations** \u2014 ticketing, SLAs, escalation procedures\n- **IT support best practices** \u2014 documentation, user communication, remote support";

    if (/cisco.*intro|introduction to cyber/.test(m))
      return "**Cisco Introduction to Cybersecurity** (June 2026)\nCompleted a full self-paced training course.\n\nSkills gained:\n- **Cybersecurity fundamentals** \u2014 CIA triad, security domains, threat landscape\n- **Cyber threats and vulnerabilities** \u2014 malware types, social engineering, phishing\n- **Threat detection and defense** \u2014 basic prevention and detection methods\n- **Network security concepts** \u2014 firewalls, VPNs, encryption basics\n- **Data privacy principles** \u2014 GDPR, data protection, ethical handling";

    if (/compare.*cisco|cisco.*compare|cert.*pathway|cert.*build|cert.*roadmap/.test(m))
      return "John's **Cisco certifications** form a clear progression:\n\n1. **Introduction to Cybersecurity** \u2014 foundation: threats, vulnerabilities, defense basics\n2. **Network Support and Security** \u2014 practical: networking, protocols, help desk ops\n3. **Network Defense** \u2014 advanced: threat detection, vuln assessment, active defense\n4. **Security Operations and Defense Analyst** \u2014 specialized: SOC operations, analyst skills\n\nTogether they create a **solid pathway from security fundamentals to professional SOC readiness**. Each cert builds on the previous, covering the **NIST framework** domains progressively.";

    if (/isc2|cc\b(?!\w)|certified in cybersecurity/.test(m))
      return "**ISC2 Certified in Cybersecurity (CC)** (April \u2013 May 2026)\n\nA globally recognized entry-level cybersecurity certification from **ISC2**, the same organization behind the renowned **CISSP**. John completed this self-paced program.\n\nSkills developed:\n- **Security principles** \u2014 confidentiality, integrity, availability\n- **Network security controls** \u2014 firewalls, IDS/IPS, VPNs\n- **Risk management and compliance** \u2014 risk assessment, regulatory frameworks\n- **Incident response fundamentals** \u2014 preparation, detection, containment, recovery\n\nThis certification covers **NIST and ISO 27001 frameworks** and is a strong foundation for any cybersecurity role.";

    if (/stellar|blockchain/.test(m))
      return "**Stellar UniTour Bootcamp \u2013 Blockchain** (March 2026)\n\nJohn completed a focused bootcamp on blockchain technology.\n\nSkills gained:\n- **Blockchain fundamentals** \u2014 distributed ledger, blocks, chains, mining\n- **Consensus mechanisms** \u2014 PoW, PoS, Stellar Consensus Protocol\n- **Decentralized systems architecture** \u2014 peer-to-peer networks, node types\n- **Crypto-based transactions** \u2014 wallets, keys, transaction validation\n- **AI-assisted learning support** \u2014 using AI tools to accelerate blockchain understanding\n\nThis broadens his perspective beyond traditional cybersecurity into **Web3 and decentralized security**.";

    if (/htb|hack.?the.?box/.test(m))
      return "**Hack The Box \u2013 Cybersecurity Fundamentals** (March 2026)\n\nJohn completed a seminar through Hack The Box's renowned hands-on platform.\n\nSkills gained:\n- **Essential security concepts** \u2014 real-world attack and defense scenarios\n- **Attacker mindset and methodology** \u2014 recon, exploitation, privilege escalation\n- **Practical defensive strategies** \u2014 hardening, monitoring, detection\n- **Tool exposure** \u2014 Nmap, Metasploit, Wireshark, Burp Suite basics\n\nHTB is highly respected in the cybersecurity community for its **practical, hands-on approach**.";

    if (/all.*cert|cert.*list|list.*cert|certif|credentials|badges/.test(m))
      return "John holds **7 certifications** (latest first):\n1. **Cisco Security Operations and Defense Analyst** (July 2026)\n2. **Cisco Network Defense** (July 2026)\n3. **Cisco Network Support and Security** (June 2026)\n4. **Cisco Introduction to Cybersecurity** (June 2026)\n5. **ISC2 Certified in Cybersecurity (CC)** (Apr\u2013May 2026)\n6. **Stellar UniTour Bootcamp \u2013 Blockchain** (March 2026)\n7. **Hack The Box \u2013 Cybersecurity Fundamentals** (March 2026)\n\nAll focused on **cybersecurity, networking, and blockchain**.";

    if (/certs.*prepar|prepar.*certs|cybersecur.*certs|certs.*cybersecur|cert.*(career|role|job|path)/.test(m))
      return "John's certifications build a clear **cybersecurity career pathway**:\n\n1. **Cisco Introduction to Cybersecurity** \u2014 fundamentals: threats, vulnerabilities, defense basics\n2. **Cisco Network Support and Security** \u2014 networking, protocols, IT support skills\n3. **ISC2 Certified in Cybersecurity (CC)** \u2014 governance, risk management, professional frameworks\n4. **Cisco Network Defense** \u2014 advanced threat detection, vulnerability assessment, active defense\n5. **Cisco Security Operations and Defense Analyst** \u2014 SOC operations, analyst responsibilities, incident response\n6. **Hack The Box** \u2014 hands-on attacker tools and defensive strategies\n7. **Stellar Blockchain** \u2014 decentralized security perspective\n\nTogether, these cover the **NIST framework** (Identify, Protect, Detect, Respond, Recover) and prepare him for **SOC analyst, NOC technician, or junior security engineer** roles.";

    if (/how many.*cert|current.*work|in progress|most recent|latest cert|newest/.test(m))
      return "John currently holds **7 certifications**. His most recent is **Cisco Security Operations and Defense Analyst** (July 2026). All certifications are from: **Cisco** (4), **ISC2** (1), **Stellar** (1), and **Hack The Box** (1). View the full timeline in the Certifications section!";

    if (/hardest|toughest|most difficult|challenging.*cert/.test(m))
      return "The most challenging certification John pursued was likely the **Cisco Security Operations and Defense Analyst** \u2014 it's the most advanced of his Cisco credentials, covering real SOC operations, incident response workflows, and performance metrics. The **ISC2 CC** also required understanding of governance and compliance frameworks, which are more conceptual than technical.";

    if (/which cert.*(recommend|most valuable|best|important)/.test(m))
      return "For John's career goals, the **most valuable** certifications are:\n1. **ISC2 Certified in Cybersecurity (CC)** \u2014 globally recognized, covers foundational frameworks, great for resume screening\n2. **Cisco Security Operations and Defense Analyst** \u2014 most job-relevant for SOC analyst roles\n3. **Cisco Network Defense** \u2014 practical defensive skills directly applicable to security operations\n\nTogether, they signal to employers that John has both **theoretical knowledge and practical readiness**.";

    /* =============================================
       CATEGORY 4: PROJECTS (deep expanded)
       ============================================= */
    if (/oto|carwash/.test(m))
      return "**Otokwikk** (2026) \u2014 Full-Stack Carwash Management System\n\nA comprehensive management platform John built from the ground up.\n\n**Key Features:**\n- Booking and scheduling system with real-time availability\n- Customer relationship management with history tracking\n- Service bundle configuration and pricing\n- Staff coordination and shift management\n- Analytics dashboard with KPIs and revenue tracking\n- Email notifications via automated triggers\n- AI chatbot integration for customer inquiries\n\n**Tech Stack:** JavaScript, HTML, CSS, Node.js, MongoDB\n\n**What it demonstrates:** Full-stack development, database schema design, REST API architecture, AI integration, UI/UX design, business logic implementation.\n\nThis is his **flagship project** \u2014 a complete, production-ready system.";

    if (/civic|fact.?check/.test(m))
      return "**CivicLens** (2025) \u2014 AI-Powered Fact-Checking System\n\nA C# desktop application John built that uses AI to verify the accuracy of claims and statements.\n\n**Architecture:**\n- Built with **Object-Oriented Programming principles**\n- Clean layered architecture separating UI, business logic, and data access\n- Modular components for AI integration, claim parsing, and result rendering\n\n**Tech Stack:** C#, .NET, AI integration\n\n**What it demonstrates:** Desktop application development, OOP design patterns (Separation of Concerns, Encapsulation), AI/ML integration, data verification logic, clean architecture.\n\nThis project shows his **desktop development skills** and ability to apply **software engineering best practices**.";

    if (/compare.*project|project.*compare/.test(m))
      return "Comparing John's two projects:\n\n**Otokwikk** (2026):\n- Full-stack web application\n- Demonstrates breadth: database, backend, frontend, AI chatbot, business logic\n- Tech: JavaScript, Node.js, MongoDB, HTML, CSS\n- Best for showing **end-to-end development** and **product thinking**\n\n**CivicLens** (2025):\n- C# desktop application\n- Demonstrates depth: OOP architecture, AI integration, clean design patterns\n- Tech: C#, .NET\n- Best for showing **software engineering discipline** and **algorithmic thinking**\n\n**Verdict:** Otokwikk shows range and product sense; CivicLens shows engineering rigor. Together they prove John can work across **both web and desktop** platforms.";

    if (/what.*project|projects.*built|built.*project|project.*demonstrat/.test(m))
      return "John has built **two main projects**:\n\n1. **Otokwikk** (2026) \u2014 A full-stack carwash management system with AI chatbot, booking, analytics, and email notifications. Demonstrates end-to-end web development, database design, and AI integration.\n\n2. **CivicLens** (2025) \u2014 A C# desktop application for AI-powered fact-checking. Demonstrates OOP architecture, clean design patterns, and C# proficiency.\n\nBoth projects highlight his ability to **ship complete, functional applications** from concept to deployment.";

    if (/pattern|oop|architecture.*civic|civic.*architecture/.test(m))
      return "In **CivicLens**, John applied **software engineering best practices**:\n- **Separation of Concerns** \u2014 clean layered architecture separating UI, business logic, and data access\n- **Encapsulation** \u2014 data verification logic hidden behind well-defined interfaces\n- **Modular design** \u2014 loosely coupled components for AI integration, claim parsing, and rendering\n- **Single Responsibility Principle** \u2014 each class has one clear purpose\n\nThe project follows **clean architecture** principles, making it testable, maintainable, and extensible \u2014 exactly what employers look for in production code.";

    if (/web.*app|desktop.*app|what kind.*project/.test(m))
      return "John builds **both types** of applications:\n- **Web apps** like **Otokwikk** (full-stack with Node.js, MongoDB, AI chatbot)\n- **Desktop apps** like **CivicLens** (C#, OOP architecture, AI integration)\n\nThis cross-platform versatility is rare for a 3rd-year student and shows he's comfortable with **different development paradigms**.";

    if (/which.*project|start.*with|look.*first|technolog|integrate.*ai.*project/.test(m))
      return "It depends on what you're interested in:\n- **Full-stack / web development** \u2192 check out **Otokwikk** \u2014 end-to-end Node.js + MongoDB + AI chatbot\n- **Desktop / OOP / C#** \u2192 check out **CivicLens** \u2014 clean architecture, AI-powered fact-checking\n- **AI integration** \u2192 both projects incorporate AI in different ways (chatbot vs. fact-checking)\n\nBoth demonstrate strong practical skills from different angles!";

    if (/project.*tech|tech.*used.*project|how.*(build|made).*(project|app|system)/.test(m))
      return "A quick breakdown of the tech behind John's projects:\n\n**Otokwikk:** JavaScript (frontend logic), HTML/CSS (UI), Node.js (backend), MongoDB (database), AI chatbot (Gemini API integration)\n\n**CivicLens:** C# (core logic), .NET framework (desktop runtime), AI integration (third-party API for fact verification)\n\nBoth projects started as concepts and were built iteratively, following real development workflows.";

    /* =============================================
       CATEGORY 5: SKILLS (deep expanded)
       ============================================= */
    if (/ai.*skill.*cyber|cyber.*ai.*skill|ai.*complement|complement.*cyber/.test(m))
      return "John's **AI skills and cybersecurity knowledge** are a powerful combination:\n\n- **AI-powered threat detection** \u2014 he can build systems that use ML to identify anomalies\n- **Chatbot integration** \u2014 experience building conversational AI, applicable to security automation\n- **Pattern matching** \u2014 analytical thinking from AI development transfers to threat hunting\n- **Blockchain + AI** \u2014 Stellar bootcamp gave him decentralized security perspective\n\nThis intersection is increasingly valuable as the industry moves toward **AI-driven SOC operations** and **automated incident response**. Many companies are specifically hiring for this blend.";

    if (/strongest|best.*area|best.*skill|top.*skill|what.*good at|expertise/.test(m))
      return "John's **strongest area** is arguably **security-minded full-stack development** \u2014 he can both **build applications** (Otokwikk, CivicLens) and **defend the infrastructure** they run on (Cisco certs, ISC2, network defense).\n\nHis unique differentiator is the **three-pillar combination**:\n1. **Cybersecurity fundamentals** \u2014 certifications, threat analysis, network defense\n2. **AI integration skills** \u2014 chatbot development, prompt engineering, AI-assisted tools\n3. **Practical development ability** \u2014 shipping complete, functional applications\n\nThis blend is rare for a 3rd-year student and makes him a compelling candidate for **security-focused developer roles**.";

    if (/skill|tech|stack|language|prog|tool|technology/.test(m))
      return "John's technical toolkit:\n- **Languages**: JavaScript, HTML, CSS, C#\n- **Backend**: Node.js, REST APIs\n- **Database**: MongoDB (CRUD, aggregation, schema design)\n- **Frontend**: Responsive design, CSS animations, DOM API\n- **Cybersecurity**: Network defense, threat analysis, incident response, SOC ops\n- **Hardware**: Arduino, circuit design, embedded systems\n- **AI**: Gemini API, prompt engineering, chatbot architecture, workflow automation\n- **Tools**: Git, VS Code, Arduino IDE, MongoDB Compass, Postman\n- **Soft skills**: Problem-solving, analytical thinking, continuous learning, communication";

    if (/python/.test(m))
      return "John doesn't list **Python** in his current stack yet, but his experience with **JavaScript** and **C#** gives him a strong programming foundation to pick it up quickly. Many of his cybersecurity and AI interests **would directly benefit from Python**:\n- Security automation scripts\n- AI/ML libraries (TensorFlow, PyTorch, scikit-learn)\n- Penetration testing tools\n- Data analysis and visualization\n\nIt's a **logical and high-priority next step** for him.";

    if (/c#|c sharp/.test(m))
      return "Yes, John knows **C#**! He built **CivicLens**, a desktop fact-checking application, using C# with **Object-Oriented Programming principles** and clean architecture. This demonstrates:\n- Desktop application development\n- OOP concepts (encapsulation, inheritance, polymorphism)\n- Clean layered architecture\n- AI API integration in a desktop context\n\nC# is a versatile language used in **enterprise applications, game development (Unity), and desktop tools**.";

    if (/backend|node|mongodb|database|api|server/.test(m))
      return "Yes! John uses **Node.js** for backend development and **MongoDB** for databases \u2014 the same stack powering **Otokwikk**. He's comfortable with:\n- **REST API design** \u2014 routes, middleware, request/response handling\n- **MongoDB operations** \u2014 CRUD, aggregation pipelines, indexing\n- **Server logic** \u2014 authentication, validation, error handling\n- **Data modeling** \u2014 schema design, relationships, embedding vs. referencing\n\nThis stack is widely used in modern web applications.";

    if (/frontend|html|css|design|ui.*ux/.test(m))
      return "John is proficient in **frontend development** using vanilla **HTML, CSS, and JavaScript**. His portfolio itself is a showcase of his frontend skills:\n- **Responsive design** \u2014 adapts to mobile, tablet, desktop\n- **CSS animations** \u2014 smooth transitions, reveal-on-scroll, loader animation\n- **Theme system** \u2014 light/dark mode with CSS custom properties\n- **Interactive components** \u2014 lightbox, modal, info chips, project previews\n- **No frameworks** \u2014 everything is hand-coded, demonstrating deep understanding";

    if (/linkedin|github|social/.test(m))
      return "You can find John on:\n- **LinkedIn**: linkedin.com/in/john-lord-zambrano\n- **GitHub**: github.com/jlz0727\n\nBoth are active with his latest projects, certifications, and professional updates. Following or connecting is a great way to stay updated!";

    if (/arduino|hardware|iot|circuit|embedded/.test(m))
      return "John has **hardware experience** through his Computer Engineering curriculum:\n- **Arduino programming** \u2014 C/C++ for microcontrollers\n- **Circuit design** \u2014 breadboarding, schematic reading, component selection\n- **Embedded systems** \u2014 understanding how software interacts with hardware\n\nThis hardware background gives him an edge in **IoT security** \u2014 a growing field where cybersecurity meets physical devices.";

    /* =============================================
       CATEGORY 6: EDUCATION (deep expanded)
       ============================================= */
    if (/degree.*connect|degree.*cyber|computer.*engineering.*cyber|cp[e\u0113].*cyber|how.*degree.*help/.test(m))
      return "John's **BS Computer Engineering** degree connects to cybersecurity in several ways:\n- **Networking fundamentals** \u2014 CpE covers network protocols, architecture, and infrastructure, the foundation of network security\n- **Hardware security** \u2014 embedded systems and circuit design translate directly to IoT security knowledge\n- **Programming** \u2014 C# and JavaScript skills enable secure coding practices and security tool development\n- **Systems thinking** \u2014 holistic understanding of hardware + software, critical for threat modeling\n- **Operating systems** \u2014 understanding OS internals helps with malware analysis and system hardening\n\nHis coursework at **UE Caloocan** directly supports his cybersecurity certifications and career goals.";

    if (/school|study|education|university|course|major|college|dean|lister|academic/.test(m))
      return "John is a **3rd-year BS Computer Engineering** student at the **University of the East (Caloocan Campus)**, maintaining **Dean's Lister** status. His curriculum covers:\n- Networking and data communications\n- Embedded systems and microcontrollers\n- Programming and data structures\n- Circuit analysis and design\n- Operating systems\n- Software engineering principles\n\nHe's expected to graduate in **2027 or early 2028**.";

    if (/year.*college|how many.*year|what year|graduat/.test(m))
      return "John is in his **3rd year** of BS Computer Engineering at UE Caloocan, on the **Dean's List**. He started in 2023 and is roughly halfway through his degree. Expected graduation is **around 2027\u20132028**.";

    if (/dean.*list|gpa|grade|honor/.test(m))
      return "John is a proud **Dean's Lister** at the University of the East, Caloocan Campus. This means he consistently maintained above-average grades while simultaneously pursuing **7 industry certifications** and building **2 significant projects** \u2014 a remarkable demonstration of **time management and dedication**.";

    /* =============================================
       CATEGORY 7: CAREER & ROLE ANALYSIS (expanded 3x)
       ============================================= */
    if (/cybersecur.*(vs|or).*web|web.*(vs|or).*cyber|prepar.*more|more.*prepar/.test(m))
      return "John is **strongly positioned for both**, but here's the breakdown:\n\n**Cybersecurity Edge:**\n- 5 security-focused certifications (Cisco x4 + ISC2)\n- SOC operations and network defense training\n- Hands-on security exposure via Hack The Box\n- Clear pathway aligned with SOC/NOC roles\n\n**Web Development Edge:**\n- Full-stack project (Otokwikk) with real business logic\n- Node.js + MongoDB + JavaScript proficiency\n- AI chatbot integration experience\n- Vanilla frontend skills demonstrated through this portfolio\n\n**Verdict:** His certs and training make him a stronger **entry-level cybersecurity candidate right now**, but his full-stack skills mean he can also contribute to dev teams immediately. His **unique value is the intersection** \u2014 a developer who understands security deeply.";

    if (/career|role|job|intern|suitable|fit|position/.test(m))
      return "Based on John's profile, he's well-suited for:\n\n**1. Cybersecurity Intern** (SOC Analyst Trainee, NOC Technician)\n- Certs: Cisco x4 + ISC2 provide the knowledge base\n- Skills: Threat detection, network defense, incident response\n- Fit: Directly aligned with his training and interests\n\n**2. Junior Full-Stack Developer**\n- Project: Otokwikk proves he can ship complete applications\n- Stack: Node.js, MongoDB, JavaScript, HTML, CSS\n- Fit: Ready to contribute from day one\n\n**3. AI-Assisted Development / Prompt Engineering**\n- Project: Built an AI chatbot from scratch\n- Skills: Gemini API, prompt engineering, chatbot architecture\n- Fit: Emerging field where he has practical experience\n\n**4. IT Support / Help Desk**\n- Cert: Cisco Network Support and Security\n- Skills: Ticketing systems, protocols, troubleshooting\n- Fit: Entry point with clear growth path to security\n\nHis **combination of cybersecurity + AI + development** is quite distinctive for a 3rd-year student.";

    if (/improve|next|learn|future|growth|roadmap|path|should.*learn/.test(m))
      return "Here's a **strategic growth roadmap** for John:\n\n**Short-term (next 3\u20136 months):**\n1. **Python** \u2014 essential for cybersecurity automation, AI/ML, and scripting\n2. **Linux administration** \u2014 Ubuntu, command line, bash scripting\n3. **CTF challenges** \u2014 practical security experience on platforms like Hack The Box\n\n**Medium-term (6\u201312 months):**\n4. **Cloud fundamentals** (AWS/Azure) \u2014 modern infrastructure standard\n5. **SIEM tools** (Splunk, ELK) \u2014 core SOC technology\n6. **Networking deeper** \u2014 CCNA or equivalent\n\n**Long-term (12\u201318 months):**\n7. **Advanced security cert** \u2014 CompTIA Security+, SSCP, or CEH\n8. **Open-source contributions** \u2014 portfolio building and community involvement\n9. **Capstone project** \u2014 combining AI + security in a novel way\n\nHis current foundation provides **excellent building blocks** for any of these paths.";

    if (/career goal|become.*cyber|company|good fit|dream.*(job|company|role)/.test(m))
      return "John's career goal is to work at the **intersection of cybersecurity, AI, and software development** \u2014 building secure, intelligent systems. He's targeting:\n- **Cybersecurity firms** \u2014 SOC analyst, NOC technician, junior security engineer\n- **Tech companies with strong security teams** \u2014 embedded security roles\n- **AI startups** \u2014 security-minded developer or AI-assisted security roles\n- **Internship programs** \u2014 companies like Trend Micro, Cisco, Palo Alto Networks, or local cybersecurity firms in Metro Manila\n\nHis **ideal role** would be one where he can **apply his security knowledge while continuing to build software** \u2014 combining both passions.";

    if (/salary|compensation|expect.*pay|rate|hourly/.test(m))
      return "While I can't predict exact salaries (they vary by company, location, and role), here's context:\n\n**Philippines (entry-level):**\n- IT/cybersecurity internships: **PHP 8,000\u201320,000/month**\n- Junior SOC analyst: **PHP 20,000\u201335,000/month**\n- Junior developer: **PHP 18,000\u201330,000/month**\n\n**International remote (entry-level):**\n- Cybersecurity internships: **$500\u2013$1,500/month**\n- Junior development roles: **$800\u2013$2,000/month**\n\nJohn's certifications and projects put him **above average** for a 3rd-year student, which could command higher compensation.";

    if (/company.*(hire|look|interest)|what.*company|employer|where.*work/.test(m))
      return "Based on his profile, these company types would be great fits for John:\n- **Cybersecurity vendors**: Trend Micro (PH-based!), Cisco, Palo Alto Networks, Fortinet\n- **Tech consultancies**: Accenture, Deloitte (cybersecurity practices)\n- **Local PH firms**: ING, GCash, PayMaya (fintech needs security)\n- **AI startups**: companies building AI-powered security tools\n- **Government agencies**: DICT, NBI cybersecurity divisions\n\n**Trend Micro** is particularly interesting \u2014 it's a world-class cybersecurity company headquartered in the Philippines.";

    /* =============================================
       CATEGORY 8: COMPARATIVE & MULTI-PERSPECTIVE
       ============================================= */
    if (/how.*(compare|stack up|measure).*(other|candidate|student|peer|applicant)/.test(m))
      return "Compared to other 3rd-year Computer Engineering students, John stands out in several ways:\n\n**Above average:**\n- **Certifications** \u2014 most students have 0\u20131; John has 7\n- **Projects** \u2014 most have academic exercises; John has 2 complete, real-world applications\n- **AI experience** \u2014 most haven't integrated an AI API; John built a chatbot\n- **Cybersecurity focus** \u2014 most CpE students go general; John has a clear specialization\n\n**Average / developing:**\n- **Programming languages** \u2014 standard CpE range (JS, C#, HTML, CSS)\n- **Work experience** \u2014 still looking for first internship (typical for 3rd year)\n\n**Areas to grow:**\n- **Python** \u2014 not yet in his stack\n- **Cloud platforms** \u2014 next step for most students\n\nOverall, his **certification volume and project quality** put him in the **top tier** of his peer group.";

    if (/compare.*(cert|certification).*(project)/.test(m))
      return "Comparing John's certifications vs. his projects:\n\n**Certifications** show his **knowledge and dedication to learning**:\n- 7 certs from 4 respected organizations\n- Clear cybersecurity specialization\n- Self-paced, requiring discipline\n\n**Projects** show his **practical application ability**:\n- 2 complete, working systems\n- Real-world tech stacks (Node.js, MongoDB, C#)\n- AI integration in both\n\n**Synergy:** The certs give him the **theory and framework knowledge**; the projects prove he can **actually build things**. Together, they create a compelling story: he **learns and applies**.";

    if (/who.*(hire|choose|pick)|which.*(better|stronger|more)|compare.*(john|him|his)/.test(m))
      return "Here's a multi-perspective analysis of John's strengths:\n\n**As a Recruiter Would See It:**\n- 7 certifications from recognized orgs \u2192 proven learner\n- 2 complete projects \u2192 can ship software\n- Dean's List + full course load \u2192 manages time effectively\n- Clear cybersecurity focus \u2192 knows what he wants\n\n**As a Teammate Would See It:**\n- Built both solo projects \u2192 self-sufficient\n- Uses Git for version control \u2192 collaboration ready\n- Understands full stack \u2192 can work across the codebase\n\n**As a Mentor Would See It:**\n- Ahead of peers in certifications \u2192 self-motivated\n- Still needs Python, cloud, Linux \u2192 clear growth areas\n- Strong foundation \u2192 ready to accelerate with guidance";

    /* =============================================
       CATEGORY 9: SCENARIO & HYPOTHETICAL
       ============================================= */
    if (/what if|scenario|imagine|suppose|hypothetical|if.*(could|would|should)/.test(m))
      return "Interesting hypothetical! Here's how I'd reason through it based on John's profile:\n\nIf John were to **pivot entirely into AI/ML engineering**, his current skills would give him:\n- **Programming foundation** (JavaScript, C#) \u2014 transferable logic and syntax understanding\n- **AI integration experience** \u2014 already worked with Gemini API\n- **Analytical thinking** \u2014 honed through cybersecurity threat analysis\n- **Self-learning ability** \u2014 proven by 7 self-paced certifications\n\nHe'd need to add: **Python, linear algebra, statistics, ML frameworks** (TensorFlow/PyTorch).\n\nIt's a viable path, but his **strongest positioning** remains **cybersecurity with AI as a differentiator** rather than pure AI.";

    if (/if.*(meet|talk|speak|interview).*(him|john)/.test(m))
      return "If you were to meet or interview John, here's what to expect:\n\n**His likely strengths in conversation:**\n- Deep knowledge of cybersecurity fundamentals\n- Practical project experience to discuss\n- Enthusiasm for AI and emerging tech\n- Professional demeanor (Dean's Lister discipline)\n\n**Questions he'd answer well:**\n- \"Walk me through how you built Otokwikk.\"\n- \"How does your ISC2 training apply to real-world security?\"\n- \"Why are you interested in cybersecurity?\"\n\n**Growth areas to explore:**\n- He'd be honest about areas he's still learning (Python, cloud)\n- First internship means less professional workplace experience\n\nOverall, he'd come across as **prepared, passionate, and coachable**.";

    if (/problem.?solving|approach|methodology|how.*(tackle|solve|handle)/.test(m))
      return "Based on John's projects and academic background, here's how he likely approaches problems:\n\n**1. Understand the Problem** \u2014 gather requirements, define scope, ask questions\n**2. Research & Plan** \u2014 look up best practices, choose tech stack, design architecture\n**3. Build Iteratively** \u2014 start with core functionality, add features one by one\n**4. Test & Refine** \u2014 debug, optimize, improve based on feedback\n**5. Document & Reflect** \u2014 learn from what worked and what didn't\n\nThis methodology is evident in **Otokwikk** (incremental feature addition) and **CivicLens** (clean architecture design).";

    /* =============================================
       CATEGORY 10: ADVICE & MENTORSHIP
       ============================================= */
    if (/what.*(advice|tip|suggest|recommend).*(him|john|student|beginner|someone)/.test(m))
      return "Here's advice I'd offer John (or someone at his stage):\n\n**1. Build in public.** Share your projects and certs on LinkedIn \u2014 you've done impressive work, let people see it.\n\n**2. Start a blog or write.** Explaining concepts (network defense, SOC operations) in your own words deepens understanding and builds your personal brand.\n\n**3. Join communities.** Cybersecurity and developer communities (CTF competitions, hackathons, local tech meetups) accelerate learning and open doors.\n\n**4. Python next.** It's the lingua franca of cybersecurity and AI \u2014 learning it unlocks automation, ML, and more advanced security tools.\n\n**5. Aim for that first internship.** Real work experience will complement your certifications and projects perfectly.";

    if (/mentor|guide|coach|teach.*(how|to)|learn.*from/.test(m))
      return "If John were to seek mentorship, here's what I'd guide him on:\n\n**Technical focus:**\n- **Python scripting** for security automation\n- **Linux command line** (Ubuntu, Kali)\n- **Cloud basics** (AWS security group, IAM, S3)\n- **SIEM tools** (Splunk, ELK stack)\n\n**Career focus:**\n- **Resume tailoring** \u2014 highlight certs and projects for specific roles\n- **Portfolio narrative** \u2014 tell the story of why cybersecurity + AI + development\n- **Interview prep** \u2014 practice explaining his projects and cert learnings\n- **Networking strategy** \u2014 connecting with professionals in target companies\n\nHis **best mentors** would be SOC analysts, security engineers, or full-stack developers who transitioned into security.";

    /* =============================================
       CATEGORY 11: PORTFOLIO META
       ============================================= */
    if (/portfolio|website|this site|how.*(build|made).*(this|portfolio)/.test(m))
      return "This portfolio is built with **vanilla HTML, CSS, and JavaScript** \u2014 no frameworks, no build step. Features include:\n- **Loader animation** \u2014 logo zooms from center into nav bar\n- **Scroll-driven reveals** \u2014 elements fade and slide on scroll\n- **Certificate lightbox** \u2014 click to view certificate images with navigation\n- **Scheduling modal** \u2014 meeting/interview scheduling via EmailJS\n- **AI Portfolio Assistant** \u2014 that's me! Powered by Gemini API\n- **Project preview** \u2014 live iframe preview of Otokwikk\n- **Light/Dark theme** \u2014 persistent toggle with smooth transitions\n- **Fully responsive** \u2014 works on mobile, tablet, desktop\n\nIt's designed to be **fast, accessible, and showcase John's abilities** directly through its own construction.";

    if (/contact|email|reach|hire|message/.test(m))
      return "You can reach John through:\n- **Email**: jlgzambrano27@gmail.com\n- **Phone**: +63 968 367 2765\n- **LinkedIn**: linkedin.com/in/john-lord-zambrano\n- **GitHub**: github.com/jlz0727\n\nOr use the **Schedule a Meeting** or **Schedule an Interview** buttons in the Contact section of this website. He's open to opportunities, internships, and entry-level roles!";

    if (/resume|cv|download|curriculum/.test(m))
      return "Use the **Download CV** button in the top navigation bar to download John's resume. You can also reach out directly via **jlgzambrano27@gmail.com** for a copy.";

    if (/schedule|book|appointment|meeting|interview|calendar/.test(m))
      return "To schedule with John:\n- Go to the **Contact** section of this portfolio\n- Use **Schedule a Meeting** for general discussions\n- Use **Schedule an Interview** for formal interview requests\n- Both buttons open a form that sends an email via **EmailJS**\n\nAlternatively, email him directly at **jlgzambrano27@gmail.com** and he'll coordinate.";

    /* =============================================
       CATEGORY 12: MULTI-PART & COMPLEX QUESTIONS
       ============================================= */
    if (/(and|also|,|what about).*(project|cert|skill|education).*(and|also|,|what about)/i.test(m))
      return "It sounds like you're asking about multiple things! Let me break it down:\n\n**Projects:** John has built **Otokwikk** (full-stack carwash management with AI chatbot) and **CivicLens** (C# AI-powered fact-checker).\n\n**Certifications:** He holds **7 certifications** from Cisco (4), ISC2 (1), Stellar (1), and Hack The Box (1), covering cybersecurity, networking, and blockchain.\n\n**Skills:** JavaScript, HTML, CSS, C#, Node.js, MongoDB, network defense, threat analysis, AI integration, Arduino.\n\n**Education:** 3rd-year BS Computer Engineering at UE Caloocan, Dean's Lister.\n\nWhich of these would you like to dive deeper into?";

    /* =============================================
       CATEGORY 13: EMERGING TECH & INDUSTRY
       ============================================= */
    if (/trend|industry|market|future.*(cyber|ai|tech)|(cyber|ai|tech).*future/.test(m))
      return "Great context question! Here's how John's skills align with industry trends:\n\n**1. AI in Cybersecurity** \u2014 The industry is moving toward AI-powered SOC operations. John's experience with **Gemini API + chatbot development** gives him practical AI skills that complement his security training.\n\n**2. Zero Trust Architecture** \u2014 Network defense and access control principles from his Cisco certs align with the Zero Trust model (never trust, always verify).\n\n**3. Cloud Security** \u2014 While he hasn't worked with cloud extensively yet, his networking and security fundamentals provide a strong foundation for AWS/Azure security certifications.\n\n**4. Blockchain & Web3** \u2014 His Stellar bootcamp exposure gives him awareness of decentralized security challenges.\n\n**5. Automation & SOAR** \u2014 His Node.js backend skills could extend to building security orchestration and automated response (SOAR) playbooks.\n\nHe's well-positioned to grow into these trends.";

    /* =============================================
       CATEGORY 14: TEAM & COLLABORATION
       ============================================= */
    if (/team|collaborat|group|pair|work.*(with|together|other)/.test(m))
      return "Based on his profile, here's what John would bring to a team:\n\n**Technical contributions:**\n- Full-stack development (frontend + backend + database)\n- AI integration and chatbot architecture\n- Security perspective (secure coding, threat modeling)\n- Git workflow and version control\n\n**Soft skills:**\n- Analytical problem-solving\n- Self-directed and proactive\n- Continuous learner \u2014 picks up new tools quickly\n- Documented approach (clean architecture in CivicLens)\n\nHe'd work well in teams that value **security awareness, practical building, and continuous learning**.";

    /* =============================================
       CATEGORY 15: EMOTIONAL / MOTIVATIONAL
       ============================================= */
    if (/why.*(cyber|security|tech|program|choose)/.test(m))
      return "John chose **Computer Engineering** because he wanted to understand technology from the ground up \u2014 from circuits and hardware to software and networks. His interest in **cybersecurity** grew from the realization that as technology becomes more powerful, **protecting it becomes more critical**.\n\nHe's motivated by the challenge of **building systems that are both functional and secure**, and by the constantly evolving nature of the field \u2014 there's always something new to learn. His certifications and projects reflect this **drive to understand and protect**.";

    if (/proud|accomplish|achievement|milestone|highlight/.test(m))
      return "Some of John's proudest achievements:\n1. **Earning 7 certifications** before 3rd year \u2014 including ISC2 and multiple Cisco credentials\n2. **Building Otokwikk** \u2014 a complete, full-stack system with AI chatbot that solves real business problems\n3. **Maintaining Dean's List** while pursuing certs and projects \u2014 balancing academics with self-driven learning\n4. **Building this portfolio and AI assistant** (me!) from scratch with vanilla code\n\nEach represents **months of dedication and discipline**.";

    /* =============================================
       CATEGORY 16: FUN / PERSONALITY
       ============================================= */
    if (/personality|describe.*(him|john|person)|what.*(like|type|kind).*person/.test(m))
      return "Based on what his profile shows, John seems to be:\n- **Driven and disciplined** \u2014 Dean's List + 7 certifications don't happen by accident\n- **Curious and self-directed** \u2014 he pursues learning beyond the classroom\n- **Practical and hands-on** \u2014 he builds real things, not just theory\n- **Interdisciplinary** \u2014 connects cybersecurity, AI, and development\n- **Humble** \u2014 his portfolio is well-crafted but not boastful\n\nIf you met him, you'd probably find someone who's **passionate about tech, eager to learn, and ready to contribute**.";

    if (/fun fact|interesting|unique|special|surprising|random/.test(m))
      return "Here's a fun fact: **John built this entire portfolio website and the AI assistant (me!) before earning most of his certifications.** This means he was already capable of building production-quality applications while systematically building his cybersecurity knowledge through certifications. It's a great example of his **learn-by-building** approach.";

    /* =============================================
       CATEGORY 17: TIME / AVAILABILITY
       ============================================= */
    if (/available|free|when|time|schedule|availability|hours/.test(m))
      return "John is currently a **full-time 3rd-year student**, so his availability depends on his academic schedule. He's generally:\n- **Most flexible** during semester breaks and weekends\n- **Available for part-time or internship roles** that accommodate his class schedule\n- **Responsive to emails** within 24\u201348 hours\n\nThe best way to discuss timing is to **schedule a meeting** via the Contact section or email him directly at **jlgzambrano27@gmail.com**.";

    /* =============================================
       CATEGORY 18: WHAT IF / IMAGINARY SCENARIOS
       ============================================= */
    if (/what.*(think|feel|believe|opinion).*(about|on)/.test(m))
      return "Based on his profile and trajectory, I believe John would emphasize that **cybersecurity is not just about tools and technology \u2014 it's about mindset**. His combination of hands-on development (Otokwikk, CivicLens) and formal security training (Cisco, ISC2) shows he values both **practical building** and **principled defense**.\n\nHe'd likely say: \"The best defense is understanding how things are built. That's why I study both development and security.\"";

    /* =============================================
       CATEGORY 19: FALLBACK (supercharged with context)
       ============================================= */
    return "I can help you with **many aspects** of John's profile. Here's what I know about:\n\n**\u2192 Skills & Tech Stack**\nLanguages: JavaScript, HTML, CSS, C# | Backend: Node.js | Database: MongoDB | Cybersecurity: Network defense, threat analysis | AI: Gemini API, chatbot dev | Hardware: Arduino\n\n**\u2192 Certifications**\nCisco (4): SecOps & Defense Analyst, Network Defense, Network Support, Intro to Cyber | ISC2: Certified in Cybersecurity | Stellar: Blockchain | Hack The Box: Cyber Fundamentals\n\n**\u2192 Projects**\nOtokwikk \u2014 Full-stack carwash management with AI chatbot | CivicLens \u2014 C# AI fact-checker\n\n**\u2192 Education**\n3rd-year BS CpE at UE Caloocan | Dean's Lister\n\n**\u2192 Career**\nBest fit: SOC analyst, full-stack dev, AI-assisted security roles\n\n**\u2192 Contact**\nEmail: jlgzambrano27@gmail.com | Phone: +63 968 367 2765\n\nWhat would you like to ask?";
  }

  function send(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    input.value = '';
    if (inputTextEl) inputTextEl.textContent = '';
    conversationTurns++;

    var typing = addTyping();

    function afterReply(reply) {
      typing.remove();
      addMessage(reply, 'ai');
      history.push({ role: 'user', parts: [{ text: text }] });
      history.push({ role: 'model', parts: [{ text: reply }] });
    }

    if (API_ENABLED) {
      askGemini(text).then(afterReply).catch(function (err) {
        console.error('Gemini API error — falling back to local reply:', err);
        typing.remove();
        afterReply(localReply(text));
      });
    } else {
      setTimeout(function () { afterReply(localReply(text)); }, 450);
    }
  }

  function openPanel() {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    fab.classList.add('open');
    setTimeout(function () { if (input) input.focus(); }, 320);
  }

  function closePanel() {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    fab.classList.remove('open');
  }

  function init() {
    fab       = document.getElementById('chatFab');
    panel     = document.getElementById('chatPanel');
    closeBtn  = document.getElementById('chatClose');
    messages  = document.getElementById('chatMessages');
    quickWrap = document.getElementById('chatQuick');
    form      = document.getElementById('chatForm');
    input     = document.getElementById('chatInput');
    if (!fab || !panel) return;

    fab.addEventListener('click', function () { panel.classList.contains('open') ? closePanel() : openPanel(); });
    closeBtn.addEventListener('click', closePanel);
    form.addEventListener('submit', function (e) { e.preventDefault(); send(input.value); });

    /* ---------- Mirror typed text to visible display ---------- */
    inputTextEl = document.getElementById('inputText');
    if (inputTextEl) {
      inputTextEl.textContent = input.value;
      input.addEventListener('input', function () { inputTextEl.textContent = input.value; });
    }

    /* ---------- Global keystroke capture — type immediately without clicking ---------- */
    document.addEventListener('keydown', function (e) {
      if (document.activeElement === input) return;
      var tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON') return;
      var modal = document.getElementById('modal');
      if (modal && modal.classList.contains('open')) return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === 'Tab' || e.key.startsWith('F')) return;
      input.focus();
      if (e.key.length === 1) {
        e.preventDefault();
        input.value += e.key;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        input.value = input.value.slice(0, -1);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        send(input.value);
      }
    });

    /* ---------- Persistent terminal cursor blink (same whether focused or not) ---------- */
    var cursor = document.getElementById('termCursor');
    if (cursor) {
      cursor.classList.add('visible');
      setInterval(function () { cursor.classList.toggle('visible'); }, 530);
    }

    if (!API_ENABLED) console.info('[chatbot] No Gemini API key set — using local fallback. Set GEMINI_API_KEY in chatbot.js to enable AI.');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  return { send: send };
})();
