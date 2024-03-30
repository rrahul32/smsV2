/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_ATLAS_APP_ID: string
  readonly MAIN_ATLAS_API_KEY: string
  readonly MAIN_JWT_SECRET_KEY: string
  readonly MAIN_MONGO_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
