/// <reference types="vite/client" />

declare module "*.hdr" {
  const value: string;
  export default value;
}

declare module '*.frag' {
  const content: string
  export default content
}

declare module '*.vert' {
  const content: string
  export default content
}