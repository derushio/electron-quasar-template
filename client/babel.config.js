module.exports = {
  "presets": [
    "@vue/app"
  ],
  "plugins": [
    "@babel/proposal-optional-chaining",
    [
      "transform-imports",
      {
        "quasar": {
          "transform": "quasar/dist/babel-transforms/imports.js",
          "preventFullImport": true
        }
      }
    ]
  ]
}
