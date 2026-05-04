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

export const ratingColors = [
  "#5c5c5c",
  "#e03145",
  "#e05a31",
  "#e08631",
  "#e0b431",
  "#cee031",
  "#51e031",
  "#31e0ba",
  "#3189e0",
  "#4e31e0",
  "#a331e0"
]

export function formatSeconds(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
