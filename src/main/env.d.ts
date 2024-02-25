/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_ATLAS_APP_ID: string
  readonly MAIN_ATLAS_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
