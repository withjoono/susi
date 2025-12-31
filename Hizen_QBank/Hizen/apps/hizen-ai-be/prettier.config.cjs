module.exports = {
  tabWidth: 2,
  trailingComma: "all",
  singleQuote: false,
  semi: true,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "^dotenv/(.*)$",
    "THIRD_PARTY_MODULES",
    "^@app/(.*)$",
    "^@api/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ["decorators-legacy", "typescript", "jsx"],
};
