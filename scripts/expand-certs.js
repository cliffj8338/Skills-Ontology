const fs = require('fs');
const existing = JSON.parse(fs.readFileSync('certifications/lightcast-certs.json', 'utf8'));
const certs = existing.credentials.slice();
const existingNames = new Set(certs.map(c => c.name.toLowerCase()));

function add(name, abbr, category, description, provider) {
    if (existingNames.has(name.toLowerCase())) return;
    existingNames.add(name.toLowerCase());
    certs.push({ name, abbr: abbr || '', category, description, provider: provider || 'Various', skills: [], tier: 'standard', source: 'lightcast' });
}

const cloud = 'Cloud & Infrastructure';
const cyber = 'Cybersecurity';
const data = 'Data & Analytics';
const dev = 'Development & Programming';
const ai = 'AI & Machine Learning';
const pm = 'Project Management';
const net = 'Networking';
const itops = 'IT Operations';
const fin = 'Finance & Accounting';
const health = 'Healthcare';
const hr = 'Human Resources';
const mkt = 'Marketing & Sales';
const legal = 'Legal & Compliance';
const quality = 'Quality & Manufacturing';
const edu = 'Education & Training';
const biz = 'Business & Management';
const design = 'Design & Creative';
const trades = 'Trades & Safety';
const gen = 'General';

// ═══════════════════════════════════════════════════
// CLOUD EXPANSION
// ═══════════════════════════════════════════════════
add('AWS Certified Solutions Architect - Associate (SAA-C03)', 'SAA-C03', cloud, 'Current exam version for AWS Solutions Architect Associate', 'Amazon Web Services');
add('AWS Certified Cloud Practitioner (CLF-C02)', 'CLF-C02', cloud, 'Current exam version for AWS Cloud Practitioner', 'Amazon Web Services');
add('Google Cloud Certified: Professional ChromeOS Administrator', '', cloud, 'ChromeOS fleet management and administration', 'Google');
add('Google Cloud Certified: Professional Google Workspace Administrator', '', cloud, 'Google Workspace administration and security', 'Google');
add('Microsoft Certified: Azure Stack Hub Operator Associate', '', cloud, 'Azure Stack Hub deployment and management', 'Microsoft');
add('Microsoft Certified: Power Automate RPA Developer Associate', 'PL-500', cloud, 'Robotic process automation with Power Automate', 'Microsoft');
add('Terraform Associate (003)', '', cloud, 'Current HashiCorp Terraform certification version', 'HashiCorp');
add('HashiCorp Certified: Vault Operations Professional', '', cloud, 'Advanced Vault operations and management', 'HashiCorp');
add('HashiCorp Certified: Terraform Authoring and Operations Professional', '', cloud, 'Advanced Terraform usage and operations', 'HashiCorp');
add('Pulumi Certified Cloud Engineer', '', cloud, 'Infrastructure as code with Pulumi', 'Pulumi');
add('Crossplane Certified Associate', '', cloud, 'Cloud infrastructure management with Crossplane', 'CNCF');
add('Certified GitOps Associate', 'CGOA', cloud, 'GitOps practices for infrastructure management', 'CNCF');
add('Certified Argo Project Associate', 'CAPA', cloud, 'CI/CD with Argo Workflows and Argo CD', 'CNCF');
add('Istio Certified Associate', 'ICA', cloud, 'Service mesh with Istio', 'CNCF');
add('Cilium Certified Associate', 'CCA', cloud, 'Cloud native networking with Cilium', 'CNCF');
add('Backstage Certified Associate', '', cloud, 'Developer portal with Backstage', 'CNCF');
add('Linux Foundation Certified System Administrator', 'LFCS', cloud, 'Linux system administration', 'Linux Foundation');
add('Linux Foundation Certified Engineer', 'LFCE', cloud, 'Advanced Linux system engineering', 'Linux Foundation');
add('Linux Foundation Certified Cloud Technician', 'LFCT', cloud, 'Cloud computing with Linux', 'Linux Foundation');
add('Linode Certified Cloud Professional', '', cloud, 'Cloud infrastructure on Linode/Akamai', 'Akamai/Linode');
add('Hetzner Cloud Certified Professional', '', cloud, 'European cloud infrastructure management', 'Hetzner');
add('Proxmox Certified Administrator', '', cloud, 'Virtualization with Proxmox VE', 'Proxmox');
add('Rancher Certified Administrator', '', cloud, 'Kubernetes management with Rancher', 'SUSE/Rancher');
add('Portainer Certified Administrator', '', cloud, 'Container management with Portainer', 'Portainer');
add('MinIO Certified Administrator', '', cloud, 'Object storage with MinIO', 'MinIO');
add('Ceph Certified Administrator', '', cloud, 'Distributed storage with Ceph', 'Red Hat');
add('NetApp Certified Storage Associate', 'NCSA', cloud, 'NetApp storage solutions fundamentals', 'NetApp');
add('NetApp Certified Data Administrator', 'NCDA', cloud, 'NetApp data management and administration', 'NetApp');
add('Pure Storage Certified Professional', '', cloud, 'Flash storage solutions with Pure Storage', 'Pure Storage');
add('Veritas Certified Professional', '', cloud, 'Data protection with Veritas solutions', 'Veritas');
add('Kasten K10 Certified Professional', '', cloud, 'Kubernetes backup with Kasten K10', 'Veeam/Kasten');
add('Akamai Certified Professional', '', cloud, 'CDN and edge computing with Akamai', 'Akamai');
add('Cloudflare Certified Developer', '', cloud, 'Edge computing with Cloudflare Workers', 'Cloudflare');
add('Fastly Certified Engineer', '', cloud, 'Edge cloud delivery with Fastly', 'Fastly');
add('Fly.io Certified Developer', '', cloud, 'Edge application deployment with Fly.io', 'Fly.io');

// ═══════════════════════════════════════════════════
// CYBERSECURITY EXPANSION
// ═══════════════════════════════════════════════════
add('GIAC Security Leadership', 'GSLC', cyber, 'Security management and leadership', 'SANS/GIAC');
add('GIAC Law of Data Security and Investigations', 'GLEG', cyber, 'Legal aspects of information security', 'SANS/GIAC');
add('GIAC Certified Windows Security Administrator', 'GCWN', cyber, 'Windows security configuration and monitoring', 'SANS/GIAC');
add('GIAC Mobile Device Security Analyst', 'GMOB', cyber, 'Mobile device security assessment', 'SANS/GIAC');
add('GIAC Certified UNIX Security Administrator', 'GCUX', cyber, 'UNIX/Linux security administration', 'SANS/GIAC');
add('GIAC Battlefield Forensics and Acquisition', 'GBFA', cyber, 'Rapid digital forensics acquisition', 'SANS/GIAC');
add('GIAC Open Source Intelligence', 'GOSI', cyber, 'Open source intelligence gathering and analysis', 'SANS/GIAC');
add('GIAC Information Security Fundamentals', 'GISF', cyber, 'Information security fundamentals', 'SANS/GIAC');
add('GIAC Critical Controls Certification', 'GCCC', cyber, 'CIS Critical Security Controls implementation', 'SANS/GIAC');
add('GIAC Cloud Threat Detection', 'GCTD', cyber, 'Cloud-native threat detection and response', 'SANS/GIAC');
add('GIAC Strategic Planning, Policy, and Leadership', 'GSTRT', cyber, 'Security strategy and policy development', 'SANS/GIAC');
add('Check Point Certified Security Administrator', 'CCSA', cyber, 'Check Point firewall administration', 'Check Point');
add('Check Point Certified Security Expert', 'CCSE', cyber, 'Advanced Check Point security engineering', 'Check Point');
add('Check Point Certified Master', 'CCSM', cyber, 'Expert Check Point security solutions', 'Check Point');
add('Sophos Certified Administrator', '', cyber, 'Sophos endpoint and network security', 'Sophos');
add('Sophos Certified Engineer', '', cyber, 'Advanced Sophos security deployment', 'Sophos');
add('WatchGuard Certified System Professional', '', cyber, 'WatchGuard firewall and security appliance management', 'WatchGuard');
add('SonicWall Certified Network Security Administrator', 'SNSA', cyber, 'SonicWall firewall configuration', 'SonicWall');
add('Trend Micro Certified Professional', '', cyber, 'Trend Micro endpoint and server security', 'Trend Micro');
add('Carbon Black Certified Professional', '', cyber, 'Endpoint detection with VMware Carbon Black', 'VMware');
add('SentinelOne Certified Administrator', '', cyber, 'Endpoint protection with SentinelOne', 'SentinelOne');
add('Cylance Certified Professional', '', cyber, 'AI-driven endpoint security with BlackBerry Cylance', 'BlackBerry');
add('Qualys Certified Specialist', '', cyber, 'Vulnerability management with Qualys', 'Qualys');
add('Tenable Certified Security Engineer', '', cyber, 'Vulnerability management with Tenable/Nessus', 'Tenable');
add('Rapid7 Certified InsightIDR Specialist', '', cyber, 'SIEM and incident detection with Rapid7', 'Rapid7');
add('LogRhythm Certified Deployment Professional', '', cyber, 'SIEM deployment with LogRhythm', 'LogRhythm');
add('IBM QRadar Certified Associate Analyst', '', cyber, 'Security analytics with IBM QRadar', 'IBM');
add('Sumo Logic Certified Professional', '', cyber, 'Cloud SIEM and analytics with Sumo Logic', 'Sumo Logic');
add('Snyk Security Certification', '', cyber, 'Developer security and SAST/DAST with Snyk', 'Snyk');
add('Veracode Certified Professional', '', cyber, 'Application security testing with Veracode', 'Veracode');
add('Checkmarx Certified Security Champion', '', cyber, 'Application security with Checkmarx', 'Checkmarx');
add('Synopsys Application Security Testing Certification', '', cyber, 'Software composition analysis and SAST', 'Synopsys');
add('Proofpoint Certified Administrator', '', cyber, 'Email security with Proofpoint', 'Proofpoint');
add('Mimecast Email Security Specialist', '', cyber, 'Email security with Mimecast', 'Mimecast');
add('KnowBe4 Security Awareness Certification', '', cyber, 'Security awareness training management', 'KnowBe4');
add('Varonis Certified Administrator', '', cyber, 'Data security and analytics with Varonis', 'Varonis');
add('Sailpoint Certified IdentityNow Engineer', '', cyber, 'Identity governance with SailPoint', 'SailPoint');
add('CyberArk Certified Trustee', '', cyber, 'Privileged access management with CyberArk', 'CyberArk');
add('CyberArk Certified Delivery Engineer', '', cyber, 'CyberArk PAM solution deployment', 'CyberArk');
add('BeyondTrust Certified Professional', '', cyber, 'Privileged access management with BeyondTrust', 'BeyondTrust');
add('Thales Certified Professional', '', cyber, 'Data encryption and key management', 'Thales');
add('Delinea Certified Administrator', '', cyber, 'Secret Server privileged access management', 'Delinea');
add('Okta Certified Professional', '', cyber, 'Identity and access management with Okta', 'Okta');
add('Okta Certified Administrator', '', cyber, 'Okta platform administration', 'Okta');
add('Okta Certified Developer', '', cyber, 'Identity integration development with Okta', 'Okta');
add('Ping Identity Certified Professional', '', cyber, 'Identity management with Ping Identity', 'Ping Identity');
add('ForgeRock Certified Professional', '', cyber, 'Digital identity management with ForgeRock', 'ForgeRock');
add('OneSpan Certified Administrator', '', cyber, 'Digital identity verification with OneSpan', 'OneSpan');
add('Duo Security Certified Administrator', '', cyber, 'Multi-factor authentication with Cisco Duo', 'Cisco');
add('Yubico YubiKey Certified Professional', '', cyber, 'Hardware security key management', 'Yubico');

