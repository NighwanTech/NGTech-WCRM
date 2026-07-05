import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, RefreshCw, Trash2, Copy, AlertCircle } from "lucide-react"

export function TestingPlayground({ config }: { config: any }) {
  const [messages, setMessages] = useState<{role: 'user'|'assistant', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    const newHistory = [...messages, { role: 'user', content: userMsg }];
    setMessages(newHistory as any);
    setInput('');
    setLoading(true);
    setError('');
    setStats(null);

    try {
      const res = await fetch('/api/ai-assistant/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          config,
          history: messages // pass history up to this point
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate response");
      
      setMessages([...newHistory, { role: 'assistant', content: data.text }] as any);
      
      if (data.usage || data.timeMs) {
        setStats({
          timeMs: data.timeMs,
          tokens: data.usage?.totalTokens,
          provider: data.provider,
          model: data.model
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setStats(null);
    setError('');
  };

  return (
    <Card className="flex flex-col h-[650px] shadow-sm">
      <CardHeader className="border-b bg-zinc-50 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Testing Playground</CardTitle>
            <CardDescription>Chat with your AI to test rules and knowledge base.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClear} disabled={messages.length === 0} className="text-muted-foreground hover:text-red-500">
            <Trash2 className="w-4 h-4 mr-2" /> Clear Chat
          </Button>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4 bg-[url('/whatsapp-bg.png')] bg-repeat" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && !loading && (
            <div className="text-center text-muted-foreground text-sm mt-10 bg-white/80 p-4 rounded-lg inline-block mx-auto max-w-sm shadow-sm">
              Send a message to start simulating a WhatsApp conversation. The AI will use your unsaved draft configurations above.
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm relative group ${msg.role === 'user' ? 'bg-[#d9fdd3] text-black rounded-tr-none' : 'bg-white text-black rounded-tl-none'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                {msg.role === 'assistant' && (
                  <Button variant="ghost" size="icon" className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 h-8 w-8 text-zinc-400 hover:text-zinc-800" onClick={() => navigator.clipboard.writeText(msg.content)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                <Bot className="w-4 h-4 text-zinc-400 animate-pulse" />
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}

          {error && (
             <div className="flex justify-center mt-4">
               <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                 <AlertCircle className="w-4 h-4" />
                 {error}
               </div>
             </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t">
        {stats && (
          <div className="bg-zinc-50 px-4 py-2 flex items-center justify-between text-[10px] text-zinc-500 uppercase font-medium tracking-wider border-b">
            <span>Provider: {stats.provider} ({stats.model})</span>
            <div className="flex gap-4">
              <span>Time: {stats.timeMs ? `${Math.round(stats.timeMs)}ms` : '-'}</span>
              <span>Tokens: {stats.tokens || '-'}</span>
            </div>
          </div>
        )}
        <CardFooter className="p-3 bg-zinc-100 gap-2 m-0">
          <Input 
            placeholder="Type a message..." 
            className="flex-1 bg-white border-0 focus-visible:ring-1" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={!input.trim() || loading} className="rounded-full w-10 h-10 p-0 shadow-sm shrink-0">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-1" />}
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}
