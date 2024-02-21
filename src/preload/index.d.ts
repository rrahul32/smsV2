import { Void } from '@shared/types'

declare global {
  interface Window {
    context: {
      test: () => Void
    }
  }
}
