'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Factory,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  Building,
  Landmark,
  Hotel,
  Building2,
  Plane,
  Heart,
  Briefcase,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  Bot,
  Kanban,
  Send,
  Zap,
  HelpCircle,
  ChevronDown,
  Clock,
  Code2,
  FileText,
  PhoneCall,
  Cpu,
  DollarSign,
  Calendar,
  Compass,
  Lock
} from 'lucide-react';

export interface IndustryData {
  id: string;
  name: string;
  badge: string;
  icon: any;
  heroHeadline: string;
  heroDesc: string;
  metrics: { label: string; value: string }[];
  chatDemo: {
    userMsg: string;
    aiTitle: string;
    aiReply: string;
    telemetry: string;
  };
  challenges: { problem: string; desc: string }[];
  solutions: { feature: string; desc: string }[];
  workflow: { step: string; title: string; desc: string }[];
  features: { title: string; desc: string; icon: any }[];
  outcomes: { label: string; value: string; detail: string }[];
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
    impact: string;
  };
  faqs: { q: string; a: string }[];
}

export const INDUSTRIES_DATA: Record<string, IndustryData> = {
  manufacturing: {
    id: 'manufacturing',
    name: 'Manufacturing & B2B',
    badge: 'B2B Supply Chain',
    icon: Factory,
    heroHeadline: 'WhatsApp AI Automation for Manufacturing & Industrial Supply Chains',
    heroDesc: 'Automate RFQ quotation requests, order status tracking, dealer broadcasts, and batch dispatch alerts with official Meta Cloud API & ERP sync.',
    metrics: [
      { label: 'Faster RFQ Turnaround', value: '3.5x' },
      { label: 'Order Support Calls Cut', value: '-75%' },
      { label: 'Broadcast Delivery Rate', value: '99.9%' }
    ],
    chatDemo: {
      userMsg: 'Need RFQ quotation for 5,000 units of Industrial Valves (Model X-200)',
      aiTitle: 'AIWCRM Manufacturing AI (ERP Synced)',
      aiReply: 'Quotations sent! Unit Price: ₹1,250/pc. Prospectus & GST invoice breakdown attached 📄',
      telemetry: 'ERP Stock Check: 8,500 Available · Lead Marked HOT 🔥'
    },
    challenges: [
      { problem: 'Delayed Quotation Turnaround', desc: 'Dealers wait 24-48 hours for manual RFQ prices from sales reps, resulting in lost deals to competitors.' },
      { problem: 'Manual Dispatch Updates', desc: 'Logistics teams spend hours manually answering "Where is my shipment?" calls from distributors.' },
      { problem: 'Unorganized B2B Lead Capture', desc: 'Inquiries from trade shows and web forms get buried in individual sales rep phones.' }
    ],
    solutions: [
      { feature: 'Instant ERP-Synced RFQs', desc: 'AI queries inventory databases instantly and dispatches formal PDF quotes via WhatsApp.' },
      { feature: 'Automated Dispatch Tracking', desc: 'Sends instant WhatsApp alerts with live vehicle tracking links when orders leave the warehouse.' },
      { feature: 'Central B2B Team Inbox', desc: 'All dealer inquiries flow into a unified team inbox with automatic department routing.' }
    ],
    workflow: [
      { step: '01', title: 'Dealer Inquiry Inbound', desc: 'Distributor messages WhatsApp requesting batch pricing or order status.' },
      { step: '02', title: 'AI Intent & Stock Check', desc: 'AIWCRM AI parses model numbers and queries inventory stock level via REST API.' },
      { step: '03', title: 'Instant Quote & PDF Delivery', desc: 'Sends custom price quote with payment links and terms within 3 seconds.' },
      { step: '04', title: 'Sales CRM Stage Update', desc: 'Kanban deal stage automatically moves to "Quote Sent" with assigned rep.' }
    ],
    features: [
      { title: 'ERP & SAP Webhook Sync', desc: 'Connect directly with Tally, SAP, Oracle, or custom ERP systems.', icon: Code2 },
      { title: 'Dealer Broadcast Campaigns', desc: 'Send price list updates and new catalog announcements to 10,000+ distributors.', icon: Send },
      { title: 'Automated Order Confirmations', desc: 'Instant PO verification and GST invoice sharing via WhatsApp.', icon: FileText },
      { title: 'Multi-Warehouse Routing', desc: 'Route inquiries to nearest regional warehouse representative automatically.', icon: Building2 }
    ],
    outcomes: [
      { label: 'RFQ Response Time', value: '<3s', detail: 'Reduced from 24 hours to sub-3 seconds' },
      { label: 'Dealer Retention', value: '+42%', detail: 'Higher satisfaction with instant order updates' },
      { label: 'Sales Rep Capacity', value: '4x', detail: 'Reps handle 4x more deals with automated quotes' },
      { label: 'AI Token Expense', value: '-60%', detail: 'Saved using BYOK model routing' }
    ],
    testimonial: {
      quote: 'AIWCRM transformed our B2B dealer network across India. Our distributors receive instant stock availability and PDF quotes on WhatsApp in seconds.',
      author: 'Rajesh Singhania',
      role: 'VP Commercial Operations',
      company: 'Apex Industrial Tools Ltd',
      impact: '3.5x Faster Deal Cycles'
    },
    faqs: [
      { q: 'Can AIWCRM integrate with our existing Tally or SAP ERP?', a: 'Yes! AIWCRM provides bi-directional REST webhooks and APIs to fetch stock availability, generate invoices, and log customer interactions directly into your ERP.' },
      { q: 'How does AIWCRM handle bulk dealer broadcasts without getting blocked?', a: 'AIWCRM uses Meta Official Cloud API templates, ensuring 100% compliance, zero phone number bans, and maximum deliverability.' }
    ]
  },

  education: {
    id: 'education',
    name: 'Education & EdTech',
    badge: 'Student Counseling & Admissions',
    icon: GraduationCap,
    heroHeadline: 'AI Admission Counselors & Student Engagement on WhatsApp',
    heroDesc: 'Automate student admission counseling, prospectus downloads, campus visit scheduling, and fee payment reminders with zero token markup.',
    metrics: [
      { label: 'Admission Lead Conversion', value: '+45%' },
      { label: 'Counselor Workload Saved', value: '-80%' },
      { label: 'Instant Inquiry Response', value: '<100ms' }
    ],
    chatDemo: {
      userMsg: 'Hi, what are the eligibility criteria and fees for B.Tech Computer Science?',
      aiTitle: 'AIWCRM Admission Counselor AI',
      aiReply: 'Welcome to BPTPIA! B.Tech CSE fee is ₹85,000/sem. Eligibility: 60% in 10+2 (PCM). Download Brochure 📄',
      telemetry: 'Student Tagged: CSE Aspirant · Campus Tour Booked'
    },
    challenges: [
      { problem: 'Peak Admission Influx', desc: 'Counselors get overwhelmed by thousands of routine fee and eligibility questions during admission season.' },
      { problem: 'Slow Student Follow-ups', desc: 'High drop-off rates because students enroll with rival institutes while waiting for answers.' },
      { problem: 'Uncollected Tuition Fees', desc: 'Manual phone calls for semester fee collection take hundreds of staff hours.' }
    ],
    solutions: [
      { feature: '24/7 AI Admission Counselor', desc: 'Answers course fees, eligibility, hostel rules, and placement stats instantly on WhatsApp.' },
      { feature: 'Automated Campus Tour Booking', desc: 'Students select preferred dates and receive WhatsApp confirmation with Google Maps directions.' },
      { feature: 'WhatsApp Fee Payment Reminders', desc: 'Automated WhatsApp alerts with embedded Razorpay/UPI payment links.' }
    ],
    workflow: [
      { step: '01', title: 'Student Inquiry', desc: 'Student scans QR code or clicks WhatsApp ad asking for course details.' },
      { step: '02', title: 'AI Counselor Qualification', desc: 'AI verifies academic marks, course interest, and location preferences.' },
      { step: '03', title: 'Prospectus & Payment Link', desc: 'AI sends official admission prospectus PDF and fee payment link.' },
      { step: '04', title: 'Counselor Handover', desc: 'Hot prospects booked for campus visits are assigned to senior admissions officers.' }
    ],
    features: [
      { title: 'Brochure PDF Auto-Delivery', desc: 'Instant delivery of course prospectuses and fee structures.', icon: FileText },
      { title: 'Multi-Counselor Team Inbox', desc: 'Distribute incoming leads among counselors based on department.', icon: Users },
      { title: 'Broadcast Examination Alerts', desc: 'Send exam dates and hall ticket downloads to thousands of students.', icon: Send },
      { title: 'Zero Token Greeting Cache', desc: 'Instant replies to "Hi" and "Hello" with zero AI token cost.', icon: Zap }
    ],
    outcomes: [
      { label: 'Enrollment Rate', value: '+45%', detail: 'Higher conversion with instant counseling' },
      { label: 'Counselor Productivity', value: '5x', detail: 'Counselors focus only on pre-qualified students' },
      { label: 'Fee Collection Speed', value: '3x', detail: 'Faster fee collection via automated WhatsApp links' },
      { label: 'Student Satisfaction', value: '99%', detail: 'Instant 24/7 answers to academic questions' }
    ],
    testimonial: {
      quote: 'AIWCRM transformed our student admission counseling. The Gemini AI auto-responder handles 80% of routine inquiries instantly, saving our staff hundreds of hours during peak season.',
      author: 'Admissions Director',
      role: 'Director of Admissions',
      company: 'BPTPIA (Bihar Private Technical & Professional Institutions)',
      impact: '+48% Campus Visit Enrollments'
    },
    faqs: [
      { q: 'Can AIWCRM customize the AI auto-responder for our college prospectus?', a: 'Yes! You can upload your PDF prospectus, fee matrix, and FAQs. The AI learns your exact curriculum and rules.' },
      { q: 'Is AIWCRM compliant with student data privacy regulations?', a: 'Yes, AIWCRM uses Meta Official Cloud API with enterprise-grade AES-256 encryption.' }
    ]
  },

  healthcare: {
    id: 'healthcare',
    name: 'Healthcare & Clinics',
    badge: 'Patient Engagement & Booking',
    icon: HeartPulse,
    heroHeadline: 'Automated Patient Booking, Consultation Reminders & Lab Reports',
    heroDesc: 'Streamline clinic appointments, send lab report PDFs securely, and provide 24/7 post-consultation support on WhatsApp.',
    metrics: [
      { label: 'Patient No-Show Rate', value: '-90%' },
      { label: 'Booking Time', value: '<2 min' },
      { label: 'Patient Satisfaction', value: '98%' }
    ],
    chatDemo: {
      userMsg: 'I need to book a consultation with Dr. Sharma (Cardiology) for tomorrow morning',
      aiTitle: 'AIWCRM Clinic AI Assistant',
      aiReply: 'Dr. Sharma is available at 10:30 AM & 11:45 AM tomorrow. Click below to confirm appointment 📅',
      telemetry: 'Slot Reserved: 10:30 AM · SMS & WhatsApp Reminder Set'
    },
    challenges: [
      { problem: 'High Patient No-Show Rates', desc: 'Patients forget appointment dates, leaving expensive doctor slots empty.' },
      { problem: 'Overloaded Reception Desk', desc: 'Front desk staff waste hours answering phone calls for clinic timings and doctor fees.' },
      { problem: 'Delayed Lab Report Sharing', desc: 'Patients flood clinic lines asking for pathology and radiology reports.' }
    ],
    solutions: [
      { feature: 'Automated Slot Booking', desc: 'Patients view available doctor slots and confirm appointments directly inside WhatsApp.' },
      { feature: 'Smart Reminder Sequences', desc: 'Sends automated WhatsApp reminders 24h and 2h before the appointment.' },
      { feature: 'Secure Lab Report Delivery', desc: 'Automatically delivers password-protected PDF lab reports upon generation.' }
    ],
    workflow: [
      { step: '01', title: 'Patient Messages Clinic', desc: 'Patient asks for doctor availability or lab report.' },
      { step: '02', title: 'AI Specialty Matching', desc: 'AI identifies symptom/department and displays available doctor slots.' },
      { step: '03', title: 'Instant Booking & Token', desc: 'Patient selects slot and receives digital appointment token.' },
      { step: '04', title: 'Post-Consult Followup', desc: 'Sends post-care instructions and prescription reminders.' }
    ],
    features: [
      { title: 'Secure Report Delivery', desc: 'Deliver PDF pathology and diagnostic reports automatically.', icon: FileText },
      { title: 'Doctor Slot Management', desc: 'Sync doctor schedules across multiple clinic branches.', icon: Clock },
      { title: 'Emergency Escalation', desc: 'Route urgent medical queries immediately to duty doctors.', icon: ShieldCheck },
      { title: 'Multilingual AI Support', desc: 'Communicate with patients in Hindi, English, and regional languages.', icon: Bot }
    ],
    outcomes: [
      { label: 'No-Show Reduction', value: '-90%', detail: 'Eliminated empty slots with smart reminders' },
      { label: 'Front-Desk Calls', value: '-70%', detail: 'Routine inquiries handled by AI' },
      { label: 'Lab Report Delivery', value: 'Instant', detail: 'Zero delay in diagnostic report sharing' },
      { label: 'Patient Retention', value: '+35%', detail: 'Better follow-up care engagement' }
    ],
    testimonial: {
      quote: 'AIWCRM slashed our patient no-show rate by 90%. Our receptionists no longer spend all morning making manual confirmation calls.',
      author: 'Dr. Ananya Roy',
      role: 'Medical Director',
      company: 'Metro Care Super Speciality Clinics',
      impact: '-90% Appointment No-Shows'
    },
    faqs: [
      { q: 'Is patient medical data secure on AIWCRM?', a: 'Yes. All messages are transmitted via Meta Official Cloud API with end-to-end encryption.' },
      { q: 'Can AIWCRM integrate with our Hospital Management Information System (HMIS)?', a: 'Yes, via REST webhooks and API triggers.' }
    ]
  },

  retail: {
    id: 'retail',
    name: 'Retail & E-Commerce',
    badge: 'D2C Sales & Abandoned Carts',
    icon: ShoppingBag,
    heroHeadline: 'Turn WhatsApp Chats into Your Highest-ROI Sales Channel',
    heroDesc: 'Recover abandoned shopping carts, send automated COD verification broadcasts, and provide 24/7 post-purchase order tracking.',
    metrics: [
      { label: 'Abandoned Cart Recovery', value: '+25%' },
      { label: 'COD Return Reduction', value: '-40%' },
      { label: 'Campaign Open Rate', value: '98%' }
    ],
    chatDemo: {
      userMsg: 'Where is my order #89041? It was supposed to arrive today.',
      aiTitle: 'AIWCRM D2C Order AI',
      aiReply: 'Your order #89041 is out for delivery with BlueDart! Live Tracking: bluedart.com/track/89041 🚚',
      telemetry: 'BlueDart API Synced · Order Status: Out for Delivery'
    },
    challenges: [
      { problem: 'High Abandoned Cart Rates', desc: 'Over 70% of shoppers add items to cart but drop off before completing payment.' },
      { problem: 'High COD Return (RTO) Costs', desc: 'Fake COD orders result in expensive reverse logistics losses.' },
      { problem: 'Low Email Campaign Open Rates', desc: 'Marketing emails get ignored in spam folders with under 10% open rates.' }
    ],
    solutions: [
      { feature: 'Automated Cart Recovery', desc: 'Sends personalized WhatsApp messages with discount codes 15 minutes after cart abandonment.' },
      { feature: '1-Click COD Verification', desc: 'Verifies COD orders via interactive WhatsApp confirmation buttons before dispatch.' },
      { feature: 'High-ROI WhatsApp Broadcasts', desc: 'Schedule promotional campaigns with 98% open rates and instant checkout links.' }
    ],
    workflow: [
      { step: '01', title: 'Cart Abandoned', desc: 'Customer leaves checkout page on Shopify/WooCommerce.' },
      { step: '02', title: 'WhatsApp Alert Triggered', desc: 'AIWCRM sends friendly reminder with cart items and discount link.' },
      { step: '03', title: 'Customer Confirms Order', desc: 'Shopper clicks checkout link or confirms COD via button.' },
      { step: '04', title: 'Post-Purchase Tracking', desc: 'Automated dispatch, shipping, and delivery notifications.' }
    ],
    features: [
      { title: 'Shopify 1-Click Sync', desc: 'Sync products, orders, and customer carts seamlessly.', icon: ShoppingBag },
      { title: 'WhatsApp Catalog Showcase', desc: 'Display product catalogs directly inside WhatsApp chat.', icon: FileText },
      { title: 'Automated COD to Prepaid', desc: 'Incentivize COD buyers to pay online for extra discounts.', icon: TrendingUp },
      { title: 'Customer Segmenting', desc: 'Segment shoppers based on past purchase value and tags.', icon: Users }
    ],
    outcomes: [
      { label: 'Cart Recovery Revenue', value: '+25%', detail: 'Recovered lost sales automatically' },
      { label: 'RTO Loss Reduction', value: '-40%', detail: 'Verified COD orders before shipping' },
      { label: 'Broadcast Campaign ROI', value: '12x', detail: 'Outperformed traditional email marketing' },
      { label: 'Customer Lifetime Value', value: '+30%', detail: 'Higher repeat purchases on WhatsApp' }
    ],
    testimonial: {
      quote: 'AIWCRM replaced our old email marketing tool. Our WhatsApp broadcast campaigns achieve a 98% open rate and generated 12x ROI in 30 days.',
      author: 'Karan Malhotra',
      role: 'Co-Founder & CMO',
      company: 'UrbanStyle Apparel D2C',
      impact: '12x Campaign ROI'
    },
    faqs: [
      { q: 'Does AIWCRM connect directly with Shopify and WooCommerce?', a: 'Yes! AIWCRM integrates with Shopify and WooCommerce to trigger cart recovery, COD verification, and order tracking.' },
      { q: 'Can we send WhatsApp broadcast messages with images and buttons?', a: 'Yes, full support for Meta interactive messages, image headers, and CTA buttons.' }
    ]
  },

  realestate: {
    id: 'realestate',
    name: 'Real Estate & Property',
    badge: 'Property Inquiries & Site Visits',
    icon: Building2,
    heroHeadline: 'Instant Property Brochures, Floor Plans & Site Visit Scheduling',
    heroDesc: 'Capture high-intent property buyers from Meta Lead Ads, send PDF floor plans instantly, and automate site visit confirmations.',
    metrics: [
      { label: 'Site Visit Booking Rate', value: '2x' },
      { label: 'Lead Qualification Speed', value: '<5s' },
      { label: 'Agent Followup Rate', value: '100%' }
    ],
    chatDemo: {
      userMsg: 'Looking for 3 BHK luxury apartments in Whitefield under ₹1.5 Cr',
      aiTitle: 'AIWCRM Real Estate AI',
      aiReply: 'We have 3 matching properties in Whitefield! Here is the digital brochure & 3D floor plan 🏢',
      telemetry: 'Matching Inventory Found: 3 Units · Lead Assigned to Senior Rep'
    },
    challenges: [
      { problem: 'High Meta Lead Ad Costs', desc: 'Real estate ads generate hundreds of leads daily, but slow follow-up causes buyers to move on.' },
      { problem: 'Unqualified Buyer Calls', desc: 'Sales agents waste time speaking to low-budget callers instead of serious buyers.' },
      { problem: 'Low Weekend Site Visit Turnout', desc: 'Buyers book weekend site visits but forget or cancel due to lack of reminders.' }
    ],
    solutions: [
      { feature: 'Instant WhatsApp Floor Plans', desc: 'AI sends 3D floor plans and pricing PDFs immediately upon lead form submission.' },
      { feature: 'Budget & Intent Qualification', desc: 'AI screens buyers based on budget, possession timeline, and location preference.' },
      { feature: 'Automated Site Visit Reminders', desc: 'Sends location pin, site photos, and reminder alerts 2 hours before scheduled visit.' }
    ],
    workflow: [
      { step: '01', title: 'Ad Form Inbound', desc: 'Buyer fills Facebook/Instagram lead form for a new project.' },
      { step: '02', title: 'WhatsApp Brochure Sent', desc: 'AIWCRM sends instant greeting with PDF brochure and video walkthrough.' },
      { step: '03', title: 'Intent Qualification', desc: 'AI asks buyer preferred budget and configuration (2 BHK / 3 BHK).' },
      { step: '04', title: 'Site Visit Confirmed', desc: 'Booked visit is synced to sales Kanban and assigned to site manager.' }
    ],
    features: [
      { title: 'Interactive Floor Plan Cards', desc: 'Share high-res property images and brochures in chat.', icon: FileText },
      { title: 'Location Pin Dispatch', desc: 'Send Google Maps location pins for site sales offices.', icon: Building2 },
      { title: 'Round-Robin Lead Assignment', desc: 'Distribute hot buyer leads fairly among sales agents.', icon: Users },
      { title: 'Kanban Stage Automation', desc: 'Move deal cards automatically as buyers visit sites.', icon: Kanban }
    ],
    outcomes: [
      { label: 'Site Visit Volume', value: '2x', detail: 'Doubled weekend site visits' },
      { label: 'Lead Response Time', value: '<5s', detail: 'Instant WhatsApp brochure delivery' },
      { label: 'Agent Efficiency', value: '3x', detail: 'Agents focus only on qualified buyers' },
      { label: 'Ad Spend ROAS', value: '4x', detail: 'Lower cost per qualified lead' }
    ],
    testimonial: {
      quote: 'AIWCRM doubled our weekend site visit volume. Property buyers get floor plans instantly on WhatsApp, and our agents know exactly which leads are HOT.',
      author: 'Vikram Sethi',
      role: 'VP Sales & Marketing',
      company: 'Prestige Realty Group',
      impact: '2x Weekend Site Visits'
    },
    faqs: [
      { q: 'Can AIWCRM assign property leads to different agents based on location?', a: 'Yes! Smart lead routing distributes leads based on project location, budget, or agent availability.' },
      { q: 'Does AIWCRM integrate with Facebook and Instagram Lead Ads?', a: 'Yes, 0-latency direct Meta Cloud API integration.' }
    ]
  },

  bfsi: {
    id: 'bfsi',
    name: 'Banking, BFSI & FinTech',
    badge: 'KYC Document Collection & Loans',
    icon: ShieldCheck,
    heroHeadline: 'Secure Financial Eligibility, KYC Collection & UPI Payment Links',
    heroDesc: 'Accelerate loan pre-approvals, automate KYC document collection on WhatsApp, and deliver 1-click Razorpay payment links securely.',
    metrics: [
      { label: 'Loan Approval Speedup', value: '60%' },
      { label: 'KYC Collection Time', value: '<5 min' },
      { label: 'Security & Compliance', value: '100%' }
    ],
    chatDemo: {
      userMsg: 'What is the interest rate and documents required for a Personal Loan of ₹5 Lakhs?',
      aiTitle: 'AIWCRM BFSI AI Gateway',
      aiReply: 'Interest rates start at 10.5% p.a. Upload Aadhaar & PAN PDF here for instant 2-minute pre-approval 💳',
      telemetry: 'Eligibility Engine Synced · Pre-Approval Score: 780'
    },
    challenges: [
      { problem: 'Drop-offs During KYC Upload', desc: 'Borrowers abandon loan applications when asked to log in to complex web portals.' },
      { problem: 'Slow Loan Sanction Turnaround', desc: 'Manual document verification takes days, losing borrowers to competitor apps.' },
      { problem: 'Strict Financial Regulations', desc: 'Financial data requires end-to-end encryption and compliance with RBI guidelines.' }
    ],
    solutions: [
      { feature: 'WhatsApp KYC Upload', desc: 'Borrowers upload PAN, Aadhaar, and bank statements directly in WhatsApp chat.' },
      { feature: 'Instant Pre-Approval Eligibility', desc: 'AI queries credit scoring APIs and provides instant loan pre-approval amounts.' },
      { feature: 'Embedded Payment Links', desc: 'Send 1-click Razorpay/UPI links for loan processing fees or insurance EMI.' }
    ],
    workflow: [
      { step: '01', title: 'Loan Inquiry', desc: 'Applicant inquiries about home, car, or personal loan rates.' },
      { step: '02', title: 'Eligibility Screening', desc: 'AI asks income, employment, and desired loan amount.' },
      { step: '03', title: 'Document Upload on Chat', desc: 'Applicant uploads PDF/image copies of PAN and salary slip.' },
      { step: '04', title: 'Sanction & E-Sign Link', desc: 'Sends official sanction letter and e-signature link via WhatsApp.' }
    ],
    features: [
      { title: 'AES-256 Data Encryption', desc: 'Enterprise security meeting RBI guidelines.', icon: Lock },
      { title: 'Razorpay & PayU Links', desc: 'Generate instant UPI and card payment links.', icon: DollarSign },
      { title: 'Automated EMI Reminders', desc: 'Send monthly EMI payment alerts with 1-click pay buttons.', icon: Calendar },
      { title: 'Audit Trail & Telemetry', desc: 'Full log of customer conversations and consent timestamps.', icon: ShieldCheck }
    ],
    outcomes: [
      { label: 'Approval Speed', value: '60% faster', detail: 'Reduced loan sanction time dramatically' },
      { label: 'KYC Completion Rate', value: '+50%', detail: 'Higher completion rate on WhatsApp vs Web' },
      { label: 'EMI Recovery Rate', value: '94%', detail: 'Fewer overdue defaults via WhatsApp alerts' },
      { label: 'Compliance Audit', value: '100%', detail: 'Fully SOC2 and ISO 27001 compliant' }
    ],
    testimonial: {
      quote: 'AIWCRM streamlined our loan document collection. Customers upload their Aadhaar and PAN on WhatsApp in minutes, cutting our approval turnaround time by 60%.',
      author: 'Siddharth Mehta',
      role: 'Head of Digital Banking',
      company: 'Equitas Financial Services',
      impact: '60% Faster Loan Approvals'
    },
    faqs: [
      { q: 'Is AIWCRM compliant with RBI and financial data privacy guidelines?', a: 'Yes. AIWCRM routes all traffic via Meta Official Cloud API with end-to-end AES-256 encryption.' },
      { q: 'Can AIWCRM generate dynamic UPI payment links?', a: 'Yes, integrated payment links (Razorpay, PayU, Cashfree) allow instant 1-click payments inside WhatsApp.' }
    ]
  },

  hospitality: {
    id: 'hospitality',
    name: 'Hospitality & Travel',
    badge: 'Direct Bookings & Concierge',
    icon: Hotel,
    heroHeadline: 'Direct Hotel Bookings, Digital Room Service & Guest Concierge',
    heroDesc: 'Increase direct room bookings on WhatsApp, send digital food menus, and automate guest check-in instructions.',
    metrics: [
      { label: 'Direct Booking Revenue', value: '+30%' },
      { label: 'Guest Response Speed', value: '<5s' },
      { label: 'OTA Commission Saved', value: '-20%' }
    ],
    chatDemo: {
      userMsg: 'Hi, do you have ocean-view suite availability for 2 nights starting December 15?',
      aiTitle: 'AIWCRM Hotel Concierge AI',
      aiReply: 'Yes! Ocean Suite is available at ₹12,500/night including breakfast. Reserve now with 1-click 🏨',
      telemetry: 'PMS Inventory Checked · Reservation Link Dispatched'
    },
    challenges: [
      { problem: 'High OTA Commission Fees', desc: 'Hotels lose 15-25% commission on every booking made through third-party travel portals.' },
      { problem: 'Slow Front-Desk Service', desc: 'Guests wait in line or call reception for basic room service, wifi passwords, and menus.' },
      { problem: 'Low Post-Stay Reviews', desc: 'Guests leave without providing feedback, resulting in missed TripAdvisor reviews.' }
    ],
    solutions: [
      { feature: 'Direct WhatsApp Booking Engine', desc: 'Guests check availability, view room photos, and pay directly on WhatsApp with 0% commission.' },
      { feature: 'Digital Concierge Menu', desc: 'Guests scan room QR codes to order food, request extra towels, or book spa appointments.' },
      { feature: 'Automated Review Collection', desc: 'Sends post-checkout thank you message requesting a 5-star Google review.' }
    ],
    workflow: [
      { step: '01', title: 'Guest Inquiry Inbound', desc: 'Guest asks for room rates or amenities on WhatsApp.' },
      { step: '02', title: 'Room Photo & Price Delivery', desc: 'AI displays high-res suite photos and pricing options.' },
      { step: '03', title: 'Direct Booking Payment', desc: 'Guest pays deposit via Razorpay link to lock reservation.' },
      { step: '04', title: 'Pre-Arrival Check-in', desc: 'Sends directions, wifi code, and digital check-in form.' }
    ],
    features: [
      { title: 'Digital Menu Showcase', desc: 'Interactive food & spa service menu cards in chat.', icon: FileText },
      { title: 'PMS Integration', desc: 'Sync room availability with Opera, Cloudbeds, or custom PMS.', icon: Building2 },
      { title: 'Review Growth Automation', desc: 'Boost Google & TripAdvisor reviews automatically.', icon: Sparkles },
      { title: 'Multilingual Guest AI', desc: 'Assist international travelers in 50+ languages.', icon: Bot }
    ],
    outcomes: [
      { label: 'Direct Bookings', value: '+30%', detail: 'Shifted bookings from OTAs to WhatsApp' },
      { label: 'Commission Savings', value: '₹4.5L/mo', detail: 'Saved on third-party OTA fees' },
      { label: 'Guest Satisfaction', value: '97%', detail: 'Instant concierge service in room' },
      { label: 'Google Review Growth', value: '3x', detail: 'Increased 5-star rating submissions' }
    ],
    testimonial: {
      quote: 'AIWCRM helped us increase direct hotel bookings by 30%. Guests love receiving their check-in details and digital menus on WhatsApp.',
      author: 'Kabir Oberoi',
      role: 'General Manager',
      company: 'Grand Azure Resort & Spa',
      impact: '+30% Direct Room Bookings'
    },
    faqs: [
      { q: 'Can AIWCRM integrate with Property Management Systems (PMS)?', a: 'Yes, via REST webhooks to sync room availability and guest details.' },
      { q: 'Does AIWCRM support multiple hotel property locations?', a: 'Yes, multi-property management under one central dashboard.' }
    ]
  },

  government: {
    id: 'government',
    name: 'Government & Public Sector',
    badge: 'Citizen Helpline & Services',
    icon: Building2,
    heroHeadline: 'Official Citizen Services, Grievance Redressal & Public Alerts',
    heroDesc: 'Deliver civic certificates, resolve citizen complaints 24/7, and send public safety announcements with official Meta compliance.',
    metrics: [
      { label: 'Citizen Inquiry Speed', value: '<3s' },
      { label: 'Grievance Resolution', value: '3x Faster' },
      { label: 'Public Compliance', value: '100%' }
    ],
    chatDemo: {
      userMsg: 'How can I download my birth certificate or check property tax status?',
      aiTitle: 'AIWCRM Citizen AI Portal',
      aiReply: 'Enter your 10-digit Application Reference Number (ARN) to download your verified PDF certificate 📄',
      telemetry: 'Govt API Verified · Official Digital Signature Valid'
    },
    challenges: [
      { problem: 'Overcrowded Citizen Helpdesks', desc: 'Long physical queues at government offices for basic document status inquiries.' },
      { problem: 'Delayed Public Announcements', desc: 'Emergency weather alerts and civic updates fail to reach citizens in time via traditional media.' },
      { problem: 'Unresolved Civic Grievance', desc: 'Citizen complaints regarding water supply or road repairs get lost in paper files.' }
    ],
    solutions: [
      { feature: '24/7 Citizen AI Portal', desc: 'Citizens download tax receipts, certificates, and forms instantly on WhatsApp.' },
      { feature: 'Emergency Broadcast System', desc: 'Send urgent civic alerts and weather warnings to 100,000+ citizens simultaneously.' },
      { feature: 'Ticketed Grievance Tracking', desc: 'Citizens upload photo proof of civic issues and receive live resolution tracking links.' }
    ],
    workflow: [
      { step: '01', title: 'Citizen Inquiry', desc: 'Citizen messages official government WhatsApp helpline number.' },
      { step: '02', title: 'AI Form & Document Match', desc: 'AI verifies application ID against government database.' },
      { step: '03', title: 'PDF Certificate Delivery', desc: 'Delivers digitally signed official certificate PDF.' },
      { step: '04', title: 'Grievance Resolution Alert', desc: 'Sends resolution update when municipal team repairs issue.' }
    ],
    features: [
      { title: 'Official Meta Verification', desc: 'Official Green Tick badge for government agency trust.', icon: ShieldCheck },
      { title: 'Mass Public Alerts', desc: 'High-speed broadcast engine for civic announcements.', icon: Send },
      { title: 'AES-256 Citizen Privacy', desc: 'Strict data confidentiality meeting government IT rules.', icon: Lock },
      { title: 'Vernacular Language AI', desc: 'Supports Hindi, Tamil, Telugu, Marathi, and all Indian languages.', icon: Bot }
    ],
    outcomes: [
      { label: 'Public Satisfaction', value: '96%', detail: 'Eliminated physical queue delays' },
      { label: 'Ticket Resolution Time', value: '3x faster', detail: 'Automated civic complaint routing' },
      { label: 'Broadcast Deliverability', value: '99.9%', detail: 'Instant civic emergency notifications' },
      { label: 'Helpdesk Cost Savings', value: '-70%', detail: 'Reduced front-office administrative costs' }
    ],
    testimonial: {
      quote: 'AIWCRM enabled our municipal corporation to deliver citizen certificates and resolve civic complaints 3x faster with 100% official Meta compliance.',
      author: 'Administrative Officer',
      role: 'Director of e-Governance',
      company: 'Municipal Corporation Division',
      impact: '3x Faster Grievance Redressal'
    },
    faqs: [
      { q: 'Is AIWCRM approved for government agency use?', a: 'Yes, AIWCRM utilizes Meta Official Cloud API with enterprise security standards.' },
      { q: 'Does AIWCRM support all official Indian regional languages?', a: 'Yes! Full multi-language support including Hindi, Marathi, Bengali, Tamil, Telugu, and more.' }
    ]
  },

  travel: {
    id: 'travel',
    name: 'Travel & Tourism',
    badge: 'Itinerary & Booking Assistant',
    icon: Compass,
    heroHeadline: 'Instant PDF Itineraries, Flight Alerts & 24/7 Global Traveler Support',
    heroDesc: 'Automate tour package quotes, dispatch PDF travel vouchers on WhatsApp, and provide 24/7 multi-currency booking assistance.',
    metrics: [
      { label: 'Package Booking Rate', value: '+38%' },
      { label: 'Itinerary Dispatch', value: '<5s' },
      { label: 'Global Traveler Support', value: '24/7' }
    ],
    chatDemo: {
      userMsg: 'Looking for a 6-day Bali Honeymoon Package with private pool villa under ₹1.2 Lakh',
      aiTitle: 'AIWCRM Travel AI Agent',
      aiReply: 'Here is our bestselling 6D/5N Bali Luxury Itinerary PDF with flight & villa options 🌴',
      telemetry: 'Custom Itinerary Generated · Bali Package Sent'
    },
    challenges: [
      { problem: 'Custom Itinerary Delays', desc: 'Travel agents take up to 24 hours to craft custom quotes, losing impulse holiday bookings.' },
      { problem: 'Missed Flight & Visa Updates', desc: 'Travelers struggle to get urgent flight change or visa status updates while abroad.' },
      { problem: 'Unorganized Lead Pipeline', desc: 'High volume of holiday inquiry calls from ads goes untracked on personal agent phones.' }
    ],
    solutions: [
      { feature: 'Instant PDF Itinerary Delivery', desc: 'AI generates custom day-wise tour itineraries and dispatches PDFs in 5 seconds.' },
      { feature: '24/7 Global WhatsApp Concierge', desc: 'Assists travelers abroad with hotel vouchers, flight tickets, and local guide contacts.' },
      { feature: 'Ad Lead Auto-Routing', desc: 'Routes incoming travel ad inquiries instantly to dedicated destination specialists.' }
    ],
    workflow: [
      { step: '01', title: 'Travel Inquiry', desc: 'Traveler inquires about destination packages from Meta ad.' },
      { step: '02', title: 'AI Preference Screening', desc: 'AI asks dates, budget, number of travelers, and hotel preference.' },
      { step: '03', title: 'Custom PDF Package Sent', desc: 'Sends customized itinerary PDF with day-wise breakdown.' },
      { step: '04', title: 'Deposit & Booking', desc: 'Traveler confirms booking via embedded advance payment link.' }
    ],
    features: [
      { title: 'PDF Package Generator', desc: 'Deliver custom branded holiday itineraries instantly.', icon: FileText },
      { title: 'Destination Lead Routing', desc: 'Assign leads to specialized domestic/international agents.', icon: Users },
      { title: 'Automated Trip Reminders', desc: 'Send flight boarding reminders and visa check-lists.', icon: Calendar },
      { title: 'Global Multi-Currency', desc: 'Accept payments in INR, USD, EUR, and AED.', icon: DollarSign }
    ],
    outcomes: [
      { label: 'Package Conversion', value: '+38%', detail: 'Faster quote turnaround increased sales' },
      { label: 'Quote Dispatch Speed', value: '<5s', detail: 'Instant itinerary generation' },
      { label: 'Traveler Support Rating', value: '99%', detail: '24/7 assistance anywhere in the world' },
      { label: 'Agent Productivity', value: '4x', detail: 'Agents handle 4x more traveler inquiries' }
    ],
    testimonial: {
      quote: 'AIWCRM transformed our travel agency operations. Travelers receive instant PDF itineraries on WhatsApp, and our global support is active 24/7.',
      author: 'Rohan Deshmukh',
      role: 'Founder & CEO',
      company: 'Wanderlust Global Holidays',
      impact: '+38% Tour Package Sales'
    },
    faqs: [
      { q: 'Can AIWCRM handle international numbers from global travelers?', a: 'Yes! Official Meta API supports WhatsApp numbers globally across 180+ countries.' },
      { q: 'Does AIWCRM integrate with GDS and flight booking engines?', a: 'Yes, via REST webhooks and custom API connectors.' }
    ]
  },

  services: {
    id: 'services',
    name: 'Professional Services',
    badge: 'Client Screening & Consultations',
    icon: Code2,
    heroHeadline: 'Client Qualification, Consultation Booking & Document Collection',
    heroDesc: 'Screen high-value clients for legal, accounting, and consulting firms. Automate proposal delivery and calendar bookings on WhatsApp.',
    metrics: [
      { label: 'Billable Time Saved', value: '30%' },
      { label: 'Client Qualification', value: '<1 min' },
      { label: 'Proposal Delivery', value: 'Instant' }
    ],
    chatDemo: {
      userMsg: 'Need GST audit and corporate tax advisory services for a Private Limited company',
      aiTitle: 'AIWCRM Professional AI Assistant',
      aiReply: 'Here is our Corporate Tax Advisory Service Deck & Fee Schedule. Book a partner consult here 💼',
      telemetry: 'Client Qualified: Pvt Ltd · Partner Meeting Booked'
    },
    challenges: [
      { problem: 'Unqualified Client Inquiries', desc: 'Partners waste billable hours answering calls from low-budget leads.' },
      { problem: 'Slow Proposal Turnaround', desc: 'Delays in sending formal service proposals cause prospective clients to pick rival firms.' },
      { problem: 'Uncollected Client Documents', desc: 'Chasing clients for tax documents and audit files via email causes project delays.' }
    ],
    solutions: [
      { feature: 'AI Client Qualification', desc: 'Screens leads by turnover, company type, and service budget before booking partner time.' },
      { feature: 'Instant Proposal Delivery', desc: 'Delivers customized service decks and engagement letters automatically on WhatsApp.' },
      { feature: 'WhatsApp Document Portal', desc: 'Clients upload tax documents and financial statements securely in chat.' }
    ],
    workflow: [
      { step: '01', title: 'Client Inbound Message', desc: 'Prospect inquires about legal, audit, or consulting services.' },
      { step: '02', title: 'AI Budget Screening', desc: 'AI verifies business turnover and required scope of work.' },
      { step: '03', title: 'Proposal & Calendar Link', desc: 'AI dispatches proposal PDF and Google Calendar booking link.' },
      { step: '04', title: 'Document Collection', desc: 'Sends checklist of required onboarding documents.' }
    ],
    features: [
      { title: 'Google Calendar Sync', desc: 'Automate consultation bookings with partner calendars.', icon: Calendar },
      { title: 'Secure Document Vault', desc: 'Receive client financial files with AES-256 security.', icon: Lock },
      { title: 'Proposal PDF Dispatch', desc: 'Instant sharing of service proposals and fee schedules.', icon: FileText },
      { title: 'Team Role Management', desc: 'Manage access between partners, associates, and staff.', icon: Users }
    ],
    outcomes: [
      { label: 'Billable Hours Saved', value: '30%', detail: 'Partners focus only on pre-screened clients' },
      { label: 'Proposal Turnaround', value: 'Instant', detail: 'Zero delay in service deck delivery' },
      { label: 'Client Onboarding', value: '2x faster', detail: 'Automated document checklist on WhatsApp' },
      { label: 'Close Rate', value: '+35%', detail: 'Higher conversion on qualified consultations' }
    ],
    testimonial: {
      quote: 'AIWCRM freed up 30% of our senior partners’ billable hours. Low-budget inquiries are screened out automatically, and proposal delivery takes seconds.',
      author: 'Amitabh Verma',
      role: 'Senior Managing Partner',
      company: 'Verma & Associates Chartered Accountants',
      impact: '30% Billable Hours Saved'
    },
    faqs: [
      { q: 'Can AIWCRM integrate with Calendly or Google Calendar for partner bookings?', a: 'Yes! Automated appointment booking synced with Google Calendar or Calendly.' },
      { q: 'Is client confidentiality protected on AIWCRM?', a: 'Yes, end-to-end Meta Cloud API security with strict role-based access control.' }
    ]
  },

  b2b: {
    id: 'b2b',
    name: 'B2B Enterprise',
    badge: 'Key Account Management & BYOK',
    icon: Building2,
    heroHeadline: 'Multi-Agent Enterprise Inbox, ERP Webhooks & Zero Token Markup',
    heroDesc: 'Scale key account communication, connect ERP webhooks, and cut AI expenses by 60% with BYOK model routing.',
    metrics: [
      { label: 'AI Cost Savings', value: '60%' },
      { label: 'Enterprise SLA', value: '99.99%' },
      { label: 'API Webhook Speed', value: '<50ms' }
    ],
    chatDemo: {
      userMsg: 'Requesting API documentation and enterprise custom SLA pricing for 100+ seats',
      aiTitle: 'AIWCRM B2B Enterprise Gateway',
      aiReply: 'Enterprise Deck & Security Whitepaper attached! Connect with an Enterprise Account Exec 🏢',
      telemetry: 'Enterprise Lead Tagged · Assigned to Account Executive'
    },
    challenges: [
      { problem: 'Exorbitant AI Vendor Markups', desc: 'SaaS vendors charge 30-50% markups on AI tokens, costing enterprises millions annually.' },
      { problem: 'Lack of Role-Based Governance', desc: 'Large sales teams need strict RBAC to prevent unauthorized data exports and phone number leaks.' },
      { problem: 'Siloed Key Account Data', desc: 'WhatsApp conversations with key accounts remain locked on individual employee phones.' }
    ],
    solutions: [
      { feature: 'Zero-Markup BYOK Engine', desc: 'Plug your own OpenAI, Gemini, or Claude API keys to pay raw provider rates with 0% markup.' },
      { feature: 'Enterprise RBAC & Audit Trail', desc: 'Enforce granular permissions, phone number masking, and SOC2 audit logging.' },
      { feature: 'Central Key Account Inbox', desc: 'Unify all enterprise customer communication under one shared team dashboard.' }
    ],
    workflow: [
      { step: '01', title: 'Key Account Inbound', desc: 'Enterprise client messages WhatsApp asking for support or quote.' },
      { step: '02', title: 'BYOK AI Processing', desc: 'AI processes query using direct provider keys at 0% markup.' },
      { step: '03', title: 'ERP Webhook Sync', desc: 'Queries SAP/Oracle database for key account order history.' },
      { step: '04', title: 'Account Manager Escalation', desc: 'Seamlessly transfers high-priority deals to dedicated Account Exec.' }
    ],
    features: [
      { title: 'BYOK Model Vault', desc: 'Connect OpenAI, Gemini, Claude, Groq, and DeepSeek keys.', icon: Bot },
      { title: 'Single-Tenant VPC Support', desc: 'Isolated VPC deployment for extreme enterprise security.', icon: Lock },
      { title: 'Sub-50ms REST APIs', desc: 'High-speed webhooks for custom CRM and ERP integrations.', icon: Code2 },
      { title: 'SOC2 & GDPR Compliant', desc: 'Full compliance with international data security standards.', icon: ShieldCheck }
    ],
    outcomes: [
      { label: 'AI Cost Reduction', value: '60%', detail: 'Saved millions using BYOK direct provider rates' },
      { label: 'System Uptime', value: '99.99%', detail: 'Guaranteed by self-healing auto-failover' },
      { label: 'Response Speed', value: '<100ms', detail: 'Instant replies via 0-token greeting cache' },
      { label: 'Security Audit Pass', value: '100%', detail: 'Passed strict SOC2 and enterprise pentests' }
    ],
    testimonial: {
      quote: 'AIWCRM gave our B2B enterprise complete visibility over key account communication. The BYOK model allowed us to cut our monthly AI expenses by 60%.',
      author: 'Sanjay Kulkarni',
      role: 'Chief Technology Officer',
      company: 'Zenith Logistics & Supply Chain Ltd',
      impact: '60% AI Expense Reduction'
    },
    faqs: [
      { q: 'Can AIWCRM provide dedicated VPC deployment for enterprise security?', a: 'Yes! Enterprise plans support custom single-tenant VPC deployments and custom domain SSLs.' },
      { q: 'Can we connect multiple WhatsApp Business API numbers under one enterprise account?', a: 'Yes, AIWCRM supports multi-number management for global enterprise divisions.' }
    ]
  }
};

