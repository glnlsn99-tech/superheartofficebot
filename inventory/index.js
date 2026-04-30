// ======================================
// INVENTARIO HELLDIVERS 2 – Entry Point
// Aggiornato a: Marzo 2026 (pre-Entrenched Warfare)
// ======================================

export { primarie } from "./inventory_primarie.js";
export { secondarie } from "./inventory_secondarie.js";
export { supporto } from "./inventory_supporto.js";
export { armature } from "./inventory_armature.js";
export { granate } from "./inventory_granate.js";
export { stratagemmi } from "./inventory_stratagemmi.js";
export { loadout } from "./inventory_loadout.js";

export const menuInventario = [
  { id: "primarie", label: "🔫 Primarie", modulo: "inventory_primarie.js" },
  { id: "secondarie", label: "🔹 Secondarie", modulo: "inventory_secondarie.js" },
  { id: "supporto", label: "🛠️ Armi Supporto", modulo: "inventory_supporto.js" },
  { id: "armature", label: "🛡️ Armature", modulo: "inventory_armature.js" },
  { id: "granate", label: "💣 Granate", modulo: "inventory_granate.js" },
  { id: "stratagemmi", label: "🛰️ Stratagemmi", modulo: "inventory_stratagemmi.js" },
  { id: "loadout", label: "📚 Loadout", modulo: "inventory_loadout.js" }
];

export const tierOrder = ["S", "A+", "A", "B+", "B", "C+", "C", "D+", "D", "F", "???"];

export function filtraPerTier(lista, tier) {
  return lista.filter(item => item.tier === tier);
}

export function cercaPerNome(lista, testo) {
  const q = testo.toLowerCase();
  return lista.filter(item => item.nome.toLowerCase().includes(q));
}

export function ordinaPerTier(lista) {
  return [...lista].sort((a, b) => {
    const ai = tierOrder.indexOf(a.tier);
    const bi = tierOrder.indexOf(b.tier);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}
