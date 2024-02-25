import { Void } from '@shared/types'

declare global {
  interface Window {
    context: {
      test: () => Void
      addDog: () => Void
      reconnect: () => Promise<Bolean>
    }
  }
}