// ═══════════════════════════════════════════════════
// DATA & ANALYTICS EXPANSION
// ═══════════════════════════════════════════════════
add('AWS Certified Data Analytics - Specialty (DAS-C01)', '', data, 'Data analytics solutions on AWS', 'Amazon Web Services');
add('Google Professional Data Engineer', '', data, 'Data engineering on Google Cloud', 'Google');
add('Google Cloud Digital Leader - Data', '', data, 'Data strategy on Google Cloud', 'Google');
add('Azure Synapse Analytics Certification', '', data, 'Data warehousing with Azure Synapse', 'Microsoft');
add('Redshift Certified Specialist', '', data, 'Data warehousing with Amazon Redshift', 'Amazon Web Services');
add('BigQuery Certified Professional', '', data, 'Data analytics with Google BigQuery', 'Google');
add('Snowflake SnowPro Advanced: Data Analyst', '', data, 'Advanced data analysis on Snowflake', 'Snowflake');
add('Snowflake SnowPro Advanced: Administrator', '', data, 'Advanced Snowflake platform administration', 'Snowflake');
add('Matillion Data Productivity Cloud Certification', '', data, 'Data transformation with Matillion', 'Matillion');
add('Airbyte Certified Data Integration Specialist', '', data, 'Data integration with Airbyte', 'Airbyte');
add('Prefect Certified Workflow Engineer', '', data, 'Data workflow orchestration with Prefect', 'Prefect');
add('Apache Airflow Certified Professional', '', data, 'Workflow orchestration with Apache Airflow', 'Astronomer');
add('Dagster Certified Data Engineer', '', data, 'Data orchestration with Dagster', 'Dagster');
add('Monte Carlo Data Observability Certification', '', data, 'Data observability and quality monitoring', 'Monte Carlo');
add('Collibra Certified Data Governance Professional', '', data, 'Data governance with Collibra', 'Collibra');
add('Alation Data Intelligence Certification', '', data, 'Data cataloging with Alation', 'Alation');
add('Immuta Data Security Certification', '', data, 'Data access governance with Immuta', 'Immuta');
add('Privacera Data Governance Certification', '', data, 'Data access governance with Privacera', 'Privacera');
add('Apache Hive Certified Developer', '', data, 'Data warehousing with Apache Hive', 'Various');
add('Apache Flink Certified Developer', '', data, 'Stream processing with Apache Flink', 'Various');
add('Apache Beam Certified Developer', '', data, 'Unified batch and stream data processing', 'Various');
add('ClickHouse Certified Developer', '', data, 'Analytics database with ClickHouse', 'ClickHouse');
add('TimescaleDB Certified Developer', '', data, 'Time-series data management with TimescaleDB', 'Timescale');
add('InfluxDB Certified Developer', '', data, 'Time-series data with InfluxDB', 'InfluxData');
add('CockroachDB Certified Developer', '', data, 'Distributed SQL with CockroachDB', 'Cockroach Labs');
add('PlanetScale Certified Developer', '', data, 'Serverless MySQL with PlanetScale', 'PlanetScale');
add('Supabase Certified Developer', '', data, 'Backend-as-a-service with Supabase', 'Supabase');
add('Redis Certified Developer', '', data, 'In-memory data store with Redis', 'Redis');
add('Couchbase Certified Developer', '', data, 'NoSQL database development with Couchbase', 'Couchbase');
add('SingleStore Certified Developer', '', data, 'Distributed SQL database with SingleStore', 'SingleStore');
add('DuckDB Certified Analyst', '', data, 'Analytical SQL with DuckDB', 'DuckDB');
add('Pinecone Vector Database Certification', '', data, 'Vector database management with Pinecone', 'Pinecone');
add('Weaviate Certified Developer', '', data, 'Vector database with Weaviate', 'Weaviate');
add('Milvus Certified Developer', '', data, 'Vector database management with Milvus', 'Zilliz');
add('Microsoft Certified: Power Apps + Dynamics 365 Developer', '', data, 'Data-driven app development with Power Apps', 'Microsoft');
add('SAP Certified Application Associate - SAP HANA', '', data, 'In-memory computing with SAP HANA', 'SAP');
add('KNIME Certified Analytics Professional', '', data, 'Data analytics with KNIME platform', 'KNIME');
add('RapidMiner Certified Analyst', '', data, 'Data science with RapidMiner', 'RapidMiner');
add('Metabase Certified Analyst', '', data, 'Business intelligence with Metabase', 'Metabase');
add('Apache Superset Certified Developer', '', data, 'Data visualization with Apache Superset', 'Various');
add('Grafana Certified Associate', '', data, 'Data visualization and monitoring with Grafana', 'Grafana Labs');
add('Observe Certified Analyst', '', data, 'Observability data analysis with Observe', 'Observe');
add('Cribl Certified Admin', '', data, 'Data stream processing with Cribl', 'Cribl');

// ═══════════════════════════════════════════════════
// DEV EXPANSION
// ═══════════════════════════════════════════════════
add('AWS Certified Developer - Associate (DVA-C02)', '', dev, 'Current AWS developer certification version', 'Amazon Web Services');
add('Vercel Certified Developer', '', dev, 'Frontend deployment with Vercel', 'Vercel');
add('Netlify Certified Developer', '', dev, 'JAMstack deployment with Netlify', 'Netlify');
add('Cloudflare Workers Certified Developer', '', dev, 'Edge computing with Cloudflare Workers', 'Cloudflare');
add('Supabase Certified Backend Developer', '', dev, 'Backend development with Supabase', 'Supabase');
add('Firebase Certified Developer', '', dev, 'Mobile and web development with Firebase', 'Google');
add('Expo Certified React Native Developer', '', dev, 'Mobile development with React Native and Expo', 'Expo');
add('Ionic Certified Developer', '', dev, 'Hybrid mobile development with Ionic', 'Ionic');
add('Xamarin Certified Developer', '', dev, 'Cross-platform mobile development with Xamarin', 'Microsoft');
add('.NET Certified Developer', '', dev, '.NET framework application development', 'Microsoft');
add('Spring Professional Certification', '', dev, 'Enterprise Java development with Spring Framework', 'VMware/Pivotal');
add('Spring Cloud Developer Certification', '', dev, 'Microservices with Spring Cloud', 'VMware/Pivotal');
add('Quarkus Certified Developer', '', dev, 'Cloud-native Java with Quarkus', 'Red Hat');
add('Micronaut Certified Developer', '', dev, 'JVM microservices with Micronaut', 'Oracle');
add('gRPC Certified Developer', '', dev, 'RPC framework development with gRPC', 'Google');
add('GraphQL Certified Developer', '', dev, 'API development with GraphQL', 'Various');
add('Apollo GraphQL Certified Developer', '', dev, 'GraphQL development with Apollo', 'Apollo');
add('Hasura Certified Developer', '', dev, 'Instant GraphQL APIs with Hasura', 'Hasura');
add('Prisma Certified Developer', '', dev, 'Database ORM development with Prisma', 'Prisma');
add('Contentful Certified Developer', '', dev, 'Headless CMS development with Contentful', 'Contentful');
add('Sanity Certified Developer', '', dev, 'Structured content with Sanity CMS', 'Sanity');
add('Strapi Certified Developer', '', dev, 'Headless CMS with Strapi', 'Strapi');
add('Airtable Certified Developer', '', dev, 'Low-code development with Airtable', 'Airtable');
add('Zapier Certified Expert', '', dev, 'Workflow automation with Zapier', 'Zapier');
add('Make (Integromat) Certified Professional', '', dev, 'Automation workflow development with Make', 'Make');
add('n8n Certified Automation Expert', '', dev, 'Workflow automation with n8n', 'n8n');
add('Retool Certified Developer', '', dev, 'Internal tool development with Retool', 'Retool');
add('Bubble Certified Developer', '', dev, 'No-code application development with Bubble', 'Bubble');
add('WeWeb Certified Developer', '', dev, 'No-code frontend development with WeWeb', 'WeWeb');
add('Xano Certified Backend Developer', '', dev, 'No-code backend with Xano', 'Xano');
add('Certified Jenkins Engineer', 'CJE', dev, 'CI/CD automation with Jenkins', 'CloudBees');
add('CircleCI Certified Developer', '', dev, 'CI/CD with CircleCI', 'CircleCI');
add('Travis CI Certified Developer', '', dev, 'Continuous integration with Travis CI', 'Travis CI');
add('Bamboo Certified Administrator', '', dev, 'CI/CD with Atlassian Bamboo', 'Atlassian');
add('Azure DevOps Certified Professional', '', dev, 'DevOps practices with Azure DevOps', 'Microsoft');
add('ArgoCD Certified Associate', '', dev, 'GitOps continuous delivery with Argo CD', 'CNCF');
add('Flux Certified Associate', '', dev, 'GitOps with Flux', 'CNCF');
add('Spinnaker Certified Professional', '', dev, 'Continuous delivery with Spinnaker', 'Various');
add('LaunchDarkly Certified Professional', '', dev, 'Feature flag management with LaunchDarkly', 'LaunchDarkly');
add('Split.io Feature Flag Certification', '', dev, 'Feature management with Split.io', 'Split.io');
add('Cypress.io Certified Developer', '', dev, 'End-to-end testing with Cypress', 'Cypress.io');
add('Playwright Certified Tester', '', dev, 'Browser automation testing with Playwright', 'Microsoft');
add('Selenium Certified Professional', '', dev, 'Web browser automation testing with Selenium', 'Various');
add('Appium Certified Mobile Tester', '', dev, 'Mobile application testing with Appium', 'Various');
add('ISTQB Certified Tester Foundation Level', 'CTFL', dev, 'Software testing fundamentals', 'ISTQB');
add('ISTQB Certified Tester Advanced Level - Test Manager', 'CTAL-TM', dev, 'Software test management', 'ISTQB');
add('ISTQB Certified Tester Advanced Level - Test Analyst', 'CTAL-TA', dev, 'Software test analysis techniques', 'ISTQB');
add('ISTQB Certified Tester Advanced Level - Technical Test Analyst', 'CTAL-TTA', dev, 'Technical software testing', 'ISTQB');
add('ISTQB Agile Tester', '', dev, 'Agile software testing practices', 'ISTQB');
add('Certified Tester Advanced Level - Test Automation Engineer', 'CT-TAE', dev, 'Test automation engineering', 'ISTQB');
add('JMeter Certified Professional', '', dev, 'Performance testing with Apache JMeter', 'Various');
add('Gatling Certified Professional', '', dev, 'Load testing with Gatling', 'Gatling');
add('k6 Load Testing Certification', '', dev, 'Performance testing with k6', 'Grafana Labs');
add('Sauce Labs Certified Professional', '', dev, 'Cross-browser testing with Sauce Labs', 'Sauce Labs');
add('BrowserStack Certified Professional', '', dev, 'Cross-browser testing with BrowserStack', 'BrowserStack');
add('Sonatype Nexus Certified Professional', '', dev, 'Repository management with Sonatype Nexus', 'Sonatype');
add('JFrog Certified Professional', '', dev, 'Artifact management with JFrog Artifactory', 'JFrog');

