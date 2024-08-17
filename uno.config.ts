import { defineConfig } from 'unocss'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  transformers: [
    transformerDirectives()
  ],
  theme: {
    colors: {
      primary: '#FF9946',
    }
  }
})
