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
  Cpu
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
      aiTitle: 'WCRM Manufacturing AI (ERP Synced)',
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
      { step: '02', title: 'AI Intent & Stock Check', desc: 'WCRM AI parses model numbers and queries inventory stock level via REST API.' },
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
      quote: 'WCRM transformed our B2B dealer network across India. Our distributors receive instant stock availability and PDF quotes on WhatsApp in seconds.',
      author: 'Rajesh Singhania',
      role: 'VP Commercial Operations',
      company: 'Apex Industrial Tools Ltd',
      impact: '3.5x Faster Deal Cycles'
    },
    faqs: [
      { q: 'Can WCRM integrate with our existing Tally or SAP ERP?', a: 'Yes! WCRM provides bi-directional REST webhooks and APIs to fetch stock availability, generate invoices, and log customer interactions directly into your ERP.' },
      { q: 'How does WCRM handle bulk dealer broadcasts without getting blocked?', a: 'WCRM uses Meta Official Cloud API templates, ensuring 100% compliance, zero phone number bans, and maximum deliverability.' }
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
      aiTitle: 'WCRM Admission Counselor AI',
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
      quote: 'WCRM transformed our student admission counseling. The Gemini AI auto-responder handles 80% of routine inquiries instantly, saving our staff hundreds of hours during peak season.',
      author: 'Admissions Director',
      role: 'Director of Admissions',
      company: 'BPTPIA (Bihar Private Technical & Professional Institutions)',
      impact: '+48% Campus Visit Enrollments'
    },
    faqs: [
      { q: 'Can WCRM customize the AI auto-responder for our college prospectus?', a: 'Yes! You can upload your PDF prospectus, fee matrix, and FAQs. The AI learns your exact curriculum and rules.' },
      { q: 'Is WCRM compliant with student data privacy regulations?', a: 'Yes, WCRM uses Meta Official Cloud API with enterprise-grade AES-256 encryption.' }
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
      aiTitle: 'WCRM Clinic AI Assistant',
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
      quote: 'WCRM slashed our patient no-show rate by 90%. Our receptionists no longer spend all morning making manual confirmation calls.',
      author: 'Dr. Ananya Roy',
      role: 'Medical Director',
      company: 'Metro Care Super Speciality Clinics',
      impact: '-90% Appointment No-Shows'
    },
    faqs: [
      { q: 'Is patient medical data secure on WCRM?', a: 'Yes. All messages are transmitted via Meta Official Cloud API with end-to-end encryption.' },
      { q: 'Can WCRM integrate with our Hospital Management Information System (HMIS)?', a: 'Yes, via REST webhooks and API triggers.' }
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
      aiTitle: 'WCRM D2C Order AI',
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
      { step: '02', title: 'WhatsApp Alert Triggered', desc: 'WCRM sends friendly reminder with cart items and discount link.' },
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
      quote: 'WCRM replaced our old email marketing tool. Our WhatsApp broadcast campaigns achieve a 98% open rate and generated 12x ROI in 30 days.',
      author: 'Karan Malhotra',
      role: 'Co-Founder & CMO',
      company: 'UrbanStyle Apparel D2C',
      impact: '12x Campaign ROI'
    },
    faqs: [
      { q: 'Does WCRM connect directly with Shopify and WooCommerce?', a: 'Yes! WCRM integrates with Shopify and WooCommerce to trigger cart recovery, COD verification, and order tracking.' },
      { q: 'Can we send WhatsApp broadcast messages with images and buttons?', a: 'Yes, full support for Meta interactive messages, image headers, and CTA buttons.' }
    ]
  },

  'real-estate': {
    id: 'real-estate',
    name: 'Real Estate & Property',
    badge: 'Property Sales & Site Visits',
    icon: Building,
    heroHeadline: 'Convert Property Prospects into Confirmed Site Visits Faster',
    heroDesc: 'Automate lead qualification, send floor plan PDFs, schedule site visit appointments, and track sales pipeline deals in real time.',
    metrics: [
      { label: 'Site Visit Bookings', value: '2.5x' },
      { label: 'Lead Response Time', value: '<5s' },
      { label: 'Agent Pipeline Deals', value: '+38%' }
    ],
    chatDemo: {
      userMsg: 'Interested in 3BHK luxury apartments at Grand Heights. Send floor plans.',
      aiTitle: 'WCRM Real Estate AI',
      aiReply: 'Sending 3BHK Grand Heights Brochure & Floor Plans PDF! Would you like to schedule a site visit this Saturday? 🏢',
      telemetry: 'PDF Dispatched · Lead Intent: HOT 🔥 (Budget ₹1.5 Cr+)'
    },
    challenges: [
      { problem: 'Slow Lead Qualification', desc: 'Realtors waste time calling unqualified leads who don’t have the budget.' },
      { problem: 'Unscheduled Site Visits', desc: 'High drop-off between digital ad inquiries and actual physical site visits.' },
      { problem: 'Unorganized Agent Follow-ups', desc: 'Leads assigned to sales agents get forgotten without centralized pipeline tracking.' }
    ],
    solutions: [
      { feature: 'Instant Floor Plan Delivery', desc: 'Delivers high-res brochure PDFs and video walkthrough links instantly on WhatsApp.' },
      { feature: 'AI Lead Intent Scoring', desc: 'Evaluates buyer budget and urgency (HOT 🔥, WARM) before alerting senior agents.' },
      { feature: 'Visual Kanban Deal Pipeline', desc: 'Track property deals from initial inquiry to site visit, token payment, and registration.' }
    ],
    workflow: [
      { step: '01', title: 'Ad Lead Inbound', desc: 'Buyer clicks Facebook/Google Property Ad to WhatsApp.' },
      { step: '02', title: 'AI Budget & Location Check', desc: 'AI asks configuration (2BHK/3BHK) and budget preferences.' },
      { step: '03', title: 'Brochure & Site Visit Confirmation', desc: 'Sends PDF brochure and books site visit pickup date.' },
      { step: '04', title: 'Agent Kanban Assignment', desc: 'Assigned agent receives WhatsApp notification with lead profile.' }
    ],
    features: [
      { title: 'Brochure PDF Sharing', desc: 'Instant dispatch of property brochures and payment schedules.', icon: FileText },
      { title: 'Site Visit Scheduling', desc: 'Calendar integration for booking agent site visit tours.', icon: Clock },
      { title: 'Kanban Property Pipeline', desc: 'Visual sales stages for property deals and tokens.', icon: Kanban },
      { title: 'Lead Re-engagement', desc: 'Re-engage cold property leads with price drop alerts.', icon: Send }
    ],
    outcomes: [
      { label: 'Site Visit Conversion', value: '2.5x', detail: 'More buyers visiting properties' },
      { label: 'Lead Response Time', value: '<5s', detail: 'Instant answer while buyer interest is high' },
      { label: 'Agent Deal Velocity', value: '+38%', detail: 'Faster closing of property deals' },
      { label: 'Lead Wastage', value: '0%', detail: 'Every ad lead tracked in CRM' }
    ],
    testimonial: {
      quote: 'WCRM doubled our weekend site visit volume. Property buyers get floor plans instantly on WhatsApp, and our agents know exactly which leads are HOT.',
      author: 'Vikramaditya Rao',
      role: 'Sales Director',
      company: 'Skyline Luxury Developers',
      impact: '2.5x Site Visit Bookings'
    },
    faqs: [
      { q: 'Can WCRM assign property leads to different agents based on location?', a: 'Yes! Smart lead routing distributes leads based on project location, budget, or agent availability.' },
      { q: 'Can we send video walkthrough links on WhatsApp?', a: 'Yes, you can share YouTube links, MP4 video previews, and interactive virtual tour URLs.' }
    ]
  },

  finance: {
    id: 'finance',
    name: 'BFSI & Financial Services',
    badge: 'KYC & Secure Payment Collect',
    icon: Landmark,
    heroHeadline: 'Secure Document Collection & Loan Disposals on WhatsApp',
    heroDesc: 'Automate KYC document collection, EMI payment reminders, credit score checks, and secure payment links with enterprise AES-256 encryption.',
    metrics: [
      { label: 'Document Delay Reduction', value: '-60%' },
      { label: 'On-Time EMI Payments', value: '+35%' },
      { label: 'Security Standard', value: 'AES-256' }
    ],
    chatDemo: {
      userMsg: 'What is the status of my Personal Loan application #LN-9921?',
      aiTitle: 'WCRM BFSI AI Gateway',
      aiReply: 'Loan Approved! Approved Amount: ₹5,00,000. Please upload Aadhaar & PAN image to complete disbursement 📄',
      telemetry: 'Encrypted Channel · KYC Document Upload Active'
    },
    challenges: [
      { problem: 'Pending Document Uploads', desc: 'Loan applicants delay sending PAN/Aadhaar/Bank statements via email.' },
      { problem: 'Overdue EMI Payments', desc: 'High collection costs for manual EMI reminder calls.' },
      { problem: 'Security & Compliance Standards', desc: 'Strict regulatory requirements for customer financial data privacy.' }
    ],
    solutions: [
      { feature: 'Instant Document Capture', desc: 'Customers take photo of documents on WhatsApp for instant OCR processing.' },
      { feature: 'Automated EMI Reminders', desc: 'Sends scheduled payment reminder alerts with embedded UPI/NetBanking links.' },
      { feature: 'Bank-Grade AES-256 Encryption', desc: 'Meta Official API infrastructure meeting strict BFSI compliance standards.' }
    ],
    workflow: [
      { step: '01', title: 'Application Submitted', desc: 'Customer applies for loan or insurance policy.' },
      { step: '02', title: 'WhatsApp Document Request', desc: 'System requests Aadhaar, PAN, or salary slip photos.' },
      { step: '03', title: 'Instant Verification & Approval', desc: 'Documents verified and loan agreement sent for e-sign.' },
      { step: '04', title: 'EMI Payment Sequence', desc: 'Automated monthly WhatsApp reminders before due date.' }
    ],
    features: [
      { title: 'Secure Document Upload', desc: 'Capture & encrypt customer KYC documents.', icon: ShieldCheck },
      { title: 'UPI & Payment Links', desc: 'Send direct payment collection links on WhatsApp.', icon: TrendingUp },
      { title: 'Automated Policy Alerts', desc: 'Send renewal notices for insurance policies.', icon: Send },
      { title: 'Multi-Agent Team Inbox', desc: 'Route loan underwriting queries to specialized reps.', icon: Users }
    ],
    outcomes: [
      { label: 'Document Collection Speed', value: '3x', detail: 'KYC completed in minutes instead of days' },
      { label: 'EMI Collection Rate', value: '+35%', detail: 'Higher on-time monthly payments' },
      { label: 'Loan Processing Cost', value: '-50%', detail: 'Lower manual operational expenses' },
      { label: 'Security Standard', value: '100%', detail: 'Fully compliant Meta Cloud API' }
    ],
    testimonial: {
      quote: 'WCRM streamlined our loan document collection. Customers upload their Aadhaar and PAN on WhatsApp in minutes, cutting our approval turnaround time by 60%.',
      author: 'Sanjay Deshmukh',
      role: 'Head of Digital Lending',
      company: 'FinServe India Capital',
      impact: '-60% Document Turnaround'
    },
    faqs: [
      { q: 'Is WCRM compliant with RBI and financial data privacy guidelines?', a: 'Yes. WCRM routes all traffic via Meta Official Cloud API with end-to-end AES-256 encryption.' },
      { q: 'Can WCRM generate dynamic UPI payment links?', a: 'Yes, integrated payment links (Razorpay, PayU, Cashfree) allow instant 1-click payments inside WhatsApp.' }
    ]
  },

  hospitality: {
    id: 'hospitality',
    name: 'Hospitality & Hotels',
    badge: 'Guest Concierge & Direct Bookings',
    icon: Hotel,
    heroHeadline: '24/7 WhatsApp AI Guest Concierge & Direct Hotel Bookings',
    heroDesc: 'Automate table reservations, check-in instructions, room service requests, and review collection with zero commission fees.',
    metrics: [
      { label: 'Direct Booking Revenue', value: '+30%' },
      { label: 'Guest Satisfaction', value: '98%' },
      { label: 'Concierge Response', value: '<100ms' }
    ],
    chatDemo: {
      userMsg: 'Can I book a table for 4 people tonight at 8:00 PM?',
      aiTitle: 'WCRM Hotel Concierge AI',
      aiReply: 'Table reserved for 4 at 8:00 PM! Menu PDF attached. Would you like to pre-order appetizers? 🍽️',
      telemetry: 'Table #14 Reserved · Reservation Sent via WhatsApp'
    },
    challenges: [
      { problem: 'High OTA Commission Fees', desc: 'Hotels lose up to 25% revenue on booking commissions to third-party travel aggregators.' },
      { problem: 'Front Desk Bottlenecks', desc: 'Guests wait in line for basic check-in details, Wi-Fi passwords, and room service menus.' },
      { problem: 'Uncollected Guest Reviews', desc: 'Low Google review counts because post-checkout survey links sent via email get ignored.' }
    ],
    solutions: [
      { feature: 'Direct WhatsApp Bookings', desc: 'Guests book rooms and tables directly via WhatsApp with zero aggregator commission fees.' },
      { feature: '24/7 AI Guest Concierge', desc: 'Answers Wi-Fi passwords, pool timings, room service requests, and local attractions instantly.' },
      { feature: 'Automated Review Collection', desc: 'Sends friendly post-checkout WhatsApp messages inviting guests to rate their stay on Google.' }
    ],
    workflow: [
      { step: '01', title: 'Guest Inquiry', desc: 'Guest asks for room availability or menu.' },
      { step: '02', title: 'AI Booking Confirmation', desc: 'AI checks room inventory and sends booking link.' },
      { step: '03', title: 'In-Stay Concierge Support', desc: 'Guest requests extra towels or room service via WhatsApp.' },
      { step: '04', title: 'Post-Stay Review Request', desc: 'Automated 5-star Google review prompt sent after checkout.' }
    ],
    features: [
      { title: 'Digital Menu & PDF Sharing', desc: 'Instant sharing of food & spa menus.', icon: FileText },
      { title: 'Check-In Verification', desc: 'Pre-arrival guest ID submission on WhatsApp.', icon: ShieldCheck },
      { title: 'Room Service Order Bot', desc: 'Take in-room dining orders automatically.', icon: Bot },
      { title: 'Review Growth Engine', desc: 'Boost Google & TripAdvisor review ratings.', icon: TrendingUp }
    ],
    outcomes: [
      { label: 'Direct Bookings', value: '+30%', detail: 'Saved thousands in OTA commission fees' },
      { label: 'Guest Response Time', value: '<100ms', detail: 'Instant answers to all room inquiries' },
      { label: 'Google Review Score', value: '4.8⭐', detail: '3x more positive guest reviews' },
      { label: 'Staff Efficiency', value: '4x', detail: 'Front desk focuses on in-person guest care' }
    ],
    testimonial: {
      quote: 'WCRM helped us increase direct hotel bookings by 30%. Guests love receiving their check-in details and digital menus on WhatsApp.',
      author: 'Rohit Oberoi',
      role: 'General Manager',
      company: 'Grand Palace Resorts & Spa',
      impact: '+30% Direct Bookings'
    },
    faqs: [
      { q: 'Can WCRM integrate with Property Management Systems (PMS)?', a: 'Yes, via REST webhooks to sync room availability and guest details.' },
      { q: 'Can we send broadcast offers for festive dining packages?', a: 'Yes, schedule Meta-approved broadcast campaigns to past guests.' }
    ]
  },

  government: {
    id: 'government',
    name: 'Government & Public Sector',
    badge: 'Citizen Services & Civic Alerts',
    icon: Building2,
    heroHeadline: 'Citizen Grievance Redressal & Public Alerts on WhatsApp',
    heroDesc: 'Automate citizen inquiry handling, civic grievance registration, digital document issuing, and high-volume public alerts securely.',
    metrics: [
      { label: 'Grievance Resolution', value: '3x Faster' },
      { label: 'Citizen Satisfaction', value: '96%' },
      { label: 'Broadcast Deliverability', value: '99.9%' }
    ],
    chatDemo: {
      userMsg: 'I want to track my Municipal Utility Permit application #UT-7712',
      aiTitle: 'WCRM Citizen AI Portal',
      aiReply: 'Permit #UT-7712 Approved! Download official digital permit certificate PDF below 📄',
      telemetry: 'DigiLocker Verified · Certificate PDF Dispatched'
    },
    challenges: [
      { problem: 'Overcrowded Government Offices', desc: 'Citizens stand in long queues for simple status updates and certificate downloads.' },
      { problem: 'Slow Grievance Redressal', desc: 'Public complaints get delayed due to manual paper routing between departments.' },
      { problem: 'Emergency Alert Broadcasting', desc: 'Difficulty broadcasting urgent weather or civic alerts to lakhs of citizens reliably.' }
    ],
    solutions: [
      { feature: 'Digital Document Dispatch', desc: 'Citizens download verified certificates and permits instantly on WhatsApp.' },
      { feature: 'Automated Grievance Tagging', desc: 'Public complaints are categorized, assigned ticket numbers, and routed to officers.' },
      { feature: 'Mass Public WhatsApp Broadcasts', desc: 'Send emergency alerts and civic advisories to 100,000+ citizens in seconds.' }
    ],
    workflow: [
      { step: '01', title: 'Citizen Messages Helpline', desc: 'Citizen requests permit status or files complaint.' },
      { step: '02', title: 'AI Identity Verification', desc: 'AI verifies mobile number and application ID.' },
      { step: '03', title: 'Instant Document / Ticket', desc: 'System dispatches PDF document or assigns ticket ID.' },
      { step: '04', title: 'Officer Department Routing', desc: 'Escalated issues routed to departmental officers in team inbox.' }
    ],
    features: [
      { title: 'Digital Certificate Delivery', desc: 'Instant PDF dispatch of verified documents.', icon: FileText },
      { title: 'Department Ticket Routing', desc: 'Route civic complaints to appropriate municipal officer.', icon: Users },
      { title: 'Mass Alert Broadcasting', desc: 'Broadcast emergency advisories to lakhs of citizens.', icon: Send },
      { title: 'Multilingual Regional Support', desc: 'Full support for Hindi, Tamil, Bengali, Marathi, etc.', icon: Bot }
    ],
    outcomes: [
      { label: 'Queue Reduction', value: '-75%', detail: 'Fewer citizens visiting physical counters' },
      { label: 'Grievance Resolution', value: '3x Faster', detail: 'Automated ticketing and officer routing' },
      { label: 'Public Satisfaction', value: '96%', detail: 'Instant transparency on application status' },
      { label: 'Broadcast Capacity', value: '100K+', detail: 'High-speed official Meta API alerts' }
    ],
    testimonial: {
      quote: 'WCRM enabled our municipal corporation to deliver citizen certificates and resolve civic complaints 3x faster with 100% official Meta compliance.',
      author: 'M. K. Verma',
      role: 'Chief IT Commissioner',
      company: 'Smart City Municipal Board',
      impact: '3x Faster Resolution'
    },
    faqs: [
      { q: 'Is WCRM approved for government agency use?', a: 'Yes, WCRM utilizes Meta Official Cloud API with enterprise security standards.' },
      { q: 'Can citizens communicate in local regional languages?', a: 'Yes, full multilingual AI auto-reply capability across Indian languages.' }
    ]
  },

  travel: {
    id: 'travel',
    name: 'Travel & Tourism',
    badge: 'Itinerary Sharing & Global Support',
    icon: Plane,
    heroHeadline: 'Automated Itinerary Sharing & 24/7 Traveler Assistance',
    heroDesc: 'Share beautiful travel itineraries, automated flight updates, tour booking confirmations, and 24/7 global traveler support on WhatsApp.',
    metrics: [
      { label: 'Tour Booking Growth', value: '+35%' },
      { label: 'Support Response', value: '<50ms' },
      { label: 'Traveler Rating', value: '4.9⭐' }
    ],
    chatDemo: {
      userMsg: 'Send complete itinerary and hotel list for 5-Day Kerala Tour Package',
      aiTitle: 'WCRM Travel AI Agent',
      aiReply: 'Kerala 5D/4N Package Itinerary PDF attached! Price: ₹18,500/person (Hotels + Cab included) 🌴',
      telemetry: 'PDF Dispatched · Package Lead Tagged: Kerala Tour'
    },
    challenges: [
      { problem: 'Unstructured Package Inquiries', desc: 'Travelers ask for customized itineraries across email, phone, and social media.' },
      { problem: 'Flight & Tour Delay Communication', desc: 'Manual calls to inform groups about schedule changes take hours.' },
      { problem: 'Global Time-Zone Support', desc: 'Travelers abroad need urgent assistance outside Indian office hours.' }
    ],
    solutions: [
      { feature: 'Instant PDF Itinerary Sharing', desc: 'AI sends rich travel itineraries with hotel lists and pricing instantly on WhatsApp.' },
      { feature: 'Automated Flight & Tour Alerts', desc: 'Send group WhatsApp broadcast updates regarding pickup times and tour schedules.' },
      { feature: '24/7 Global AI Traveler Support', desc: 'AI answers emergency voucher queries, hotel locations, and cab details anytime.' }
    ],
    workflow: [
      { step: '01', title: 'Traveler Inquiry', desc: 'Customer requests tour package details.' },
      { step: '02', title: 'AI Itinerary Recommendation', desc: 'AI recommends top tour packages matching budget.' },
      { step: '03', title: 'Booking & Voucher Dispatch', desc: 'Customer confirms booking and receives voucher PDF.' },
      { step: '04', title: '24/7 On-Trip Assistance', desc: 'AI assists traveler during trip with directions and support.' }
    ],
    features: [
      { title: 'Itinerary PDF Dispatch', desc: 'Send rich PDF itineraries and tour vouchers.', icon: FileText },
      { title: 'Group Broadcast Updates', desc: 'Inform tour groups about daily schedule changes.', icon: Send },
      { title: '24/7 AI Concierge', desc: 'Round-the-clock assistance for international travelers.', icon: Bot },
      { title: 'Multi-Currency Support', desc: 'Display package costs in INR, USD, EUR, or AED.', icon: TrendingUp }
    ],
    outcomes: [
      { label: 'Tour Package Sales', value: '+35%', detail: 'Faster booking with instant itinerary PDF' },
      { label: 'Customer Rating', value: '4.9⭐', detail: 'High praise for 24/7 on-trip assistance' },
      { label: 'After-Hours Support', value: '100%', detail: 'Zero traveler inquiries missed overnight' },
      { label: 'Operational Costs', value: '-50%', detail: 'Automated routine travel updates' }
    ],
    testimonial: {
      quote: 'WCRM transformed our travel agency operations. Travelers receive instant PDF itineraries on WhatsApp, and our global support is active 24/7.',
      author: 'Meera Kapur',
      role: 'Head of Operations',
      company: 'Wanderlust International Tours',
      impact: '+35% Package Sales'
    },
    faqs: [
      { q: 'Can WCRM handle international numbers from global travelers?', a: 'Yes! Official Meta API supports WhatsApp numbers globally across 180+ countries.' },
      { q: 'Can we send custom booking voucher PDFs via WhatsApp?', a: 'Yes, automatic PDF voucher generation and sharing.' }
    ]
  },

  ngo: {
    id: 'ngo',
    name: 'NGOs & Non-Profits',
    badge: 'Donor Engagement & Volunteer Drive',
    icon: Heart,
    heroHeadline: 'Donor Engagement, Impact Reporting & Volunteer Campaigns',
    heroDesc: 'Connect with donors, share automated impact reports, run fundraising drives, and coordinate volunteer campaigns at scale on WhatsApp.',
    metrics: [
      { label: 'Donor Retention', value: '+50%' },
      { label: 'Fundraising Campaign ROI', value: '8x' },
      { label: 'Volunteer Response', value: '95%' }
    ],
    chatDemo: {
      userMsg: 'I want to donate ₹2,500 for the Rural Education Project',
      aiTitle: 'WCRM Impact AI Assistant',
      aiReply: 'Thank you for supporting Rural Education! Click below to donate via UPI/Razorpay (80G Tax Exemption Certificate included) 🙏',
      telemetry: 'Donor Tagged: Education Supporter · 80G Receipt Auto-Generated'
    },
    challenges: [
      { problem: 'Low Donor Re-engagement', desc: 'Donors contribute once but drop off due to lack of regular impact updates.' },
      { problem: 'Delayed 80G Tax Receipts', desc: 'Manual processing and emailing of tax exemption receipts takes weeks.' },
      { problem: 'Scattered Volunteer Coordination', desc: 'Difficulty mobilizing volunteers quickly for emergency relief drives.' }
    ],
    solutions: [
      { feature: 'Instant 80G Tax Receipt Dispatch', desc: 'Automatically generates and sends 80G donation receipts on WhatsApp.' },
      { feature: 'Automated Impact Stories', desc: 'Schedule monthly photo & video updates showing how donor funds are making a difference.' },
      { feature: 'Volunteer Broadcast Engine', desc: 'Mobilize hundreds of volunteers instantly for local community drives.' }
    ],
    workflow: [
      { step: '01', title: 'Donor Expresses Interest', desc: 'Donor messages WhatsApp from campaign link.' },
      { step: '02', title: 'AI Donation Link', desc: 'AI shares cause details and Razorpay donation link.' },
      { step: '03', title: 'Instant 80G Receipt', desc: 'System generates official 80G tax receipt PDF.' },
      { step: '04', title: 'Ongoing Impact Updates', desc: 'Regular broadcast updates on project progress.' }
    ],
    features: [
      { title: '80G Receipt Auto-Delivery', desc: 'Instant PDF tax exemption certificates.', icon: FileText },
      { title: 'Fundraising Broadcasts', desc: 'High-converting WhatsApp campaigns for causes.', icon: Send },
      { title: 'Volunteer Registration Bot', desc: 'Onboard and screen new community volunteers.', icon: Users },
      { title: 'Impact Video Sharing', desc: 'Share video updates directly in WhatsApp chat.', icon: Sparkles }
    ],
    outcomes: [
      { label: 'Donor Retention', value: '+50%', detail: 'Donors stay engaged with monthly updates' },
      { label: 'Receipt Processing', value: '<5s', detail: 'Instant 80G tax receipt generation' },
      { label: 'Fundraising ROI', value: '8x', detail: 'Outperformed traditional email appeals' },
      { label: 'Volunteer Mobilization', value: '10x Faster', detail: 'Quick deployment for emergency relief' }
    ],
    testimonial: {
      quote: 'WCRM helped us increase recurring donor retention by 50%. Our donors receive instant 80G tax receipts and monthly video impact reports on WhatsApp.',
      author: 'Sunita Narain',
      role: 'Director of Partnerships',
      company: 'Hope Foundation India',
      impact: '+50% Donor Retention'
    },
    faqs: [
      { q: 'Does Meta offer special WhatsApp API rates for registered non-profits?', a: 'Yes, Meta provides discounted utility and service messaging rates for verified non-profit organizations.' },
      { q: 'Can we send 80G tax exemption certificates automatically?', a: 'Yes, automatically generated PDF tax receipts sent instantly upon payment.' }
    ]
  },

  services: {
    id: 'services',
    name: 'Professional Services',
    badge: 'Client Consultations & Proposals',
    icon: Briefcase,
    heroHeadline: 'Client Qualification, Appointment Booking & Proposal Tracking',
    heroDesc: 'Empower law firms, accounting practices, agencies, and consultants with automated client screening, proposal sharing, and retainer reminders.',
    metrics: [
      { label: 'Client Onboarding Speed', value: '4x' },
      { label: 'Consultation Bookings', value: '+40%' },
      { label: 'Retainer Collection', value: '98%' }
    ],
    chatDemo: {
      userMsg: 'Need GST audit consultation for our IT company. Send retainer package options.',
      aiTitle: 'WCRM Professional AI Assistant',
      aiReply: 'Sending GST Audit Retainer Proposal PDF! Available Consultation Slots: Tomorrow 3:00 PM & 5:00 PM 💼',
      telemetry: 'Proposal Sent · Lead Tagged: High-Value Corporate Client'
    },
    challenges: [
      { problem: 'Unqualified Client Meetings', desc: 'Partners waste billable hours in consultation calls with low-budget inquiries.' },
      { problem: 'Slow Proposal Turnaround', desc: 'Delays in sending customized client proposals result in lost contracts.' },
      { problem: 'Overdue Invoice Collections', desc: 'Chasing clients for monthly retainer payments requires awkward manual calls.' }
    ],
    solutions: [
      { feature: 'AI Prospect Screening', desc: 'Screens client budget and company size before scheduling senior partner calls.' },
      { feature: 'Automated Proposal Delivery', desc: 'Dispatches professional PDF proposals and engagement letters on WhatsApp.' },
      { feature: 'Retainer Payment Reminders', desc: 'Scheduled monthly WhatsApp reminders with 1-click UPI/card payment links.' }
    ],
    workflow: [
      { step: '01', title: 'Client Inbound', desc: 'Prospect inquires for legal, accounting, or consulting services.' },
      { step: '02', title: 'AI Needs Assessment', desc: 'AI collects company details, scope, and timeline.' },
      { step: '03', title: 'Proposal & Booking Link', desc: 'AI sends service proposal PDF and partner calendar link.' },
      { step: '04', title: 'Retainer Invoicing', desc: 'Automated monthly retainer invoicing and receipting.' }
    ],
    features: [
      { title: 'Proposal PDF Sharing', desc: 'Send formal service proposals & engagement terms.', icon: FileText },
      { title: 'Partner Calendar Sync', desc: 'Book paid consultation slots automatically.', icon: Clock },
      { title: 'Retainer Invoicing Bot', desc: 'Automated monthly billing alerts and UPI links.', icon: TrendingUp },
      { title: 'Private Internal Notes', desc: 'Collaborate with team on client files in team inbox.', icon: MessageSquare }
    ],
    outcomes: [
      { label: 'Client Onboarding', value: '4x Faster', detail: 'Pre-screened leads and instant proposals' },
      { label: 'Billable Hour Savings', value: '+30%', detail: 'Partners spend time only on high-value clients' },
      { label: 'Retainer Collection', value: '98%', detail: 'On-time monthly retainer payments' },
      { label: 'Client Satisfaction', value: '4.9⭐', detail: 'Instant answers to contract status inquiries' }
    ],
    testimonial: {
      quote: 'WCRM freed up 30% of our senior partners’ billable hours. Low-budget inquiries are screened out automatically, and proposal delivery takes seconds.',
      author: 'Anand Vardhan',
      role: 'Managing Partner',
      company: 'Vardhan & Associates Legal',
      impact: '+30% Billable Hours Saved'
    },
    faqs: [
      { q: 'Can WCRM integrate with Calendly or Google Calendar for partner bookings?', a: 'Yes! Automated appointment booking synced with Google Calendar or Calendly.' },
      { q: 'Is client confidentiality protected on WCRM?', a: 'Yes, end-to-end Meta Cloud API security with strict role-based access control.' }
    ]
  },

  'b2b-enterprise': {
    id: 'b2b-enterprise',
    name: 'B2B Enterprises',
    badge: 'Account-Based Messaging & SLAs',
    icon: Building,
    heroHeadline: 'Account-Based WhatsApp Engagement for Enterprise B2B Teams',
    heroDesc: 'Unify multi-channel enterprise sales, SLA monitoring, multi-region team inboxes, and BYOK multi-model AI routing with 99.9% uptime SLA.',
    metrics: [
      { label: 'Sales Cycle Velocity', value: '+35%' },
      { label: 'Enterprise Uptime SLA', value: '99.9%' },
      { label: 'AI Token Expense', value: '-60%' }
    ],
    chatDemo: {
      userMsg: 'Need custom Enterprise SLA quote for 250 agent seats and dedicated VPC deployment',
      aiTitle: 'WCRM B2B Enterprise Gateway',
      aiReply: 'Enterprise Proposal & SOC-2 Security Compliance PDF sent! Assigned Key Account Manager: Vikrant Sharma 🏢',
      telemetry: 'Deal Value: ₹25,00,000 · Account Executive Alerted'
    },
    challenges: [
      { problem: 'Unmonitored Executive Chats', desc: 'Key account conversations happen on personal phones without CRM visibility.' },
      { problem: 'SLA Breach Vulnerability', desc: 'VIP enterprise clients wait hours for answers, risking high-value account churn.' },
      { problem: 'High AI Model Markups', desc: 'Standard CRM vendors charge 3x-5x markups on enterprise AI tokens.' }
    ],
    solutions: [
      { feature: 'Centralized Executive Inbox', desc: 'All enterprise account conversations logged centrally with role-based permissions.' },
      { feature: 'Strict SLA Telemetry Alerts', desc: 'Automated manager alerts if a VIP enterprise inquiry isn’t answered within 5 minutes.' },
      { feature: 'Zero Token Markup (BYOK)', desc: 'Plug in enterprise OpenAI, Gemini, or Claude keys with 0% platform markup.' }
    ],
    workflow: [
      { step: '01', title: 'Enterprise Inbound', desc: 'VP or Director inquires via enterprise web portal.' },
      { step: '02', title: 'AI Intent & Firmographics', desc: 'AI screens company size, seat count, and compliance needs.' },
      { step: '03', title: 'Instant Proposal & NDA', desc: 'Sends custom enterprise proposal PDF and NDA form.' },
      { step: '04', title: 'Key Account Manager Sync', desc: 'Live chat transferred seamlessly to dedicated Account Executive.' }
    ],
    features: [
      { title: 'BYOK Multi-Model Routing', desc: 'Use your own enterprise OpenAI, Gemini, or Claude API keys.', icon: Cpu },
      { title: 'SLA Breach Telemetry', desc: 'Instant alerts for response time SLA breaches.', icon: Clock },
      { title: 'SOC-2 & AES-256 Security', desc: 'Enterprise data compliance and encryption.', icon: ShieldCheck },
      { title: 'Role-Based Team Permissions', desc: 'Granular access control for regional sales teams.', icon: Users }
    ],
    outcomes: [
      { label: 'Sales Cycle Velocity', value: '+35%', detail: 'Faster closing on multi-million deals' },
      { label: 'SLA Compliance', value: '99.9%', detail: 'Zero VIP client inquiry missed' },
      { label: 'AI Cost Savings', value: '-60%', detail: 'Zero token markup with BYOK' },
      { label: 'CRM Visibility', value: '100%', detail: 'All rep conversations logged in central CRM' }
    ],
    testimonial: {
      quote: 'WCRM gave our B2B enterprise complete visibility over key account communication. The BYOK model allowed us to cut our monthly AI expenses by 60%.',
      author: 'Nikhil Saxena',
      role: 'Chief Revenue Officer',
      company: 'TechMatrix Enterprise Solutions',
      impact: '-60% AI Expenses with BYOK'
    },
    faqs: [
      { q: 'Can WCRM provide dedicated VPC deployment for enterprise security?', a: 'Yes! Enterprise plans support custom single-tenant VPC deployments and custom domain SSLs.' },
      { q: 'Can we connect multiple WhatsApp Business API numbers under one enterprise account?', a: 'Yes, WCRM supports multi-number management for global enterprise divisions.' }
    ]
  }
};

export function IndustrySolutionsClient() {
  const [selectedId, setSelectedId] = useState<string>('manufacturing');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

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
            Discover how WCRM automates sales pipelines, customer support, and AI auto-replies across 12 high-growth industry verticals with zero AI token markup.
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
                        <p className="font-bold text-white text-xs">WCRM {current.name} AI</p>
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

      {/* 4. SPLIT-SCREEN: CHALLENGES VS. WCRM SOLUTIONS */}
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

            {/* Right: WCRM AI Solutions */}
            <div className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                WCRM Intelligent Capability
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
            Join hundreds of forward-thinking enterprises in {current.name} using WCRM to qualify leads, automate support, and drive high ROI on WhatsApp.
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
