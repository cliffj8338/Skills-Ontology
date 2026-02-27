const fs = require('fs');

const certs = [];

function add(name, abbr, category, description, provider) {
    certs.push({ name, abbr: abbr || '', category, description, provider: provider || 'Various', skills: [], tier: 'standard', source: 'lightcast' });
}

// ═══════════════════════════════════════════════════
// CLOUD & INFRASTRUCTURE
// ═══════════════════════════════════════════════════
const cloud = 'Cloud & Infrastructure';
// AWS
add('AWS Certified Cloud Practitioner', 'CLF', cloud, 'Foundational understanding of AWS Cloud concepts, services, and terminology', 'Amazon Web Services');
add('AWS Certified Solutions Architect - Associate', 'SAA', cloud, 'Design distributed systems and architectures on AWS', 'Amazon Web Services');
add('AWS Certified Solutions Architect - Professional', 'SAP', cloud, 'Advanced design of distributed applications and systems on AWS', 'Amazon Web Services');
add('AWS Certified Developer - Associate', 'DVA', cloud, 'Developing and maintaining AWS-based applications', 'Amazon Web Services');
add('AWS Certified SysOps Administrator - Associate', 'SOA', cloud, 'Deployment, management, and operations on AWS', 'Amazon Web Services');
add('AWS Certified DevOps Engineer - Professional', 'DOP', cloud, 'Provisioning, operating, and managing distributed systems on AWS', 'Amazon Web Services');
add('AWS Certified Database Specialty', 'DBS', cloud, 'Design, deployment, and management of AWS database solutions', 'Amazon Web Services');
add('AWS Certified Advanced Networking - Specialty', 'ANS', cloud, 'Design and implement AWS and hybrid IT network architectures', 'Amazon Web Services');
add('AWS Certified Security - Specialty', 'SCS', cloud, 'Security controls and best practices for the AWS platform', 'Amazon Web Services');
add('AWS Certified Machine Learning - Specialty', 'MLS', cloud, 'Design, implement, and deploy ML solutions on AWS', 'Amazon Web Services');
add('AWS Certified Data Analytics - Specialty', 'DAS', cloud, 'Design and build analytics solutions on AWS', 'Amazon Web Services');
add('AWS Certified SAP on AWS - Specialty', '', cloud, 'Design SAP workloads on the AWS platform', 'Amazon Web Services');
add('AWS Certified Data Engineer - Associate', 'DEA', cloud, 'Build and manage data pipelines on AWS', 'Amazon Web Services');
add('AWS Certified AI Practitioner', 'AIF', cloud, 'Foundational understanding of AI/ML concepts and AWS AI services', 'Amazon Web Services');
// Azure
add('Microsoft Certified: Azure Fundamentals', 'AZ-900', cloud, 'Foundational knowledge of cloud services and Azure', 'Microsoft');
add('Microsoft Certified: Azure Administrator Associate', 'AZ-104', cloud, 'Implement, manage, and monitor Azure environments', 'Microsoft');
add('Microsoft Certified: Azure Developer Associate', 'AZ-204', cloud, 'Design, build, test, and maintain cloud applications on Azure', 'Microsoft');
add('Microsoft Certified: Azure Solutions Architect Expert', 'AZ-305', cloud, 'Design solutions that run on Azure including compute, network, storage, and security', 'Microsoft');
add('Microsoft Certified: Azure Security Engineer Associate', 'AZ-500', cloud, 'Implement security controls and threat protection on Azure', 'Microsoft');
add('Microsoft Certified: Azure Network Engineer Associate', 'AZ-700', cloud, 'Design, implement, and manage Azure networking solutions', 'Microsoft');
add('Microsoft Certified: Azure Data Engineer Associate', 'DP-203', cloud, 'Design and implement data solutions using Azure data services', 'Microsoft');
add('Microsoft Certified: Azure Database Administrator Associate', 'DP-300', cloud, 'Design, implement, and manage Azure database infrastructure', 'Microsoft');
add('Microsoft Certified: Azure AI Engineer Associate', 'AI-102', cloud, 'Design and implement AI solutions using Azure Cognitive Services', 'Microsoft');
add('Microsoft Certified: DevOps Engineer Expert', 'AZ-400', cloud, 'Design and implement DevOps practices for Azure', 'Microsoft');
add('Microsoft Certified: Azure Virtual Desktop Specialty', 'AZ-140', cloud, 'Plan, deliver, and manage Azure Virtual Desktop experiences', 'Microsoft');
add('Microsoft Certified: Azure IoT Developer Specialty', 'AZ-220', cloud, 'Develop cloud and edge components for Azure IoT solutions', 'Microsoft');
add('Microsoft Certified: Azure Cosmos DB Developer Specialty', 'DP-420', cloud, 'Design, implement, and monitor Azure Cosmos DB solutions', 'Microsoft');
add('Microsoft Certified: Azure for SAP Workloads Specialty', 'AZ-120', cloud, 'Planning and deploying SAP solutions on Azure', 'Microsoft');
add('Microsoft 365 Certified: Fundamentals', 'MS-900', cloud, 'Foundational knowledge of Microsoft 365 services and concepts', 'Microsoft');
add('Microsoft 365 Certified: Administrator Expert', 'MS-102', cloud, 'Deploy and manage Microsoft 365 tenant environments', 'Microsoft');
add('Microsoft 365 Certified: Modern Desktop Administrator Associate', 'MD-102', cloud, 'Deploy, configure, and manage Windows clients and devices', 'Microsoft');
add('Microsoft 365 Certified: Messaging Administrator Associate', 'MS-203', cloud, 'Plan, deploy, and manage messaging infrastructure', 'Microsoft');
add('Microsoft Certified: Windows Server Hybrid Administrator Associate', 'AZ-800', cloud, 'Manage Windows Server on-premises and hybrid environments', 'Microsoft');
// GCP
add('Google Cloud Certified: Cloud Digital Leader', '', cloud, 'Foundational knowledge of Google Cloud capabilities', 'Google');
add('Google Cloud Certified: Associate Cloud Engineer', 'ACE', cloud, 'Deploy applications, monitor operations, and manage enterprise solutions on GCP', 'Google');
add('Google Cloud Certified: Professional Cloud Architect', 'PCA', cloud, 'Design, develop, and manage robust cloud architecture on GCP', 'Google');
add('Google Cloud Certified: Professional Cloud Developer', '', cloud, 'Build scalable and highly available applications on Google Cloud', 'Google');
add('Google Cloud Certified: Professional Data Engineer', 'PDE', cloud, 'Design, build, and maintain data processing systems on GCP', 'Google');
add('Google Cloud Certified: Professional Cloud DevOps Engineer', '', cloud, 'Implement and manage CI/CD pipelines on Google Cloud', 'Google');
add('Google Cloud Certified: Professional Cloud Security Engineer', '', cloud, 'Design and implement secure infrastructure on Google Cloud', 'Google');
add('Google Cloud Certified: Professional Cloud Network Engineer', '', cloud, 'Design, implement, and manage network architectures on GCP', 'Google');
add('Google Cloud Certified: Professional Cloud Database Engineer', '', cloud, 'Design, build, and manage databases on Google Cloud', 'Google');
add('Google Cloud Certified: Professional Machine Learning Engineer', '', cloud, 'Design and build ML models using Google Cloud technologies', 'Google');
add('Google Cloud Certified: Professional Workspace Administrator', '', cloud, 'Configure and manage Google Workspace environments', 'Google');
// VMware
add('VMware Certified Professional - Data Center Virtualization', 'VCP-DCV', cloud, 'Implement and manage vSphere infrastructure', 'VMware');
add('VMware Certified Professional - Network Virtualization', 'VCP-NV', cloud, 'Implement and manage VMware NSX environments', 'VMware');
add('VMware Certified Professional - Cloud Management and Automation', 'VCP-CMA', cloud, 'Automate IT processes using VMware cloud management', 'VMware');
add('VMware Certified Professional - Desktop Management', 'VCP-DTM', cloud, 'Deploy and manage Workspace ONE environments', 'VMware');
add('VMware Certified Advanced Professional - Data Center Virtualization Design', 'VCAP-DCV', cloud, 'Advanced design of vSphere infrastructure', 'VMware');
add('VMware Certified Design Expert', 'VCDX', cloud, 'Expert-level design of VMware solutions', 'VMware');
// Other Cloud
add('Certified Cloud Security Professional', 'CCSP', cloud, 'Design, manage, and secure data, applications, and infrastructure in the cloud', 'ISC2');
add('CompTIA Cloud+', 'Cloud+', cloud, 'Maintain and optimize cloud infrastructure services', 'CompTIA');
add('HashiCorp Certified: Terraform Associate', '', cloud, 'Infrastructure as code using HashiCorp Terraform', 'HashiCorp');
add('HashiCorp Certified: Vault Associate', '', cloud, 'Secrets management using HashiCorp Vault', 'HashiCorp');
add('HashiCorp Certified: Consul Associate', '', cloud, 'Service networking using HashiCorp Consul', 'HashiCorp');
add('Certified Kubernetes Administrator', 'CKA', cloud, 'Administration and management of Kubernetes clusters', 'Cloud Native Computing Foundation');
add('Certified Kubernetes Application Developer', 'CKAD', cloud, 'Design, build, and deploy applications on Kubernetes', 'Cloud Native Computing Foundation');
add('Certified Kubernetes Security Specialist', 'CKS', cloud, 'Security best practices for Kubernetes cluster environments', 'Cloud Native Computing Foundation');
add('Docker Certified Associate', 'DCA', cloud, 'Container management and orchestration using Docker', 'Docker');
add('Red Hat Certified System Administrator', 'RHCSA', cloud, 'Core system administration skills for Red Hat Enterprise Linux', 'Red Hat');
add('Red Hat Certified Engineer', 'RHCE', cloud, 'Advanced system administration for Red Hat Enterprise Linux', 'Red Hat');
add('Red Hat Certified Architect', 'RHCA', cloud, 'Expert-level design and deployment of Red Hat solutions', 'Red Hat');
add('Red Hat Certified OpenShift Administrator', '', cloud, 'Administration of OpenShift container platform', 'Red Hat');
add('Red Hat Certified Specialist in Ansible Automation', '', cloud, 'Automation using Red Hat Ansible', 'Red Hat');
add('Nutanix Certified Professional', 'NCP', cloud, 'Enterprise cloud platform administration', 'Nutanix');
add('Snowflake SnowPro Core Certification', '', cloud, 'Foundational knowledge of Snowflake data cloud platform', 'Snowflake');
add('Snowflake SnowPro Advanced: Data Engineer', '', cloud, 'Advanced data engineering on Snowflake', 'Snowflake');
add('Snowflake SnowPro Advanced: Architect', '', cloud, 'Advanced architecture design on Snowflake', 'Snowflake');
add('Oracle Cloud Infrastructure Foundations Associate', 'OCI', cloud, 'Foundational knowledge of Oracle Cloud Infrastructure', 'Oracle');
add('Oracle Cloud Infrastructure Architect Associate', '', cloud, 'Design and deploy OCI solutions', 'Oracle');
add('Oracle Cloud Infrastructure Architect Professional', '', cloud, 'Advanced OCI architecture design', 'Oracle');
add('IBM Certified Solution Architect - Cloud Pak for Data', '', cloud, 'Design solutions using IBM Cloud Pak for Data', 'IBM');
add('IBM Certified Cloud Professional Developer', '', cloud, 'Cloud application development on IBM Cloud', 'IBM');
add('Alibaba Cloud Certified Associate', 'ACA', cloud, 'Foundational knowledge of Alibaba Cloud services', 'Alibaba Cloud');
add('Alibaba Cloud Certified Professional', 'ACP', cloud, 'Professional-level Alibaba Cloud architecture', 'Alibaba Cloud');
add('DigitalOcean Certified Cloud Practitioner', '', cloud, 'Foundational cloud skills on DigitalOcean', 'DigitalOcean');
add('OpenStack Administrator', 'COA', cloud, 'Administration of OpenStack cloud environments', 'OpenStack Foundation');
add('Puppet Certified Professional', '', cloud, 'Configuration management using Puppet', 'Puppet');
add('Chef Certified Developer', '', cloud, 'Infrastructure automation using Chef', 'Progress Chef');
add('Citrix Certified Associate - Virtualization', 'CCA-V', cloud, 'Desktop and app virtualization using Citrix', 'Citrix');
add('Citrix Certified Professional - Networking', 'CCP-N', cloud, 'Citrix ADC networking and load balancing', 'Citrix');
add('Dell Technologies Certified Associate', '', cloud, 'Foundational knowledge of Dell infrastructure', 'Dell Technologies');
add('HPE Master ASE - Data Center and Cloud', '', cloud, 'Advanced HPE data center solutions', 'Hewlett Packard Enterprise');
add('Rackspace Certified Architect', '', cloud, 'Multi-cloud architecture using Rackspace', 'Rackspace');

