import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatPokemonId(id: number): string {
  return `#${id.toString().padStart(3, '0')}`;
}

export function getColorByType(type: string): string {
  const types: Record<string, string> = {
    normal: "bg-gray-400",
    fire: "bg-red-500",
    water: "bg-blue-500",
    electric: "bg-yellow-400",
    grass: "bg-green-500",
    ice: "bg-blue-200",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-yellow-700",
    flying: "bg-indigo-300",
    psychic: "bg-pink-500",
    bug: "bg-lime-500",
    rock: "bg-yellow-800",
    ghost: "bg-purple-700",
    dragon: "bg-indigo-700",
    dark: "bg-gray-800",
    steel: "bg-gray-500",
    fairy: "bg-pink-300",
  };

  return types[type] || "bg-gray-500";
}

export function getTextColorByType(type: string): string {
  const types: Record<string, string> = {
    normal: "text-gray-700",
    fire: "text-red-600",
    water: "text-blue-600",
    electric: "text-yellow-500",
    grass: "text-green-600",
    ice: "text-blue-300",
    fighting: "text-red-800",
    poison: "text-purple-600",
    ground: "text-yellow-800",
    flying: "text-indigo-400",
    psychic: "text-pink-600",
    bug: "text-lime-600",
    rock: "text-yellow-900",
    ghost: "text-purple-800",
    dragon: "text-indigo-800",
    dark: "text-gray-900",
    steel: "text-gray-600",
    fairy: "text-pink-400",
  };

  return types[type] || "text-gray-600";
}