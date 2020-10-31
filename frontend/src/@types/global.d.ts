declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_HUB_URL: string
    }
  }
}

export {}