// ═══════════════════════════════════════════════════
// AI & ML EXPANSION
// ═══════════════════════════════════════════════════
add('AWS Certified AI Practitioner (AIF-C01)', '', ai, 'AI foundations on AWS', 'Amazon Web Services');
add('Google Cloud Generative AI Certification', '', ai, 'Generative AI on Google Cloud', 'Google');
add('Microsoft Certified: Azure AI Services', '', ai, 'AI services deployment on Azure', 'Microsoft');
add('IBM watsonx Certified Professional', '', ai, 'AI development with IBM watsonx', 'IBM');
add('Anthropic Claude API Certification', '', ai, 'LLM application development with Anthropic Claude', 'Anthropic');
add('Cohere AI Developer Certification', '', ai, 'NLP and embeddings with Cohere', 'Cohere');
add('Stability AI Developer Certification', '', ai, 'Image generation with Stable Diffusion', 'Stability AI');
add('Midjourney Certified Creator', '', ai, 'AI image generation with Midjourney', 'Midjourney');
add('Runway ML Certified Creator', '', ai, 'AI video and image generation with Runway', 'Runway');
add('Replicate AI Developer Certification', '', ai, 'ML model deployment with Replicate', 'Replicate');
add('Modal Certified ML Engineer', '', ai, 'Serverless ML infrastructure with Modal', 'Modal');
add('Anyscale Ray Certified Developer', '', ai, 'Distributed computing with Ray', 'Anyscale');
add('MLflow Certified Professional', '', ai, 'ML lifecycle management with MLflow', 'Databricks');
add('Kubeflow Certified Developer', '', ai, 'ML pipelines on Kubernetes with Kubeflow', 'Various');
add('BentoML Certified Developer', '', ai, 'ML model serving with BentoML', 'BentoML');
add('Seldon Core Certified Professional', '', ai, 'ML model deployment with Seldon', 'Seldon');
add('Tecton Feature Store Certification', '', ai, 'Feature engineering with Tecton', 'Tecton');
add('Feast Feature Store Certification', '', ai, 'Feature serving with Feast', 'Various');
add('Label Studio Certified Professional', '', ai, 'Data labeling and annotation', 'HumanSignal');
add('Scale AI Data Annotation Certification', '', ai, 'AI training data management', 'Scale AI');
add('Roboflow Computer Vision Certification', '', ai, 'Computer vision model training with Roboflow', 'Roboflow');
add('Ultralytics YOLOv8 Certification', '', ai, 'Object detection with YOLO', 'Ultralytics');
add('spaCy NLP Certification', '', ai, 'Industrial NLP with spaCy', 'Explosion AI');
add('Rasa Certified Developer', '', ai, 'Conversational AI with Rasa', 'Rasa');
add('Dialogflow Certified Developer', '', ai, 'Conversational AI with Google Dialogflow', 'Google');
add('Amazon Lex Certified Developer', '', ai, 'Conversational AI with Amazon Lex', 'Amazon Web Services');
add('Microsoft Bot Framework Certified Developer', '', ai, 'Chatbot development with Bot Framework', 'Microsoft');
add('Voiceflow Certified Designer', '', ai, 'Voice and chat AI design with Voiceflow', 'Voiceflow');

// ═══════════════════════════════════════════════════
// MARKETING EXPANSION
// ═══════════════════════════════════════════════════
add('Bing Ads Certified Professional', '', mkt, 'Search advertising with Microsoft Advertising', 'Microsoft');
add('Amazon Advertising Certified', '', mkt, 'Advertising on Amazon marketplace', 'Amazon');
add('Amazon DSP Certification', '', mkt, 'Programmatic advertising with Amazon DSP', 'Amazon');
add('Snapchat Advertising Certification', '', mkt, 'Advertising on Snapchat platform', 'Snap Inc.');
add('Reddit Advertising Certification', '', mkt, 'Advertising on Reddit platform', 'Reddit');
add('Spotify Ad Studio Certification', '', mkt, 'Audio advertising on Spotify', 'Spotify');
add('Taboola Certified Professional', '', mkt, 'Native advertising with Taboola', 'Taboola');
add('Outbrain Certified Professional', '', mkt, 'Content discovery advertising with Outbrain', 'Outbrain');
add('The Trade Desk Edge Academy Certification', '', mkt, 'Programmatic advertising with The Trade Desk', 'The Trade Desk');
add('DV360 Certified Professional', '', mkt, 'Programmatic display with Google DV360', 'Google');
add('Campaign Manager 360 Certification', '', mkt, 'Ad serving and tracking with CM360', 'Google');
add('Search Ads 360 Certification', '', mkt, 'Cross-engine search management with SA360', 'Google');
add('Adobe Analytics Certified Professional', '', mkt, 'Web analytics with Adobe Analytics', 'Adobe');
add('Adobe Target Certified Professional', '', mkt, 'A/B testing and personalization with Adobe Target', 'Adobe');
add('Adobe Experience Platform Certified Expert', '', mkt, 'Customer data management with Adobe Experience Platform', 'Adobe');
add('Adobe Campaign Certified Professional', '', mkt, 'Cross-channel campaign management with Adobe', 'Adobe');
add('Adobe Journey Optimizer Certified Expert', '', mkt, 'Customer journey orchestration with Adobe', 'Adobe');
add('Sitecore Certified Professional Marketer', '', mkt, 'Digital experience with Sitecore', 'Sitecore');
add('Bloomreach Certified Professional', '', mkt, 'Commerce experience with Bloomreach', 'Bloomreach');
add('Iterable Certified Professional', '', mkt, 'Cross-channel marketing with Iterable', 'Iterable');
add('Customer.io Certified Professional', '', mkt, 'Messaging automation with Customer.io', 'Customer.io');
add('SendGrid Certified Professional', '', mkt, 'Email delivery with SendGrid', 'Twilio/SendGrid');
add('Zendesk Sell Certification', '', mkt, 'Sales CRM with Zendesk Sell', 'Zendesk');
add('Pipedrive Certified Professional', '', mkt, 'Sales pipeline management with Pipedrive', 'Pipedrive');
add('Zoho CRM Certified Professional', '', mkt, 'CRM management with Zoho CRM', 'Zoho');
add('SugarCRM Certified Professional', '', mkt, 'CRM with SugarCRM', 'SugarCRM');
add('Freshsales Certified Professional', '', mkt, 'Sales CRM with Freshsales', 'Freshworks');
add('Outreach.io Certified Professional', '', mkt, 'Sales engagement with Outreach', 'Outreach');
add('Salesloft Certified Professional', '', mkt, 'Sales engagement with Salesloft', 'Salesloft');
add('Gong Certified Professional', '', mkt, 'Revenue intelligence with Gong', 'Gong');
add('Chorus.ai Certified Professional', '', mkt, 'Conversation intelligence with Chorus/ZoomInfo', 'ZoomInfo');
add('ZoomInfo Certified Professional', '', mkt, 'Sales intelligence with ZoomInfo', 'ZoomInfo');
add('6sense Certified Professional', '', mkt, 'Account-based marketing with 6sense', '6sense');
add('Demandbase Certified Professional', '', mkt, 'Account-based marketing with Demandbase', 'Demandbase');
add('Drift Certified Professional', '', mkt, 'Conversational marketing with Drift', 'Salesloft/Drift');
add('Intercom Certified Professional', '', mkt, 'Customer messaging with Intercom', 'Intercom');
add('Qualified Certified Professional', '', mkt, 'Pipeline generation with Qualified', 'Qualified');
add('Unbounce Certified Expert', '', mkt, 'Landing page optimization with Unbounce', 'Unbounce');
add('Instapage Certified Professional', '', mkt, 'Landing page creation with Instapage', 'Instapage');
add('ConvertKit Certified Creator', '', mkt, 'Creator marketing with ConvertKit', 'ConvertKit');
add('Drip Certified Professional', '', mkt, 'E-commerce email marketing with Drip', 'Drip');
add('Omnisend Certified Professional', '', mkt, 'E-commerce marketing automation with Omnisend', 'Omnisend');
add('Attentive Certified Professional', '', mkt, 'SMS marketing with Attentive', 'Attentive');
add('Postscript SMS Marketing Certification', '', mkt, 'E-commerce SMS marketing with Postscript', 'Postscript');
add('Ahrefs Certified Professional', '', mkt, 'SEO tools and analysis with Ahrefs', 'Ahrefs');
add('Screaming Frog Certified Professional', '', mkt, 'Technical SEO crawling and analysis', 'Screaming Frog');
add('Conductor Certified Professional', '', mkt, 'Enterprise SEO with Conductor', 'Conductor');
add('BrightEdge Certified Professional', '', mkt, 'Enterprise SEO with BrightEdge', 'BrightEdge');
add('Bazaarvoice Certified Professional', '', mkt, 'User-generated content and reviews', 'Bazaarvoice');
add('Yotpo Certified Professional', '', mkt, 'E-commerce marketing with Yotpo', 'Yotpo');
add('Trustpilot Certified Professional', '', mkt, 'Review management with Trustpilot', 'Trustpilot');
add('Later Social Media Certification', '', mkt, 'Social media scheduling with Later', 'Later');
add('Buffer Certified Professional', '', mkt, 'Social media management with Buffer', 'Buffer');
add('Agorapulse Certified Professional', '', mkt, 'Social media management with Agorapulse', 'Agorapulse');
add('Khoros Certified Professional', '', mkt, 'Enterprise social media management with Khoros', 'Khoros');
add('Sprinklr Certified Professional', '', mkt, 'Unified CXM with Sprinklr', 'Sprinklr');
add('Emplifi Certified Professional', '', mkt, 'Social media analytics with Emplifi', 'Emplifi');
add('Mention Certified Professional', '', mkt, 'Social listening with Mention', 'Mention');
add('Brandwatch Certified Professional', '', mkt, 'Social intelligence with Brandwatch', 'Brandwatch');

