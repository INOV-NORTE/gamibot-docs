import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        // Register custom components here if needed
    }
} satisfies Theme