// ═══════════════════════════════════════════════════
// CYBERSECURITY
// ═══════════════════════════════════════════════════
const cyber = 'Cybersecurity';
add('Certified Information Systems Security Professional', 'CISSP', cyber, 'Design, implement, and manage cybersecurity programs', 'ISC2');
add('Certified Information Security Manager', 'CISM', cyber, 'Information security governance and program development', 'ISACA');
add('Certified Information Systems Auditor', 'CISA', cyber, 'Audit, control, and assure information systems', 'ISACA');
add('Certified in Risk and Information Systems Control', 'CRISC', cyber, 'Enterprise IT risk management and control', 'ISACA');
add('Certified Data Privacy Solutions Engineer', 'CDPSE', cyber, 'Design and implement privacy solutions', 'ISACA');
add('CompTIA Security+', 'Security+', cyber, 'Core security functions and cybersecurity best practices', 'CompTIA');
add('CompTIA CySA+', 'CySA+', cyber, 'Cybersecurity analytics and threat detection', 'CompTIA');
add('CompTIA PenTest+', 'PenTest+', cyber, 'Penetration testing and vulnerability management', 'CompTIA');
add('CompTIA CASP+', 'CASP+', cyber, 'Advanced security practitioner skills for enterprise environments', 'CompTIA');
add('Certified Ethical Hacker', 'CEH', cyber, 'Ethical hacking techniques and penetration testing methodology', 'EC-Council');
add('EC-Council Certified Security Analyst', 'ECSA', cyber, 'Advanced penetration testing and security analysis', 'EC-Council');
add('Licensed Penetration Tester', 'LPT', cyber, 'Master-level penetration testing certification', 'EC-Council');
add('Certified SOC Analyst', 'CSA', cyber, 'Security operations center monitoring and analysis', 'EC-Council');
add('Certified Threat Intelligence Analyst', 'CTIA', cyber, 'Cyber threat intelligence collection and analysis', 'EC-Council');
add('Computer Hacking Forensic Investigator', 'CHFI', cyber, 'Digital forensics and evidence collection', 'EC-Council');
add('Certified Network Defender', 'CND', cyber, 'Network security defense and countermeasures', 'EC-Council');
add('Certified Incident Handler', 'ECIH', cyber, 'Incident handling and response procedures', 'EC-Council');
add('GIAC Security Essentials', 'GSEC', cyber, 'Foundational information security knowledge and skills', 'SANS/GIAC');
add('GIAC Certified Enterprise Defender', 'GCED', cyber, 'Enterprise network defense and incident handling', 'SANS/GIAC');
add('GIAC Certified Incident Handler', 'GCIH', cyber, 'Incident handling, detection, and response', 'SANS/GIAC');
add('GIAC Certified Intrusion Analyst', 'GCIA', cyber, 'Network traffic analysis and intrusion detection', 'SANS/GIAC');
add('GIAC Certified Forensic Analyst', 'GCFA', cyber, 'Digital forensics and advanced incident response', 'SANS/GIAC');
add('GIAC Certified Penetration Tester', 'GPEN', cyber, 'Penetration testing methodologies and techniques', 'SANS/GIAC');
add('GIAC Web Application Penetration Tester', 'GWAPT', cyber, 'Web application security testing', 'SANS/GIAC');
add('GIAC Exploit Researcher and Advanced Penetration Tester', 'GXPN', cyber, 'Advanced penetration testing and exploit development', 'SANS/GIAC');
add('GIAC Reverse Engineering Malware', 'GREM', cyber, 'Malware analysis and reverse engineering', 'SANS/GIAC');
add('GIAC Cloud Security Essentials', 'GCLD', cyber, 'Cloud security fundamentals and best practices', 'SANS/GIAC');
add('GIAC Cloud Security Automation', 'GCSA', cyber, 'Automating cloud security controls', 'SANS/GIAC');
add('GIAC Defensible Security Architecture', 'GDSA', cyber, 'Design and implement defensible network architecture', 'SANS/GIAC');
add('Offensive Security Certified Professional', 'OSCP', cyber, 'Hands-on penetration testing and ethical hacking', 'Offensive Security');
add('Offensive Security Certified Expert', 'OSCE', cyber, 'Advanced penetration testing and exploit development', 'Offensive Security');
add('Offensive Security Web Expert', 'OSWE', cyber, 'Advanced web application security testing', 'Offensive Security');
add('Offensive Security Exploitation Expert', 'OSEE', cyber, 'Expert-level exploitation and reverse engineering', 'Offensive Security');
add('Offensive Security Wireless Professional', 'OSWP', cyber, 'Wireless network security assessment', 'Offensive Security');
add('Systems Security Certified Practitioner', 'SSCP', cyber, 'Implement, monitor, and administer IT infrastructure security', 'ISC2');
add('Certified Authorization Professional', 'CAP', cyber, 'Risk management framework authorization processes', 'ISC2');
add('HealthCare Information Security and Privacy Practitioner', 'HCISPP', cyber, 'Healthcare information security and privacy', 'ISC2');
add('Cisco Certified CyberOps Associate', '', cyber, 'Security operations center fundamentals', 'Cisco');
add('Cisco Certified CyberOps Professional', '', cyber, 'Advanced security operations and incident response', 'Cisco');
add('Palo Alto Networks Certified Network Security Administrator', 'PCNSA', cyber, 'Palo Alto Networks next-gen firewall administration', 'Palo Alto Networks');
add('Palo Alto Networks Certified Network Security Engineer', 'PCNSE', cyber, 'Advanced Palo Alto Networks firewall deployment', 'Palo Alto Networks');
add('Palo Alto Networks Certified Detection and Remediation Analyst', 'PCDRA', cyber, 'Cortex XDR threat detection and remediation', 'Palo Alto Networks');
add('Fortinet NSE 4 - FortiOS Network Security Professional', 'NSE4', cyber, 'FortiGate firewall configuration and management', 'Fortinet');
add('Fortinet NSE 7 - Enterprise Firewall', 'NSE7', cyber, 'Advanced FortiGate enterprise deployment', 'Fortinet');
add('Fortinet NSE 8 - Network Security Expert', 'NSE8', cyber, 'Expert-level Fortinet security solutions', 'Fortinet');
add('CrowdStrike Certified Falcon Administrator', 'CCFA', cyber, 'CrowdStrike Falcon platform administration', 'CrowdStrike');
add('CrowdStrike Certified Falcon Responder', 'CCFR', cyber, 'Incident response using CrowdStrike Falcon', 'CrowdStrike');
add('Splunk Core Certified User', '', cyber, 'Foundational Splunk searching and reporting', 'Splunk');
add('Splunk Core Certified Power User', '', cyber, 'Advanced Splunk data analysis and visualization', 'Splunk');
add('Splunk Enterprise Certified Admin', '', cyber, 'Splunk Enterprise administration and configuration', 'Splunk');
add('Splunk Enterprise Security Certified Admin', '', cyber, 'Splunk Enterprise Security deployment and management', 'Splunk');
add('Certified in Governance of Enterprise IT', 'CGEIT', cyber, 'IT governance framework implementation', 'ISACA');
add('Certified Secure Software Lifecycle Professional', 'CSSLP', cyber, 'Security throughout the software development lifecycle', 'ISC2');
add('Certificate of Cloud Security Knowledge', 'CCSK', cyber, 'Cloud security best practices and standards', 'Cloud Security Alliance');
add('Certified Cloud Security Engineer', 'CCSE', cyber, 'Cloud infrastructure security engineering', 'EC-Council');
add('AICPA SOC for Cybersecurity', '', cyber, 'Cybersecurity risk management reporting', 'AICPA');
add('Certified Fraud Examiner', 'CFE', cyber, 'Fraud prevention, detection, and investigation', 'Association of Certified Fraud Examiners');

// ═══════════════════════════════════════════════════
// DATA & ANALYTICS
// ═══════════════════════════════════════════════════
const data = 'Data & Analytics';
add('Tableau Desktop Specialist', '', data, 'Foundational skills in Tableau Desktop', 'Tableau/Salesforce');
add('Tableau Certified Data Analyst', '', data, 'Data analysis and visualization using Tableau', 'Tableau/Salesforce');
add('Tableau Server Certified Associate', '', data, 'Tableau Server administration and management', 'Tableau/Salesforce');
add('Microsoft Certified: Power BI Data Analyst Associate', 'PL-300', data, 'Data analysis and visualization using Power BI', 'Microsoft');
add('Microsoft Certified: Fabric Analytics Engineer Associate', 'DP-600', data, 'Design analytics solutions using Microsoft Fabric', 'Microsoft');
add('Google Data Analytics Professional Certificate', '', data, 'Data analytics fundamentals using Google tools', 'Google');
add('Google Advanced Data Analytics Professional Certificate', '', data, 'Advanced data analytics with Python and statistical methods', 'Google');
add('Google Business Intelligence Professional Certificate', '', data, 'Business intelligence and dashboard design', 'Google');
add('IBM Data Science Professional Certificate', '', data, 'Data science methodology and tools', 'IBM');
add('IBM Data Engineering Professional Certificate', '', data, 'Data engineering pipelines and architectures', 'IBM');
add('IBM Data Analyst Professional Certificate', '', data, 'Data analysis and visualization fundamentals', 'IBM');
add('SAS Certified Specialist: Base Programming', '', data, 'SAS programming for data manipulation and analysis', 'SAS Institute');
add('SAS Certified Professional: Advanced Programming', '', data, 'Advanced SAS programming and data management', 'SAS Institute');
add('SAS Certified Data Scientist', '', data, 'Data science using SAS tools and methods', 'SAS Institute');
add('SAS Certified Statistical Business Analyst', '', data, 'Statistical analysis for business decision-making', 'SAS Institute');
add('SAS Certified Visual Analytics Professional', '', data, 'Visual analytics using SAS Viya', 'SAS Institute');
add('Cloudera Certified Associate Data Analyst', 'CCA', data, 'Data analysis using Cloudera platform', 'Cloudera');
add('Cloudera Certified Professional Data Engineer', 'CCP-DE', data, 'Data engineering on Cloudera ecosystem', 'Cloudera');
add('Databricks Certified Data Engineer Associate', '', data, 'Data engineering fundamentals on Databricks Lakehouse', 'Databricks');
add('Databricks Certified Data Engineer Professional', '', data, 'Advanced data engineering on Databricks', 'Databricks');
add('Databricks Certified Data Analyst Associate', '', data, 'Data analysis on Databricks SQL and dashboards', 'Databricks');
add('Databricks Certified Machine Learning Associate', '', data, 'ML model development on Databricks', 'Databricks');
add('Databricks Certified Machine Learning Professional', '', data, 'Advanced ML operations on Databricks', 'Databricks');
add('dbt Analytics Engineering Certification', '', data, 'Data transformation using dbt', 'dbt Labs');
add('Qlik Sense Business Analyst Certification', '', data, 'Business analytics using Qlik Sense', 'Qlik');
add('Qlik Sense Data Architect Certification', '', data, 'Data architecture and modeling in Qlik Sense', 'Qlik');
add('Alteryx Designer Core Certification', '', data, 'Data blending and analytics using Alteryx', 'Alteryx');
add('Alteryx Designer Advanced Certification', '', data, 'Advanced analytics workflows in Alteryx', 'Alteryx');
add('Alteryx Machine Learning Certification', '', data, 'Machine learning with Alteryx', 'Alteryx');
add('MicroStrategy Certified Analyst', '', data, 'Business intelligence analysis with MicroStrategy', 'MicroStrategy');
add('Looker LookML Developer Certification', '', data, 'Data modeling using Looker LookML', 'Google');
add('Looker Business Analyst Certification', '', data, 'Business analytics using Looker platform', 'Google');
add('TDWI Certified Business Intelligence Professional', 'CBIP', data, 'Business intelligence strategy and management', 'TDWI');
add('Certified Analytics Professional', 'CAP', data, 'End-to-end analytics process management', 'INFORMS');
add('DAMA Certified Data Management Professional', 'CDMP', data, 'Data management body of knowledge', 'DAMA International');
add('Informatica Certified Professional', '', data, 'Data integration using Informatica tools', 'Informatica');
add('Talend Data Integration Certification', '', data, 'Data integration and ETL using Talend', 'Talend');
add('Apache Spark Developer Certification', '', data, 'Distributed data processing with Apache Spark', 'Databricks');
add('MongoDB Certified Developer Associate', '', data, 'Application development with MongoDB', 'MongoDB');
add('MongoDB Certified DBA Associate', '', data, 'Database administration with MongoDB', 'MongoDB');
add('Neo4j Certified Professional', '', data, 'Graph database development with Neo4j', 'Neo4j');
add('Elasticsearch Certified Engineer', '', data, 'Search and analytics with Elasticsearch', 'Elastic');
add('Cassandra Administrator Certification', '', data, 'Apache Cassandra database administration', 'DataStax');
add('Teradata Certified Professional', '', data, 'Data warehousing with Teradata', 'Teradata');
add('SAP Certified Application Associate - SAP Analytics Cloud', '', data, 'Analytics and planning with SAP Analytics Cloud', 'SAP');
add('SAP Certified Application Associate - SAP BW/4HANA', '', data, 'Data warehousing with SAP BW/4HANA', 'SAP');
add('Oracle Certified Professional - MySQL Database Administrator', '', data, 'MySQL database administration', 'Oracle');
add('Microsoft Certified: Azure Data Scientist Associate', 'DP-100', data, 'Data science and ML on Azure', 'Microsoft');
add('Google Cloud Professional Data Analyst', '', data, 'Data analysis on Google Cloud Platform', 'Google');
add('Palantir Foundry Certification', '', data, 'Data integration and analytics with Palantir Foundry', 'Palantir');
add('ThoughtSpot Certified Analyst', '', data, 'Search-driven analytics with ThoughtSpot', 'ThoughtSpot');
add('Sisense Certified Data Engineer', '', data, 'Data engineering with Sisense platform', 'Sisense');
add('Fivetran Certified Data Engineer', '', data, 'Automated data integration with Fivetran', 'Fivetran');
add('Census Certified Reverse ETL Professional', '', data, 'Reverse ETL and data activation', 'Census');
add('Atlan Certified Data Governance Professional', '', data, 'Data cataloging and governance with Atlan', 'Atlan');
add('Great Expectations Data Quality Certification', '', data, 'Data quality and validation pipelines', 'Great Expectations');
add('Mode Analytics Certified Analyst', '', data, 'Data analysis and reporting with Mode', 'Mode');
add('Sigma Computing Certified Analyst', '', data, 'Cloud-native analytics with Sigma Computing', 'Sigma Computing');
add('Hex Certified Analytics Engineer', '', data, 'Collaborative analytics with Hex', 'Hex');
add('Apache Kafka Certified Developer', '', data, 'Event streaming with Apache Kafka', 'Confluent');
add('Confluent Certified Administrator for Apache Kafka', '', data, 'Kafka cluster administration and management', 'Confluent');
add('Confluent Certified Developer for Apache Kafka', '', data, 'Application development with Confluent Kafka', 'Confluent');
add('Starburst Certified Trino Administrator', '', data, 'Distributed SQL query engine administration', 'Starburst');

