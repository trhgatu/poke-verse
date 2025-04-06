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
    normal: "bg-normal-gradient",
    fire: "bg-fire-gradient",
    water: "bg-water-gradient",
    electric: "bg-electric-gradient",
    grass: "bg-grass-gradient",
    ice: "bg-ice-gradient",
    fighting: "bg-fighting-gradient",
    poison: "bg-poison-gradient",
    ground: "bg-ground-gradient",
    flying: "bg-flying-gradient",
    psychic: "bg-psychic-gradient",
    bug: "bg-bug-gradient",
    rock: "bg-rock-gradient",
    ghost: "bg-ghost-gradient",
    dragon: "bg-dragon-gradient",
    dark: "bg-dark-gradient",
    steel: "bg-steel-gradient",
    fairy: "bg-fairy-gradient",
  };

  return types[type] || "bg-normal-gradient";
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