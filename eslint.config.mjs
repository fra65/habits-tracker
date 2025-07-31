import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Config generale per tutto il codice
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Override per i file generati di Prisma
  {
    files: ["src/generated/**"], // o "./src/generated/**" se preferisci
    rules: {
      // Disabilita tutte le regole (puoi aggiungere quelle che danno fastidio)
      "all": "off", // Disabilita tutto, ma attenzione: non tutte le versioni ESLint supportano "all"
      // In alternativa, spegni le regole specifiche che danno errore:
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/no-unused-expressions": "off"
      // Se ci sono altre regole fastidiose, aggiungile qui
    },
  },
];

export default eslintConfig;