// ═══════════════════════════════════════════════════
// DEVELOPMENT & PROGRAMMING
// ═══════════════════════════════════════════════════
const dev = 'Development & Programming';
add('Oracle Certified Professional: Java SE Developer', 'OCP', dev, 'Professional Java SE application development', 'Oracle');
add('Oracle Certified Associate: Java SE Programmer', 'OCA', dev, 'Foundational Java programming skills', 'Oracle');
add('Oracle Certified Professional: Java EE Application Developer', '', dev, 'Enterprise Java application development', 'Oracle');
add('Microsoft Certified: Azure Developer Associate', 'AZ-204', dev, 'Cloud application development on Azure', 'Microsoft');
add('Microsoft Certified: Power Platform Developer Associate', 'PL-400', dev, 'Development of Power Platform solutions', 'Microsoft');
add('Microsoft Certified: Power Platform Fundamentals', 'PL-900', dev, 'Foundational knowledge of Microsoft Power Platform', 'Microsoft');
add('Microsoft Certified: Power Platform App Maker Associate', 'PL-100', dev, 'Building apps with Power Apps', 'Microsoft');
add('Microsoft Certified: Power Platform Solution Architect Expert', 'PL-600', dev, 'Architecture design for Power Platform solutions', 'Microsoft');
add('Microsoft Certified: Dynamics 365 Developer Associate', 'MB-500', dev, 'Dynamics 365 extension and customization development', 'Microsoft');
add('Salesforce Certified Platform Developer I', '', dev, 'Custom application development on Salesforce platform', 'Salesforce');
add('Salesforce Certified Platform Developer II', '', dev, 'Advanced Salesforce platform development', 'Salesforce');
add('Salesforce Certified B2C Commerce Developer', '', dev, 'B2C Commerce Cloud development', 'Salesforce');
add('Salesforce Certified JavaScript Developer I', '', dev, 'JavaScript and Lightning Web Components development', 'Salesforce');
add('Salesforce Certified OmniStudio Developer', '', dev, 'OmniStudio development on Salesforce', 'Salesforce');
add('Certified ScrumDeveloper', 'CSD', dev, 'Agile software development practices', 'Scrum Alliance');
add('GitHub Certified Developer', '', dev, 'Software development workflows with GitHub', 'GitHub');
add('GitHub Actions Certified', '', dev, 'CI/CD automation with GitHub Actions', 'GitHub');
add('GitHub Advanced Security Certification', '', dev, 'Code security using GitHub Advanced Security', 'GitHub');
add('GitHub Administration Certification', '', dev, 'GitHub Enterprise administration', 'GitHub');
add('GitLab Certified CI/CD Specialist', '', dev, 'CI/CD pipelines using GitLab', 'GitLab');
add('GitLab Certified Git Associate', '', dev, 'Git version control fundamentals', 'GitLab');
add('Unity Certified Developer', '', dev, 'Game development using Unity engine', 'Unity Technologies');
add('Unity Certified Professional: Programmer', '', dev, 'Advanced Unity programming and architecture', 'Unity Technologies');
add('Unreal Engine Certified Developer', '', dev, 'Game and interactive development with Unreal Engine', 'Epic Games');
add('Certified Python Developer', 'PCEP', dev, 'Python programming fundamentals', 'Python Institute');
add('Certified Associate in Python Programming', 'PCAP', dev, 'Intermediate Python programming skills', 'Python Institute');
add('Certified Professional in Python Programming', 'PCPP', dev, 'Professional Python development and design patterns', 'Python Institute');
add('C++ Certified Associate Programmer', 'CPA', dev, 'C++ programming fundamentals', 'C++ Institute');
add('C++ Certified Professional Programmer', 'CPP', dev, 'Advanced C++ development skills', 'C++ Institute');
add('Zend Certified PHP Engineer', 'ZCE', dev, 'PHP development and best practices', 'Zend/Perforce');
add('Ruby Association Certified Ruby Programmer', '', dev, 'Ruby programming language certification', 'Ruby Association');
add('Certified Rust Developer', '', dev, 'Systems programming with Rust', 'Various');
add('Go Developer Certification', '', dev, 'Application development with Go/Golang', 'Various');
add('Swift Certified Developer', '', dev, 'iOS/macOS development with Swift', 'Apple');
add('Kotlin Certified Developer', '', dev, 'Kotlin programming for Android and server-side', 'JetBrains');
add('Flutter Certified Application Developer', '', dev, 'Cross-platform mobile development with Flutter', 'Google');
add('React Developer Certification', '', dev, 'Frontend development with React', 'Various');
add('Angular Certified Developer', '', dev, 'Enterprise web development with Angular', 'Various');
add('Vue.js Certified Developer', '', dev, 'Progressive web development with Vue.js', 'Various');
add('Node.js Certified Developer', 'JSNAD', dev, 'Server-side JavaScript development with Node.js', 'OpenJS Foundation');
add('Node.js Certified Application Developer', 'JSNSD', dev, 'Node.js application services development', 'OpenJS Foundation');
add('WordPress Certified Developer', '', dev, 'WordPress theme and plugin development', 'Various');
add('Shopify Partner Certification', '', dev, 'E-commerce development on Shopify platform', 'Shopify');
add('Magento Certified Developer', '', dev, 'E-commerce development on Adobe Commerce/Magento', 'Adobe');
add('Drupal Certified Developer', '', dev, 'Content management development with Drupal', 'Acquia');
add('Acquia Certified Site Builder', '', dev, 'Drupal site building and configuration', 'Acquia');
add('Acquia Certified Developer', '', dev, 'Drupal module development', 'Acquia');
add('Kentico Certified Developer', '', dev, 'CMS development with Kentico', 'Kentico');
add('Sitecore Certified Developer', '', dev, 'Enterprise CMS development with Sitecore', 'Sitecore');
add('OutSystems Associate Developer', '', dev, 'Low-code application development with OutSystems', 'OutSystems');
add('Mendix Certified Developer', '', dev, 'Low-code application development with Mendix', 'Mendix/Siemens');
add('Appian Certified Developer', '', dev, 'Low-code development on Appian platform', 'Appian');
add('ServiceNow Certified Application Developer', 'CAD', dev, 'Application development on ServiceNow platform', 'ServiceNow');
add('MuleSoft Certified Developer - Level 1', 'MCD', dev, 'API development using MuleSoft Anypoint Platform', 'MuleSoft/Salesforce');
add('MuleSoft Certified Developer - Level 2', '', dev, 'Advanced MuleSoft integration development', 'MuleSoft/Salesforce');
add('MuleSoft Certified Platform Architect - Level 1', 'MCPA', dev, 'MuleSoft platform architecture design', 'MuleSoft/Salesforce');
add('Boomi Professional Developer', '', dev, 'Integration development with Dell Boomi', 'Dell Boomi');
add('Postman API Fundamentals Student Expert', '', dev, 'API design and testing with Postman', 'Postman');
add('Kong Gateway Certified Associate', '', dev, 'API gateway management with Kong', 'Kong');
add('Twilio Certified Developer', '', dev, 'Communication API development with Twilio', 'Twilio');
add('Stripe Certified Developer', '', dev, 'Payment integration development with Stripe', 'Stripe');

// ═══════════════════════════════════════════════════
// AI & MACHINE LEARNING
// ═══════════════════════════════════════════════════
const ai = 'AI & Machine Learning';
add('TensorFlow Developer Certificate', '', ai, 'Machine learning model development using TensorFlow', 'Google');
add('Google Cloud Professional Machine Learning Engineer', '', ai, 'Design and build ML systems on Google Cloud', 'Google');
add('AWS Certified Machine Learning - Specialty', '', ai, 'Design and deploy ML solutions on AWS', 'Amazon Web Services');
add('Microsoft Certified: Azure AI Fundamentals', 'AI-900', ai, 'Foundational knowledge of AI and ML concepts on Azure', 'Microsoft');
add('Microsoft Certified: Azure AI Engineer Associate', 'AI-102', ai, 'Design and implement AI solutions on Azure', 'Microsoft');
add('Microsoft Certified: Azure Data Scientist Associate', 'DP-100', ai, 'Design and implement data science solutions on Azure', 'Microsoft');
add('IBM AI Engineering Professional Certificate', '', ai, 'AI engineering fundamentals and deep learning', 'IBM');
add('IBM Applied AI Professional Certificate', '', ai, 'Applied AI using IBM Watson and cloud services', 'IBM');
add('IBM Machine Learning Professional Certificate', '', ai, 'Machine learning fundamentals and implementation', 'IBM');
add('NVIDIA Deep Learning Institute - Fundamentals of Deep Learning', '', ai, 'Deep learning using NVIDIA GPU-accelerated tools', 'NVIDIA');
add('NVIDIA Deep Learning Institute - Building Transformer-Based NLP Applications', '', ai, 'NLP application development using transformers', 'NVIDIA');
add('NVIDIA Deep Learning Institute - Fundamentals of Accelerated Computing', '', ai, 'GPU-accelerated computing with CUDA', 'NVIDIA');
add('NVIDIA Deep Learning Institute - Building RAG Agents with LLMs', '', ai, 'Retrieval-augmented generation agent development', 'NVIDIA');
add('Certified Artificial Intelligence Practitioner', 'CAIP', ai, 'AI and ML fundamentals for practitioners', 'CertNexus');
add('Certified Artificial Intelligence Scientist', 'CAIS', ai, 'Advanced AI research and implementation', 'CertNexus');
add('Certified Ethical Emerging Technologist', 'CEET', ai, 'Ethics in AI and emerging technology deployment', 'CertNexus');
add('Stanford Machine Learning Specialization Certificate', '', ai, 'Machine learning theory and practical application', 'Stanford/Coursera');
add('Deep Learning Specialization Certificate', '', ai, 'Neural networks and deep learning mastery', 'DeepLearning.AI/Coursera');
add('Natural Language Processing Specialization Certificate', '', ai, 'NLP techniques and applications', 'DeepLearning.AI/Coursera');
add('Generative AI with Large Language Models Certificate', '', ai, 'LLM fundamentals, fine-tuning, and deployment', 'DeepLearning.AI/Coursera');
add('Machine Learning Engineering for Production (MLOps) Certificate', '', ai, 'Production ML system design and deployment', 'DeepLearning.AI/Coursera');
add('Hugging Face NLP Course Certificate', '', ai, 'Transformer-based NLP using Hugging Face', 'Hugging Face');
add('OpenAI API Developer Certification', '', ai, 'Application development using OpenAI APIs', 'OpenAI');
add('LangChain Certified Developer', '', ai, 'LLM application development with LangChain', 'LangChain');
add('MLflow Certified Associate', '', ai, 'ML experiment tracking and model management', 'Databricks');
add('DataRobot Certified AI Practitioner', '', ai, 'Automated machine learning with DataRobot', 'DataRobot');
add('H2O.ai Certified Machine Learning Engineer', '', ai, 'ML model building with H2O platform', 'H2O.ai');
add('SAS Certified AI and Machine Learning Professional', '', ai, 'AI and ML using SAS tools', 'SAS Institute');
add('Intel AI Analytics Toolkit Certification', '', ai, 'AI development using Intel oneAPI toolkit', 'Intel');
add('Weights & Biases MLOps Certification', '', ai, 'ML experiment tracking and model monitoring', 'Weights & Biases');
add('Amazon Machine Learning University Certificate', '', ai, 'ML fundamentals and AWS ML services', 'Amazon');
add('Fast.ai Practical Deep Learning Certificate', '', ai, 'Practical deep learning for coders', 'fast.ai');
add('Certified Machine Learning Professional', 'CMLP', ai, 'End-to-end ML project management and deployment', 'Various');
add('Edge AI Developer Certification', '', ai, 'AI model deployment on edge devices', 'Various');
add('Computer Vision Nanodegree', '', ai, 'Computer vision and image processing with deep learning', 'Udacity');
add('Robotics Software Engineer Nanodegree', '', ai, 'Robotics perception and control systems', 'Udacity');

