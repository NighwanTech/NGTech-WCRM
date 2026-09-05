import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { KeyRound, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, Zap, ShoppingBag, MessageSquareText } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  config: any;
  onChange: (field: string, value: any, category?: string) => void;
}

export function GeneralSettingsCard({ config, onChange }: Props) {
  const advanced = config.advanced_settings || {};
  const [testingKey, setTestingKey] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const provider = config.provider || 'gemini';

  async function handleTestKey() {
    try {
      setTestingKey(true);
      const res = await fetch('/api/ai-assistant/keys/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: config.provider,
          model: config.model,
          apiKey: config.custom_api_key,
          baseUrl: config.custom_api_base_url,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Connection failed');
      }

      toast.success(data.message || 'AI Connection verified successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Key verification failed');
    } finally {
      setTestingKey(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>General AI Settings</CardTitle>
            <CardDescription>
              Configure your AI Provider, Model, and API Key credentials.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="enable-ai" className="font-medium">Enable AI Assistant</Label>
            <Switch
              id="enable-ai"
              checked={config.enabled}
              onCheckedChange={(v) => onChange('enabled', v)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Provider & Model Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>AI Provider</Label>
            <Select
              value={config.provider || 'gemini'}
              onValueChange={(v) => {
                onChange('provider', v);
                // Set sensible default model when switching provider
                if (v === 'openai') onChange('model', 'gpt-4o');
                else if (v === 'gemini') onChange('model', 'gemini-2.5-flash');
                else if (v === 'claude') onChange('model', 'claude-3-5-sonnet-latest');
                else if (v === 'groq') onChange('model', 'openai/gpt-oss-120b');
                else if (v === 'deepseek') onChange('model', 'deepseek-chat');
                else if (v === 'custom') onChange('model', 'llama3');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI (ChatGPT)</SelectItem>
                <SelectItem value="gemini">Google Gemini</SelectItem>
                <SelectItem value="claude">Anthropic Claude</SelectItem>
                <SelectItem value="groq">Groq (Ultra-Fast Llama & OSS)</SelectItem>
                <SelectItem value="deepseek">DeepSeek AI</SelectItem>
                <SelectItem value="custom">Custom Endpoint / Ollama</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Model</Label>
            <Select value={config.model || 'gemini-2.5-flash'} onValueChange={(v) => onChange('model', v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent className="w-full min-w-[340px] max-w-[90vw]">
                {provider === 'openai' && (
                  <>
                    <SelectItem value="gpt-4o">GPT-4o (Flagship Multimodal)</SelectItem>
                    <SelectItem value="gpt-4o-mini">GPT-4o Mini (Fast & Cost-Efficient)</SelectItem>
                    <SelectItem value="o3-mini">o3-Mini (Latest Reasoning SOTA)</SelectItem>
                    <SelectItem value="o1">o1 (Advanced Reasoning)</SelectItem>
                    <SelectItem value="o1-mini">o1-Mini (Fast Reasoning)</SelectItem>
                    <SelectItem value="custom-model">Custom Model Identifier...</SelectItem>
                  </>
                )}
                {provider === 'gemini' && (
                  <>
                    <SelectItem value="gemini-3.6-flash">Gemini 3.6 Flash (Latest Flagship)</SelectItem>
                    <SelectItem value="gemini-3.5-flash">Gemini 3.5 Flash (Standard High-Throughput)</SelectItem>
                    <SelectItem value="gemini-3.5-flash-lite">Gemini 3.5 Flash-Lite (Fastest & Cost-Effective)</SelectItem>
                    <SelectItem value="gemini-3.5-flash-cyber">Gemini 3.5 Flash-Cyber (Security Testing)</SelectItem>
                    <SelectItem value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview (Deep Reasoning)</SelectItem>
                    <SelectItem value="gemini-3.1-flash-lite">Gemini 3.1 Flash-Lite (High-Volume)</SelectItem>
                    <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro (Legacy Reasoning)</SelectItem>
                    <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash (Legacy Price-Performance)</SelectItem>
                    <SelectItem value="gemini-2.5-flash-lite">Gemini 2.5 Flash-Lite (Legacy Budget)</SelectItem>
                    <SelectItem value="custom-model">Custom Model Identifier...</SelectItem>
                  </>
                )}
                {provider === 'claude' && (
                  <>
                    <SelectItem value="claude-3-5-sonnet-latest">Claude 3.5 Sonnet (Latest Flagship)</SelectItem>
                    <SelectItem value="claude-3-5-haiku-latest">Claude 3.5 Haiku (Latest High Speed)</SelectItem>
                    <SelectItem value="claude-3-opus-latest">Claude 3 Opus (Deep Intelligence)</SelectItem>
                    <SelectItem value="custom-model">Custom Model Identifier...</SelectItem>
                  </>
                )}
                {provider === 'groq' && (
                  <>
                    <SelectItem value="openai/gpt-oss-120b">GPT OSS 120B (Groq SOTA Flagship)</SelectItem>
                    <SelectItem value="qwen/qwen3.8-27b">Qwen 3.8 27B (Groq Ultra-Fast)</SelectItem>
                    <SelectItem value="openai/gpt-oss-20b">GPT OSS 20B (Groq Lightweight)</SelectItem>
                    <SelectItem value="groq/compound">Groq Compound</SelectItem>
                    <SelectItem value="custom-model">Custom Model Identifier...</SelectItem>
                  </>
                )}
                {provider === 'deepseek' && (
                  <>
                    <SelectItem value="deepseek-chat">DeepSeek-V3 (Chat Flagship)</SelectItem>
                    <SelectItem value="deepseek-reasoner">DeepSeek-R1 (Reasoning SOTA)</SelectItem>
                    <SelectItem value="custom-model">Custom Model Identifier...</SelectItem>
                  </>
                )}
                {provider === 'custom' && (
                  <>
                    <SelectItem value="llama3.3">Llama 3.3 (Local / Self-Hosted)</SelectItem>
                    <SelectItem value="deepseek-r1">DeepSeek R1 Local</SelectItem>
                    <SelectItem value="custom-model">Custom Endpoint Model...</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>

            {config.model === 'custom-model' && (
              <div className="pt-2">
                <Input
                  type="text"
                  placeholder="Enter exact model string (e.g. gemini-3.6-flash, gpt-4.5-preview)"
                  value={config.custom_model_name || ''}
                  onChange={(e) => onChange('custom_model_name', e.target.value)}
                  className="font-mono text-xs"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Type any custom or unlisted model name supported by your API key.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bring Your Own Key (BYOK) Credentials Section */}
        <div className="pt-4 border-t space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <div>
                <Label className="font-semibold text-base">API Key Credentials</Label>
                <p className="text-xs text-muted-foreground">
                  Use WCRM system default keys or provide your account's custom API key.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="use-custom-keys" className="text-xs font-medium">Use My Own API Key</Label>
              <Switch
                id="use-custom-keys"
                checked={!!config.use_custom_keys}
                onCheckedChange={(v) => onChange('use_custom_keys', v)}
              />
            </div>
          </div>

          {config.use_custom_keys && (
            <div className="p-4 rounded-lg bg-muted/40 border space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {provider.toUpperCase()} API Key
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showKey ? 'text' : 'password'}
                      placeholder={`Enter your ${provider} API key (e.g. sk-...)`}
                      value={config.custom_api_key || ''}
                      onChange={(e) => onChange('custom_api_key', e.target.value)}
                      className="pr-10 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleTestKey}
                    disabled={testingKey}
                    className="gap-2"
                  >
                    {testingKey ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    Test Connection
                  </Button>
                </div>
              </div>

              {(provider === 'deepseek' || provider === 'custom') && (
                <div className="space-y-2 pt-2">
                  <Label className="text-xs font-medium">Custom Base URL (Optional)</Label>
                  <Input
                    type="text"
                    placeholder={
                      provider === 'deepseek'
                        ? 'https://api.deepseek.com/v1'
                        : 'http://localhost:11434/v1 or https://your-domain.com/v1'
                    }
                    value={config.custom_api_base_url || ''}
                    onChange={(e) => onChange('custom_api_base_url', e.target.value)}
                    className="font-mono text-xs"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Required for self-hosted LLM endpoints or custom enterprise gateways.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hyperparameters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Temperature ({advanced.temperature || 0.7})</Label>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={advanced.temperature || 0.7}
                onChange={(e) => onChange('temperature', parseFloat(e.target.value), 'advanced_settings')}
                className="w-full accent-primary"
              />
              <p className="text-xs text-muted-foreground">Higher values make output more creative, lower values make it focused.</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Top P ({advanced.top_p || 1})</Label>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={advanced.top_p || 1}
                onChange={(e) => onChange('top_p', parseFloat(e.target.value), 'advanced_settings')}
                className="w-full accent-primary"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Maximum Tokens</Label>
              <Input
                type="number"
                placeholder="Leave blank for model default"
                value={advanced.max_tokens || ''}
                onChange={(e) => onChange('max_tokens', e.target.value ? parseInt(e.target.value) : undefined, 'advanced_settings')}
              />
            </div>
            <div className="space-y-2">
              <Label>Response Language Override</Label>
              <Select value={advanced.response_language || 'auto'} onValueChange={(v) => onChange('response_language', v, 'advanced_settings')}>
                <SelectTrigger>
                  <SelectValue placeholder="Auto-detect" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect (Match Customer)</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Instant Greeting Cache (0-Token Fast Replies) */}
        <div className="pt-4 border-t space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-5 w-5 text-emerald-500" />
              <div>
                <Label className="font-semibold text-base">Instant Greeting Cache (0-Token Fast Replies)</Label>
                <p className="text-xs text-muted-foreground">
                  When enabled, greetings like &quot;Hi&quot;, &quot;Hello&quot;, &quot;Thanks&quot; are answered instantly with your custom welcome message — no AI tokens used!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="enable-greeting-cache" className="text-xs font-medium">Enable</Label>
              <Switch
                id="enable-greeting-cache"
                checked={config.enable_greeting_cache ?? true}
                onCheckedChange={(v) => onChange('enable_greeting_cache', v)}
              />
            </div>
          </div>

          {config.enable_greeting_cache !== false && (
            <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Custom Welcome Greeting</Label>
                <Textarea
                  placeholder={"Hello! Welcome to [Your Business Name].\n\nI am your AI Assistant. How can I help you today?\n\n📞 Helpline: +91-XXXXXXXXXX"}
                  value={config.custom_welcome_greeting || ''}
                  onChange={(e) => onChange('custom_welcome_greeting', e.target.value)}
                  rows={5}
                  className="text-sm"
                />
                <p className="text-[11px] text-muted-foreground">
                  This exact message is sent instantly when a customer sends &quot;Hi&quot;, &quot;Hello&quot;, &quot;Hey&quot;, &quot;Good morning&quot;, etc. Supports WhatsApp formatting (*bold*, _italic_).
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Custom Courtesy Reply (for &quot;Thanks&quot; / &quot;Ok&quot; / &quot;Bye&quot;)</Label>
                <Textarea
                  placeholder={"You're very welcome! Feel free to reach out if you have any more questions. 😊"}
                  value={config.custom_courtesy_reply || ''}
                  onChange={(e) => onChange('custom_courtesy_reply', e.target.value)}
                  rows={2}
                  className="text-sm"
                />
                <p className="text-[11px] text-muted-foreground">
                  Sent instantly for courtesy messages (&quot;Thanks&quot;, &quot;Thank you&quot;, &quot;Ok&quot;, &quot;Bye&quot;). Leave blank to let AI handle these.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Product Catalog Toggle */}
        <div className="pt-4 border-t space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-blue-500" />
              <div>
                <Label className="font-semibold text-base">Product Catalog in AI Prompts</Label>
                <p className="text-xs text-muted-foreground">
                  When enabled, AI queries your product catalog database and includes it in responses. Disable if you don&apos;t have products to save tokens.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="enable-product-catalog" className="text-xs font-medium">Enable</Label>
              <Switch
                id="enable-product-catalog"
                checked={config.enable_product_catalog ?? false}
                onCheckedChange={(v) => onChange('enable_product_catalog', v)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
