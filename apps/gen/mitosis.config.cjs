/**
 * @type {import('@builder.io/mitosis').MitosisConfig}
 */
module.exports = {
  files: "./**",
  targets: ["react", "svelte", "vue"],
  dest: "../web/registry",
  // exclude: ["out"],
  commonOptions: {
    typescript: true,
    // prettier: false,
  },
  options: {
    react: {
      stylesType: "style-tag",
    },
    vue: {
      api: "composition",
    },
  },
};