export function IndustrySolutionsClient({ initialIndustry }: { initialIndustry?: string }) {
  const defaultId = (initialIndustry && INDUSTRIES_DATA[initialIndustry.toLowerCase()]) ? initialIndustry.toLowerCase() : 'manufacturing';
  const [selectedId, setSelectedId] = useState<string>(defaultId);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  useEffect(() => {
    if (initialIndustry && INDUSTRIES_DATA[initialIndustry.toLowerCase()]) {
      setSelectedId(initialIndustry.toLowerCase());
    }
  }, [initialIndustry]);

  const current = INDUSTRIES_DATA[selectedId] || INDUSTRIES_DATA.manufacturing;
  const IconComponent = current.icon;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      
      {/* 1. ENTERPRISE SOLUTIONS PAGE HERO */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 bg-background border-b border-border/40">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-tr from-emerald-500/15 via-blue-500/10 to-purple-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-emerald-400">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <span>Salesforce & ServiceNow Grade Industry Workflows</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.06] max-w-5xl mx-auto">
            Tailored Industry Workflows for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500">
              Enterprise Growth
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-normal">
            Discover how AIWCRM automates sales pipelines, customer support, and AI auto-replies across 12 high-growth industry verticals with zero AI token markup.
          </p>
        </div>
      </section>

      {/* 2. STICKY HORIZONTAL INDUSTRY SELECTOR BAR */}
      <div className="sticky top-16 sm:top-20 z-40 bg-background/90 backdrop-blur-xl border-b border-border/60 py-4 shadow-md">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-6xl mx-auto py-1">
            {Object.values(INDUSTRIES_DATA).map((ind) => {
              const Icon = ind.icon;
              const isSelected = selectedId === ind.id;
              return (
                <button
                  key={ind.id}
                  onClick={() => setSelectedId(ind.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-xl shadow-emerald-500/30 scale-105'
                      : 'bg-card/90 border-border/80 text-muted-foreground hover:text-foreground hover:bg-card hover:border-emerald-500/40'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{ind.name}</span>
                  <span
                    className={`text-[9px] font-mono font-extrabold px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-emerald-500/30 text-white border border-emerald-400/30'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {ind.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. DYNAMIC SELECTED INDUSTRY HERO & LIVE DEMO */}
      <section className="py-16 lg:py-24 bg-card/30 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-extrabold text-emerald-400">
                <IconComponent className="h-4 w-4 text-emerald-500" />
                <span>{current.badge}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
                {current.heroHeadline}
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {current.heroDesc}
              </p>

              {/* KPI Badges */}
              <div className="grid grid-cols-3 gap-4 pt-2 border-y border-border/60 py-6">
                {current.metrics.map((m, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-2xl sm:text-3xl font-black text-emerald-400">{m.value}</p>
                    <p className="text-[11px] font-mono text-muted-foreground uppercase font-bold">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <Link
                  href="/free-trial"
                  className="flex h-14 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-9 text-base transition-all shadow-xl shadow-emerald-500/20 hover:scale-[1.02] gap-2.5"
                >
                  Start 7-Day Free Trial <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/book-demo"
                  className="flex h-14 items-center justify-center rounded-full border-2 border-emerald-500/30 bg-card/60 backdrop-blur-md px-9 text-base font-bold text-foreground hover:bg-emerald-500/10"
                >
                  Schedule Industry Demo
                </Link>
              </div>
            </div>

            {/* Right Live Phone Chat Screen Mockup */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="w-full max-w-[340px] rounded-[40px] border-[8px] border-slate-900 bg-slate-950 p-2 shadow-2xl shadow-emerald-500/15 relative overflow-hidden">
                <div className="w-32 h-4 bg-slate-900 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
                  <div className="w-10 h-1 bg-slate-800 rounded-full" />
                </div>
                <div className="rounded-[30px] bg-[#0b141a] p-3 text-white text-xs space-y-3 font-sans relative overflow-hidden min-h-[460px] flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 px-1">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                        W
                      </div>
                      <div>
                        <p className="font-bold text-white text-xs">AIWCRM {current.name} AI</p>
                        <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" /> Online · Gemini 3.6
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto py-2">
                    <div className="flex justify-end">
                      <div className="bg-[#005c4b] text-white p-2.5 rounded-2xl rounded-tr-none max-w-[85%] space-y-0.5">
                        <p>{current.chatDemo.userMsg}</p>
                        <span className="text-[9px] text-emerald-200 float-right pl-2 font-mono">10:42 AM</span>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-[#202c33] text-white p-2.5 rounded-2xl rounded-tl-none max-w-[88%] space-y-1.5 border border-emerald-500/30">
                        <p className="font-bold text-emerald-400 text-[11px]">{current.chatDemo.aiTitle}</p>
                        <p>{current.chatDemo.aiReply}</p>
                        <span className="text-[9px] text-slate-400 float-right font-mono">10:42 AM</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#111b21] p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <p className="text-[9px] font-mono text-emerald-400 font-bold">● {current.chatDemo.telemetry}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SPLIT-SCREEN: CHALLENGES VS. AIWCRM SOLUTIONS */}
      <section className="py-24 bg-background border-t border-border/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-500">
              Problem & Solution Matrix
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground">
              Overcoming {current.name} Operational Roadblocks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Left: Painful Legacy Challenges */}
            <div className="p-8 rounded-3xl bg-rose-500/5 border border-rose-500/20 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider">
                Legacy Bottlenecks
              </div>
              <div className="space-y-6">
                {current.challenges.map((c, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-card border border-rose-500/20 space-y-1.5">
                    <h3 className="font-bold text-foreground text-base text-rose-400">{c.problem}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: AIWCRM AI Solutions */}
            <div className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                AIWCRM Intelligent Capability
              </div>
              <div className="space-y-6">
                {current.solutions.map((s, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-card border border-emerald-500/30 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <h3 className="font-extrabold text-foreground text-base">{s.feature}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE ANIMATED WORKFLOW TIMELINE */}
      <section className="py-24 bg-card/40 border-t border-border/50 text-center">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-500">
              End-To-End Automation Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">
              How {current.name} Automation Operates
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {current.workflow.map((w, idx) => (
              <div key={idx} className="p-6 rounded-3xl bg-background border border-border/80 shadow-md space-y-3 relative flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-3xl font-black text-emerald-500 font-mono">{w.step}</span>
                  <h3 className="font-extrabold text-foreground text-base">{w.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{w.desc}</p>
                </div>
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">● Active Automated Step</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TAILORED ENTERPRISE FEATURES LIST */}
      <section className="py-24 bg-background border-t border-border/50">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-500">
              Enterprise Feature Suite
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">
              Core Capabilities for {current.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {current.features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 w-fit">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-extrabold text-foreground text-base">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. MEASURABLE BUSINESS OUTCOMES & ROI */}
      <section className="py-24 bg-slate-950 text-white border-t border-slate-800">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
              Measurable Business ROI
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
              Expected Growth Metrics for {current.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {current.outcomes.map((o, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 text-center">
                <p className="text-5xl font-black text-emerald-400">{o.value}</p>
                <p className="font-bold text-white text-base">{o.label}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{o.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. VERIFIED CUSTOMER TESTIMONIAL SPOTLIGHT */}
      <section className="py-24 bg-card/40 border-t border-border/50">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            Verified Case Study Spotlight
          </div>

          <blockquote className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground leading-relaxed italic">
            &ldquo;{current.testimonial.quote}&rdquo;
          </blockquote>

          <div className="space-y-1">
            <p className="font-extrabold text-foreground text-lg">{current.testimonial.author}</p>
            <p className="text-xs text-emerald-400 font-mono">{current.testimonial.role} · {current.testimonial.company}</p>
            <div className="inline-block mt-2 px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black border border-emerald-500/40">
              Impact: {current.testimonial.impact}
            </div>
          </div>
        </div>
      </section>

      {/* 9. INDUSTRY FAQ ACCORDION */}
      <section className="py-24 bg-background border-t border-border/50">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground">
              {current.name} Industry FAQs
            </h2>
          </div>

          <div className="space-y-4">
            {current.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm transition-all group overflow-hidden cursor-pointer"
                open={openFaqIdx === idx}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenFaqIdx(openFaqIdx === idx ? null : idx);
                }}
              >
                <summary className="font-extrabold text-base text-foreground flex items-center justify-between gap-4 list-none group-hover:text-emerald-400 transition-colors">
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${openFaqIdx === idx ? 'rotate-180' : ''}`} />
                </summary>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 10. VERCEL-STYLE SPOTLIGHT CONVERSION CTA */}
      <section className="py-28 bg-slate-950 text-white relative overflow-hidden text-center border-t border-slate-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/20 blur-[180px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl px-4 space-y-8 relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            Ready to Automate {current.name} Sales & Support?
          </h2>
          <p className="text-base text-slate-400 max-w-2xl mx-auto">
            Join hundreds of forward-thinking enterprises in {current.name} using AIWCRM to qualify leads, automate support, and drive high ROI on WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/free-trial"
              className="flex h-14 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-10 text-base transition-all shadow-xl shadow-emerald-500/25 hover:scale-[1.03] gap-2.5"
            >
              Start 7-Day Free Trial <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/book-demo"
              className="flex h-14 items-center justify-center rounded-full border-2 border-slate-700 bg-slate-900/80 px-10 text-base font-bold text-white transition-all hover:bg-slate-800"
            >
              Schedule Industry Demo
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
