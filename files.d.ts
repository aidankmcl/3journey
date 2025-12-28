/// <reference types="vite/client" />

declare module "*.hdr" {
  const value: string;
  export default value;
}

declare module '*.glsl' {
  const content: string
  export default content
}

declare module '*.frag' {
  const content: string
  export default content
}

declare module '*.vert' {
  const content: string
  export default content
}

declare module '*.glb' {
  const content: string
  export default content
}

declare module '*.gltf' {
  const content: string
  export default content
}