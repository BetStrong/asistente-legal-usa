import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  ShieldCheck, 
  Send, 
  User, 
  AlertCircle,
  FileText,
  History,
  Info,
  CheckCircle2
} from 'lucide-react';
import { analyzeCase } from './services/gemini';
import { Message } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hola, soy tu asistente legal de inmigración en Estados Unidos.

Voy a analizar tu caso desde una perspectiva profesional, como lo haría un abogado.

Para comenzar, descríbeme tu situación con el mayor detalle posible:
- País de origen
- Cómo entraste a EE.UU.
- Qué problema tienes actualmente
- Si tienes documentos o pruebas

Comencemos.`,
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await analyzeCase(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        perspectives: response,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Ocurrió un error al procesar su solicitud. Por favor, inténtelo de nuevo.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-saas-bg">
      {/* Header Superior Minimalista */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 saas-shadow">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-saas-blue p-2 rounded-lg">
              <Scale className="w-6 h-6 text-saas-yellow" />
            </div>
            <div>
              <h1 className="font-display font-bold text-saas-blue text-lg leading-tight">
                Asistente Legal de Inmigración
              </h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Análisis en Vivo</span>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-saas-yellow" />
              Experto en Virginia
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-saas-yellow" />
              Análisis Dual
            </span>
          </div>
        </div>
      </header>

      {/* Área Principal de Chat */}
      <main className="flex-1 overflow-y-auto pb-32 pt-8 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex flex-col",
                  message.role === 'user' ? "items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "max-w-[90%] md:max-w-[85%] rounded-2xl",
                  message.role === 'user' 
                    ? "bg-saas-blue text-white rounded-tr-none p-4 md:p-6 saas-shadow" 
                    : "bg-transparent text-slate-800 space-y-4"
                )}>
                  {message.content && (
                    <div className={cn(
                      "p-4 md:p-6 rounded-2xl saas-shadow",
                      message.role === 'user' ? "" : "bg-white border border-slate-100 rounded-tl-none"
                    )}>
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  )}

                  {message.perspectives && (
                    <div className="space-y-4">
                      {!message.perspectives.tieneInformacionSuficiente ? (
                        /* Respuesta Directa (cuando falta info) */
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-3 saas-shadow">
                          <div className="flex items-center gap-2 text-saas-blue font-bold text-xs uppercase tracking-wider">
                            <Info className="w-4 h-4" />
                            <span>Información Requerida</span>
                          </div>
                          <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                            {message.perspectives.respuestaDirecta}
                          </p>
                        </div>
                      ) : (
                        /* Análisis Completo */
                        <>
                          {/* 1. Análisis del caso */}
                          <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-3 saas-shadow">
                            <div className="flex items-center gap-2 text-saas-blue font-bold text-xs uppercase tracking-wider">
                              <FileText className="w-4 h-4" />
                              <span>1. Análisis del Caso</span>
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                              {message.perspectives.analisis}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* 2. Evaluación legal */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-3 saas-shadow">
                              <div className="flex items-center gap-2 text-saas-blue font-bold text-xs uppercase tracking-wider">
                                <Scale className="w-4 h-4" />
                                <span>2. Evaluación Legal</span>
                              </div>
                              <p className="text-slate-700 text-xs leading-relaxed font-medium whitespace-pre-wrap">
                                {message.perspectives.evaluacion}
                              </p>
                            </div>

                            {/* 5. Probabilidad estimada */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-100 flex flex-col justify-center items-center text-center saas-shadow">
                              <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
                                <History className="w-4 h-4" />
                                <span>5. Probabilidad Estimada</span>
                              </div>
                              <div className="text-3xl font-bold text-saas-blue mt-1">
                                {message.perspectives.probabilidad}
                              </div>
                            </div>
                          </div>

                          {/* 3. Riesgos importantes */}
                          <div className="bg-white p-5 rounded-2xl border border-red-100 space-y-3 saas-shadow">
                            <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wider">
                              <AlertCircle className="w-4 h-4" />
                              <span>3. Riesgos Importantes</span>
                            </div>
                            <p className="text-slate-700 text-xs leading-relaxed font-medium whitespace-pre-wrap">
                              {message.perspectives.riesgos}
                            </p>
                          </div>

                          {/* 4. Estrategia recomendada */}
                          <div className="bg-white p-5 rounded-2xl border border-emerald-100 space-y-3 saas-shadow">
                            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
                              <ShieldCheck className="w-4 h-4" />
                              <span>4. Estrategia Recomendada</span>
                            </div>
                            <p className="text-slate-700 text-xs leading-relaxed font-medium whitespace-pre-wrap">
                              {message.perspectives.estrategia}
                            </p>
                          </div>

                          {/* 6. Recomendaciones claras */}
                          <div className="bg-white p-5 rounded-2xl border border-blue-100 space-y-3 saas-shadow">
                            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider">
                              <Info className="w-4 h-4" />
                              <span>6. Recomendaciones Claras</span>
                            </div>
                            <div className="text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">
                              {message.perspectives.recomendaciones}
                            </div>
                          </div>
                        </>
                      )}

                      {/* ❗ Advertencia legal */}
                      <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex gap-2 items-start saas-shadow">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-[9px] text-red-700 font-medium leading-tight uppercase tracking-wide">
                          {message.perspectives.advertencia}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3 text-slate-400 text-sm font-medium"
            >
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-saas-yellow rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-saas-yellow rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-saas-yellow rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span>Analizando caso legal...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Fijo Inferior */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-saas-bg via-saas-bg to-transparent">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative saas-shadow rounded-2xl overflow-hidden bg-white border border-slate-200">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe tu caso para un análisis legal profesional..."
              className="w-full bg-transparent border-none px-6 py-4 text-sm md:text-base text-slate-800 placeholder:text-slate-400 focus:ring-0 resize-none min-h-[60px] max-h-[200px]"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="absolute right-2 bottom-2">
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-3 bg-saas-yellow text-saas-blue rounded-xl hover:bg-[#FFD633] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 saas-shadow flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
          <p className="text-center text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-widest">
            Asistente Legal IA • Basado en Leyes de EE. UU.
          </p>
        </div>
      </footer>
    </div>
  );
}
