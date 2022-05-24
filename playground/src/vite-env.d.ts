/// <reference types="vite/client" />

interface ImportMeta {
  myGlob<T>(glob: string | string[], options?: myGlobOptions<false>): Record<string, () => Promise<T>>
  myGlob<T>(glob: string | string[], options: myGlobOptions<true>): Record<string, () => T>
  myGlob<T, Eager extends boolean>(glob: string | string[], options?: myGlobOptions<Eager>): Eager extends true
    ? Record<string, T>
    : Record<string, () => Promise<T>>
}

interface myGlobOptions<Eager extends boolean> {
  as?: string
  eager?: Eager
}
