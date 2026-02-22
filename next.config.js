const nextra = require('nextra')

const withNextra = (nextra.default || nextra)({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

module.exports = withNextra()
