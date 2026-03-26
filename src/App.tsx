import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, 
  ShieldCheck, 
  Gavel, 
  Send, 
  User, 
  Bot, 
  AlertCircle,
  MessageSquare,
  ChevronRight,
  Info,
  LayoutDashboard,
  FileText,
  History,
  Settings,
  Cpu,
  Sparkles
} from 'lucide-react';
import { analyzeCase } from './services/gemini';
import { Message } from './types';
import { cn } from './lib/utils';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bienvenido al Asistente Legal de Inmigración IA. Estoy listo para proporcionar un análisis dual de su caso. Por favor, describa su situación o haga una pregunta sobre las leyes de inmigración de los EE. UU.',
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
    <div className="dashboard-grid bg-[#050A15]">
      {/* Sidebar - Estética de Oficina Legal Moderna */}
      <aside className="hidden lg:flex flex-col border-r border-slate-800/50 bg-[#0A192F]/40 backdrop-blur-xl p-6">
        <div className="flex items-center gap-3 mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-legal-gold/20 blur-lg rounded-full animate-pulse" />
            <Scale className="w-8 h-8 text-legal-gold relative z-10" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight gold-gradient-text">
              Legal AI
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
              Asistente de Inmigración
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Panel de Control', active: true },
            { icon: FileText, label: 'Análisis de Caso' },
            { icon: History, label: 'Historial' },
            { icon: Settings, label: 'Configuración' },
          ].map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                item.active 
                  ? "bg-legal-gold/10 text-legal-gold border border-legal-gold/20" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-800/50">
          <div className="glass-screen p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-legal-gold">
              <Cpu className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Estado del Sistema</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Núcleo IA</span>
              <span className="text-xs text-emerald-400 font-mono">ÓPTIMO</span>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '92%' }}
                className="h-full bg-emerald-400"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <div className="flex flex-col h-screen relative overflow-hidden">
        {/* Elementos de Fondo Cinemáticos */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-legal-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Encabezado */}
        <header className="glass-screen sticky top-0 z-20 px-8 py-5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="lg:hidden bg-legal-gold/10 p-2 rounded-lg">
              <Scale className="w-6 h-6 text-legal-gold" />
            </div>
            <div>
              <h2 className="text-sm font-display font-bold text-slate-100">
                Asistente Legal de Inmigración
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em]">
                Análisis Dual: Estrategia de Defensa y Evaluación de la Corte
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Análisis en Vivo</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border border-slate-700 p-0.5">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Área de Chat */}
        <main className="flex-1 overflow-y-auto px-6 py-10 relative z-10">
          <div className="max-w-5xl mx-auto space-y-10">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-6",
                    message.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 cinematic-glow",
                    message.role === 'user' 
                      ? "bg-slate-800 border border-slate-700" 
                      : "bg-legal-gold/10 border border-legal-gold/30"
                  )}>
                    {message.role === 'user' 
                      ? <User className="w-6 h-6 text-slate-400" /> 
                      : <Sparkles className="w-6 h-6 text-legal-gold" />
                    }
                  </div>

                  <div className={cn(
                    "max-w-[80%] space-y-6",
                    message.role === 'user' ? "items-end" : "items-start"
                  )}>
                    {message.content && (
                      <div className={cn(
                        "p-6 rounded-3xl glass-screen",
                        message.role === 'user' 
                          ? "bg-slate-800/40 border-slate-700/50 rounded-tr-none" 
                          : "bg-white/5 border-white/10 rounded-tl-none"
                      )}>
                        <p className="text-sm leading-relaxed text-slate-200">{message.content}</p>
                      </div>
                    )}

                    {message.perspectives && (
                      <div className="space-y-6">
                      {/* 🔍 Análisis de tu caso */}
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-screen bg-white/5 p-6 rounded-3xl space-y-3"
                      >
                        <div className="flex items-center gap-2 text-blue-400 font-display font-bold text-xs uppercase tracking-[0.2em]">
                          <FileText className="w-4 h-4" />
                          <span>Análisis del Caso</span>
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed">
                          {message.perspectives.analisis}
                        </p>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 🛡️ Como abogado defensor */}
                        <motion.div 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                          className="glass-screen bg-emerald-500/5 border-emerald-500/20 p-6 rounded-3xl space-y-4 relative overflow-hidden group"
                        >
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldCheck className="w-12 h-12 text-emerald-500" />
                          </div>
                          <div className="flex items-center gap-2 text-emerald-400 font-display font-bold text-xs uppercase tracking-[0.2em]">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Estrategia de Defensa</span>
                          </div>
                          <div className="h-px w-12 bg-emerald-500/30" />
                          <p className="text-slate-200 text-sm leading-relaxed font-medium">
                            {message.perspectives.defensor}
                          </p>
                        </motion.div>

                        {/* ⚖️ Como oficial/juez */}
                        <motion.div 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="glass-screen bg-legal-gold/5 border-legal-gold/20 p-6 rounded-3xl space-y-4 relative overflow-hidden group"
                        >
                          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Gavel className="w-12 h-12 text-legal-gold" />
                          </div>
                          <div className="flex items-center gap-2 text-legal-gold font-display font-bold text-xs uppercase tracking-[0.2em]">
                            <Gavel className="w-4 h-4" />
                            <span>Evaluación del Juez</span>
                          </div>
                          <div className="h-px w-12 bg-legal-gold/30" />
                          <p className="text-slate-200 text-sm leading-relaxed font-medium">
                            {message.perspectives.juez}
                          </p>
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 📊 Evaluación del caso */}
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="glass-screen bg-white/5 p-6 rounded-3xl space-y-3"
                        >
                          <div className="flex items-center gap-2 text-slate-400 font-display font-bold text-[10px] uppercase tracking-[0.3em]">
                            <LayoutDashboard className="w-4 h-4" />
                            <span>Evaluación General</span>
                          </div>
                          <p className="text-slate-200 text-sm leading-relaxed">
                            {message.perspectives.evaluacion}
                          </p>
                        </motion.div>

                        {/* 📈 Probabilidad estimada */}
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="glass-screen bg-white/5 p-6 rounded-3xl space-y-3 flex flex-col justify-center items-center text-center"
                        >
                          <div className="flex items-center gap-2 text-slate-400 font-display font-bold text-[10px] uppercase tracking-[0.3em]">
                            <History className="w-4 h-4" />
                            <span>Probabilidad Estimada</span>
                          </div>
                          <div className="text-4xl font-display font-bold gold-gradient-text mt-2">
                            {message.perspectives.probabilidad}
                          </div>
                        </motion.div>
                      </div>

                      {/* 📌 Recomendaciones */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-screen bg-blue-500/5 border-blue-500/20 p-6 rounded-3xl space-y-4"
                      >
                        <div className="flex items-center gap-2 text-blue-400 font-display font-bold text-xs uppercase tracking-[0.2em]">
                          <Info className="w-4 h-4" />
                          <span>Recomendaciones y Evidencia</span>
                        </div>
                        <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                          {message.perspectives.recomendaciones}
                        </div>
                      </motion.div>

                      {/* ❗ Advertencia legal */}
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 flex gap-3 items-start"
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-red-400/80 font-medium leading-relaxed uppercase tracking-wider">
                          {message.perspectives.advertencia}
                        </p>
                      </motion.div>
                    </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-legal-gold/10 border border-legal-gold/30 flex items-center justify-center animate-pulse">
                  <Cpu className="w-6 h-6 text-legal-gold" />
                </div>
                <div className="glass-screen px-6 py-4 rounded-3xl rounded-tl-none flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-legal-gold/50 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-legal-gold/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-legal-gold/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Área de Entrada - Centro de Comando Futurista */}
        <footer className="p-8 relative z-20">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-legal-gold/20 via-blue-500/20 to-legal-gold/20 rounded-[32px] blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200" />
              <div className="relative glass-screen rounded-[28px] p-2 flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ingrese detalles del caso para análisis legal dual..."
                  className="flex-1 bg-transparent border-none px-6 py-4 text-sm text-slate-100 placeholder:text-slate-500 focus:ring-0 resize-none min-h-[60px] max-h-[200px]"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-4 bg-legal-gold text-slate-900 rounded-2xl hover:bg-legal-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(197,160,89,0.3)]"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
            
            <div className="mt-6 flex justify-center gap-8">
              <div className="flex items-center gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Lógica de Defensa Activa</span>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                <Gavel className="w-3 h-3 text-legal-gold" />
                <span>Simulación de Corte Lista</span>
              </div>
              <div className="flex items-center gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">
                <Cpu className="w-3 h-3 text-blue-400" />
                <span>Motor Legal Neuronal v4.0</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
