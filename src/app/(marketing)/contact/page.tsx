import { Metadata } from 'next'
import { Mail, Phone, MapPin, MessageSquare, PhoneCall } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us | NGTech WCRM',
  description: 'Get in touch with the NGTech WCRM team. Call us directly at +91 8985025794 or chat on WhatsApp.',
}

export default function ContactPage() {
  return (
    <div className="flex flex-col py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Touch</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Have questions about our CRM? Need help setting up your team? Call or chat with our sales and support teams directly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Contact Information */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-6">
            <h2 className="text-2xl font-bold mb-2">Contact Information</h2>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="bg-emerald-500 text-white p-3 rounded-full shrink-0">
                <PhoneCall className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-lg">Direct Phone Call</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Speak with our sales & technical support experts.</p>
                <a href="tel:+918985025794" className="text-emerald-600 dark:text-emerald-400 hover:underline mt-2 inline-block font-extrabold text-xl">
                  +91 8985025794
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">WhatsApp Chat</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Fastest way to get support from our team on WhatsApp.</p>
                <a href="https://wa.me/918092225777" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline mt-2 inline-block font-bold text-base">
                  +91 80922 25777
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Email Support</h3>
                <p className="text-xs text-muted-foreground mt-0.5">For general inquiries and billing support.</p>
                <a href="mailto:info@nighwantech.com" className="text-primary hover:underline mt-2 inline-block font-medium">
                  info@nighwantech.com
                </a>
              </div>
            </div>
          </div>

          {/* Quick FAQ or CTA */}
          <div className="bg-muted/30 border border-border rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-bold">Ready to scale?</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Launch your 14-day free trial immediately and explore the full capabilities of NGTech WCRM, or call us at <strong className="text-foreground">+91 8985025794</strong> for a guided live demo.
            </p>
            <a href="tel:+918985025794" className="flex w-full h-12 items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base transition-all shadow-lg gap-2">
              <PhoneCall className="h-5 w-5 animate-pulse" /> Call +91 8985025794 Now
            </a>
            <a href="/free-trial" className="flex w-full h-12 items-center justify-center rounded-full border border-border bg-card hover:bg-muted text-base font-semibold text-foreground transition-all">
              Start 14-Day Free Trial
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
