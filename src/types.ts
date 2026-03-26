export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  perspectives?: {
    tieneInformacionSuficiente: boolean;
    respuestaDirecta: string;
    analisis: string;
    evaluacion: string;
    riesgos: string;
    estrategia: string;
    probabilidad: string;
    recomendaciones: string;
    advertencia: string;
  };
}

export interface LegalCase {
  description: string;
}
