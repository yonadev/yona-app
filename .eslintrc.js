module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "@vue/prettier",
    "@vue/typescript",
    "prettier",
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
  plugins: ["prettier"],
  rules: { "prettier/prettier": ["error", { endOfLine: "auto" }] },
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
};