// ═══════════════════════════════════════════════════
// HEALTHCARE EXPANSION
// ═══════════════════════════════════════════════════
add('Certified Medical Assistant', 'CMA', health, 'Medical assisting competencies', 'AAMA');
add('Registered Medical Assistant', 'RMA', health, 'Medical assistant registration', 'AMT');
add('National Certified Medical Assistant', 'NCMA', health, 'National medical assistant certification', 'NCCT');
add('Certified Surgical Technologist', 'CST', health, 'Surgical technology and sterile technique', 'NBSTSA');
add('Certified Nurse Practitioner', 'CNP', health, 'Advanced practice nursing', 'AANP');
add('Certified Registered Nurse Anesthetist', 'CRNA', health, 'Nurse anesthesia practice', 'NBCRNA');
add('Certified Nurse Midwife', 'CNM', health, 'Nurse midwifery practice', 'AMCB');
add('Clinical Nurse Specialist', 'CNS', health, 'Advanced clinical nursing practice', 'ANCC');
add('Certified Pediatric Nurse', 'CPN', health, 'Pediatric nursing specialty', 'PNCB');
add('Certified Emergency Nurse', 'CEN', health, 'Emergency nursing practice', 'BCEN');
add('Certified Critical Care Nurse', 'CCRN', health, 'Critical care nursing', 'AACN');
add('Certified Perioperative Nurse', 'CNOR', health, 'Perioperative nursing practice', 'CCI');
add('Certified Medical-Surgical Registered Nurse', 'CMSRN', health, 'Medical-surgical nursing', 'AMSN');
add('Certified Wound Care Nurse', 'CWCN', health, 'Wound care management', 'WOCNCB');
add('Certified Diabetes Educator', 'CDE', health, 'Diabetes patient education', 'NCBDE');
add('Certified Oncology Nurse', 'OCN', health, 'Oncology nursing practice', 'ONCC');
add('Certified Rehabilitation Registered Nurse', 'CRRN', health, 'Rehabilitation nursing', 'ARN');
add('Certified Infection Preventionist', 'CIC', health, 'Infection prevention and control', 'CBIC');
add('Certified Nursing Home Administrator', 'CNHA', health, 'Long-term care facility administration', 'NAB');
add('Fellow of the American College of Healthcare Executives', 'FACHE', health, 'Healthcare leadership and management', 'ACHE');
add('Certified Healthcare Access Associate', 'CHAA', health, 'Patient access and registration', 'NAHAM');
add('Certified Healthcare Access Manager', 'CHAM', health, 'Healthcare access management', 'NAHAM');
add('Certified Healthcare Constructor', 'CHC', health, 'Healthcare construction project management', 'AHA');
add('Certified Healthcare Environmental Services Technician', 'CHEST', health, 'Healthcare facility environmental services', 'AHE');
add('Certified Healthcare Facility Manager', 'CHFM', health, 'Healthcare facility management', 'AHA');
add('Certified Medical Dosimetrist', 'CMD', health, 'Radiation therapy dosimetry', 'MDCB');
add('Registered Respiratory Therapist', 'RRT', health, 'Respiratory care and therapy', 'NBRC');
add('Certified Respiratory Therapist', 'CRT', health, 'Respiratory therapy fundamentals', 'NBRC');
add('Registered Diagnostic Medical Sonographer', 'RDMS', health, 'Diagnostic ultrasound imaging', 'ARDMS');
add('Registered Radiographer', 'RT(R)', health, 'Radiographic imaging procedures', 'ARRT');
add('Registered Vascular Technologist', 'RVT', health, 'Vascular ultrasound imaging', 'ARDMS');
add('Nuclear Medicine Technologist Certified', 'CNMT', health, 'Nuclear medicine imaging procedures', 'NMTCB');
add('Certified Polysomnographic Technologist', 'CPSGT', health, 'Sleep study technology', 'BRPT');
add('Certified Orthotist', 'CO', health, 'Orthotic device design and fitting', 'ABC');
add('Certified Prosthetist', 'CP', health, 'Prosthetic device design and fitting', 'ABC');
add('Certified Athletic Trainer', 'ATC', health, 'Athletic training and sports medicine', 'BOC');
add('Certified Strength and Conditioning Specialist', 'CSCS', health, 'Strength training program design', 'NSCA');
add('National Certified Counselor', 'NCC', health, 'Professional counseling practice', 'NBCC');
add('Licensed Clinical Social Worker', 'LCSW', health, 'Clinical social work practice', 'State Boards');
add('Certified Social Work Case Manager', 'C-SWCM', health, 'Social work case management', 'NASW');
add('Certified Health Informatics Systems Professional', 'CHISP', health, 'Health informatics systems', 'Various');
add('Meditech Certified Professional', '', health, 'Meditech EHR system management', 'Meditech');
add('Allscripts Certified Professional', '', health, 'Allscripts EHR administration', 'Allscripts');
add('athenahealth Certified Professional', '', health, 'athenahealth practice management', 'athenahealth');

// ═══════════════════════════════════════════════════
// FINANCE EXPANSION
// ═══════════════════════════════════════════════════
add('Certified Financial Services Auditor', 'CFSA', fin, 'Financial services internal auditing', 'Institute of Internal Auditors');
add('Certificate in Investment Performance Measurement', 'CIPM', fin, 'Investment performance evaluation', 'CFA Institute');
add('Certified Credit Union Financial Counselor', 'CCUFC', fin, 'Credit union financial counseling', 'CUNA');
add('Certified Retirement Counselor', 'CRC', fin, 'Retirement planning counseling', 'InFRE');
add('Retirement Income Certified Professional', 'RICP', fin, 'Retirement income planning', 'The American College');
add('Certified Plan Fiduciary Advisor', 'CPFA', fin, 'Retirement plan fiduciary advisory', 'NAPA');
add('Chartered Retirement Planning Counselor', 'CRPC', fin, 'Retirement planning strategies', 'College for Financial Planning');
add('Chartered Mutual Fund Counselor', 'CMFC', fin, 'Mutual fund advisory services', 'College for Financial Planning');
add('Chartered Market Technician', 'CMT', fin, 'Technical analysis of financial markets', 'CMT Association');
add('Certified Merger & Acquisition Advisor', 'CM&AA', fin, 'Mergers and acquisitions advisory', 'AM&AA');
add('Accredited Senior Appraiser', 'ASA', fin, 'Business and personal property appraisal', 'ASA');
add('Master Analyst in Financial Forensics', 'MAFF', fin, 'Financial forensics and litigation support', 'NACVA');
add('Certified Turnaround Professional', 'CTP', fin, 'Corporate restructuring and turnaround management', 'TMA');
add('Chartered SRI Counselor', 'CSRIC', fin, 'Sustainable responsible impact investing', 'College for Financial Planning');
add('Certified ESG Analyst', 'CESGA', fin, 'Environmental social governance analysis', 'EFFAS');
add('Fundamentals of Sustainability Accounting', 'FSA', fin, 'Sustainability accounting standards', 'SASB');
add('Global Association of Risk Professionals Energy Risk Professional', 'ERP', fin, 'Energy sector risk management', 'GARP');
add('Sustainability and Climate Risk Certificate', 'SCR', fin, 'Climate risk in financial services', 'GARP');
add('Certified Commercial Investment Member', 'CCIM', fin, 'Commercial real estate investment', 'CCIM Institute');
add('Certified Property Manager', 'CPM', fin, 'Real estate property management', 'IREM');
add('Accredited Residential Manager', 'ARM', fin, 'Residential property management', 'IREM');
add('Certified International Property Specialist', 'CIPS', fin, 'International real estate transactions', 'NAR');
add('Certified Residential Specialist', 'CRS', fin, 'Residential real estate expertise', 'RRC');
add('Accredited Buyer Representative', 'ABR', fin, 'Buyer representation in real estate', 'REBAC');
add('Certified Commercial Advisor', 'CCAL', fin, 'Commercial real estate advisory', 'NAR');
add('Society of Actuaries Associate', 'ASA', fin, 'Actuarial science associate level', 'Society of Actuaries');
add('Society of Actuaries Fellow', 'FSA', fin, 'Actuarial science fellow level', 'Society of Actuaries');
add('Casualty Actuarial Society Associate', 'ACAS', fin, 'Property/casualty actuarial science', 'CAS');
add('Casualty Actuarial Society Fellow', 'FCAS', fin, 'Advanced property/casualty actuarial science', 'CAS');
add('Chartered Property Casualty Underwriter', 'CPCU', fin, 'Property and casualty insurance', 'The Institutes');
add('Associate in Risk Management', 'ARM', fin, 'Risk management fundamentals', 'The Institutes');
add('Associate in Claims', 'AIC', fin, 'Insurance claims handling', 'The Institutes');
add('Associate in Underwriting', 'AU', fin, 'Insurance underwriting', 'The Institutes');
add('Certified Insurance Counselor', 'CIC', fin, 'Insurance coverage and risk management', 'National Alliance');
add('Certified Risk Manager', 'CRM', fin, 'Enterprise risk management', 'National Alliance');

