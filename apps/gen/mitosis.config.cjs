/**
 * @type {import('@builder.io/mitosis').MitosisConfig}
 */
module.exports = {
  files: "./**",
  targets: ["react", "svelte", "vue"],
  dest: "../web/registry",
  // exclude: [
  //   "out",
  // ],
  commonOptions: {
    typescript: true,
  },
  options: {
    react: {
      stylesType: "style-tag",
    },
    svelte: {
      // prettier:
    },
    qwik: {},
    vue: {
      api: "composition",
    },
  },
  // getTargetPath: ({ target }) => `./`,
};
