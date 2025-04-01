import '@emotion/react'

import { ThemeType } from './styles/theme'

declare module '@emotion/react' {
  export type Theme = ThemeType
}
