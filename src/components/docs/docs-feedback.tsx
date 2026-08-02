'use client';

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
import { submitDocFeedback } from '@/lib/services/docs-cms.service';

export function DocsFeedback({ articleId }: { articleId: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFeedback = async (isHelpful: boolean) => {
    setLoading(true);
    await submitDocFeedback(articleId, isHelpful);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="my-10 p-6 rounded-2xl border border-border/80 bg-card/60 shadow-md text-left space-y-3 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-foreground">Was this documentation article helpful?</h4>
          <p className="text-xs text-muted-foreground">Your feedback helps us continuously improve the AI WCRM Knowledge Base.</p>
        </div>

        {submitted ? (
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
            <CheckCircle2 className="h-4 w-4" /> Thank you for your feedback!
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              disabled={loading}
              onClick={() => handleFeedback(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted hover:bg-emerald-500/20 text-muted-foreground hover:text-emerald-400 border border-border/60 hover:border-emerald-500/40 text-xs font-bold transition-all"
            >
              <ThumbsUp className="h-4 w-4" /> Yes
            </button>
            <button
              disabled={loading}
              onClick={() => handleFeedback(false)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted hover:bg-rose-500/20 text-muted-foreground hover:text-rose-400 border border-border/60 hover:border-rose-500/40 text-xs font-bold transition-all"
            >
              <ThumbsDown className="h-4 w-4" /> No
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
