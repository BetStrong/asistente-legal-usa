export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  perspectives?: {
    analisis: string;
    defensor: string;
    juez: string;
    evaluacion: string;
    probabilidad: string;
    recomendaciones: string;
    advertencia: string;
  };
}

export interface LegalCase {
  description: string;
}
