export interface ReportSection {
  heading: string
  body?: string
  bullets?: string[]
}

export interface PhaseReport {
  id: string
  name: string
  summary: string
  title: string
  sections: ReportSection[]
}

export const phasesReport: PhaseReport[] = [
  {
    id: '01',
    name: 'Physical Security Breach',
    summary: 'CCTV blind spots, tailgating, and inadequate access controls allowed unauthorized facility entry.',
    title: 'PHASE 1 — PHYSICAL SECURITY BREACH',
    sections: [
      {
        heading: 'Definition of Physical Security',
        body: 'Physical security refers to the physical measures, policies, and procedures designed to protect an organization\'s personnel, facilities, hardware, networks, and data from physical actions or events that could cause loss, damage, or unauthorized access.',
      },
      {
        heading: 'Physical Security Weaknesses in this Scenario',
        bullets: [
          'CCTV Blind Spots: Cameras were poorly positioned, allowing the suspect to operate undetected in certain areas.',
          'Inadequate Access Control Systems: The system relied solely on ID cards without secondary authentication (like PINs or biometrics) for highly restricted areas.',
          'Susceptibility to Tailgating: Lack of physical barriers (like mantraps or turnstiles) allowed the suspect to follow authorized personnel.',
          'Poor Visitor Management: Incomplete visitor documentation and lack of verification processes for after-hours entry.',
        ],
      },
      {
        heading: 'How Tailgating Bypasses Access Control',
        body: 'Tailgating occurs when an unauthorized individual closely follows an authorized person through a secure checkpoint (like a door or gate) before it closes. This renders electronic access controls (like keycard readers) completely ineffective, as the system logs the entry of the authorized user but remains blind to the intruder.',
      },
      {
        heading: 'The Essential Role of Physical Security',
        body: 'Physical security is the foundational layer of information security. If a malicious actor gains physical access to a server, workstation, or network switch, they can bypass firewalls, install hardware keyloggers, steal hard drives, or physically destroy the equipment. Without physical security, digital security measures are easily circumvented.',
      },
      {
        heading: 'Recommended Physical Access Controls',
        bullets: [
          'Mantraps (Security Vestibules): Prevents tailgating by requiring one door to close before the second door opens.',
          'Multi-Factor Authentication (MFA) for Doors: Requiring a keycard plus a biometric scan (fingerprint/retina) for critical areas like the server room.',
          'Security Personnel: Stationing guards at key chokepoints, especially during after-hours.',
        ],
      },
      {
        heading: 'The Role of CCTV in Investigations',
        body: 'CCTV provides crucial visual evidence to corroborate digital logs. It establishes a timeline, verifies the identity of the physical actor (proving it wasn\'t just stolen credentials being used remotely), and helps investigators observe the methods used to bypass security (like identifying exactly who the suspect tailgated).',
      },
    ],
  },
  {
    id: '02',
    name: 'Mobile Device & Data Handling',
    summary: 'Portable storage devices bypassed network security perimeters enabling silent data exfiltration.',
    title: 'PHASE 2 — MOBILE DEVICE AND DATA HANDLING INCIDENT',
    sections: [
      {
        heading: 'Security Risks of Portable Storage Devices',
        body: 'Portable storage devices (USBs, external hard drives) are small, easily concealable, have massive storage capacities, and are highly susceptible to loss or theft. They can easily be used to extract sensitive data or introduce malicious payloads (like malware or ransomware) into a secure network.',
      },
      {
        heading: 'Risks Associated with Mobile/Portable Systems',
        body: 'Beyond storage devices, mobile systems (laptops, tablets) frequently leave the secure perimeter of the organization. They operate on untrusted networks (public Wi-Fi), lack continuous physical oversight, and, if not properly encrypted, expose massive amounts of organizational data if stolen.',
      },
      {
        heading: 'Definition of Data Leakage',
        body: 'Data leakage (or data exfiltration) is the unauthorized transmission, copying, or transfer of sensitive, classified, or confidential information from an organization\'s internal systems to the outside world.',
      },
      {
        heading: 'Bypassing Traditional Security Controls',
        body: 'Traditional security perimeters focus on network traffic (firewalls, email filters, Intrusion Detection Systems). Removable media bypasses these controls entirely because the data transfer happens locally over a hardware port (USB) without ever crossing the network boundary, making it invisible to standard network monitoring tools.',
      },
      {
        heading: 'Recommended Policies for External Storage',
        bullets: [
          'Acceptable Use Policy (AUP) Update: Strictly prohibit the use of personal or unapproved external storage devices on university computers.',
          'Data Classification Policy: Mandate that highly confidential data (HR records, student data) cannot be transferred to removable media under any circumstances.',
        ],
      },
      {
        heading: 'Technical Controls to Reduce Risk',
        bullets: [
          'Endpoint Data Loss Prevention (DLP): Software that detects and blocks the transfer of sensitive data to USB drives.',
          'Group Policy Objects (GPO): Disabling USB mass storage access on all university workstations at the operating system level.',
          'Mandatory Hardware Encryption: If USBs must be used, enforce the use of university-issued, strictly managed hardware-encrypted drives.',
        ],
      },
    ],
  },
  {
    id: '03',
    name: 'Personnel Security Failure',
    summary: 'Offboarding breakdown left active credentials and physical access for a resigned employee.',
    title: 'PHASE 3 — PERSONNEL SECURITY INVESTIGATION',
    sections: [
      {
        heading: 'Personnel Security and Information Security',
        body: 'Personnel security ensures that the people interacting with information systems are trustworthy, properly trained, and hold only the access necessary for their roles. It manages the human element of security through background checks, role-based access control, and strict onboarding/offboarding procedures.',
      },
      {
        heading: 'Principle of Least Privilege (PoLP)',
        body: 'PoLP is the concept that a user, program, or process should be granted only the bare minimum level of access and permissions necessary to perform their legitimate functions, and nothing more.',
      },
      {
        heading: 'Security Failures During Employee Separation',
        bullets: [
          'Failure to revoke logical access (network credentials, admin rights).',
          'Failure to revoke physical access (keycards remained active).',
          'Failure to reclaim university-owned assets (laptops, storage devices).',
        ],
      },
      {
        heading: 'Importance of Account Deactivation',
        body: 'Immediately deactivating accounts prevents former employees—who no longer have a legitimate business need and may harbor malicious intent—from logging in to steal data, sabotage systems, or deploy malware. It neutralizes the insider threat the moment employment ends.',
      },
      {
        heading: 'Risks Created by Excessive Privileges',
        body: 'Excessive privileges expand an organization\'s attack surface. If an account with unnecessary administrator rights is compromised (or goes rogue, as in this case), the "blast radius" is massive. The attacker can alter system logs, access restricted files, and bypass standard user restrictions.',
      },
      {
        heading: 'Recommended Offboarding Procedures',
        bullets: [
          'Automated HR-IT Synchronization: When HR marks an employee as "resigned/terminated," IT systems should automatically freeze their credentials and revoke access.',
          'Asset Return Checklists: Mandatory sign-offs ensuring all physical hardware, IDs, and keys are returned before final pay is released.',
        ],
      },
    ],
  },
  {
    id: '04',
    name: 'Security Management Review',
    summary: 'Stale policies, absent audits, and untrained staff created systemic organizational vulnerabilities.',
    title: 'PHASE 4 — SECURITY MANAGEMENT AND MAINTENANCE REVIEW',
    sections: [
      {
        heading: 'Why Security Requires Continuous Maintenance',
        body: 'The threat landscape is constantly evolving, new vulnerabilities are discovered daily, and organizational structures (personnel, technology) frequently change. A static security posture quickly becomes obsolete, leaving the network vulnerable to modern attack vectors.',
      },
      {
        heading: 'Definition of Vulnerability Assessment',
        body: 'A vulnerability assessment is a systematic, continuous process of identifying, quantifying, and prioritizing security weaknesses within an organization\'s physical or digital infrastructure.',
      },
      {
        heading: 'The Relationship Between Security Stages',
        bullets: [
          'Planning: Establishes the policies, budget, and strategic goals for security.',
          'Risk Assessment: Identifies critical assets and evaluates the likelihood and impact of potential threats.',
          'Vulnerability Assessment: Actively scans the infrastructure to find specific technical or physical flaws.',
          'Remediation: The execution of fixes (patching, upgrading locks, policy enforcement) based on the findings of the assessments.',
        ],
      },
      {
        heading: 'Organizational Failures Contributed to the Incident',
        bullets: [
          'Stale policies (3 years outdated) failed to address modern USB/data threats.',
          'Lack of security awareness training meant staff didn\'t challenge the tailgating.',
          'Lack of audits allowed the HR/IT offboarding gap to persist unnoticed.',
        ],
      },
      {
        heading: 'Security Management Improvements',
        bullets: [
          'Implement an annual policy review and update cycle.',
          'Mandate bi-annual, modern security awareness training for all staff (covering physical tailgating and digital phishing).',
          'Schedule quarterly vulnerability scans and annual third-party penetration tests.',
        ],
      },
      {
        heading: 'Continuous Monitoring Strengthens Security',
        body: 'Continuous monitoring provides real-time visibility into the network. Even if preventative controls fail (like a physical door being breached), continuous monitoring (like detecting abnormal late-night file transfers) triggers immediate alerts, allowing responders to stop the exfiltration in progress.',
      },
    ],
  },
  {
    id: '05',
    name: 'Digital Forensics Investigation',
    summary: 'Registry artifacts, access logs, and forensic imaging reconstructed the full incident timeline.',
    title: 'PHASE 5 — DIGITAL FORENSICS INVESTIGATION',
    sections: [
      {
        heading: 'Definition of Digital Forensics',
        body: 'Digital forensics is the science of identifying, preserving, collecting, analyzing, and reporting on digital data in a legally admissible manner to reconstruct events surrounding a cybercrime or policy violation.',
      },
      {
        heading: 'Importance of Digital Evidence',
        body: 'Digital evidence provides objective, undeniable "digital fingerprints." It can prove exact timelines, intent, data volumes, and methods used, moving an investigation from suspicion to factual certainty.',
      },
      {
        heading: 'The Five Phases of Digital Forensics',
        bullets: [
          'Identification: Locating the devices and data relevant to the incident.',
          'Preservation: Securing the evidence (e.g., using write-blockers) so it is not altered or destroyed.',
          'Collection: Creating a bit-for-bit forensic image/copy of the data for safe analysis.',
          'Analysis: Examining the forensic copy to uncover timelines, deleted files, and malicious actions.',
          'Reporting: Documenting the findings in a clear, objective manner for stakeholders or legal proceedings.',
        ],
      },
      {
        heading: 'Why Evidence Preservation is Critical',
        body: 'Digital data is incredibly fragile. Simply booting up a computer can alter thousands of system files, timestamps, and logs. Preservation ensures the integrity of the data, proving in a court of law or tribunal that the evidence was not tampered with by the investigators.',
      },
      {
        heading: 'Definition of Chain of Custody',
        body: 'Chain of Custody is a chronological, documented paper trail that records the sequence of physical custody, control, transfer, analysis, and disposition of physical or electronic evidence. It answers: Who had the evidence, when did they have it, and what did they do with it?',
      },
      {
        heading: 'Possible Digital Evidence Sources',
        bullets: [
          'Windows Registry (shows history of attached USB devices).',
          'Workstation Hard Drive (Unallocated space for deleted documents/browser history).',
          'Server Access Logs / Active Directory Logs (showing when the ex-employee logged in).',
          'CCTV Server hard drives.',
        ],
      },
      {
        heading: 'Supporting Disciplinary/Legal Proceedings',
        body: 'Forensic findings translate technical jargon into legally admissible facts. By recovering deleted files and correlating timestamps with USB insertions, the forensics team provides undeniable proof of intent to steal intellectual property, justifying civil lawsuits, criminal charges, or strict disciplinary action.',
      },
    ],
  },
]

