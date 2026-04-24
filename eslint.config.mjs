// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    "@stylistic/quotes": "off",
    "@stylistic/comma-dangle": "off",
    "@stylistic/semi": "off",
    "vue/max-attributes-per-line": "off",
    "vue/comma-dangle": "off",
    "vue/singleline-html-element-content-newline": "off",
  },
});