// ═══════════════════════════════════════════════════
// HR EXPANSION
// ═══════════════════════════════════════════════════
add('Certified Professional Resume Writer', 'CPRW', hr, 'Professional resume writing', 'PARW/CC');
add('Certified Career Counselor', 'CCC', hr, 'Career counseling and coaching', 'NCDA');
add('Global Career Development Facilitator', 'GCDF', hr, 'Career development facilitation', 'CCE');
add('Certified Staffing Professional', 'CSP', hr, 'Staffing industry practices', 'ASA');
add('Certified Search Consultant', 'CSC', hr, 'Executive search and recruiting', 'ASA');
add('Certified Temporary Staffing Specialist', 'CTS', hr, 'Temporary staffing management', 'ASA');
add('Certified Personnel Consultant', 'CPC', hr, 'Personnel consulting and placement', 'NAPS');
add('Total Rewards Certified Professional', '', hr, 'Total rewards strategy and design', 'WorldatWork');
add('Certified Equity Professional', 'CEP', hr, 'Stock plan administration', 'CEP Institute');
add('Certified Executive Compensation Professional', 'CECP', hr, 'Executive compensation design', 'WorldatWork');
add('Certified Workforce Planning Professional', '', hr, 'Strategic workforce planning', 'Various');
add('People Analytics Certification', '', hr, 'HR data analytics and workforce insights', 'Wharton/Various');
add('Culture Amp Certified Professional', '', hr, 'Employee engagement analytics with Culture Amp', 'Culture Amp');
add('Lattice Certified Professional', '', hr, 'Performance management with Lattice', 'Lattice');
add('15Five Certified Professional', '', hr, 'Performance management with 15Five', '15Five');
add('Betterworks Certified Professional', '', hr, 'OKR and performance management with Betterworks', 'Betterworks');
add('Greenhouse Certified Professional', '', hr, 'Recruitment with Greenhouse ATS', 'Greenhouse');
add('Lever Certified Professional', '', hr, 'Talent acquisition with Lever', 'Lever');
add('iCIMS Certified Professional', '', hr, 'Talent acquisition with iCIMS', 'iCIMS');
add('SmartRecruiters Certified Professional', '', hr, 'Hiring success with SmartRecruiters', 'SmartRecruiters');
add('Jobvite Certified Professional', '', hr, 'Recruitment automation with Jobvite', 'Jobvite');
add('Phenom Certified Professional', '', hr, 'Talent experience with Phenom', 'Phenom');
add('Eightfold Certified Professional', '', hr, 'AI talent intelligence with Eightfold', 'Eightfold');
add('Visier Certified People Analytics Professional', '', hr, 'People analytics with Visier', 'Visier');
add('Dayforce Certified Professional', '', hr, 'HCM with Ceridian Dayforce', 'Ceridian');
add('Paychex Certified Professional', '', hr, 'Payroll and HR with Paychex', 'Paychex');
add('Paycom Certified Professional', '', hr, 'HR technology with Paycom', 'Paycom');
add('Paylocity Certified Professional', '', hr, 'HR and payroll with Paylocity', 'Paylocity');
add('Gusto Certified Professional', '', hr, 'Small business HR and payroll with Gusto', 'Gusto');
add('Rippling Certified Professional', '', hr, 'HR platform management with Rippling', 'Rippling');

// ═══════════════════════════════════════════════════
// TRADES EXPANSION
// ═══════════════════════════════════════════════════
add('Certified Professional Constructor', 'CPC', trades, 'Construction management and supervision', 'AIC');
add('Construction Manager Certification', 'CCM', trades, 'Construction project management', 'CMAA');
add('Design-Build Professional', 'DBIA', trades, 'Design-build project delivery', 'DBIA');
add('LEED AP Building Design + Construction', 'LEED AP BD+C', trades, 'Green building design and construction', 'USGBC');
add('LEED AP Operations + Maintenance', 'LEED AP O+M', trades, 'Green building operations and maintenance', 'USGBC');
add('LEED AP Interior Design + Construction', 'LEED AP ID+C', trades, 'Green interior design and construction', 'USGBC');
add('LEED AP Neighborhood Development', 'LEED AP ND', trades, 'Green neighborhood development', 'USGBC');
add('WELL Accredited Professional', 'WELL AP', trades, 'WELL Building Standard implementation', 'IWBI');
add('Fitwel Ambassador', '', trades, 'Healthy building certification with Fitwel', 'CfAD');
add('Passive House Certified Designer', 'CPHD', trades, 'Passive house energy-efficient design', 'PHI');
add('Certified Home Inspector', 'CHI', trades, 'Residential property inspection', 'ASHI');
add('Certified Commercial Property Inspector', 'CCPI', trades, 'Commercial building inspection', 'InterNACHI');
add('Certified Home Energy Rater', 'HERS', trades, 'Home energy rating and assessment', 'RESNET');
add('Certified Mold Inspector', 'CMI', trades, 'Mold inspection and assessment', 'ACAC');
add('Certified Indoor Air Quality Professional', 'CIAQP', trades, 'Indoor air quality assessment', 'ACAC');
add('Radon Measurement Professional', '', trades, 'Radon testing and measurement', 'NRPP');
add('Lead Inspector/Risk Assessor', '', trades, 'Lead paint inspection and risk assessment', 'EPA');
add('Asbestos Inspector Certification', '', trades, 'Asbestos inspection and assessment', 'EPA');
add('Underground Storage Tank Operator', '', trades, 'UST operation and compliance', 'EPA');
add('Certified Elevator Technician', 'CET', trades, 'Elevator installation and maintenance', 'NAEC');
add('National Certified Locksmith', 'NCL', trades, 'Locksmithing and security hardware', 'ALOA');
add('Certified Master Locksmith', 'CML', trades, 'Advanced locksmithing and security', 'ALOA');
add('National Institute for Automotive Service Excellence', 'ASE', trades, 'Automotive service and repair', 'ASE');
add('ASE Certified - Collision Repair', 'B-Series', trades, 'Automotive collision repair', 'ASE');
add('ASE Certified - Medium/Heavy Truck', 'T-Series', trades, 'Heavy truck maintenance', 'ASE');
add('Universal Refrigerant Certification', '', trades, 'All types of refrigerant handling', 'EPA');
add('BPI Building Analyst Professional', 'BA', trades, 'Whole-home energy assessment', 'BPI');
add('BPI Envelope Professional', 'EP', trades, 'Building envelope analysis and improvement', 'BPI');
add('NABCEP PV Installation Professional', 'PVIP', trades, 'Solar photovoltaic installation', 'NABCEP');
add('NABCEP PV Design Specialist', 'PVDS', trades, 'Solar PV system design', 'NABCEP');
add('NABCEP Solar Heating Installer', '', trades, 'Solar thermal system installation', 'NABCEP');
add('NABCEP PV Technical Sales', '', trades, 'Solar PV technical sales', 'NABCEP');
add('Wind Energy Technician Certificate', '', trades, 'Wind turbine installation and maintenance', 'Various');
add('Certified Energy Procurement Professional', 'CEP', trades, 'Energy procurement and management', 'AEE');
add('Certified Power Quality Professional', 'CPQ', trades, 'Electrical power quality analysis', 'AEE');
add('Certified Lighting Efficiency Professional', 'CLEP', trades, 'Lighting energy efficiency', 'AEE');
add('Certified Measurement and Verification Professional', 'CMVP', trades, 'Energy savings measurement', 'AEE/EVO');
add('Master Gardener Certification', '', trades, 'Horticulture and gardening expertise', 'Extension Services');
add('Certified Irrigation Designer', 'CID', trades, 'Irrigation system design', 'Irrigation Association');
add('Certified Irrigation Contractor', 'CIC', trades, 'Irrigation system installation', 'Irrigation Association');
add('Water Efficiency Certified Professional', 'WECP', trades, 'Water efficiency and conservation', 'Irrigation Association');
add('Certified Pool/Spa Inspector', 'CPI', trades, 'Pool and spa safety inspection', 'Various');
add('Certified Professional Food Manager', 'CPFM', trades, 'Food service management and safety', 'Various');
add('Certified Food Protection Professional', 'CFPP', trades, 'Dietary food service safety', 'ANFP');
add('National Registry of Food Safety Professionals', 'NRFSP', trades, 'Food safety training and certification', 'NRFSP');
add('DOT Hazmat Employee Training', '', trades, 'DOT hazardous materials handling', 'DOT');
add('RCRA Hazardous Waste Management', '', trades, 'RCRA hazardous waste compliance', 'EPA');
add('Confined Space Entry Certification', '', trades, 'Confined space safety procedures', 'OSHA/Various');
add('Fall Protection Competent Person', '', trades, 'Fall protection system design and inspection', 'OSHA/Various');
add('Scaffold Competent Person', '', trades, 'Scaffold erection and inspection', 'OSHA/Various');
add('Trench Safety Competent Person', '', trades, 'Excavation and trench safety', 'OSHA/Various');
add('Aerial Lift Operator Certification', '', trades, 'Aerial work platform operation', 'OSHA/Various');
add('Scissor Lift Operator Certification', '', trades, 'Scissor lift operation', 'OSHA/Various');
add('Boom Lift Operator Certification', '', trades, 'Boom lift operation', 'OSHA/Various');
add('Telehandler Operator Certification', '', trades, 'Telehandler equipment operation', 'OSHA/Various');
add('Skid Steer Operator Certification', '', trades, 'Skid steer loader operation', 'Various');
add('Excavator Operator Certification', '', trades, 'Excavator equipment operation', 'Various');
add('Backhoe Operator Certification', '', trades, 'Backhoe equipment operation', 'Various');
add('Bulldozer Operator Certification', '', trades, 'Bulldozer equipment operation', 'Various');
add('Certified Flagger', '', trades, 'Traffic control flagging operations', 'ATSSA');
add('Traffic Control Technician', 'TCT', trades, 'Traffic control device installation', 'ATSSA');
add('Certified Traffic Control Supervisor', 'CTCS', trades, 'Traffic control supervision', 'ATSSA');

