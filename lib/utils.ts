import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const catalogColors = [
  "#d13b47", 
  "#edb634", 
  "#2abf4d", 
  "#3b61d1", 
  "#a93bd1", 
  "#e87025", 
  "#3bbdd1", 
  "#f5eee1", 
  "#f582b9", 
  "#e84c25", 
  "#68e8b5", 
  "#4234c7", 
  "#b2d93b", 
  "#F8C8A0", 
  "#b08fdb", 
  "#484a54", 
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
