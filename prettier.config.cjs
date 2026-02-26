/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  endOfLine: "auto",
  semi: false,
  singleQuote: false,
  printWidth: 90,
  arrowParens: "always",
  tabWidth: 2,
  trailingComma: "es5",

  importOrder: [
    "^(react$)|^(react-dom(.*)$)|^(react/(.*)$)",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^types$",
    "^@/components/(.*)$",
    "^@/context/(.*)$",
    "^@/hooks/(.*)$",
    "^@/layout/(.*)$",
    "^@/modules/(.*)$",
    "^@/types/(.*)$",
    "^@/utils/(.*)$",
    "^@/lib/(.*)$",
    "^@/(.*)$",
    "",
    "^(?!.*\\.css$)[./].*$",
    "",
    ".*\\.css$",
  ],

  importOrderSafeSideEffects: [".*\\.css$"],

  plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],

  tailwindFunctions: ["tv", "clsx"],
  tailwindAttributes: ["cn"],
}

module.exports = config