// ═══════════════════════════════════════════════════
// PROJECT MANAGEMENT
// ═══════════════════════════════════════════════════
const pm = 'Project Management';
add('Project Management Professional', 'PMP', pm, 'Leading and directing projects and teams', 'Project Management Institute');
add('Certified Associate in Project Management', 'CAPM', pm, 'Foundational project management knowledge and skills', 'Project Management Institute');
add('PMI Agile Certified Practitioner', 'PMI-ACP', pm, 'Agile principles and practices for project management', 'Project Management Institute');
add('PMI Risk Management Professional', 'PMI-RMP', pm, 'Project risk identification, assessment, and mitigation', 'Project Management Institute');
add('PMI Scheduling Professional', 'PMI-SP', pm, 'Project scheduling and timeline management', 'Project Management Institute');
add('PMI Professional in Business Analysis', 'PMI-PBA', pm, 'Business analysis within project management', 'Project Management Institute');
add('Program Management Professional', 'PgMP', pm, 'Managing multiple related projects and programs', 'Project Management Institute');
add('Portfolio Management Professional', 'PfMP', pm, 'Strategic portfolio management', 'Project Management Institute');
add('PMI Construction Professional', 'PMI-CP', pm, 'Project management for the construction industry', 'Project Management Institute');
add('PRINCE2 Foundation', '', pm, 'Foundational knowledge of PRINCE2 project management', 'Axelos');
add('PRINCE2 Practitioner', '', pm, 'Applying PRINCE2 methodology to project management', 'Axelos');
add('PRINCE2 Agile Foundation', '', pm, 'PRINCE2 combined with agile methodologies', 'Axelos');
add('PRINCE2 Agile Practitioner', '', pm, 'Applied PRINCE2 Agile project management', 'Axelos');
add('Certified ScrumMaster', 'CSM', pm, 'Scrum framework facilitation and team leadership', 'Scrum Alliance');
add('Certified Scrum Product Owner', 'CSPO', pm, 'Product backlog management and stakeholder collaboration', 'Scrum Alliance');
add('Advanced Certified ScrumMaster', 'A-CSM', pm, 'Advanced Scrum facilitation and coaching', 'Scrum Alliance');
add('Advanced Certified Scrum Product Owner', 'A-CSPO', pm, 'Advanced product ownership and strategy', 'Scrum Alliance');
add('Certified Scrum Professional - ScrumMaster', 'CSP-SM', pm, 'Expert-level Scrum facilitation', 'Scrum Alliance');
add('Certified Scrum Professional - Product Owner', 'CSP-PO', pm, 'Expert-level product ownership', 'Scrum Alliance');
add('Certified Scrum Trainer', 'CST', pm, 'Teaching and certifying Scrum practitioners', 'Scrum Alliance');
add('Professional Scrum Master I', 'PSM I', pm, 'Scrum framework fundamentals and application', 'Scrum.org');
add('Professional Scrum Master II', 'PSM II', pm, 'Advanced Scrum mastery and organizational change', 'Scrum.org');
add('Professional Scrum Master III', 'PSM III', pm, 'Expert Scrum mastery and thought leadership', 'Scrum.org');
add('Professional Scrum Product Owner I', 'PSPO I', pm, 'Product value maximization using Scrum', 'Scrum.org');
add('Professional Scrum Product Owner II', 'PSPO II', pm, 'Advanced product management with Scrum', 'Scrum.org');
add('Professional Agile Leadership', 'PAL', pm, 'Agile leadership and organizational transformation', 'Scrum.org');
add('Scaled Agile Framework Agilist', 'SA', pm, 'SAFe Lean-Agile principles and enterprise transformation', 'Scaled Agile');
add('SAFe Practitioner', 'SP', pm, 'Agile team practices within SAFe framework', 'Scaled Agile');
add('SAFe Scrum Master', 'SSM', pm, 'Scrum mastery within SAFe context', 'Scaled Agile');
add('SAFe Advanced Scrum Master', 'SASM', pm, 'Advanced facilitation in SAFe environments', 'Scaled Agile');
add('SAFe Product Owner/Product Manager', 'POPM', pm, 'Product management in SAFe context', 'Scaled Agile');
add('SAFe Release Train Engineer', 'RTE', pm, 'Agile Release Train facilitation and coordination', 'Scaled Agile');
add('SAFe for Government', 'SGP', pm, 'SAFe practices adapted for government organizations', 'Scaled Agile');
add('SAFe Lean Portfolio Manager', 'LPM', pm, 'Lean portfolio management and strategy execution', 'Scaled Agile');
add('SAFe DevOps Practitioner', 'SDP', pm, 'DevOps practices within SAFe framework', 'Scaled Agile');
add('SAFe Architect', 'ARCH', pm, 'Architecture practices in SAFe environments', 'Scaled Agile');
add('Disciplined Agile Scrum Master', 'DASM', pm, 'Agile team leadership with Disciplined Agile', 'PMI');
add('Disciplined Agile Senior Scrum Master', 'DASSM', pm, 'Advanced agile coaching with Disciplined Agile', 'PMI');
add('Disciplined Agile Value Stream Consultant', 'DAVSC', pm, 'Value stream optimization with Disciplined Agile', 'PMI');
add('ICAgile Certified Professional', 'ICP', pm, 'Foundational agile knowledge and mindset', 'ICAgile');
add('ICAgile Certified Professional in Agile Coaching', 'ICP-ACC', pm, 'Agile team and individual coaching', 'ICAgile');
add('Kanban Management Professional', 'KMP', pm, 'Kanban method for workflow management', 'Lean Kanban University');
add('ITIL 4 Managing Professional', 'ITIL MP', pm, 'IT service management across the value chain', 'Axelos');
add('ITIL 4 Strategic Leader', 'ITIL SL', pm, 'IT strategy and digital transformation', 'Axelos');
add('Certified Agile Leadership', 'CAL', pm, 'Organizational agile leadership', 'Scrum Alliance');
add('Management of Portfolios', 'MoP', pm, 'Portfolio management practices and governance', 'Axelos');
add('Managing Successful Programmes', 'MSP', pm, 'Program management methodology', 'Axelos');

// ═══════════════════════════════════════════════════
// NETWORKING
// ═══════════════════════════════════════════════════
const net = 'Networking';
add('Cisco Certified Network Associate', 'CCNA', net, 'Network fundamentals, access, connectivity, and services', 'Cisco');
add('Cisco Certified Network Professional - Enterprise', 'CCNP Enterprise', net, 'Advanced enterprise networking technologies', 'Cisco');
add('Cisco Certified Network Professional - Data Center', 'CCNP DC', net, 'Data center infrastructure design and deployment', 'Cisco');
add('Cisco Certified Network Professional - Security', 'CCNP Security', net, 'Network security infrastructure and technologies', 'Cisco');
add('Cisco Certified Network Professional - Service Provider', 'CCNP SP', net, 'Service provider networking technologies', 'Cisco');
add('Cisco Certified Network Professional - Collaboration', 'CCNP Collab', net, 'Unified communications and collaboration technologies', 'Cisco');
add('Cisco Certified Internetwork Expert - Enterprise Infrastructure', 'CCIE EI', net, 'Expert-level enterprise network infrastructure', 'Cisco');
add('Cisco Certified Internetwork Expert - Security', 'CCIE Security', net, 'Expert-level network security', 'Cisco');
add('Cisco Certified Internetwork Expert - Data Center', 'CCIE DC', net, 'Expert-level data center networking', 'Cisco');
add('Cisco Certified Internetwork Expert - Service Provider', 'CCIE SP', net, 'Expert-level service provider networking', 'Cisco');
add('Cisco Certified DevNet Associate', '', net, 'Network automation and programmability fundamentals', 'Cisco');
add('Cisco Certified DevNet Professional', '', net, 'Advanced network automation and API development', 'Cisco');
add('Cisco Certified Design Expert', 'CCDE', net, 'Expert-level network infrastructure design', 'Cisco');
add('CompTIA Network+', 'Network+', net, 'Networking concepts, infrastructure, and troubleshooting', 'CompTIA');
add('Juniper Networks Certified Associate - Junos', 'JNCIA-Junos', net, 'Juniper Junos OS networking fundamentals', 'Juniper Networks');
add('Juniper Networks Certified Specialist - Enterprise Routing and Switching', 'JNCIS-ENT', net, 'Intermediate Juniper enterprise networking', 'Juniper Networks');
add('Juniper Networks Certified Professional - Enterprise Routing and Switching', 'JNCIP-ENT', net, 'Advanced Juniper enterprise networking', 'Juniper Networks');
add('Juniper Networks Certified Expert - Enterprise Routing and Switching', 'JNCIE-ENT', net, 'Expert-level Juniper enterprise networking', 'Juniper Networks');
add('Juniper Networks Certified Associate - Security', 'JNCIA-SEC', net, 'Juniper security fundamentals', 'Juniper Networks');
add('Juniper Networks Certified Specialist - Security', 'JNCIS-SEC', net, 'Intermediate Juniper security technologies', 'Juniper Networks');
add('Aruba Certified Networking Associate', 'ACNA', net, 'Aruba networking fundamentals', 'HPE/Aruba');
add('Aruba Certified Mobility Professional', 'ACMP', net, 'Aruba wireless LAN design and deployment', 'HPE/Aruba');
add('Aruba Certified ClearPass Professional', 'ACCP', net, 'Network access control with Aruba ClearPass', 'HPE/Aruba');
add('Aruba Certified Network Security Expert', 'ACNX', net, 'Expert Aruba network security', 'HPE/Aruba');
add('Wireshark Certified Network Analyst', 'WCNA', net, 'Network protocol analysis and troubleshooting', 'Wireshark University');
add('Certified Wireless Network Administrator', 'CWNA', net, 'Enterprise wireless LAN administration', 'CWNP');
add('Certified Wireless Security Professional', 'CWSP', net, 'Wireless network security', 'CWNP');
add('Certified Wireless Design Professional', 'CWDP', net, 'Wireless network design and planning', 'CWNP');
add('Certified Wireless Analysis Professional', 'CWAP', net, 'Wireless protocol analysis and troubleshooting', 'CWNP');
add('F5 Certified BIG-IP Administrator', '', net, 'F5 BIG-IP application delivery controller management', 'F5 Networks');
add('F5 Certified Technical Specialist', '', net, 'Advanced F5 BIG-IP configuration', 'F5 Networks');
add('Riverbed Certified Solutions Associate', 'RCSA', net, 'WAN optimization and network performance', 'Riverbed');
add('Brocade Certified Network Engineer', 'BCNE', net, 'Brocade SAN and network switching', 'Broadcom/Brocade');
add('MikroTik Certified Network Associate', 'MTCNA', net, 'MikroTik RouterOS networking', 'MikroTik');
add('Ubiquiti Network Specialist', 'UNS', net, 'Ubiquiti network infrastructure deployment', 'Ubiquiti');

// ═══════════════════════════════════════════════════
// IT OPERATIONS
// ═══════════════════════════════════════════════════
const itops = 'IT Operations';
add('ITIL 4 Foundation', '', itops, 'IT service management framework fundamentals', 'Axelos');
add('ITIL 4 Specialist: Create, Deliver and Support', '', itops, 'Service value chain activities and practices', 'Axelos');
add('ITIL 4 Specialist: Drive Stakeholder Value', '', itops, 'Stakeholder engagement and service relationships', 'Axelos');
add('ITIL 4 Specialist: High Velocity IT', '', itops, 'Digital transformation and high-velocity delivery', 'Axelos');
add('ITIL 4 Strategist: Direct, Plan and Improve', '', itops, 'Strategic direction and continuous improvement', 'Axelos');
add('ITIL 4 Leader: Digital and IT Strategy', '', itops, 'Digital strategy and IT leadership', 'Axelos');
add('CompTIA A+', 'A+', itops, 'IT operational roles including hardware and software troubleshooting', 'CompTIA');
add('CompTIA Server+', 'Server+', itops, 'Server administration, management, and troubleshooting', 'CompTIA');
add('CompTIA Linux+', 'Linux+', itops, 'Linux system administration and operations', 'CompTIA');
add('CompTIA DataSys+', 'DataSys+', itops, 'Database system administration fundamentals', 'CompTIA');
add('CompTIA Project+', 'Project+', itops, 'IT project management essentials', 'CompTIA');
add('CompTIA ITF+', 'ITF+', itops, 'IT fundamentals for career readiness', 'CompTIA');
add('ServiceNow Certified System Administrator', 'CSA', itops, 'ServiceNow platform administration', 'ServiceNow');
add('ServiceNow Certified Implementation Specialist', 'CIS', itops, 'ServiceNow module implementation', 'ServiceNow');
add('ServiceNow Certified Technical Architect', 'CTA', itops, 'Expert ServiceNow architecture and design', 'ServiceNow');
add('ServiceNow Certified Application Specialist', 'CAS', itops, 'ServiceNow application configuration', 'ServiceNow');
add('HDI Customer Service Representative', 'HDI-CSR', itops, 'Help desk customer service fundamentals', 'HDI');
add('HDI Support Center Analyst', 'HDI-SCA', itops, 'Technical support and troubleshooting', 'HDI');
add('HDI Support Center Manager', 'HDI-SCM', itops, 'Support center management and leadership', 'HDI');
add('HDI Desktop Support Technician', 'HDI-DST', itops, 'Desktop support and end-user computing', 'HDI');
add('Microsoft Certified: Modern Desktop Administrator Associate', '', itops, 'Windows client deployment and management', 'Microsoft');
add('Apple Certified Support Professional', 'ACSP', itops, 'macOS troubleshooting and support', 'Apple');
add('Apple Certified IT Professional', 'ACIT', itops, 'Enterprise Apple device management', 'Apple');
add('Google IT Support Professional Certificate', '', itops, 'IT support fundamentals and troubleshooting', 'Google');
add('Google IT Automation with Python Professional Certificate', '', itops, 'IT task automation using Python', 'Google');
add('SUSE Certified Administrator', 'SCA', itops, 'SUSE Linux Enterprise administration', 'SUSE');
add('SUSE Certified Engineer', 'SCE', itops, 'Advanced SUSE Linux Enterprise engineering', 'SUSE');
add('LPI Linux Essentials', '', itops, 'Linux operating system fundamentals', 'Linux Professional Institute');
add('LPIC-1 Linux Administrator', 'LPIC-1', itops, 'Linux system administration', 'Linux Professional Institute');
add('LPIC-2 Linux Engineer', 'LPIC-2', itops, 'Advanced Linux system engineering', 'Linux Professional Institute');
add('LPIC-3 Linux Enterprise Professional', 'LPIC-3', itops, 'Enterprise Linux specialist skills', 'Linux Professional Institute');
add('Microsoft Certified: Identity and Access Administrator Associate', 'SC-300', itops, 'Identity and access management with Azure AD', 'Microsoft');
add('Microsoft Certified: Information Protection and Compliance Administrator Associate', 'SC-400', itops, 'Data governance and compliance in Microsoft 365', 'Microsoft');
add('Microsoft Certified: Security Operations Analyst Associate', 'SC-200', itops, 'Security operations with Microsoft Sentinel and Defender', 'Microsoft');
add('Jira Administrator Certification', '', itops, 'Atlassian Jira administration and configuration', 'Atlassian');
add('Jira Service Management Administrator', '', itops, 'Jira Service Management platform administration', 'Atlassian');
add('Atlassian Certified Professional', '', itops, 'Atlassian suite expertise and administration', 'Atlassian');
add('Zendesk Support Administrator Certification', '', itops, 'Zendesk customer support platform administration', 'Zendesk');
add('Freshservice ITSM Certification', '', itops, 'IT service management with Freshservice', 'Freshworks');
add('BMC Certified Administrator: Remedy ITSM', '', itops, 'BMC Remedy ITSM suite administration', 'BMC Software');
add('ConnectWise Certified Administrator', '', itops, 'ConnectWise platform administration for MSPs', 'ConnectWise');
add('Datto Certified Technician', '', itops, 'Backup and disaster recovery with Datto', 'Datto');
add('Veeam Certified Engineer', 'VMCE', itops, 'Backup and replication with Veeam', 'Veeam');
add('Commvault Certified Professional', '', itops, 'Data protection with Commvault', 'Commvault');
add('Nagios Certified Administrator', 'NCA', itops, 'IT infrastructure monitoring with Nagios', 'Nagios');
add('Zabbix Certified Specialist', '', itops, 'Infrastructure monitoring with Zabbix', 'Zabbix');
add('Datadog Fundamentals Certification', '', itops, 'Infrastructure and application monitoring with Datadog', 'Datadog');
add('New Relic Certified Performance Professional', '', itops, 'Application performance monitoring with New Relic', 'New Relic');
add('PagerDuty Certified Incident Responder', '', itops, 'Incident management with PagerDuty', 'PagerDuty');
add('Prometheus Certified Associate', 'PCA', itops, 'Cloud-native monitoring with Prometheus', 'Cloud Native Computing Foundation');

