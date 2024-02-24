/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
