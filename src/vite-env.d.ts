/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHATBOT_API_URL: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_WS_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {};

declare module 'framer-motion';
declare module 'react-intersection-observer';