// ═══════════════════════════════════════════════════
// FINANCE & ACCOUNTING
// ═══════════════════════════════════════════════════
const fin = 'Finance & Accounting';
add('Certified Public Accountant', 'CPA', fin, 'Public accounting, auditing, and financial reporting', 'AICPA/State Boards');
add('Chartered Financial Analyst', 'CFA', fin, 'Investment analysis and portfolio management', 'CFA Institute');
add('Certified Financial Planner', 'CFP', fin, 'Comprehensive personal financial planning', 'CFP Board');
add('Certified Management Accountant', 'CMA', fin, 'Management accounting and financial management', 'IMA');
add('Chartered Global Management Accountant', 'CGMA', fin, 'Global management accounting', 'AICPA/CIMA');
add('Certified Internal Auditor', 'CIA', fin, 'Internal audit practices and standards', 'Institute of Internal Auditors');
add('Enrolled Agent', 'EA', fin, 'Federal tax preparation and representation', 'IRS');
add('Certified Financial Risk Manager', 'FRM', fin, 'Financial risk management and analysis', 'Global Association of Risk Professionals');
add('Professional Risk Manager', 'PRM', fin, 'Enterprise risk management', 'PRMIA');
add('Certified Treasury Professional', 'CTP', fin, 'Corporate treasury management', 'Association for Financial Professionals');
add('Financial Modeling & Valuation Analyst', 'FMVA', fin, 'Financial modeling and company valuation', 'Corporate Finance Institute');
add('Chartered Financial Consultant', 'ChFC', fin, 'Advanced financial planning', 'The American College');
add('Chartered Life Underwriter', 'CLU', fin, 'Life insurance and estate planning', 'The American College');
add('Certified Valuation Analyst', 'CVA', fin, 'Business valuation methodologies', 'NACVA');
add('Accredited Business Valuator', 'ABV', fin, 'Business valuation for CPAs', 'AICPA');
add('Certified Government Financial Manager', 'CGFM', fin, 'Government accounting and financial management', 'AGA');
add('Certified Credit Professional', 'CCP', fin, 'Credit analysis and risk management', 'Credit Institute of Canada');
add('Certified Anti-Money Laundering Specialist', 'CAMS', fin, 'Anti-money laundering compliance and investigation', 'ACAMS');
add('Certified Regulatory Compliance Manager', 'CRCM', fin, 'Regulatory compliance in financial institutions', 'ABA');
add('Certified Trust and Fiduciary Advisor', 'CTFA', fin, 'Trust administration and fiduciary services', 'ABA');
add('Certified Wealth Strategist', 'CWS', fin, 'Wealth management and advanced planning', 'Cannon Financial Institute');
add('Chartered Alternative Investment Analyst', 'CAIA', fin, 'Alternative investment analysis', 'CAIA Association');
add('Certified Investment Management Analyst', 'CIMA', fin, 'Investment management consulting', 'Investments & Wealth Institute');
add('Certified Private Wealth Advisor', 'CPWA', fin, 'Advanced wealth management strategies', 'Investments & Wealth Institute');
add('Series 7 - General Securities Representative', 'Series 7', fin, 'Securities sales and trading', 'FINRA');
add('Series 63 - Uniform Securities Agent', 'Series 63', fin, 'State securities law compliance', 'NASAA');
add('Series 65 - Investment Adviser Representative', 'Series 65', fin, 'Investment advisory services', 'NASAA');
add('Series 66 - Uniform Combined State Law', 'Series 66', fin, 'Combined securities agent and adviser', 'NASAA');
add('Certified Bookkeeper', 'CB', fin, 'Professional bookkeeping and accounting', 'AIPB');
add('QuickBooks ProAdvisor Certification', '', fin, 'Accounting and bookkeeping with QuickBooks', 'Intuit');
add('Xero Advisor Certification', '', fin, 'Cloud accounting with Xero', 'Xero');
add('Sage Certified Consultant', '', fin, 'Accounting solutions with Sage software', 'Sage');
add('NetSuite Certified Administrator', '', fin, 'NetSuite ERP administration', 'Oracle/NetSuite');
add('NetSuite Certified SuiteFoundation', '', fin, 'NetSuite platform fundamentals', 'Oracle/NetSuite');
add('SAP Certified Application Associate - SAP S/4HANA Finance', '', fin, 'Financial accounting with SAP S/4HANA', 'SAP');
add('Chartered Institute of Management Accountants', 'CIMA', fin, 'Management accounting and business finance', 'CIMA');
add('Association of Chartered Certified Accountants', 'ACCA', fin, 'Global professional accounting qualification', 'ACCA');
add('Certified Information Technology Professional', 'CITP', fin, 'Technology for accounting professionals', 'AICPA');
add('Certified Forensic Accountant', 'CrFA', fin, 'Forensic accounting and fraud investigation', 'ACFE');
add('Accredited in Business Valuation', 'ABV', fin, 'CPA-exclusive business valuation credential', 'AICPA');
add('Personal Financial Specialist', 'PFS', fin, 'Personal financial planning for CPAs', 'AICPA');
add('Certified Credit Analyst', 'CCA', fin, 'Credit analysis and underwriting', 'Various');
add('Bloomberg Market Concepts Certificate', 'BMC', fin, 'Bloomberg Terminal and financial markets fundamentals', 'Bloomberg');
add('Refinitiv Certified Specialist', '', fin, 'Financial data analysis with Refinitiv Eikon', 'Refinitiv/LSEG');
add('Workday Financial Management Certification', '', fin, 'Financial management with Workday', 'Workday');
add('Coupa Certified Procurement Professional', '', fin, 'Procurement and spend management with Coupa', 'Coupa');
add('Certified Government Auditing Professional', 'CGAP', fin, 'Government sector auditing', 'Institute of Internal Auditors');
add('Qualification in Internal Audit Leadership', 'QIAL', fin, 'Internal audit leadership', 'Institute of Internal Auditors');

// ═══════════════════════════════════════════════════
// HEALTHCARE
// ═══════════════════════════════════════════════════
const health = 'Healthcare';
add('Certified Professional Coder', 'CPC', health, 'Medical coding for physician services', 'AAPC');
add('Certified Outpatient Coder', 'COC', health, 'Outpatient facility medical coding', 'AAPC');
add('Certified Inpatient Coder', 'CIC', health, 'Inpatient hospital medical coding', 'AAPC');
add('Certified Risk Adjustment Coder', 'CRC', health, 'Risk adjustment and HCC coding', 'AAPC');
add('Certified Professional Biller', 'CPB', health, 'Medical billing processes and procedures', 'AAPC');
add('Certified Professional Medical Auditor', 'CPMA', health, 'Medical record auditing and compliance', 'AAPC');
add('Certified Coding Specialist', 'CCS', health, 'Hospital-based medical coding', 'AHIMA');
add('Certified Coding Specialist - Physician-based', 'CCS-P', health, 'Physician practice medical coding', 'AHIMA');
add('Registered Health Information Technician', 'RHIT', health, 'Health information management', 'AHIMA');
add('Registered Health Information Administrator', 'RHIA', health, 'Health information administration and management', 'AHIMA');
add('Certified Health Data Analyst', 'CHDA', health, 'Healthcare data analysis and reporting', 'AHIMA');
add('Certified in Healthcare Privacy and Security', 'CHPS', health, 'Healthcare data privacy and security compliance', 'AHIMA');
add('HIPAA Compliance Certification', '', health, 'Health Insurance Portability and Accountability Act compliance', 'Various');
add('Certified HIPAA Professional', 'CHP', health, 'HIPAA regulation expertise', 'Various');
add('Certified Electronic Health Records Specialist', 'CEHRS', health, 'Electronic health records management', 'NHA');
add('Certified Clinical Medical Assistant', 'CCMA', health, 'Clinical medical assistant competencies', 'NHA');
add('Certified Medical Administrative Assistant', 'CMAA', health, 'Medical office administration', 'NHA');
add('Certified Pharmacy Technician', 'CPhT', health, 'Pharmacy technician practices', 'PTCB');
add('Certified Phlebotomy Technician', 'CPT', health, 'Blood specimen collection procedures', 'NHA');
add('Certified EKG Technician', 'CET', health, 'Electrocardiogram monitoring and testing', 'NHA');
add('Registered Nurse', 'RN', health, 'Professional nursing licensure', 'State Boards of Nursing');
add('Licensed Practical Nurse', 'LPN', health, 'Practical nursing under RN supervision', 'State Boards of Nursing');
add('Certified Nursing Assistant', 'CNA', health, 'Basic patient care assistance', 'State Boards');
add('Board Certified Patient Advocate', 'BCPA', health, 'Patient advocacy and healthcare navigation', 'PACB');
add('Certified Healthcare Financial Professional', 'CHFP', health, 'Healthcare financial management', 'HFMA');
add('Certified Professional in Healthcare Quality', 'CPHQ', health, 'Healthcare quality management and improvement', 'NAHQ');
add('Certified Professional in Patient Safety', 'CPPS', health, 'Patient safety program management', 'CBPPS');
add('Certified Professional in Healthcare Risk Management', 'CPHRM', health, 'Healthcare risk management', 'AHA');
add('Lean Six Sigma for Healthcare', '', health, 'Process improvement in healthcare settings', 'Various');
add('Emergency Medical Technician', 'EMT', health, 'Emergency medical response and patient care', 'NREMT');
add('Paramedic Certification', 'NRP', health, 'Advanced emergency medical care', 'NREMT');
add('Certified Health Education Specialist', 'CHES', health, 'Community health education and promotion', 'NCHEC');
add('Master Certified Health Education Specialist', 'MCHES', health, 'Advanced health education and promotion', 'NCHEC');
add('Certified Medical Interpreter', 'CMI', health, 'Medical interpretation services', 'NBCMI');
add('Certified Healthcare Interpreter', 'CHI', health, 'Healthcare language interpretation', 'CCHI');
add('Certified Professional in Healthcare Information and Management Systems', 'CPHIMS', health, 'Healthcare IT management', 'HIMSS');
add('Certified Associate in Healthcare Information and Management Systems', 'CAHIMS', health, 'Healthcare IT fundamentals', 'HIMSS');
add('Epic Certified Professional', '', health, 'Epic EHR system configuration and support', 'Epic Systems');
add('Cerner Certified Professional', '', health, 'Cerner EHR system administration', 'Oracle Health/Cerner');
add('HL7 FHIR Certified Professional', '', health, 'Healthcare interoperability standards', 'HL7 International');
add('Clinical Research Associate Certification', 'CCRA', health, 'Clinical trial monitoring and management', 'ACRP');
add('Certified Clinical Research Professional', 'CCRP', health, 'Clinical research coordination', 'SoCRA');
add('Good Clinical Practice Certification', 'GCP', health, 'ICH-GCP guidelines for clinical trials', 'Various');
add('Certified Diabetes Care and Education Specialist', 'CDCES', health, 'Diabetes patient education and care', 'CBDCE');
add('Board Certified Behavior Analyst', 'BCBA', health, 'Applied behavior analysis', 'BACB');
add('Certified Case Manager', 'CCM', health, 'Healthcare case management coordination', 'CCMC');
add('Certified Professional in Utilization Review', 'CPUR', health, 'Healthcare utilization review and management', 'McKesson');
add('Certified Revenue Cycle Representative', 'CRCR', health, 'Healthcare revenue cycle management', 'HFMA');
add('Certified Medical Practice Executive', 'CMPE', health, 'Medical practice management', 'ACMPE');

