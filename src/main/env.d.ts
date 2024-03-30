/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_JWT_SECRET_KEY: string
  readonly MAIN_MONGO_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