// ═══════════════════════════════════════════════════
// QUALITY & MANUFACTURING EXPANSION
// ═══════════════════════════════════════════════════
add('Certified Quality Technician', 'CQT', quality, 'Quality control technical skills', 'ASQ');
add('Certified Software Quality Engineer', 'CSQE', quality, 'Software quality engineering', 'ASQ');
add('Lean Certification', '', quality, 'Lean manufacturing principles', 'Various');
add('Lean Bronze Certification', '', quality, 'Foundational lean management', 'SME/AME/Shingo');
add('Lean Silver Certification', '', quality, 'Intermediate lean management', 'SME/AME/Shingo');
add('Lean Gold Certification', '', quality, 'Advanced lean enterprise management', 'SME/AME/Shingo');
add('Toyota Production System Certified', '', quality, 'Toyota production system principles', 'Toyota');
add('Theory of Constraints Certified', 'TOCCP', quality, 'Theory of constraints management', 'TOCICO');
add('Value Stream Mapping Certification', '', quality, 'Value stream analysis and improvement', 'Various');
add('Total Productive Maintenance Certified', 'TPM', quality, 'Equipment maintenance and reliability', 'Various');
add('5S Workplace Organization Certification', '', quality, 'Workplace organization methodology', 'Various');
add('Kaizen Certified Professional', '', quality, 'Continuous improvement methodology', 'Various');
add('Statistical Process Control Certification', 'SPC', quality, 'Statistical quality control methods', 'Various');
add('Measurement Systems Analysis Certification', 'MSA', quality, 'Measurement system evaluation', 'Various');
add('Failure Mode and Effects Analysis Certification', 'FMEA', quality, 'FMEA risk analysis methodology', 'Various');
add('Design for Six Sigma Certification', 'DFSS', quality, 'Six Sigma applied to product design', 'Various');
add('Advanced Product Quality Planning Certification', 'APQP', quality, 'Quality planning for automotive/manufacturing', 'AIAG');
add('Production Part Approval Process Certification', 'PPAP', quality, 'Part approval for production', 'AIAG');
add('Certified Food Scientist', 'CFS', quality, 'Food science and technology', 'IFT');
add('SQF Practitioner', '', quality, 'Safe Quality Food program management', 'SQFI');
add('BRCGS Food Safety Certification', '', quality, 'BRC Global Standard for food safety', 'BRCGS');
add('FSSC 22000 Lead Auditor', '', quality, 'Food safety system certification auditing', 'FSSC');
add('Certified Process Professional', 'CPP', quality, 'Business process management and improvement', 'ABPMP');
add('Certified Business Process Associate', 'CBPA', quality, 'Business process fundamentals', 'ABPMP');
add('Certified Business Process Professional', 'CBPP', quality, 'Advanced business process management', 'ABPMP');
add('EPC Certified Supply Chain Professional', '', quality, 'Supply chain operations with EPC', 'Various');
add('Warehousing Education and Research Council Certification', '', quality, 'Warehouse management and logistics', 'WERC');
add('Certified Professional in Distribution and Warehousing', 'CPDW', quality, 'Distribution and warehousing management', 'Various');
add('Certified Customs Specialist', 'CCS', quality, 'Customs and trade compliance', 'NCBFAA');
add('Certified Export Specialist', 'CES', quality, 'Export compliance and procedures', 'NCBFAA');
add('Hazardous Materials Transportation Certification', '', quality, 'Hazmat transportation compliance', 'DOT');

// ═══════════════════════════════════════════════════
// BUSINESS & MANAGEMENT EXPANSION
// ═══════════════════════════════════════════════════
add('Certified Professional in Organizational Development', 'CPOD', biz, 'Organization development strategy and practices', 'Various');
add('Organization Development Certified Professional', 'ODCP', biz, 'OD consulting and intervention', 'IOD');
add('Certified Agile Coach', 'CAC', biz, 'Professional agile coaching', 'ICAgile');
add('Certified Enterprise Coach', 'CEC', biz, 'Enterprise-level agile coaching', 'Scrum Alliance');
add('Certified Team Coach', 'CTC', biz, 'Agile team coaching', 'Scrum Alliance');
add('Certified LeSS Practitioner', 'CLP', biz, 'Large-Scale Scrum practices', 'LeSS Company');
add('Certified Nexus Practitioner', '', biz, 'Scaling Scrum with Nexus framework', 'Scrum.org');
add('Management 3.0 Certified Facilitator', '', biz, 'Modern management practices', 'Management 3.0');
add('Certified Professional in Stakeholder Management', '', biz, 'Stakeholder engagement and management', 'Various');
add('Design Sprint Certified Facilitator', '', biz, 'Google Ventures design sprint facilitation', 'Various');
add('Jobs-to-be-Done Certified Practitioner', '', biz, 'Innovation using JTBD framework', 'Various');
add('Lean Startup Certified', '', biz, 'Lean startup methodology', 'Various');
add('Business Model Canvas Certified Practitioner', '', biz, 'Business model design and innovation', 'Strategyzer');
add('Value Proposition Design Certified', '', biz, 'Value proposition canvas methodology', 'Strategyzer');
add('Certified Professional Innovator', 'CPI', biz, 'Systematic innovation management', 'IAOIP');
add('TRIZ Certified Practitioner', '', biz, 'Theory of inventive problem solving', 'MATRIZ');
add('Certified M&A Integration Professional', '', biz, 'Post-merger integration management', 'Various');
add('Certified Due Diligence Professional', '', biz, 'M&A due diligence processes', 'Various');
add('Certified Corporate Director', 'ICD.D', biz, 'Corporate board governance', 'ICD');
add('National Association of Corporate Directors Board Leadership Fellow', '', biz, 'Board leadership and governance', 'NACD');
add('Certified Executive Leader', '', biz, 'Executive leadership development', 'Various');
add('Certified Emotional Intelligence Practitioner', '', biz, 'Emotional intelligence in leadership', 'Various');
add('DISC Certified Practitioner', '', biz, 'DISC behavioral assessment facilitation', 'Various');
add('Myers-Briggs Type Indicator Certified Practitioner', 'MBTI', biz, 'MBTI personality assessment facilitation', 'The Myers-Briggs Company');
add('CliftonStrengths Certified Coach', '', biz, 'Strengths-based coaching with Gallup', 'Gallup');
add('Hogan Assessment Certified', '', biz, 'Hogan personality assessment interpretation', 'Hogan Assessments');
add('Predictive Index Certified Partner', '', biz, 'PI behavioral and cognitive assessment', 'Predictive Index');
add('StrengthsFinder Certified Coach', '', biz, 'Strengths-based development coaching', 'Gallup');
add('Certified Professional in Catering and Events', 'CPCE', biz, 'Catering and event management', 'NACE');
add('Certified Venue Professional', 'CVP', biz, 'Venue management and operations', 'IAVM');
add('Certified Festival and Events Executive', 'CFEE', biz, 'Festival and event management', 'IFEA');
add('Certified Sports Event Executive', 'CSEE', biz, 'Sports event management', 'NASC');
add('Certified Destination Management Executive', 'CDME', biz, 'Destination management and tourism', 'DMAI');
add('Certified Travel Associate', 'CTA', biz, 'Travel industry professional', 'The Travel Institute');
add('Certified Travel Counselor', 'CTC', biz, 'Advanced travel counseling', 'The Travel Institute');
add('Sustainable Tourism Certified', '', biz, 'Sustainable tourism practices', 'GSTC');

// ═══════════════════════════════════════════════════
// LEGAL & COMPLIANCE EXPANSION
// ═══════════════════════════════════════════════════
add('Certified Regulatory Affairs Professional', 'RAC', legal, 'Regulatory affairs in healthcare/life sciences', 'RAPS');
add('Certified Clinical Research Coordinator', 'CCRC', legal, 'Clinical research regulatory compliance', 'ACRP');
add('Certified IRB Professional', 'CIP', legal, 'Institutional review board management', 'PRIM&R');
add('Certified Medical Device Regulatory Affairs', '', legal, 'Medical device regulatory compliance', 'RAPS');
add('Certified Government Contracts Professional', 'CGCP', legal, 'Government contract compliance', 'Various');
add('Certified Federal Specialist', 'CFS', legal, 'Federal regulation specialist', 'Various');
add('Anti-Bribery Management System Lead Auditor', '', legal, 'ISO 37001 anti-bribery compliance auditing', 'Various');
add('SOX Compliance Certification', '', legal, 'Sarbanes-Oxley Act compliance', 'Various');
add('FERPA Compliance Certification', '', legal, 'Family Educational Rights and Privacy Act compliance', 'Various');
add('ADA Compliance Certification', '', legal, 'Americans with Disabilities Act compliance', 'Various');
add('PCI DSS Qualified Security Assessor', 'QSA', legal, 'Payment card industry security assessment', 'PCI SSC');
add('PCI DSS Internal Security Assessor', 'ISA', legal, 'Internal PCI DSS security assessment', 'PCI SSC');
add('PCI Professional', 'PCIP', legal, 'Payment card industry professional', 'PCI SSC');
add('Certified Third Party Risk Professional', 'CTPRP', legal, 'Third party risk management', 'Shared Assessments');
add('Vendor Risk Management Certification', '', legal, 'Vendor and supplier risk management', 'Various');
add('Certified Ethics and Compliance Professional', 'CECP', legal, 'Ethics program management', 'Various');
add('Certified Whistleblower Management Professional', '', legal, 'Whistleblower program management', 'Various');
add('Certified Sustainability Reporting Professional', '', legal, 'ESG and sustainability reporting', 'GRI');
add('GRI Certified Sustainability Professional', '', legal, 'GRI Standards sustainability reporting', 'GRI');
add('SASB FSA Credential', 'FSA', legal, 'Sustainability accounting standards', 'IFRS/SASB');
add('CDP Certified Reporter', '', legal, 'Environmental disclosure reporting', 'CDP');
add('ISO 37301 Compliance Management Lead Auditor', '', legal, 'Compliance management system auditing', 'Various');