// ═══════════════════════════════════════════════════
// HUMAN RESOURCES
// ═══════════════════════════════════════════════════
const hr = 'Human Resources';
add('SHRM Certified Professional', 'SHRM-CP', hr, 'HR operational and tactical management', 'Society for Human Resource Management');
add('SHRM Senior Certified Professional', 'SHRM-SCP', hr, 'Strategic HR leadership and policy development', 'Society for Human Resource Management');
add('Professional in Human Resources', 'PHR', hr, 'Technical and operational HR management', 'HR Certification Institute');
add('Senior Professional in Human Resources', 'SPHR', hr, 'Strategic HR management and policy design', 'HR Certification Institute');
add('Global Professional in Human Resources', 'GPHR', hr, 'International HR management and compliance', 'HR Certification Institute');
add('Associate Professional in Human Resources', 'aPHR', hr, 'Entry-level HR knowledge and practices', 'HR Certification Institute');
add('Professional in Human Resources - International', 'PHRi', hr, 'International HR practices and compliance', 'HR Certification Institute');
add('Senior Professional in Human Resources - International', 'SPHRi', hr, 'Strategic international HR management', 'HR Certification Institute');
add('Certified Compensation Professional', 'CCP', hr, 'Compensation program design and management', 'WorldatWork');
add('Certified Benefits Professional', 'CBP', hr, 'Employee benefits program management', 'WorldatWork');
add('Global Remuneration Professional', 'GRP', hr, 'Global compensation and benefits', 'WorldatWork');
add('Certified Sales Compensation Professional', 'CSCP', hr, 'Sales compensation plan design', 'WorldatWork');
add('Work-Life Certified Professional', 'WLCP', hr, 'Work-life program management', 'WorldatWork');
add('Certified Employee Benefit Specialist', 'CEBS', hr, 'Employee benefits management and administration', 'IFEBP/Wharton');
add('Talent Management Practitioner', 'TMP', hr, 'Talent acquisition and development strategies', 'Talent Management Institute');
add('Senior Talent Management Practitioner', 'STMP', hr, 'Strategic talent management and workforce planning', 'Talent Management Institute');
add('Global Talent Management Leader', 'GTML', hr, 'Global talent management leadership', 'Talent Management Institute');
add('Certified Professional in Talent Development', 'CPTD', hr, 'Talent development strategy and delivery', 'ATD');
add('Associate Professional in Talent Development', 'APTD', hr, 'Foundational talent development skills', 'ATD');
add('AIRS Certified Diversity and Inclusion Recruiter', 'CDR', hr, 'Diversity-focused recruitment practices', 'AIRS');
add('AIRS Certified Internet Recruiter', 'CIR', hr, 'Internet-based talent sourcing', 'AIRS');
add('AIRS Certified Social and New Media Recruiter', 'CSMR', hr, 'Social media recruiting strategies', 'AIRS');
add('LinkedIn Certified Professional Recruiter', '', hr, 'Recruiting using LinkedIn platform', 'LinkedIn');
add('Certified Professional in Learning and Performance', 'CPLP', hr, 'Learning program design and delivery', 'ATD');
add('Certified Payroll Professional', 'CPP', hr, 'Payroll management and compliance', 'APA');
add('Fundamental Payroll Certification', 'FPC', hr, 'Foundational payroll knowledge', 'APA');
add('Workday HCM Certification', '', hr, 'Human capital management with Workday', 'Workday');
add('SAP SuccessFactors Certification', '', hr, 'HR management with SAP SuccessFactors', 'SAP');
add('UKG (Ultimate Kronos) Certified Professional', '', hr, 'Workforce management with UKG', 'UKG');
add('ADP Workforce Now Certification', '', hr, 'Payroll and HR management with ADP', 'ADP');
add('BambooHR Certified Professional', '', hr, 'HR management with BambooHR', 'BambooHR');
add('Certified Professional in Disability Management', 'CPDM', hr, 'Disability management and accommodation', 'CDMS');
add('Certified Employee Assistance Professional', 'CEAP', hr, 'Employee assistance program management', 'EAPA');
add('Certified Labor Relations Professional', 'CLRP', hr, 'Labor relations and collective bargaining', 'Various');
add('Certified Change Management Professional', 'CCMP', hr, 'Organizational change management', 'ACMP');
add('Prosci Certified Change Practitioner', '', hr, 'ADKAR-based change management', 'Prosci');

// ═══════════════════════════════════════════════════
// MARKETING & SALES
// ═══════════════════════════════════════════════════
const mkt = 'Marketing & Sales';
add('Google Ads Certification', '', mkt, 'Google Ads campaign management and optimization', 'Google');
add('Google Ads Search Certification', '', mkt, 'Search advertising with Google Ads', 'Google');
add('Google Ads Display Certification', '', mkt, 'Display advertising with Google Ads', 'Google');
add('Google Ads Video Certification', '', mkt, 'Video advertising with YouTube and Google', 'Google');
add('Google Ads Shopping Certification', '', mkt, 'Shopping campaign management with Google Ads', 'Google');
add('Google Ads Apps Certification', '', mkt, 'Mobile app advertising with Google Ads', 'Google');
add('Google Ads Measurement Certification', '', mkt, 'Ads measurement and attribution', 'Google');
add('Google Ads Creative Certification', '', mkt, 'Creative best practices for Google Ads', 'Google');
add('Google Analytics Individual Qualification', 'GAIQ', mkt, 'Web analytics using Google Analytics', 'Google');
add('Google Analytics 4 Certification', '', mkt, 'Advanced analytics with Google Analytics 4', 'Google');
add('Google Digital Marketing & E-commerce Certificate', '', mkt, 'Digital marketing and e-commerce fundamentals', 'Google');
add('Google Tag Manager Fundamentals', '', mkt, 'Tag management and tracking implementation', 'Google');
add('HubSpot Inbound Marketing Certification', '', mkt, 'Inbound marketing strategy and execution', 'HubSpot');
add('HubSpot Content Marketing Certification', '', mkt, 'Content creation and marketing strategy', 'HubSpot');
add('HubSpot Email Marketing Certification', '', mkt, 'Email marketing campaigns and automation', 'HubSpot');
add('HubSpot Social Media Marketing Certification', '', mkt, 'Social media strategy and management', 'HubSpot');
add('HubSpot SEO Certification', '', mkt, 'Search engine optimization strategies', 'HubSpot');
add('HubSpot Sales Software Certification', '', mkt, 'Sales process management with HubSpot CRM', 'HubSpot');
add('HubSpot Marketing Software Certification', '', mkt, 'Marketing automation with HubSpot', 'HubSpot');
add('HubSpot CMS for Developers Certification', '', mkt, 'HubSpot CMS Hub development', 'HubSpot');
add('HubSpot Revenue Operations Certification', '', mkt, 'Revenue operations strategy and alignment', 'HubSpot');
add('Salesforce Certified Administrator', '', mkt, 'Salesforce CRM administration', 'Salesforce');
add('Salesforce Certified Advanced Administrator', '', mkt, 'Advanced Salesforce configuration and management', 'Salesforce');
add('Salesforce Certified Sales Cloud Consultant', '', mkt, 'Sales Cloud implementation and optimization', 'Salesforce');
add('Salesforce Certified Service Cloud Consultant', '', mkt, 'Service Cloud implementation and management', 'Salesforce');
add('Salesforce Certified Marketing Cloud Administrator', '', mkt, 'Marketing Cloud platform administration', 'Salesforce');
add('Salesforce Certified Marketing Cloud Email Specialist', '', mkt, 'Email marketing with Salesforce Marketing Cloud', 'Salesforce');
add('Salesforce Certified Marketing Cloud Consultant', '', mkt, 'Marketing Cloud strategy and implementation', 'Salesforce');
add('Salesforce Certified Pardot Specialist', '', mkt, 'B2B marketing automation with Pardot', 'Salesforce');
add('Salesforce Certified Experience Cloud Consultant', '', mkt, 'Community and experience design on Salesforce', 'Salesforce');
add('Salesforce Certified CPQ Specialist', '', mkt, 'Configure, price, quote implementation', 'Salesforce');
add('Salesforce Certified Field Service Consultant', '', mkt, 'Field service operations on Salesforce', 'Salesforce');
add('Meta Certified Digital Marketing Associate', '', mkt, 'Facebook and Instagram advertising fundamentals', 'Meta');
add('Meta Certified Marketing Science Professional', '', mkt, 'Marketing measurement and data analysis on Meta', 'Meta');
add('Meta Certified Media Planning Professional', '', mkt, 'Media planning for Meta platforms', 'Meta');
add('Meta Certified Creative Strategy Professional', '', mkt, 'Creative strategy for Meta ad platforms', 'Meta');
add('Meta Certified Community Manager', '', mkt, 'Facebook community management', 'Meta');
add('LinkedIn Marketing Solutions Fundamentals', '', mkt, 'LinkedIn advertising fundamentals', 'LinkedIn');
add('LinkedIn Marketing Strategy Certification', '', mkt, 'B2B marketing strategy on LinkedIn', 'LinkedIn');
add('LinkedIn Content and Creative Design Certification', '', mkt, 'Content creation for LinkedIn campaigns', 'LinkedIn');
add('Twitter Flight School Certification', '', mkt, 'Advertising on Twitter/X platform', 'X/Twitter');
add('Pinterest Advertising Essentials', '', mkt, 'Advertising on Pinterest', 'Pinterest');
add('TikTok Academy Certification', '', mkt, 'Marketing and advertising on TikTok', 'TikTok');
add('Hootsuite Social Marketing Certification', '', mkt, 'Social media marketing and management', 'Hootsuite');
add('Hootsuite Platform Certification', '', mkt, 'Social media management with Hootsuite', 'Hootsuite');
add('Sprout Social Certified Professional', '', mkt, 'Social media management with Sprout Social', 'Sprout Social');
add('Semrush SEO Toolkit Certification', '', mkt, 'SEO analysis and optimization with Semrush', 'Semrush');
add('Semrush Content Marketing Toolkit Certification', '', mkt, 'Content marketing strategy with Semrush', 'Semrush');
add('Semrush PPC Fundamentals Certification', '', mkt, 'PPC campaign management with Semrush', 'Semrush');
add('Moz SEO Essentials Certification', '', mkt, 'SEO fundamentals and best practices', 'Moz');
add('Yoast SEO for WordPress Certification', '', mkt, 'WordPress SEO optimization with Yoast', 'Yoast');
add('Mailchimp Email Marketing Certification', '', mkt, 'Email marketing with Mailchimp', 'Mailchimp/Intuit');
add('Marketo Certified Expert', 'MCE', mkt, 'Marketing automation with Adobe Marketo', 'Adobe');
add('Oracle Eloqua Marketing Cloud Certification', '', mkt, 'B2B marketing automation with Oracle Eloqua', 'Oracle');
add('Klaviyo Product Certification', '', mkt, 'Email and SMS marketing with Klaviyo', 'Klaviyo');
add('ActiveCampaign Certified Consultant', '', mkt, 'Marketing automation with ActiveCampaign', 'ActiveCampaign');
add('Braze Certified Practitioner', '', mkt, 'Customer engagement with Braze', 'Braze');
add('Optimizely Certified Developer', '', mkt, 'A/B testing and experimentation with Optimizely', 'Optimizely');
add('Hotjar Certified Professional', '', mkt, 'User behavior analytics with Hotjar', 'Hotjar');
add('Mixpanel Certified Professional', '', mkt, 'Product analytics with Mixpanel', 'Mixpanel');
add('Amplitude Analytics Certification', '', mkt, 'Product analytics with Amplitude', 'Amplitude');
add('Segment Certified Professional', '', mkt, 'Customer data platform management with Segment', 'Twilio/Segment');
add('Certified Brand Manager', 'CBM', mkt, 'Brand strategy and management', 'Various');
add('Digital Marketing Institute Certified Digital Marketing Professional', 'CDMP', mkt, 'Professional digital marketing certification', 'Digital Marketing Institute');
add('American Marketing Association Professional Certified Marketer', 'PCM', mkt, 'Professional marketing competency', 'AMA');
add('Certified Product Marketing Manager', 'CPMM', mkt, 'Product marketing strategy and execution', 'AIPMM');
add('Pragmatic Institute Certified', '', mkt, 'Product management and marketing', 'Pragmatic Institute');

// ═══════════════════════════════════════════════════
// LEGAL & COMPLIANCE
// ═══════════════════════════════════════════════════
const legal = 'Legal & Compliance';
add('Certified Compliance and Ethics Professional', 'CCEP', legal, 'Compliance and ethics program management', 'SCCE');
add('Certified in Healthcare Compliance', 'CHC', legal, 'Healthcare regulatory compliance', 'HCCA');
add('Certified in Healthcare Privacy Compliance', 'CHPC', legal, 'Healthcare privacy regulation compliance', 'HCCA');
add('Certified in Healthcare Research Compliance', 'CHRC', legal, 'Healthcare research regulatory compliance', 'HCCA');
add('Certified Information Privacy Professional/US', 'CIPP/US', legal, 'US data privacy laws and regulations', 'IAPP');
add('Certified Information Privacy Professional/Europe', 'CIPP/E', legal, 'European data privacy regulations including GDPR', 'IAPP');
add('Certified Information Privacy Professional/Canada', 'CIPP/C', legal, 'Canadian privacy laws and regulations', 'IAPP');
add('Certified Information Privacy Professional/Asia', 'CIPP/A', legal, 'Asian data privacy regulations', 'IAPP');
add('Certified Information Privacy Manager', 'CIPM', legal, 'Privacy program management and governance', 'IAPP');
add('Certified Information Privacy Technologist', 'CIPT', legal, 'Privacy in technology design and development', 'IAPP');
add('Fellow of Information Privacy', 'FIP', legal, 'Distinguished privacy professional', 'IAPP');
add('Certified Paralegal', 'CP', legal, 'Paralegal competency and legal assistance', 'NALA');
add('Certified Legal Manager', 'CLM', legal, 'Legal department management', 'ALA');
add('Certified E-Discovery Specialist', 'CEDS', legal, 'Electronic discovery processes and technology', 'ACEDS');
add('Certified Regulatory Compliance Manager', 'CRCM', legal, 'Financial regulatory compliance', 'ABA');
add('Certified Anti-Money Laundering Specialist', 'CAMS', legal, 'Anti-money laundering program management', 'ACAMS');
add('Certified Global Sanctions Specialist', 'CGSS', legal, 'Sanctions compliance and screening', 'ACAMS');
add('Certified Financial Crime Specialist', 'CFCS', legal, 'Financial crime prevention and investigation', 'ACFCS');
add('Certified Information Systems Auditor', 'CISA', legal, 'IT audit and compliance', 'ISACA');
add('Certified Protection Professional', 'CPP', legal, 'Security management and loss prevention', 'ASIS International');
add('Certified Contract Manager', 'CCM', legal, 'Contract management and negotiation', 'NCMA');
add('Certified Federal Contracts Manager', 'CFCM', legal, 'Federal contracting processes and regulations', 'NCMA');
add('Certified Commercial Contracts Manager', 'CCCM', legal, 'Commercial contract management', 'NCMA');
add('Society of Corporate Compliance and Ethics Certification', 'CCEP-I', legal, 'International compliance and ethics', 'SCCE');
add('OneTrust Certified Privacy Professional', '', legal, 'Privacy management with OneTrust platform', 'OneTrust');
add('TrustArc Certified Privacy Professional', '', legal, 'Privacy compliance with TrustArc', 'TrustArc');
add('Certified Export Compliance Professional', 'CECP', legal, 'Export control and trade compliance', 'Various');
add('Certified Licensing Professional', 'CLP', legal, 'Intellectual property licensing', 'Licensing Executives Society');