export const finalReportSections = [
  {
    id: 'timeline',
    title: 'Incident Timeline',
    items: [
      { label: 'T-Minus 14 Days', detail: 'Suspect officially resigns. HR fails to notify IT/Security to revoke logical and physical access.' },
      { label: '11:37 PM (Incident Night)', detail: 'Suspect uses still-active physical access card to enter the building. Suspect tailgates behind an authorized user to bypass secondary controls and enters the restricted server room.' },
      { label: 'Post-Entry', detail: 'Suspect connects a personal, unauthorized USB device to a university workstation.' },
      { label: 'Data Exfiltration', detail: 'Suspect utilizes unrevoked administrator privileges to access and copy high volumes of confidential HR, faculty, and research data to the USB drive.' },
      { label: 'Cover-Up Attempt', detail: 'Suspect deletes documents, clears browser history, and deletes local log files to hide their tracks.' },
      { label: '8:45 AM (Next Morning)', detail: 'Security officers detect anomalies in the remaining system logs and physical entry logs. Incident declared.' },
    ],
  },
  {
    id: 'failures',
    title: 'Security Failure Analysis',
    items: [
      { label: 'Physical', detail: 'Weak secondary authentication on restricted rooms, unmonitored CCTV blind spots, lack of anti-tailgating architecture (mantraps).' },
      { label: 'Personnel', detail: 'Complete breakdown of the offboarding lifecycle. No communication between HR and IT regarding the termination of access. Violation of the Principle of Least Privilege (retaining admin rights).' },
      { label: 'Management', detail: 'Systemic neglect of security governance. Policies were outdated, audits were non-existent, and staff were not trained to challenge tailgaters.' },
    ],
  },
  {
    id: 'forensics',
    title: 'Digital Forensics Analysis',
    items: [
      { label: 'Evidence Sources', detail: 'Suspect\'s workstation, network event logs, USB registry artifacts, and CCTV footage.' },
      { label: 'Procedures', detail: 'The workstation must be immediately quarantined. A write-blocker must be used to create a forensic image of the drive. Analysis will be conducted strictly on the forensic copy to maintain the Chain of Custody.' },
      { label: 'Findings', detail: 'Recovery of deleted files confirms the exact data stolen. USB connection artifacts tie the specific unauthorized hardware to the exact time of the breach.' },
    ],
  },
  {
    id: 'impact',
    title: 'Impact Analysis',
    items: [
      { label: 'Operational', detail: 'Temporary shutdown of affected servers for forensic imaging; disruption to HR and Registrar workflows.' },
      { label: 'Financial', detail: 'Costs of the forensic investigation, potential regulatory fines, and costs associated with upgrading physical and digital security controls.' },
      { label: 'Reputational', detail: 'Loss of trust from students, faculty, and research partners whose data was compromised. Potential drop in future research grants.' },
      { label: 'Legal', detail: 'Potential lawsuits from affected individuals whose private data was leaked. Breach of data protection laws.' },
      { label: 'Privacy', detail: 'Severe breach of PII (Personally Identifiable Information) belonging to staff and students.' },
    ],
  },
  {
    id: 'improvements',
    title: 'Security Improvement Plan',
    items: [
      { label: 'Physical', detail: 'Install mantraps for the Data Center and Research hubs. Upgrade access controls to require MFA (Badge + Biometric) for restricted zones.' },
      { label: 'Personnel', detail: 'Implement an automated Identity and Access Management (IAM) system that links HR software directly to Active Directory—automatically disabling accounts and badges the moment an employee is marked as terminated.' },
      { label: 'Maintenance', detail: 'Institute a rigid, annual security audit. Schedule mandatory quarterly security awareness training for all university staff.' },
      { label: 'Forensic Readiness', detail: 'Deploy centralized log management (SIEM) that forwards logs to an immutable, off-site server so that even if an insider deletes local logs, the central record remains intact.' },
    ],
  },
]
