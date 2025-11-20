/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CHATBOT_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {};

declare module 'framer-motion';
declare module 'react-intersection-observer';