// ═══════════════════════════════════════════════════
// EDUCATION EXPANSION
// ═══════════════════════════════════════════════════
add('Certified Online Course Creator', '', edu, 'Online course design and development', 'Various');
add('Certified Learning Experience Designer', '', edu, 'Learning experience design methodology', 'Various');
add('Certified Micro-Learning Designer', '', edu, 'Microlearning content design', 'Various');
add('Certified Gamification Designer', '', edu, 'Gamification in education and training', 'Various');
add('Certified Virtual Classroom Trainer', '', edu, 'Virtual classroom facilitation', 'Various');
add('Adobe Captivate Prime Certified', '', edu, 'LMS management with Adobe Captivate Prime', 'Adobe');
add('Docebo Certified LMS Administrator', '', edu, 'Learning management with Docebo', 'Docebo');
add('Cornerstone OnDemand Certified Administrator', '', edu, 'Learning and talent management with Cornerstone', 'Cornerstone');
add('SAP Litmos Certified Administrator', '', edu, 'LMS management with SAP Litmos', 'SAP');
add('Absorb LMS Certified Administrator', '', edu, 'Learning management with Absorb LMS', 'Absorb');
add('TalentLMS Certified Administrator', '', edu, 'LMS management with TalentLMS', 'Epignosis');
add('Thinkific Certified Course Creator', '', edu, 'Online course creation with Thinkific', 'Thinkific');
add('Teachable Certified Course Creator', '', edu, 'Online course creation with Teachable', 'Teachable');
add('Kajabi Certified Partner', '', edu, 'Online business with Kajabi', 'Kajabi');
add('LearnDash Certified Developer', '', edu, 'WordPress LMS development with LearnDash', 'LearnDash');
add('Certified Facilitator of Training', '', edu, 'Professional training facilitation', 'Langevin');
add('Master Trainer Certification', '', edu, 'Advanced training program design and delivery', 'Bob Pike Group');
add('Certified ROI Professional', 'CRP', edu, 'Training program ROI measurement', 'ROI Institute');
add('Success Case Method Certified', '', edu, 'Training impact evaluation methodology', 'Various');
add('Certified Simulation and Game Facilitator', '', edu, 'Simulation-based learning facilitation', 'Various');
add('VR/AR Learning Design Certification', '', edu, 'Immersive learning design with VR/AR', 'Various');

// ═══════════════════════════════════════════════════
// DESIGN EXPANSION
// ═══════════════════════════════════════════════════
add('Certified Professional in UX Design', '', design, 'User experience design methodology', 'Various');
add('Certified Information Architect', '', design, 'Information architecture for digital products', 'Various');
add('Certified Service Designer', '', design, 'Service design methodology and practice', 'Various');
add('Certified Product Designer', '', design, 'Digital product design', 'Various');
add('Framer Certified Developer', '', design, 'Interactive prototyping with Framer', 'Framer');
add('ProtoPie Certified Interaction Designer', '', design, 'Advanced prototyping with ProtoPie', 'ProtoPie');
add('Axure Certified Professional', '', design, 'Wireframing and prototyping with Axure', 'Axure');
add('Balsamiq Certified Designer', '', design, 'Rapid wireframing with Balsamiq', 'Balsamiq');
add('Miro Certified Consultant', '', design, 'Visual collaboration with Miro', 'Miro');
add('Mural Certified Consultant', '', design, 'Visual collaboration with Mural', 'Mural');
add('Procreate Certified Artist', '', design, 'Digital illustration with Procreate', 'Savage Interactive');
add('Affinity Designer Certified Professional', '', design, 'Vector design with Affinity Designer', 'Serif');
add('Affinity Photo Certified Professional', '', design, 'Photo editing with Affinity Photo', 'Serif');
add('CorelDRAW Certified Professional', '', design, 'Graphic design with CorelDRAW', 'Corel');
add('CATIA Certified Professional', '', design, '3D design with Dassault CATIA', 'Dassault Systèmes');
add('NX Certified Professional', '', design, '3D design with Siemens NX', 'Siemens');
add('Certified Color Management Professional', '', design, 'Color management in print and digital', 'Various');
add('Certified Typography Professional', '', design, 'Typography design principles', 'Various');
add('Certified Motion Designer', '', design, 'Motion graphics design', 'Various');
add('Houdini Certified Artist', '', design, 'Visual effects with SideFX Houdini', 'SideFX');
add('Nuke Certified Artist', '', design, 'Visual effects compositing with Nuke', 'Foundry');
add('Certified 3D Printing Specialist', '', design, 'Additive manufacturing and 3D printing design', 'Various');
add('Pantone Certified Color Specialist', '', design, 'Color specification and matching', 'Pantone');
add('Certified Packaging Designer', '', design, 'Product packaging design', 'Various');
add('Certified Environmental Graphic Designer', '', design, 'Environmental and wayfinding design', 'SEGD');
add('Certified Brand Identity Designer', '', design, 'Brand identity system design', 'Various');

// ═══════════════════════════════════════════════════
// GENERAL EXPANSION
// ═══════════════════════════════════════════════════
add('Certified Drone Pilot', '', gen, 'Commercial drone operation', 'FAA');
add('FAA Part 107 Remote Pilot Certificate', 'Part 107', gen, 'FAA commercial drone pilot license', 'FAA');
add('Certified Drone Thermographer', '', gen, 'Thermal imaging with drones', 'Various');
add('Certified Robotics Technician', '', gen, 'Industrial robotics operation and maintenance', 'Various');
add('Universal Robots Certified Integrator', '', gen, 'Collaborative robot integration', 'Universal Robots');
add('FANUC Certified Robot Operator', '', gen, 'FANUC industrial robot programming', 'FANUC');
add('ABB Robotics Certified Programmer', '', gen, 'ABB industrial robot programming', 'ABB');
add('Certified Metaverse Professional', '', gen, 'Metaverse technology and applications', 'Various');
add('Certified NFT Professional', '', gen, 'NFT creation and marketplace management', 'Various');
add('Certified DeFi Professional', '', gen, 'Decentralized finance protocols and platforms', 'Various');
add('Web3 Certified Developer', '', gen, 'Decentralized application development', 'Various');
add('Solidity Certified Developer', '', gen, 'Smart contract development with Solidity', 'Various');
add('Chainlink Certified Developer', '', gen, 'Oracle integration with Chainlink', 'Chainlink');
add('Polkadot Certified Developer', '', gen, 'Blockchain development on Polkadot', 'Web3 Foundation');
add('Cosmos Certified Developer', '', gen, 'Blockchain development on Cosmos', 'Cosmos');
add('Algorand Certified Developer', '', gen, 'Blockchain development on Algorand', 'Algorand Foundation');
add('Certified Quantum Computing Professional', '', gen, 'Quantum computing fundamentals', 'Various');
add('IBM Quantum Developer Certification', '', gen, 'Quantum computing with IBM Qiskit', 'IBM');
add('Certified Digital Twin Professional', '', gen, 'Digital twin technology implementation', 'Various');
add('Certified 5G Professional', '', gen, '5G network technology fundamentals', 'Various');
add('Certified Edge Computing Professional', '', gen, 'Edge computing architecture and deployment', 'Various');
add('Certified Augmented Reality Developer', '', gen, 'AR application development', 'Various');
add('Certified Virtual Reality Developer', '', gen, 'VR application development', 'Various');
add('Unity AR/VR Developer Certification', '', gen, 'AR/VR development with Unity', 'Unity Technologies');
add('Certified Spatial Computing Developer', '', gen, 'Spatial computing and mixed reality', 'Various');
add('Certified Sustainability Professional', 'CSP', gen, 'Corporate sustainability strategy', 'ISSP');
add('Envision Sustainability Professional', 'ENV SP', gen, 'Sustainable infrastructure development', 'ISI');
add('TRUE Zero Waste Certification', '', gen, 'Zero waste program management', 'GBCI');
add('Certified Carbon Reduction Manager', '', gen, 'Carbon footprint reduction management', 'Various');
add('CDP Climate Change Certified', '', gen, 'Climate change disclosure and management', 'CDP');
add('Science Based Targets Certified', '', gen, 'Science-based emissions targets', 'SBTi');
add('B Corp Certification', '', gen, 'Certified B Corporation standards', 'B Lab');
add('Certified Accessibility Specialist', 'CAS', gen, 'Digital accessibility implementation', 'Various');
add('Section 508 Compliance Specialist', '', gen, 'Federal digital accessibility compliance', 'Various');
add('VPAT Certified Professional', '', gen, 'Voluntary Product Accessibility Template assessment', 'Various');

