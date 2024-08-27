// src/types.ts
export interface Trabajador {
  id: number;
  nombre_completo: string;
}

export interface Boleta {
  id: number;
  mes: string; // Mantén el tipo como string para formato
  pdf: string;
  trabajador: Trabajador;
}
