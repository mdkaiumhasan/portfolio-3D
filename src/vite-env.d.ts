/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_RAIN_STREET_MODEL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