// ═══════════════════════════════════════════════════
// IT OPERATIONS EXPANSION
// ═══════════════════════════════════════════════════
add('COBIT 2019 Foundation', '', itops, 'IT governance framework fundamentals', 'ISACA');
add('COBIT 2019 Design and Implementation', '', itops, 'IT governance design and implementation', 'ISACA');
add('TOGAF 10 Foundation', '', itops, 'Enterprise architecture framework fundamentals', 'The Open Group');
add('TOGAF 10 Certified', '', itops, 'Enterprise architecture with TOGAF 10', 'The Open Group');
add('IT4IT Foundation', '', itops, 'IT value chain reference architecture', 'The Open Group');
add('Certified Information Technology Infrastructure Library Expert', 'ITIL Expert', itops, 'Expert IT service management', 'Axelos');
add('VeriSM Foundation', '', itops, 'Service management for the digital age', 'IFDC');
add('VeriSM Professional', '', itops, 'Advanced digital service management', 'IFDC');
add('SIAM Foundation', '', itops, 'Service integration and management fundamentals', 'EXIN');
add('DevOps Foundation', '', itops, 'DevOps principles and practices', 'DevOps Institute');
add('DevOps Leader', 'DOL', itops, 'DevOps leadership and transformation', 'DevOps Institute');
add('Site Reliability Engineering Foundation', 'SRE', itops, 'SRE principles and practices', 'DevOps Institute');
add('Certified Agile Service Manager', 'CASM', itops, 'Agile service management practices', 'DevOps Institute');
add('DevSecOps Foundation', 'DSOF', itops, 'Security integration in DevOps', 'DevOps Institute');
add('Continuous Testing Foundation', 'CTF', itops, 'Continuous testing in DevOps pipelines', 'DevOps Institute');
add('Value Stream Management Foundation', 'VSMF', itops, 'Value stream management practices', 'DevOps Institute');
add('Elasticsearch Certified Administrator', '', itops, 'Elasticsearch cluster administration', 'Elastic');
add('Confluent Certified Operator for Apache Kafka', '', itops, 'Kafka operations and management', 'Confluent');
add('Couchbase Certified Administrator', '', itops, 'Couchbase cluster administration', 'Couchbase');
add('Puppet Certified Practitioner', '', itops, 'Configuration management with Puppet', 'Puppet');
add('Ansible Certified Engineer', '', itops, 'Automation with Ansible', 'Red Hat');
add('SaltStack Certified Engineer', '', itops, 'Infrastructure automation with Salt', 'VMware');
add('Dynatrace Certified Associate', '', itops, 'Application performance with Dynatrace', 'Dynatrace');
add('AppDynamics Certified Associate', '', itops, 'Application performance with AppDynamics', 'Cisco');
add('ThousandEyes Certified Professional', '', itops, 'Network intelligence with ThousandEyes', 'Cisco');
add('Catchpoint Certified Professional', '', itops, 'Digital experience monitoring with Catchpoint', 'Catchpoint');
add('StatusPage Certified Administrator', '', itops, 'Incident communication with StatusPage', 'Atlassian');
add('OpsGenie Certified Administrator', '', itops, 'Alert management with OpsGenie', 'Atlassian');
add('Freshservice Certified Administrator', '', itops, 'ITSM with Freshservice', 'Freshworks');
add('ManageEngine Certified Professional', '', itops, 'IT management with ManageEngine', 'Zoho/ManageEngine');
add('SolarWinds Certified Professional', '', itops, 'IT infrastructure monitoring with SolarWinds', 'SolarWinds');
add('PRTG Certified Professional', '', itops, 'Network monitoring with PRTG', 'Paessler');
add('Sumo Logic Certified Administrator', '', itops, 'Cloud-native log management', 'Sumo Logic');

// ═══════════════════════════════════════════════════
// NETWORKING EXPANSION
// ═══════════════════════════════════════════════════
add('Cisco Certified Technician', 'CCT', net, 'Cisco device support and maintenance', 'Cisco');
add('Cisco Certified Specialist - Enterprise Core', '', net, 'Enterprise networking core technologies', 'Cisco');
add('Cisco Certified Specialist - Enterprise Advanced Infrastructure', '', net, 'Advanced enterprise infrastructure', 'Cisco');
add('Cisco Certified Specialist - Collaboration Core', '', net, 'Unified communications core technologies', 'Cisco');
add('Cisco Meraki Solutions Specialist', 'CMSS', net, 'Cloud-managed networking with Cisco Meraki', 'Cisco');
add('Cisco SD-WAN Solutions Specialist', '', net, 'Software-defined WAN with Cisco Viptela', 'Cisco');
add('Juniper Networks Certified Associate - Cloud', 'JNCIA-Cloud', net, 'Juniper cloud networking fundamentals', 'Juniper Networks');
add('Juniper Networks Certified Associate - DevOps', 'JNCIA-DevOps', net, 'Juniper automation and DevOps', 'Juniper Networks');
add('Juniper Networks Certified Associate - Data Center', 'JNCIA-DC', net, 'Juniper data center networking', 'Juniper Networks');
add('Extreme Networks Certified Associate', '', net, 'Extreme Networks switching and routing', 'Extreme Networks');
add('Extreme Networks Certified Professional', '', net, 'Advanced Extreme Networks deployment', 'Extreme Networks');
add('Ruckus Certified Wireless Administrator', '', net, 'Ruckus wireless network administration', 'Ruckus/CommScope');
add('Cambium Certified Network Professional', '', net, 'Cambium wireless infrastructure', 'Cambium Networks');
add('Peplink Certified Engineer', '', net, 'SD-WAN with Peplink', 'Peplink');
add('Silver Peak Certified Professional', '', net, 'SD-WAN with HPE Aruba/Silver Peak', 'HPE/Aruba');
add('Fortinet NSE 1 - Information Security Awareness', 'NSE1', net, 'Information security awareness fundamentals', 'Fortinet');
add('Fortinet NSE 2 - The Evolution of Cybersecurity', 'NSE2', net, 'Cybersecurity evolution and threat landscape', 'Fortinet');
add('Fortinet NSE 3 - Product Awareness', 'NSE3', net, 'Fortinet product portfolio awareness', 'Fortinet');
add('Fortinet NSE 5 - FortiManager', 'NSE5', net, 'Centralized management with FortiManager', 'Fortinet');
add('Fortinet NSE 6 - FortiWeb', 'NSE6', net, 'Web application firewall with FortiWeb', 'Fortinet');

// ═══════════════════════════════════════════════════
// PROJECT MANAGEMENT EXPANSION
// ═══════════════════════════════════════════════════
add('Certified Scrum@Scale Master', 'CS@SM', pm, 'Scaling Scrum across teams', 'Scrum Inc.');
add('LeSS Certified Practitioner', '', pm, 'Large-Scale Scrum framework', 'LeSS Company');
add('Certified Nexus Framework Practitioner', '', pm, 'Nexus scaling framework for Scrum', 'Scrum.org');
add('Certified SAFe Lean-Agile Engineer', '', pm, 'Engineering practices in SAFe', 'Scaled Agile');
add('SAFe Program Consultant', 'SPC', pm, 'SAFe program consulting and transformation', 'Scaled Agile');
add('SAFe for Teams', 'ST', pm, 'SAFe practices for agile teams', 'Scaled Agile');
add('Certified Agile Transformation Coach', '', pm, 'Enterprise agile transformation coaching', 'Various');
add('Professional Agile Leadership - Evidence-Based Management', 'PAL-EBM', pm, 'Evidence-based management with Scrum', 'Scrum.org');
add('Professional Scrum with Kanban', 'PSK', pm, 'Kanban integration with Scrum', 'Scrum.org');
add('Professional Scrum with User Experience', 'PSU', pm, 'UX integration with Scrum', 'Scrum.org');
add('Professional Scrum Facilitation Skills', 'PSF', pm, 'Facilitation for Scrum events', 'Scrum.org');
add('Monday.com Certified Expert', '', pm, 'Project management with Monday.com', 'Monday.com');
add('Asana Certified Pro', '', pm, 'Project management with Asana', 'Asana');
add('Wrike Certified Professional', '', pm, 'Project management with Wrike', 'Wrike');
add('Smartsheet Certified Professional', '', pm, 'Project management with Smartsheet', 'Smartsheet');
add('ClickUp Certified Professional', '', pm, 'Project management with ClickUp', 'ClickUp');
add('Basecamp Certified Professional', '', pm, 'Project management with Basecamp', 'Basecamp');
add('Notion Certified Professional', '', pm, 'Knowledge management with Notion', 'Notion');
add('Airtable Certified Pro', '', pm, 'Project tracking with Airtable', 'Airtable');
add('Microsoft Project Certified Professional', '', pm, 'Project management with Microsoft Project', 'Microsoft');
add('Primavera P6 Certified Professional', '', pm, 'Enterprise project management with Primavera', 'Oracle');
add('Planview Certified Professional', '', pm, 'Portfolio and project management with Planview', 'Planview');
add('Clarity PPM Certified Professional', '', pm, 'Project portfolio management with Clarity', 'Broadcom');
add('Certified ScrumMaster for Distributed Teams', '', pm, 'Remote/distributed Scrum facilitation', 'Various');
add('AgilePM Foundation', '', pm, 'Agile project management using DSDM', 'APMG International');
add('AgilePM Practitioner', '', pm, 'Applied agile project management with DSDM', 'APMG International');
add('Certified Construction Manager', 'CCM', pm, 'Construction project management', 'CMAA');
add('Associate Value Specialist', 'AVS', pm, 'Value engineering methodology', 'SAVE International');
add('Certified Value Specialist', 'CVS', pm, 'Advanced value engineering', 'SAVE International');

// Build final output
certs.sort((a, b) => a.name.localeCompare(b.name));

const output = {
    totalCredentials: certs.length,
    source: 'lightcast',
    sourceVersion: '2023-05',
    generatedAt: new Date().toISOString(),
    credentials: certs
};

fs.writeFileSync('certifications/lightcast-certs.json', JSON.stringify(output, null, 2));
console.log('Total credentials:', certs.length);

const cats = {};
certs.forEach(c => { cats[c.category] = (cats[c.category] || 0) + 1; });
console.log('\nCategory breakdown:');
Object.entries(cats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
});

const fileSize = fs.statSync('certifications/lightcast-certs.json').size;
console.log(`\nFile size: ${(fileSize / 1024).toFixed(1)} KB`);