// ═══════════════════════════════════════════════════
// QUALITY & MANUFACTURING
// ═══════════════════════════════════════════════════
const quality = 'Quality & Manufacturing';
add('Certified Six Sigma Green Belt', 'CSSGB', quality, 'Six Sigma process improvement methodology', 'ASQ');
add('Certified Six Sigma Black Belt', 'CSSBB', quality, 'Advanced Six Sigma project leadership', 'ASQ');
add('Certified Six Sigma Master Black Belt', 'CSSMBB', quality, 'Six Sigma strategic deployment and mentoring', 'ASQ');
add('Six Sigma Yellow Belt', 'SSYB', quality, 'Six Sigma awareness and team participation', 'Various');
add('Lean Six Sigma Green Belt', 'LSSGB', quality, 'Lean and Six Sigma integrated process improvement', 'Various');
add('Lean Six Sigma Black Belt', 'LSSBB', quality, 'Advanced Lean Six Sigma project management', 'Various');
add('Certified Quality Engineer', 'CQE', quality, 'Quality engineering principles and practices', 'ASQ');
add('Certified Quality Auditor', 'CQA', quality, 'Quality system auditing', 'ASQ');
add('Certified Quality Inspector', 'CQI', quality, 'Quality inspection techniques and standards', 'ASQ');
add('Certified Manager of Quality/Organizational Excellence', 'CMQ/OE', quality, 'Quality management and organizational improvement', 'ASQ');
add('Certified Reliability Engineer', 'CRE', quality, 'Product and system reliability engineering', 'ASQ');
add('Certified Quality Improvement Associate', 'CQIA', quality, 'Quality improvement fundamentals', 'ASQ');
add('Certified Supplier Quality Professional', 'CSQP', quality, 'Supplier quality management', 'ASQ');
add('Certified HACCP Auditor', 'CHA', quality, 'Food safety HACCP system auditing', 'ASQ');
add('Certified Biomedical Auditor', 'CBA', quality, 'Biomedical and pharmaceutical quality auditing', 'ASQ');
add('Certified Calibration Technician', 'CCT', quality, 'Measurement and calibration standards', 'ASQ');
add('ISO 9001 Lead Auditor', '', quality, 'Quality management system auditing per ISO 9001', 'Various');
add('ISO 9001 Internal Auditor', '', quality, 'Internal quality management system auditing', 'Various');
add('ISO 14001 Lead Auditor', '', quality, 'Environmental management system auditing', 'Various');
add('ISO 14001 Internal Auditor', '', quality, 'Internal environmental management auditing', 'Various');
add('ISO 27001 Lead Auditor', '', quality, 'Information security management system auditing', 'Various');
add('ISO 27001 Lead Implementer', '', quality, 'ISMS implementation and management', 'Various');
add('ISO 22000 Lead Auditor', '', quality, 'Food safety management system auditing', 'Various');
add('ISO 45001 Lead Auditor', '', quality, 'Occupational health and safety management auditing', 'Various');
add('ISO 13485 Lead Auditor', '', quality, 'Medical devices quality management auditing', 'Various');
add('AS9100 Lead Auditor', '', quality, 'Aerospace quality management system auditing', 'Various');
add('IATF 16949 Internal Auditor', '', quality, 'Automotive quality management system auditing', 'Various');
add('Certified Production and Inventory Management', 'CPIM', quality, 'Production and inventory management', 'ASCM/APICS');
add('Certified Supply Chain Professional', 'CSCP', quality, 'End-to-end supply chain management', 'ASCM/APICS');
add('Certified in Logistics, Transportation and Distribution', 'CLTD', quality, 'Logistics and distribution management', 'ASCM/APICS');
add('Supply Chain Operations Reference Professional', 'SCOR-P', quality, 'Supply chain operations modeling and improvement', 'ASCM/APICS');
add('Certified Professional in Supply Management', 'CPSM', quality, 'Strategic supply management', 'ISM');
add('Certified Purchasing Manager', 'C.P.M.', quality, 'Purchasing and procurement management', 'ISM');
add('Certified in Transformation for Supply Chain', 'CTSC', quality, 'Supply chain digital transformation', 'ASCM/APICS');
add('Certified Manufacturing Engineer', 'CMfgE', quality, 'Manufacturing engineering principles', 'SME');
add('Certified Manufacturing Technologist', 'CMfgT', quality, 'Manufacturing technology applications', 'SME');
add('Certified Enterprise Integrator', 'CEI', quality, 'Manufacturing systems integration', 'SME');
add('Additive Manufacturing Certification', '', quality, 'Additive manufacturing and 3D printing', 'SME');
add('GMP Certification', '', quality, 'Good Manufacturing Practice compliance', 'Various');
add('Total Quality Management Certification', 'TQM', quality, 'TQM principles and continuous improvement', 'Various');
add('Certified Maintenance & Reliability Professional', 'CMRP', quality, 'Maintenance and asset reliability management', 'SMRP');

// ═══════════════════════════════════════════════════
// EDUCATION & TRAINING
// ═══════════════════════════════════════════════════
const edu = 'Education & Training';
add('Certified Professional in Training Management', 'CPTM', edu, 'Training program management and strategy', 'Training Industry');
add('Certified Technical Trainer', 'CTT+', edu, 'Technical training delivery and design', 'CompTIA');
add('Microsoft Certified Educator', 'MCE', edu, 'Technology integration in education', 'Microsoft');
add('Google Certified Educator Level 1', '', edu, 'Google Workspace for Education fundamentals', 'Google');
add('Google Certified Educator Level 2', '', edu, 'Advanced Google for Education integration', 'Google');
add('Google Certified Trainer', '', edu, 'Google for Education training and coaching', 'Google');
add('Google Certified Innovator', '', edu, 'Innovation in education using Google tools', 'Google');
add('Apple Teacher Certification', '', edu, 'Apple products integration in education', 'Apple');
add('TESOL/TEFL Certification', 'TESOL', edu, 'Teaching English to speakers of other languages', 'Various');
add('Certificate in English Language Teaching to Adults', 'CELTA', edu, 'English language teaching methodology', 'Cambridge Assessment');
add('Diploma in Teaching English to Speakers of Other Languages', 'Delta', edu, 'Advanced English language teaching', 'Cambridge Assessment');
add('International Baccalaureate Educator Certificate', '', edu, 'IB programme teaching and assessment', 'IBO');
add('National Board Certification for Teachers', 'NBCT', edu, 'Advanced teaching practice standards', 'NBPTS');
add('Certified Online Learning Facilitator', '', edu, 'Online course facilitation and management', 'Various');
add('Quality Matters Certified Peer Reviewer', '', edu, 'Online course quality assurance review', 'Quality Matters');
add('Articulate Storyline Certified', '', edu, 'E-learning development with Articulate Storyline', 'Articulate');
add('Adobe Captivate Specialist', '', edu, 'E-learning content creation with Adobe Captivate', 'Adobe');
add('Certified Professional in Accessibility Core Competencies', 'CPACC', edu, 'Accessibility principles for digital content', 'IAAP');
add('Web Accessibility Specialist', 'WAS', edu, 'Web accessibility implementation and testing', 'IAAP');
add('Certified Instructional Designer', '', edu, 'Instructional design theory and practice', 'ATD');
add('Certified Performance Technologist', 'CPT', edu, 'Human performance technology', 'ISPI');
add('Association for Talent Development Master Trainer', '', edu, 'Advanced facilitation and training design', 'ATD');
add('Kirkpatrick Four Levels Evaluation Certification', '', edu, 'Training program evaluation methodology', 'Kirkpatrick Partners');
add('Certified Professional in eLearning', 'CPeL', edu, 'E-learning design and delivery', 'eLearning Guild');
add('Canvas LMS Certified Educator', '', edu, 'Learning management with Canvas LMS', 'Instructure');
add('Blackboard Certified Educator', '', edu, 'Teaching with Blackboard LMS', 'Blackboard/Anthology');
add('Moodle Educator Certificate', 'MEC', edu, 'Teaching and learning with Moodle', 'Moodle');

// ═══════════════════════════════════════════════════
// BUSINESS & MANAGEMENT
// ═══════════════════════════════════════════════════
const biz = 'Business & Management';
add('Certified Business Analysis Professional', 'CBAP', biz, 'Advanced business analysis and requirements management', 'IIBA');
add('Certification of Capability in Business Analysis', 'CCBA', biz, 'Business analysis competency', 'IIBA');
add('Entry Certificate in Business Analysis', 'ECBA', biz, 'Foundational business analysis knowledge', 'IIBA');
add('Agile Analysis Certification', 'AAC', biz, 'Agile business analysis techniques', 'IIBA');
add('Certified Business Architect', 'CBA', biz, 'Business architecture modeling and strategy', 'Business Architecture Guild');
add('TOGAF Certified', 'TOGAF', biz, 'Enterprise architecture framework', 'The Open Group');
add('ArchiMate Certified', '', biz, 'Enterprise architecture modeling language', 'The Open Group');
add('Certified Management Consultant', 'CMC', biz, 'Management consulting practices and ethics', 'IMC');
add('Certified Strategy Professional', 'CSP', biz, 'Strategic planning and execution', 'Association for Strategic Planning');
add('Balanced Scorecard Professional', 'BSP', biz, 'Performance management using Balanced Scorecard', 'Balanced Scorecard Institute');
add('Certified Innovation Professional', 'CInP', biz, 'Innovation management and strategy', 'Global Innovation Institute');
add('Certified Design Thinking Professional', '', biz, 'Design thinking methodology and facilitation', 'Various');
add('Certified Customer Experience Professional', 'CCXP', biz, 'Customer experience strategy and management', 'CXPA');
add('Net Promoter Certified Associate', '', biz, 'NPS methodology and customer loyalty measurement', 'Bain/Satmetrix');
add('Certified Professional Facilitator', 'CPF', biz, 'Group facilitation and meeting management', 'IAF');
add('Certified Speaking Professional', 'CSP', biz, 'Professional speaking and presentation', 'National Speakers Association');
add('Certified Professional Negotiator', 'CPN', biz, 'Negotiation strategy and techniques', 'Various');
add('Prosci Change Management Certification', '', biz, 'Organizational change management methodology', 'Prosci');
add('Certified Business Continuity Professional', 'CBCP', biz, 'Business continuity planning and management', 'DRI International');
add('Master Business Continuity Professional', 'MBCP', biz, 'Advanced business continuity management', 'DRI International');
add('Certified Disaster Recovery Professional', 'CDRP', biz, 'Disaster recovery planning and implementation', 'DRI International');
add('Certified Executive Coach', 'CEC', biz, 'Executive coaching methodology and practice', 'Center for Credentialing & Education');
add('International Coach Federation Credential', 'ACC/PCC/MCC', biz, 'Professional coaching practice', 'International Coach Federation');
add('Board Certified Coach', 'BCC', biz, 'Professional coaching in organizational settings', 'Center for Credentialing & Education');
add('Certified Professional Co-Active Coach', 'CPCC', biz, 'Co-Active coaching methodology', 'Co-Active Training Institute');
add('Certified Franchise Executive', 'CFE', biz, 'Franchise management and operations', 'IFA');
add('Certified Association Executive', 'CAE', biz, 'Association and nonprofit management', 'ASAE');
add('Certified Meeting Professional', 'CMP', biz, 'Meeting and event planning management', 'EIC');
add('Certified Special Events Professional', 'CSEP', biz, 'Special event planning and coordination', 'ISES');
add('Certified Hospitality Administrator', 'CHA', biz, 'Hospitality industry management', 'AHLEI');
add('Certified Revenue Management Executive', 'CRME', biz, 'Revenue management in hospitality', 'HSMAI');
add('SAP Certified Application Associate - SAP S/4HANA', '', biz, 'Enterprise resource planning with SAP S/4HANA', 'SAP');
add('SAP Certified Technology Associate', '', biz, 'SAP technology platform fundamentals', 'SAP');
add('Oracle Certified Professional - ERP Cloud', '', biz, 'Enterprise resource planning with Oracle Cloud', 'Oracle');
add('Certified ERP Professional', '', biz, 'Enterprise resource planning implementation', 'Various');
add('Certified Scrum@Scale Practitioner', '', biz, 'Scaling Scrum across the enterprise', 'Scrum@Scale');
add('OKR Professional Certification', '', biz, 'Objectives and Key Results framework', 'Various');
add('Certified ScrumMaster Trainer', '', biz, 'Training and certifying Scrum practitioners', 'Scrum Alliance');
add('Certified Product Manager', 'CPM', biz, 'Product management strategy and execution', 'AIPMM');
add('Certified Innovation Leader', 'CIL', biz, 'Innovation leadership and management', 'Global Innovation Institute');

