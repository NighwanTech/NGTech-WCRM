export interface IndustryData {
  id: string;
  name: string;
  badge: string;
  iconName: string;
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
  features: { title: string; desc: string; iconName: string }[];
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
    iconName: 'Factory',
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
      { title: 'ERP & SAP Webhook Sync', desc: 'Connect directly with Tally, SAP, Oracle, or custom ERP systems.', iconName: 'Code2' },
      { title: 'Dealer Broadcast Campaigns', desc: 'Send price list updates and new catalog announcements to 10,000+ distributors.', iconName: 'Send' },
      { title: 'Automated Order Confirmations', desc: 'Instant PO verification and GST invoice sharing via WhatsApp.', iconName: 'FileText' },
      { title: 'Multi-Warehouse Routing', desc: 'Route inquiries to nearest regional warehouse representative automatically.', iconName: 'Building2' }
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
    iconName: 'GraduationCap',
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
      { problem: 'Manual Document Verification', desc: 'Counselors spend days manually requesting 10th/12th marksheets via email.' }
    ],
    solutions: [
      { feature: '24/7 AI Admission Bot', desc: 'Answers questions on courses, fees, eligibility, and hostel facilities instantly.' },
      { feature: 'Instant Prospectus Dispatch', desc: 'Sends PDF course brochures and fee structure documents in response to WhatsApp inquiries.' },
      { feature: 'Automated Fee Reminders', desc: 'Dispatches automated installment due alerts with direct UPI and credit card payment links.' }
    ],
    workflow: [
      { step: '01', title: 'Student Inbound Message', desc: 'Student clicks Meta Ad or scans QR code on brochure.' },
      { step: '02', title: 'AI Qualifies Course Preference', desc: 'AI asks 3 quick questions: Stream, Location, and Expected Joining Year.' },
      { step: '03', title: 'Brochure & Payment Link Delivered', desc: 'AI sends PDF prospectus and application fee payment link.' },
      { step: '04', title: 'Counselor Assigned', desc: 'Hot leads assigned to specific admission counselors based on course department.' }
    ],
    features: [
      { title: 'Campus Tour Scheduler', desc: 'Students book campus visit slots directly inside WhatsApp.', iconName: 'Calendar' },
      { title: 'Bulk Exam Alerts', desc: 'Send examination timetables and admit card links to 50,000+ students.', iconName: 'Send' },
      { title: 'Multi-Department Routing', desc: 'Route inquiries to Engineering, Management, or Medical admission desks.', iconName: 'Building2' },
      { title: 'Document Collection Bot', desc: 'Students upload marksheets directly in chat for instant AI OCR parsing.', iconName: 'FileText' }
    ],
    outcomes: [
      { label: 'Enrollment Growth', value: '+34%', detail: 'Achieved through instant counseling replies' },
      { label: 'Application Fee Collection', value: '3x', detail: 'Faster application submission via UPI links' },
      { label: 'Counselor Productivity', value: '5x', detail: 'Counselors focus only on high-intent candidates' },
      { label: 'Token Expense', value: 'Zero Markup', detail: 'BYOK direct API rates' }
    ],
    testimonial: {
      quote: 'During peak admission season, AIWCRM handled over 50,000 student inquiries on WhatsApp without a single delay. Our counselors saved 80% of their manual repetitive workload.',
      author: 'Dr. Anita Deshmukh',
      role: 'Director of Admissions',
      company: 'Imperial Group of Institutions',
      impact: '+45% Admission Conversion'
    },
    faqs: [
      { q: 'Can students pay application fees directly inside WhatsApp?', a: 'Yes! AIWCRM integrates with Razorpay, Cashfree, and UPI to generate instant payment links inside the chat.' },
      { q: 'Can we send bulk WhatsApp broadcasts to prospective student lists?', a: 'Yes, official Meta Cloud API broadcasts allow targeted campaign delivery with high conversion tracking.' }
    ]
  },

  healthcare: {
    id: 'healthcare',
    name: 'Healthcare & Hospitals',
    badge: 'Doctor Appointments & Lab Reports',
    iconName: 'HeartPulse',
    heroHeadline: 'Automate WhatsApp Doctor Appointments & Lab Report Delivery',
    heroDesc: 'HIPAA & DPDP compliant WhatsApp CRM for hospitals, clinics, and diagnostic centers. Doctor slot booking, lab PDF reports, and prescription reminders.',
    metrics: [
      { label: 'No-Show Rate Drop', value: '-65%' },
      { label: 'Call Center Volume Cut', value: '-70%' },
      { label: 'Patient CSAT Rating', value: '4.9/5' }
    ],
    chatDemo: {
      userMsg: 'Book an appointment with Dr. Sharma (Cardiology) for tomorrow at 11 AM',
      aiTitle: 'AIWCRM Health Assistant AI',
      aiReply: 'Appointment confirmed! Dr. Sharma · Tomorrow 11:00 AM · Token #14. Token Pass attached 🎫',
      telemetry: 'HIS Synced · Slot Reserved · SMS & WhatsApp Reminder Scheduled'
    },
    challenges: [
      { problem: 'High Patient No-Show Rates', desc: 'Patients forget appointment slots due to lack of timely, interactive reminders.' },
      { problem: 'Lab Report Inquiry Overload', desc: 'Front desk receptionists spend hours answering "Is my blood report ready?" calls.' },
      { problem: 'Unstructured Emergency Inquiries', desc: 'Critical patient messages get delayed in unorganized phone calls.' }
    ],
    solutions: [
      { feature: 'Interactive Slot Booking', desc: 'Patients view real-time doctor availability and confirm slots in 2 taps.' },
      { feature: 'Instant PDF Lab Report Delivery', desc: 'Securely dispatches lab test results as encrypted PDF files directly on WhatsApp.' },
      { feature: 'Post-Op Care & Dosage Reminders', desc: 'Sends automated medicine intake schedules and follow-up consultation reminders.' }
    ],
    workflow: [
      { step: '01', title: 'Patient Selects Speciality', desc: 'Patient messages "Book Appointment" and chooses Cardiology / Orthopedics / Pediatrics.' },
      { step: '02', title: 'HIS Slot Query', desc: 'AI queries Hospital Information System (HIS) database for available doctor time slots.' },
      { step: '03', title: 'Slot Reservation & Confirmation', desc: 'Sends appointment confirmation token with Google Maps navigation link.' },
      { step: '04', title: 'Automated 2-Hour Prior Alert', desc: 'Sends interactive reminder button: [Confirm Attendance] or [Reschedule Slot].' }
    ],
    features: [
      { title: 'HIS & EMR Webhook Integration', desc: 'Connects with Practo, Medidart, or custom hospital ERPs.', iconName: 'Code2' },
      { title: 'Encrypted Lab Report PDF Sharing', desc: 'HIPAA-compliant document delivery directly in patient chat.', iconName: 'FileText' },
      { title: 'Emergency Department Alerts', desc: 'High-priority routing to casualty desk for critical keywords.', iconName: 'PhoneCall' },
      { title: 'Automated Medication Reminders', desc: 'Schedule multi-day prescription follow-ups automatically.', iconName: 'Clock' }
    ],
    outcomes: [
      { label: 'Patient No-Shows', value: '-65%', detail: 'Reduced using interactive 2-hour reminders' },
      { label: 'Lab Report Turnaround', value: 'Instant', detail: 'Dispatched automatically when test results sync' },
      { label: 'Reception Support Costs', value: '-60%', detail: 'Saved via self-service slot booking' },
      { label: 'Compliance Grade', value: '100%', detail: 'DPDP 2023 & HIPAA compliant architecture' }
    ],
    testimonial: {
      quote: 'AIWCRM eliminated front-desk chaos at our 300-bed hospital. Over 70% of doctor appointments and lab report downloads now happen automatically on WhatsApp.',
      author: 'Dr. Vikram Malhotra',
      role: 'Chief Medical Officer',
      company: 'Sanjeevani Super Speciality Hospitals',
      impact: '-65% Patient No-Shows'
    },
    faqs: [
      { q: 'Is patient data secure and compliant on WhatsApp?', a: 'Yes! AIWCRM uses end-to-end encrypted official Meta Cloud API endpoints and strictly complies with DPDP 2023 data isolation rules.' },
      { q: 'Can patients reschedule or cancel appointments directly in chat?', a: 'Yes, patients can tap interactive buttons to reschedule or cancel, instantly freeing up the slot for others.' }
    ]
  },

  retail: {
    id: 'retail',
    name: 'D2C & E-Commerce',
    badge: 'Cart Recovery & Order Updates',
    iconName: 'ShoppingBag',
    heroHeadline: 'Supercharge D2C Sales with WhatsApp Cart Recovery & Meta AI Ads',
    heroDesc: 'Recover 35%+ abandoned Shopify & WooCommerce carts, send automated COD verification alerts, and launch AI-targeted Meta Ad campaigns.',
    metrics: [
      { label: 'Abandoned Cart Recovery', value: '38.4%' },
      { label: 'Return to Origin (RTO) Cut', value: '-45%' },
      { label: 'ROAS Improvement', value: '4.2x' }
    ],
    chatDemo: {
      userMsg: 'Is the Leather Jacket (Size M) in stock? Can I get a discount?',
      aiTitle: 'AIWCRM D2C Shopping Assistant',
      aiReply: 'Yes! 4 units left in Size M. Use code SPECIAL10 for 10% off + Free Shipping 🚚 Order Link attached 🛒',
      telemetry: 'Shopify Stock Checked · Checkout Link Generated · Discount Applied'
    },
    challenges: [
      { problem: '70%+ Abandoned Cart Rate', desc: 'Shoppers add products to cart but leave without completing checkout on web stores.' },
      { problem: 'High RTO (Return To Origin) Rates', desc: 'Unverified Cash on Delivery (COD) orders lead to heavy shipping losses.' },
      { problem: 'Low Email Open Rates (10-15%)', desc: 'Traditional email promotional campaigns go unread in spam folders.' }
    ],
    solutions: [
      { feature: 'Automated 15-Min Cart Recovery', desc: 'Triggers personalized WhatsApp checkout reminder with dynamic discount coupon 15 mins after cart abandonment.' },
      { feature: 'Instant COD Order Verification', desc: 'Sends an interactive [Confirm COD Order] button on WhatsApp before shipping to reduce RTO.' },
      { feature: 'WhatsApp Catalog & Checkout', desc: 'Showcases native product catalogs and collects payments directly inside WhatsApp.' }
    ],
    workflow: [
      { step: '01', title: 'Cart Abandoned on Shopify', desc: 'Shopper leaves store checkout page without completing payment.' },
      { step: '02', title: 'WhatsApp Reminder Triggered', desc: 'AIWCRM detects abandoned checkout and queues personalized WhatsApp message.' },
      { step: '03', title: 'Dynamic Coupon & Cart Link', desc: 'Shopper receives message: "You left items in your cart! Here is 10% off."' },
      { step: '04', title: 'Payment Completed', desc: 'Shopper clicks 1-tap checkout link and order syncs automatically.' }
    ],
    features: [
      { title: 'Shopify & WooCommerce Webhooks', desc: 'Instant 1-click integration with major e-commerce platforms.', iconName: 'Code2' },
      { title: 'Native WhatsApp Product Catalogs', desc: 'Sync your inventory catalog for in-chat shopping.', iconName: 'ShoppingBag' },
      { title: 'Automated Shipping Updates', desc: 'Send Dispatch, Out for Delivery, and Delivered alerts with tracking.', iconName: 'Send' },
      { title: 'Click-to-WhatsApp Meta AI Ads', desc: 'Run targeted Instagram & Facebook ads that open directly in WhatsApp chat.', iconName: 'Sparkles' }
    ],
    outcomes: [
      { label: 'Cart Revenue Recovered', value: '38.4%', detail: 'Converted abandoned checkouts into completed orders' },
      { label: 'COD RTO Reduction', value: '-45%', detail: 'Saved lakhs in wasted courier transit costs' },
      { label: 'Campaign Open Rate', value: '98%', detail: 'Compared to 12% standard email open rate' },
      { label: 'ROAS Increase', value: '4.2x', detail: 'Achieved through Click-to-WhatsApp Meta Ads' }
    ],
    testimonial: {
      quote: 'AIWCRM recovered over ₹18 Lakhs in abandoned Shopify carts in our very first month. The COD verification flow reduced our RTO returns by 45%.',
      author: 'Karan Mehra',
      role: 'Founder & CEO',
      company: 'UrbanStyle D2C Apparel',
      impact: '₹18L Recovered in Month 1'
    },
    faqs: [
      { q: 'Does AIWCRM integrate with Shopify and WooCommerce automatically?', a: 'Yes! Install our webhook integration to automatically sync abandoned carts, order status, and tracking numbers.' },
      { q: 'How does WhatsApp COD verification reduce RTO losses?', a: 'AIWCRM sends an interactive confirmation request before dispatch. Unconfirmed or fake addresses are flagged before shipping.' }
    ]
  },

  realestate: {
    id: 'realestate',
    name: 'Real Estate & Property',
    badge: 'Site Visits & Lead Qualification',
    iconName: 'Building',
    heroHeadline: 'Convert Property Leads Faster with AI WhatsApp Site Visit Scheduling',
    heroDesc: 'Automate property brochure dispatches, qualify buyer budgets with AI, schedule weekend site visits, and manage broker networks on WhatsApp.',
    metrics: [
      { label: 'Site Visits Booked', value: '3x' },
      { label: 'Lead Response Time', value: '<5s' },
      { label: 'Sales Closing Rate', value: '+28%' }
    ],
    chatDemo: {
      userMsg: 'Interested in 3 BHK Apartments in Gurgaon under ₹1.5 Cr. Send floor plan and site visit availability.',
      aiTitle: 'AIWCRM Property Advisor AI',
      aiReply: 'Great choice! Tower B has 3 BHK available (1,850 sq.ft). Download Floor Plan PDF 📄 Book Site Visit for Saturday?',
      telemetry: 'Budget Qualified: ₹1.5 Cr · Site Visit Reserved · Lead Assigned to Senior Agent'
    },
    challenges: [
      { problem: 'Slow Response to Portal Leads', desc: 'Leads from 99acres, MagicBricks, and Facebook Ads cold down within 10 minutes if not called immediately.' },
      { problem: 'Low Site Visit Attendance', desc: 'Buyers book site visits but forget to show up without interactive WhatsApp reminders.' },
      { problem: 'Unqualified Buyer Calls', desc: 'Agents waste hours speaking with buyers whose budgets do not match project pricing.' }
    ],
    solutions: [
      { feature: 'Instant Property Brochure Bot', desc: 'Delivers project brochures, floor plans, price sheets, and location maps instantly via WhatsApp.' },
      { feature: 'AI Budget & Location Qualification', desc: 'Qualifies buyer budget, timeline, and preferred BHK configuration before routing to sales agents.' },
      { feature: 'Automated Site Visit Reminders', desc: 'Sends cab pickup details and Google Maps location pins 2 hours prior to site visits.' }
    ],
    workflow: [
      { step: '01', title: 'Portal Lead Inbound', desc: 'Buyer submits inquiry on 99acres or Click-to-WhatsApp Facebook Ad.' },
      { step: '02', title: 'Instant WhatsApp Welcome', desc: 'AIWCRM sends instant welcome message with project intro video and PDF brochure.' },
      { step: '03', title: 'AI Qualifies Buyer Intent', desc: 'AI asks: "What is your budget?" & "Are you looking for End-use or Investment?"' },
      { step: '04', title: 'Site Visit Confirmed', desc: 'Buyer confirms Saturday 3 PM visit slot. Calendar invite & sales manager notified.' }
    ],
    features: [
      { title: 'Real Estate Portal API Sync', desc: 'Connect 99acres, MagicBricks, Housing.com, and Facebook Lead Ads.', iconName: 'Code2' },
      { title: 'Interactive Site Visit Calendar', desc: 'Buyers choose site visit dates directly inside WhatsApp.', iconName: 'Calendar' },
      { title: 'Broker Network Broadcasts', desc: 'Send new project launch details and commission structure to 5,000+ channel partners.', iconName: 'Send' },
      { title: 'Location Map & Cab Sharing', desc: 'Send interactive Google Maps links for seamless site visit directions.', iconName: 'Compass' }
    ],
    outcomes: [
      { label: 'Site Visit Volume', value: '3x Growth', detail: 'Increased through instant WhatsApp brochure delivery' },
      { label: 'Lead Response Speed', value: '<5s', detail: 'Reduced from 4 hours to under 5 seconds' },
      { label: 'Agent Productivity', value: '+50%', detail: 'Agents speak only with budget-qualified buyers' },
      { label: 'ROAS on Property Ads', value: '3.8x', detail: 'Achieved with Click-to-WhatsApp Ads' }
    ],
    testimonial: {
      quote: 'AIWCRM tripled our weekend site visit attendance. Buyers get project brochures and location maps on WhatsApp within 3 seconds of clicking our Facebook Ads.',
      author: 'Vikramaditya Roy',
      role: 'Chief Marketing Officer',
      company: 'Prestige Infrastructure Group',
      impact: '3x Site Visits Booked'
    },
    faqs: [
      { q: 'Can AIWCRM auto-capture leads from Facebook Property Ads and 99acres?', a: 'Yes! Lead Ads automatically trigger WhatsApp brochure dispatches within 2 seconds of form submission.' },
      { q: 'Can channel partners/brokers receive automated commission updates?', a: 'Yes, broadcast price updates and broker commission alerts to thousands of channel partners in 1 click.' }
    ]
  },

  bfsi: {
    id: 'bfsi',
    name: 'BFSI, Loans & FinTech',
    badge: 'Loan Eligibility & Document Collection',
    iconName: 'Landmark',
    heroHeadline: 'Secure WhatsApp Banking, Instant Loan Eligibility & Doc Collection',
    heroDesc: 'ISO 27001 & SOC2 certified WhatsApp CRM for banks, NBFCs, and FinTechs. Instant EMI calculators, CIBIL eligibility, document uploads, and payment reminders.',
    metrics: [
      { label: 'Loan Processing Speed', value: '5x' },
      { label: 'Document Drop-off Cut', value: '-70%' },
      { label: 'Collection Recovery', value: '+35%' }
    ],
    chatDemo: {
      userMsg: 'Check my Personal Loan eligibility for ₹5 Lakhs (Monthly Salary: ₹75,000)',
      aiTitle: 'AIWCRM FinTech Loan Advisor AI',
      aiReply: 'Eligible! Max Loan: ₹7.5 Lakhs · Interest Rate: 10.5% p.a. Upload PAN & Salary Slip to proceed 📄',
      telemetry: 'Instant Eligibility Calculated · Document Upload Link Dispatched · Lead Marked HOT'
    },
    challenges: [
      { problem: 'High Document Drop-off', desc: 'Borrowers start loan applications online but drop off when requested to email PAN/Aadhaar/bank statements.' },
      { problem: 'High EMI Collection Cost', desc: 'Field collection agents spend huge efforts calling borrowers for monthly EMI dues.' },
      { problem: 'Slow Underwriting Turnaround', desc: 'Manual review of basic applicant details delays loan sanction letters.' }
    ],
    solutions: [
      { feature: 'Instant WhatsApp Eligibility Bot', desc: 'Calculates loan amount eligibility and EMI breakdown based on user inputs in 10 seconds.' },
      { feature: 'In-Chat Document Collection', desc: 'Borrowers upload PAN, Aadhaar, and Salary slips directly in WhatsApp chat with AI OCR validation.' },
      { feature: 'Automated EMI Payment Links', desc: 'Dispatches automated monthly payment reminders with 1-tap UPI payment links.' }
    ],
    workflow: [
      { step: '01', title: 'Loan Inquiry Triggered', desc: 'User clicks loan ad or scans QR code at partner merchant.' },
      { step: '02', title: 'AI Eligibility Calculation', desc: 'AI asks 3 quick inputs: Salary, Employment Type, and Existing EMIs.' },
      { step: '03', title: 'WhatsApp Document Upload', desc: 'Borrower snaps photo of PAN and salary slip inside WhatsApp.' },
      { step: '04', title: 'Sanction Letter Dispatched', desc: 'Instant pre-approved sanction letter PDF delivered with e-sign link.' }
    ],
    features: [
      { title: 'Core Banking API Sync', desc: 'Connects with Finacle, Flexcube, and custom FinTech loan engines.', iconName: 'Code2' },
      { title: 'In-Chat EMI Payment Links', desc: 'UPI, NetBanking, and NACH collection links inside chat.', iconName: 'DollarSign' },
      { title: 'Secure Document Vault', desc: 'AES-256 encrypted document storage complying with RBI guidelines.', iconName: 'Lock' },
      { title: 'Broadcast Loan Offers', desc: 'Send pre-approved top-up loan offers to existing customer database.', iconName: 'Send' }
    ],
    outcomes: [
      { label: 'Loan Sanction Time', value: '<10m', detail: 'Reduced from 3 days to under 10 minutes' },
      { label: 'Document Submission Rate', value: '+75%', detail: 'Achieved via easy WhatsApp photo uploads' },
      { label: 'EMI Collection Recovery', value: '+35%', detail: 'Higher collection via automated UPI links' },
      { label: 'Security Grade', value: 'SOC2 / RBI', detail: 'Bank-grade encrypted architecture' }
    ],
    testimonial: {
      quote: 'AIWCRM revolutionized our personal loan distribution. Document collection drop-offs dropped by 70% because borrowers simply photo-upload their documents in WhatsApp.',
      author: 'Aditya Srivastava',
      role: 'Head of Digital Lending',
      company: 'Capitall Finance NBFC',
      impact: '5x Faster Loan Processing'
    },
    faqs: [
      { q: 'Is borrower financial data encrypted and RBI compliant?', a: 'Yes! AIWCRM uses AES-256 encryption at rest and TLS 1.3 in transit, fully complying with RBI data localization and security norms.' },
      { q: 'Can borrowers pay EMI dues directly using UPI on WhatsApp?', a: 'Yes! Integrated payment links allow instant UPI payment via PhonePe, Google Pay, or Paytm.' }
    ]
  },

  hospitality: {
    id: 'hospitality',
    name: 'Hospitality & Travel',
    badge: 'Direct Bookings & Concierge',
    iconName: 'Hotel',
    heroHeadline: 'Drive Direct Hotel & Resort Bookings on WhatsApp (0% OTA Commission)',
    heroDesc: 'Save 15-25% OTA commissions on booking.com & Agoda. Automate room availability checks, direct payment collection, and 24/7 AI guest concierge.',
    metrics: [
      { label: 'Direct Booking Growth', value: '+62%' },
      { label: 'OTA Commission Saved', value: '18%' },
      { label: 'Guest Response Time', value: '<2s' }
    ],
    chatDemo: {
      userMsg: 'Check Deluxe Ocean View room availability for 2 adults (15th Oct - 18th Oct)',
      aiTitle: 'AIWCRM Resort Concierge AI',
      aiReply: 'Available! Deluxe Ocean View ₹9,500/night incl. Breakfast 🍳 Reserve with 20% Advance Payment attached 💳',
      telemetry: 'PMS Synced · 2 Nights Reserved · Special Request Tagged: High Floor'
    },
    challenges: [
      { problem: 'High OTA Commission Fees', desc: 'Hotels lose 15-25% revenue to OTAs like Booking.com, Agoda, and MakeMyTrip for every room booked.' },
      { problem: 'Slow Reservation Replies', desc: 'Travelers inquiring on social media or Google book elsewhere if front desk takes hours to confirm rates.' },
      { problem: 'Front Desk Phone Congestion', desc: 'Hotel staff spend hours answering room service, Wi-Fi password, and checkout time questions.' }
    ],
    solutions: [
      { feature: 'Direct WhatsApp Booking Engine', desc: 'Guests check real-time room availability, view photo galleries, and pay advance deposits directly in chat.' },
      { feature: '24/7 Virtual Guest Concierge', desc: 'Answers guest queries about room service menus, spa bookings, pool timings, and local sightseeing.' },
      { feature: 'Post-Checkout Feedback & Review Bot', desc: 'Automates TripAdvisor and Google Review requests after guest checkout.' }
    ],
    workflow: [
      { step: '01', title: 'Guest Inquires Availability', desc: 'Guest clicks Instagram Ad or website widget to inquire about weekend rates.' },
      { step: '02', title: 'PMS Stock & Rate Check', desc: 'AI queries Property Management System (PMS) for live room inventory & seasonal rates.' },
      { step: '03', title: 'Photos & Advance Payment Link', desc: 'Guest receives room photos, amenity list, and 20% advance booking deposit link.' },
      { step: '04', title: 'Booking Confirmed & PMS Synced', desc: 'Instant booking voucher with QR code check-in sent on WhatsApp.' }
    ],
    features: [
      { title: 'PMS & Opera Webhook Integration', desc: 'Connects directly with Opera, Cloudbeds, and eZee Technosys PMS.', iconName: 'Code2' },
      { title: 'Interactive Room Gallery', desc: 'Showcase room categories with high-res photos and video tours in chat.', iconName: 'ShoppingBag' },
      { title: 'Contactless Express Check-in', desc: 'Guests submit ID proof photos prior to arrival for instant check-in.', iconName: 'FileText' },
      { title: 'Automated Post-Stay Reviews', desc: 'Collect 5-star Google & TripAdvisor reviews automatically post-checkout.', iconName: 'Sparkles' }
    ],
    outcomes: [
      { label: 'Direct Bookings', value: '+62%', detail: 'Shifted booking volume from OTAs to WhatsApp' },
      { label: 'Commission Savings', value: '18% Margin', detail: 'Retained full room revenue on direct bookings' },
      { label: 'Guest CSAT Rating', value: '4.8/5', detail: 'Achieved through instant 24/7 concierge support' },
      { label: 'Review Conversion', value: '3.5x', detail: 'Higher review submission via WhatsApp' }
    ],
    testimonial: {
      quote: 'AIWCRM helped our boutique luxury resort chain shift 60%+ of room bookings directly to WhatsApp, saving us over ₹25 Lakhs in OTA commissions in 6 months.',
      author: 'Kabir Oberoi',
      role: 'Managing Director',
      company: 'Serenity Resorts & Spas',
      impact: '₹25L Saved in OTA Fees'
    },
    faqs: [
      { q: 'Can guests pay booking advance deposits directly on WhatsApp?', a: 'Yes! AIWCRM sends instant Razorpay, Stripe, or UPI payment links right in the conversation.' },
      { q: 'Does AIWCRM sync with our PMS so rooms are not double-booked?', a: 'Yes! Direct PMS webhooks update room inventory in real time.' }
    ]
  }
};
