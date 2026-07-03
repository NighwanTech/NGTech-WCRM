import Link from 'next/link'
import { Check, Info } from 'lucide-react'
import { PLANS } from '@/lib/plan-limits'

export const metadata = {
  title: "Pricing | NGTech WCRM",
  description: "Simple, transparent pricing for teams of all sizes. No hidden WhatsApp markup.",
}

// Helper to convert object to array for UI
const pricingPlans = Object.values(PLANS).map((plan, i) => ({
  ...plan,
  // Hardcoded for demo/static rendering; in real dynamic we fetch from DB
  priceMonthly: i === 0 ? 0 : i === 1 ? 29 : i === 2 ? 99 : null,
  priceAnnual: i === 0 ? 0 : i === 1 ? 290 : i === 2 ? 990 : null,
  features: [
    `${plan.maxContacts === -1 ? 'Unlimited' : plan.maxContacts.toLocaleString()} Contacts`,
    `${plan.maxMessagesPm === -1 ? 'Unlimited' : plan.maxMessagesPm.toLocaleString()} Messages / mo`,
    i === 0 ? 'Basic CRM features' : 'Advanced CRM Workflows',
    i >= 1 ? 'Shared Team Inbox' : '1 Team Member',
    i >= 2 ? 'AI Chatbot Builder' : null,
    i >= 2 ? 'Dedicated Account Manager' : null,
  ].filter(Boolean) as string[]
}))

export default function PricingPage() {
  return (
    <div className="py-24 bg-background min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">Simple, transparent pricing</h1>
          <p className="text-lg text-muted-foreground">
            No hidden fees. No markup on WhatsApp API costs. Choose the plan that scales with your business.
          </p>
          
          <div className="mt-8 flex justify-center">
            <div className="bg-muted p-1 rounded-lg inline-flex items-center">
              <button className="px-6 py-2 rounded-md bg-background text-foreground font-semibold shadow-sm">Monthly</button>
              <button className="px-6 py-2 rounded-md text-muted-foreground font-medium hover:text-foreground transition-colors">Annually <span className="ml-1 text-xs text-emerald-500 font-bold">Save 20%</span></button>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => {
            const isPopular = plan.label === 'Pro';
            return (
              <div key={plan.label} className={`relative flex flex-col rounded-2xl border ${isPopular ? 'border-primary ring-1 ring-primary shadow-2xl shadow-primary/10' : 'border-border'} bg-card p-8`}>
                {isPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">{plan.label}</h3>
                  <p className="text-sm text-muted-foreground min-h-[40px]">{plan.description}</p>
                </div>
                
                <div className="mb-6 flex-grow-0">
                  {plan.priceMonthly === null ? (
                    <div className="text-4xl font-extrabold text-foreground">Custom</div>
                  ) : (
                    <div className="flex items-baseline text-foreground">
                      <span className="text-4xl font-extrabold">${plan.priceMonthly}</span>
                      <span className="text-muted-foreground ml-2">/month</span>
                    </div>
                  )}
                </div>
                
                <Link href={plan.priceMonthly === null ? "/contact" : "/free-trial"} className={`mb-8 w-full flex justify-center items-center py-2.5 px-4 rounded-lg font-semibold transition-all ${isPopular ? 'bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg shadow-primary/25' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
                  {plan.priceMonthly === null ? 'Contact Sales' : 'Start Free Trial'}
                </Link>
                
                <div className="space-y-4 flex-1">
                  <p className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">What's included</p>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-emerald-500 mr-3 shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "Are there any hidden charges?", a: "No. Unlike other platforms, we do not add any markup to your Meta WhatsApp API messaging costs. You pay exactly what Meta charges." },
              { q: "Can I upgrade or downgrade my plan?", a: "Yes, you can upgrade, downgrade, or cancel your plan at any time right from your billing dashboard." },
              { q: "Do you offer refunds?", a: "We offer a 14-day free trial so you can test the platform completely risk-free. After upgrading, you can cancel at any time but we do not offer refunds for partial months." }
            ].map((faq, i) => (
              <div key={i} className="border border-border bg-card rounded-xl p-6">
                <h4 className="text-lg font-semibold text-foreground mb-2">{faq.q}</h4>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