// ═══════════════════════════════════════════════════
// DESIGN & CREATIVE
// ═══════════════════════════════════════════════════
const design = 'Design & Creative';
add('Adobe Certified Professional in Visual Design', '', design, 'Visual design using Adobe Photoshop and Illustrator', 'Adobe');
add('Adobe Certified Professional in Graphic Design & Illustration', '', design, 'Graphic design with Adobe Illustrator', 'Adobe');
add('Adobe Certified Professional in Video Design', '', design, 'Video editing with Adobe Premiere Pro', 'Adobe');
add('Adobe Certified Professional in Web Design', '', design, 'Web design using Adobe Dreamweaver and XD', 'Adobe');
add('Adobe Certified Professional in Print & Digital Media Publication', '', design, 'Publication design with Adobe InDesign', 'Adobe');
add('Adobe Certified Expert - Photoshop', 'ACE', design, 'Expert-level Adobe Photoshop skills', 'Adobe');
add('Adobe Certified Expert - Illustrator', 'ACE', design, 'Expert-level Adobe Illustrator skills', 'Adobe');
add('Adobe Certified Expert - InDesign', 'ACE', design, 'Expert-level Adobe InDesign skills', 'Adobe');
add('Adobe Certified Expert - After Effects', 'ACE', design, 'Expert-level motion graphics with After Effects', 'Adobe');
add('Adobe Certified Expert - Premiere Pro', 'ACE', design, 'Expert-level video editing with Premiere Pro', 'Adobe');
add('Adobe Certified Expert - XD', 'ACE', design, 'Expert-level UX design with Adobe XD', 'Adobe');
add('Adobe Certified Expert - Lightroom', 'ACE', design, 'Expert-level photo editing with Lightroom', 'Adobe');
add('Figma Professional Certification', '', design, 'UI/UX design with Figma', 'Figma');
add('Sketch Certified Designer', '', design, 'Interface design with Sketch', 'Sketch');
add('InVision Certified Professional', '', design, 'Digital product design with InVision', 'InVision');
add('Certified Usability Analyst', 'CUA', design, 'Usability testing and analysis', 'Human Factors International');
add('Certified User Experience Professional', 'CUXP', design, 'UX research and design methodology', 'UXQB');
add('Nielsen Norman Group UX Certification', '', design, 'UX design and research best practices', 'Nielsen Norman Group');
add('Interaction Design Foundation UX Certificate', '', design, 'User experience design principles', 'IxDF');
add('Google UX Design Professional Certificate', '', design, 'UX design process and methodology', 'Google');
add('Certified ScrumMaster for UX', '', design, 'Integrating UX with Scrum methodology', 'Various');
add('Autodesk Certified Professional - AutoCAD', '', design, 'Technical drawing with AutoCAD', 'Autodesk');
add('Autodesk Certified Professional - Revit', '', design, 'BIM modeling with Autodesk Revit', 'Autodesk');
add('Autodesk Certified Professional - 3ds Max', '', design, '3D modeling and rendering with 3ds Max', 'Autodesk');
add('Autodesk Certified Professional - Maya', '', design, '3D animation and modeling with Maya', 'Autodesk');
add('Autodesk Certified Professional - Fusion 360', '', design, '3D CAD/CAM/CAE with Fusion 360', 'Autodesk');
add('Autodesk Certified Professional - Inventor', '', design, 'Mechanical design with Inventor', 'Autodesk');
add('SolidWorks Certified Professional', 'CSWP', design, '3D CAD modeling with SolidWorks', 'Dassault Systèmes');
add('SolidWorks Certified Associate', 'CSWA', design, 'Foundational SolidWorks 3D modeling', 'Dassault Systèmes');
add('SolidWorks Certified Expert', 'CSWE', design, 'Expert-level SolidWorks engineering design', 'Dassault Systèmes');
add('PTC Creo Certified Professional', '', design, '3D CAD design with PTC Creo', 'PTC');
add('Certified Professional Photographer', 'CPP', design, 'Professional photography standards', 'PPA');
add('Avid Certified User - Pro Tools', '', design, 'Audio production with Avid Pro Tools', 'Avid');
add('Avid Certified User - Media Composer', '', design, 'Video editing with Avid Media Composer', 'Avid');
add('Blackmagic DaVinci Resolve Certified', '', design, 'Color grading and video editing with DaVinci Resolve', 'Blackmagic Design');
add('Cinema 4D Certified Professional', '', design, '3D motion design with Cinema 4D', 'Maxon');
add('Blender Foundation Certified', '', design, '3D creation with Blender open-source', 'Blender Foundation');
add('Canva Certified Creative', '', design, 'Design and content creation with Canva', 'Canva');
add('Webflow Expert Certification', '', design, 'Visual web development with Webflow', 'Webflow');

// ═══════════════════════════════════════════════════
// TRADES & SAFETY
// ═══════════════════════════════════════════════════
const trades = 'Trades & Safety';
add('OSHA 10-Hour General Industry', 'OSHA 10', trades, 'Workplace safety awareness for general industry', 'OSHA');
add('OSHA 30-Hour General Industry', 'OSHA 30', trades, 'Comprehensive workplace safety for general industry', 'OSHA');
add('OSHA 10-Hour Construction', 'OSHA 10C', trades, 'Construction safety awareness', 'OSHA');
add('OSHA 30-Hour Construction', 'OSHA 30C', trades, 'Comprehensive construction safety', 'OSHA');
add('OSHA 510 - Occupational Safety and Health Standards for the Construction Industry', '', trades, 'OSHA construction industry standards', 'OSHA');
add('OSHA 511 - Occupational Safety and Health Standards for General Industry', '', trades, 'OSHA general industry standards', 'OSHA');
add('Commercial Driver License Class A', 'CDL-A', trades, 'Commercial driving for tractor-trailers and combination vehicles', 'State DMV');
add('Commercial Driver License Class B', 'CDL-B', trades, 'Commercial driving for single vehicles over 26,001 lbs', 'State DMV');
add('Hazardous Materials Endorsement', 'HazMat', trades, 'Transportation of hazardous materials', 'State DMV');
add('Transportation Worker Identification Credential', 'TWIC', trades, 'Access credential for maritime facilities', 'TSA');
add('Forklift Operator Certification', '', trades, 'Powered industrial truck operation', 'OSHA/Various');
add('Crane Operator Certification', '', trades, 'Mobile and tower crane operation', 'NCCCO');
add('Rigging Certification', '', trades, 'Rigging and signal person qualification', 'NCCCO');
add('Certified Welding Inspector', 'CWI', trades, 'Welding inspection and quality control', 'AWS');
add('Certified Welder', 'CW', trades, 'Welding performance qualification', 'AWS');
add('Certified Welding Educator', 'CWE', trades, 'Welding instruction and education', 'AWS');
add('AWS Certified Robotic Arc Welding Operator', '', trades, 'Robotic welding system operation', 'AWS');
add('EPA Section 608 Certification', 'EPA 608', trades, 'Refrigerant handling and HVAC certification', 'EPA');
add('EPA Section 609 Certification', 'EPA 609', trades, 'Motor vehicle air conditioning refrigerant', 'EPA');
add('NATE HVAC/R Certification', 'NATE', trades, 'HVAC/R installation and service', 'NATE');
add('HVAC Excellence Certification', '', trades, 'HVAC system installation, service, and maintenance', 'HVAC Excellence');
add('Master Electrician License', '', trades, 'Advanced electrical installation and maintenance', 'State Licensing Boards');
add('Journeyman Electrician License', '', trades, 'Electrical installation and wiring', 'State Licensing Boards');
add('Master Plumber License', '', trades, 'Advanced plumbing installation and repair', 'State Licensing Boards');
add('Journeyman Plumber License', '', trades, 'Plumbing installation and maintenance', 'State Licensing Boards');
add('Certified Plumbing Designer', 'CPD', trades, 'Plumbing system design', 'ASPE');
add('ASE Master Technician - Automobile', 'ASE', trades, 'Comprehensive automotive repair', 'ASE');
add('ASE Certified Technician - Engine Repair', 'A1', trades, 'Automotive engine diagnosis and repair', 'ASE');
add('ASE Certified Technician - Brakes', 'A5', trades, 'Automotive brake system service', 'ASE');
add('ASE Certified Technician - Electrical/Electronic Systems', 'A6', trades, 'Automotive electrical systems', 'ASE');
add('ASE Certified Technician - Heating and Air Conditioning', 'A7', trades, 'Automotive HVAC systems', 'ASE');
add('ASE Certified Technician - Engine Performance', 'A8', trades, 'Automotive engine performance diagnosis', 'ASE');
add('ASE Certified Technician - Advanced Engine Performance', 'L1', trades, 'Advanced automotive engine performance', 'ASE');
add('ASE Medium/Heavy Truck Technician', '', trades, 'Commercial truck maintenance and repair', 'ASE');
add('Certified Fire Protection Specialist', 'CFPS', trades, 'Fire protection engineering and safety', 'NFPA');
add('Certified Fire Inspector', 'CFI', trades, 'Fire code inspection and enforcement', 'NFPA/ICC');
add('Certified Safety Professional', 'CSP', trades, 'Occupational safety management', 'BCSP');
add('Associate Safety Professional', 'ASP', trades, 'Entry-level safety professional', 'BCSP');
add('Occupational Health and Safety Technologist', 'OHST', trades, 'Occupational health and safety technical skills', 'BCSP');
add('Construction Health and Safety Technician', 'CHST', trades, 'Construction safety management', 'BCSP');
add('Certified Industrial Hygienist', 'CIH', trades, 'Industrial hygiene and occupational health', 'ABIH');
add('Certified Hazardous Materials Manager', 'CHMM', trades, 'Hazardous materials management', 'IHMM');
add('Certified Environmental Specialist', 'CES', trades, 'Environmental compliance and management', 'Various');
add('LEED Green Associate', 'LEED GA', trades, 'Green building fundamentals', 'USGBC');
add('LEED Accredited Professional', 'LEED AP', trades, 'Green building design and construction', 'USGBC');
add('Certified Energy Manager', 'CEM', trades, 'Energy management and efficiency', 'AEE');
add('Certified Energy Auditor', 'CEA', trades, 'Energy auditing and assessment', 'AEE');
add('Building Performance Institute Certification', 'BPI', trades, 'Building energy efficiency and performance', 'BPI');
add('ICC Building Inspector', '', trades, 'Building code inspection', 'International Code Council');
add('ICC Plans Examiner', '', trades, 'Building plan review and code compliance', 'International Code Council');
add('ICC Mechanical Inspector', '', trades, 'Mechanical systems code inspection', 'International Code Council');
add('ICC Plumbing Inspector', '', trades, 'Plumbing code inspection', 'International Code Council');
add('ICC Electrical Inspector', '', trades, 'Electrical code inspection', 'International Code Council');
add('Certified Pool/Spa Operator', 'CPO', trades, 'Swimming pool and spa operation', 'PHTA');
add('ServSafe Food Handler', '', trades, 'Food safety and handling certification', 'National Restaurant Association');
add('ServSafe Manager', '', trades, 'Food safety management certification', 'National Restaurant Association');
add('Certified Food Safety Professional', 'CFSP', trades, 'Professional food safety management', 'Various');
add('Pest Control Operator License', '', trades, 'Pest management and chemical application', 'State Agencies');
add('Water Treatment Operator Certification', '', trades, 'Water treatment plant operation', 'State Agencies');
add('Wastewater Treatment Operator Certification', '', trades, 'Wastewater treatment plant operation', 'State Agencies');
add('Certified Arborist', '', trades, 'Tree care and arboriculture', 'ISA');
add('Certified Landscape Technician', 'CLT', trades, 'Professional landscape installation and maintenance', 'NALP');
add('National Inspection Testing Certification', 'NITC', trades, 'Fire alarm and sprinkler system inspection', 'NITC');
add('Backflow Prevention Assembly Tester', '', trades, 'Backflow prevention device testing', 'ABPA');

// ═══════════════════════════════════════════════════
// GENERAL
// ═══════════════════════════════════════════════════
const gen = 'General';
add('Certified Professional in Accessibility Core Competencies', 'CPACC', gen, 'Digital accessibility principles and standards', 'IAAP');
add('Certified ScrumMaster', '', gen, 'Scrum methodology and agile team facilitation', 'Various');
add('Certified Blockchain Professional', 'CBP', gen, 'Blockchain technology and decentralized applications', 'EC-Council');
add('Certified Blockchain Developer', 'CBD', gen, 'Blockchain application development', 'Various');
add('Certified Ethereum Developer', 'CED', gen, 'Smart contract development on Ethereum', 'Various');
add('Hyperledger Certified Service Provider', '', gen, 'Enterprise blockchain with Hyperledger', 'Linux Foundation');
add('Certified Internet of Things Professional', 'CIoTP', gen, 'IoT system design and implementation', 'CertNexus');
add('Certified Internet of Things Practitioner', 'CIoT', gen, 'IoT practical applications and deployment', 'CertNexus');
add('AWS Certified IoT Specialty', '', gen, 'IoT solutions on AWS', 'Amazon Web Services');
add('Certified Wireless IoT Solutions Engineer', '', gen, 'Wireless IoT system engineering', 'Various');
add('Certified Digital Transformation Professional', '', gen, 'Digital transformation strategy and execution', 'Various');
add('APMG Change Management Foundation', '', gen, 'Change management framework fundamentals', 'APMG International');
add('APMG Change Management Practitioner', '', gen, 'Applied change management methodology', 'APMG International');
add('Certified Knowledge Manager', 'CKM', gen, 'Knowledge management systems and practices', 'KMI');
add('Certified Records Manager', 'CRM', gen, 'Records management and information governance', 'ICRM');
add('Certified Information Professional', 'CIP', gen, 'Information management and governance', 'AIIM');
add('Geographic Information Systems Professional', 'GISP', gen, 'GIS technology and spatial analysis', 'GIS Certification Institute');
add('Esri Technical Certification', '', gen, 'GIS development with Esri ArcGIS', 'Esri');
add('Certified Professional Ergonomist', 'CPE', gen, 'Workplace ergonomics and human factors', 'BCPE');
add('Certified Supply Chain Security Professional', 'CSSCP', gen, 'Supply chain security management', 'Various');
add('Certified Wireless Technology Specialist', 'CWTS', gen, 'Wireless technology fundamentals', 'CWNP');
add('CompTIA Data+', 'Data+', gen, 'Data analytics concepts and fundamentals', 'CompTIA');
add('Certified Data Centre Professional', 'CDCP', gen, 'Data center design and management', 'EPI');
add('Certified Data Centre Specialist', 'CDCS', gen, 'Advanced data center operations', 'EPI');

// Deduplicate by lowercase name
const seen = new Set();
const deduped = [];
for (const cert of certs) {
    const key = cert.name.toLowerCase();
    if (!seen.has(key)) {
        seen.add(key);
        deduped.push(cert);
    }
}

deduped.sort((a, b) => a.name.localeCompare(b.name));

const output = {
    totalCredentials: deduped.length,
    source: 'lightcast',
    sourceVersion: '2023-05',
    generatedAt: new Date().toISOString(),
    credentials: deduped
};

fs.writeFileSync('certifications/lightcast-certs.json', JSON.stringify(output, null, 2));
console.log('Total credentials:', deduped.length);

const cats = {};
deduped.forEach(c => { cats[c.category] = (cats[c.category] || 0) + 1; });
console.log('\nCategory breakdown:');
Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
});

const providers = {};
deduped.forEach(c => { providers[c.provider] = (providers[c.provider] || 0) + 1; });
console.log(`\nUnique providers: ${Object.keys(providers).length}`);
const topProviders = Object.entries(providers).sort((a, b) => b[1] - a[1]).slice(0, 15);
console.log('Top providers:');
topProviders.forEach(([p, count]) => { console.log(`  ${p}: ${count}`); });

const fileSize = fs.statSync('certifications/lightcast-certs.json').size;
console.log(`\nFile size: ${(fileSize / 1024).toFixed(1)} KB`);
