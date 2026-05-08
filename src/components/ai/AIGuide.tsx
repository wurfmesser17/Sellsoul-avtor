import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Zap, ShieldAlert, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { getAIGuideResponse } from '../../services/geminiService';
import { subscribeToChat, addChatMessage } from '../../lib/firestoreService';
import { useAuth } from '../../context/AuthContext';
import { ChatMessage } from '../../types';
import { cn } from '../../lib/utils';

export function AIGuide() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingText, setStreamingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    
    // Subscribe to messages
    const unsubscribe = subscribeToChat(user.uid, (msgs) => {
      if (msgs.length === 0) {
        // Initial welcome message if no history
        setMessages([{ 
          role: 'model', 
          text: "Здорово, будущий миллионер. Я — SellSoul AI. Знаю всё про фильтры Kaspi, грязные приемы конкурентов и как не слить бюджет. Что на уме? Спрашивай по факту.",
          createdAt: Date.now()
        }]);
      } else {
        setMessages(msgs);
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, streamingText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping || !user) return;

    const userMessage = input.trim();
    setInput('');
    setIsTyping(true);
    setStreamingText('');

    try {
      // 1. Save user message to Firestore
      await addChatMessage(user.uid, 'user', userMessage);

      // 2. Prepare history for Gemini
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // 3. Get AI Response
      const stream = await getAIGuideResponse(userMessage, history);
      let fullResponse = '';
      
      for await (const chunk of stream) {
        const text = chunk.text;
        if (text) {
          fullResponse += text;
          setStreamingText(fullResponse);
        }
      }

      // 4. Save full response to Firestore
      await addChatMessage(user.uid, 'model', fullResponse);
      setStreamingText('');
    } catch (error) {
      console.error("AI Guide Error:", error);
      // Local error message is not persisted
      setStreamingText("Глюк в системе. Попробуй еще раз, или проверь интернет. Я пока перекур.");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] w-full max-w-4xl mx-auto bg-white border-2 border-brand-ink rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="px-4 md:px-8 py-4 md:py-6 border-b border-brand-line flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-brand-ink flex items-center justify-center text-white shadow-lg">
            <Zap size={18} fill="currentColor" />
          </div>
          <div>
            <h3 className="text-xs md:text-sm font-black uppercase tracking-widest leading-none">SellSoul AI</h3>
            <span className="text-[9px] md:text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest">Онлайн // Режим: Hard</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-zinc-100 rounded-full">
           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Gemini 3 Flash</span>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6 scrollbar-none"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={m.id || i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-3 md:gap-4 max-w-[95%] md:max-w-[85%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "h-6 w-6 md:h-8 md:w-8 rounded-full flex-shrink-0 flex items-center justify-center border-2",
                m.role === 'user' ? "bg-zinc-50 border-brand-line" : "bg-brand-ink border-brand-ink text-white"
              )}>
                {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
              </div>
              <div className={cn(
                "p-3 md:p-4 rounded-2xl md:rounded-3xl text-xs md:text-sm leading-relaxed whitespace-pre-wrap",
                m.role === 'user' 
                  ? "bg-zinc-100 text-brand-ink rounded-tr-none" 
                  : "bg-brand-ink text-zinc-50 rounded-tl-none font-mono"
              )}>
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <div className="flex gap-3 md:gap-4 max-w-[95%] md:max-w-[85%] mr-auto">
            <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-brand-ink border-2 border-brand-ink text-white flex items-center justify-center">
              <Bot size={12} />
            </div>
            <div className="p-3 md:p-4 rounded-2xl md:rounded-3xl bg-brand-ink text-zinc-50 rounded-tl-none font-mono text-xs md:text-sm min-w-[60px] whitespace-pre-wrap">
              {streamingText || "..."}
              {streamingText === '' && <Loader2 className="animate-spin inline-block ml-2" size={12} />}
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom warning */}
      <div className="px-4 md:px-8 py-2 bg-amber-50/50 border-t border-amber-100 flex items-center gap-3">
         <ShieldAlert size={10} className="text-amber-600 flex-shrink-0" />
         <p className="text-[8px] md:text-[9px] font-bold text-amber-800 uppercase tracking-widest leading-none">
           Внимание: советы ИИ не являются официальной офертой. Рискуй с умом.
         </p>
      </div>

      {/* Input */}
      <form 
        onSubmit={handleSubmit}
        className="p-4 md:p-6 bg-zinc-50 border-t border-brand-line flex gap-2 md:gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Спрашивай по теме..."
          className="flex-1 bg-white border-2 border-brand-line rounded-xl md:rounded-2xl px-4 md:px-5 py-2 md:py-3 text-xs md:text-sm font-medium focus:outline-none focus:border-brand-ink transition-all placeholder:text-zinc-300"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-brand-ink text-white flex items-center justify-center hover:bg-zinc-800 transition-all disabled:opacity-20 flex-shrink-0"
        >
          {isTyping ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
}
