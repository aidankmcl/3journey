import type { MainModule } from 'clipper2-wasm/dist/clipper2z';
import wasmURL from '~/clipper/clipper2z.wasm?url';

// import Clipper2ZFactory from 'clipper2-wasm/dist/es/clipper2z';

// export { Clipper2ZFactory as ClipperFactory };

// const Clipper2ZFactory: Clipper2ZFactoryFunction = Clipper2ZFactory;

// Clipper2ZFactory({
// 	locateFile: () => {
// 		return 'clipper2-wasm/dist/es/clipper2z/clipper2z.wasm'
// 	},
// }).then((Clipper2Z: MainModule) => {
// 	console.log('Clipper2Z', Clipper2Z);
// })



import Clipper2ZFactory from 'clipper2-wasm/dist/es/clipper2z'; // You may need to import from 'clipper2-wasm/dist/clipper2z' depending on your bundler

// 1. Singleton: Load the WASM module only once
let clipperInstance: MainModule | null = null;

export async function getClipperLib(): Promise<MainModule> {
  if (!clipperInstance) {
    // Note: You might need to configure 'locateFile' if your bundler doesn't auto-resolve the .wasm file
    clipperInstance = await Clipper2ZFactory({
      locateFile: () => {
        return wasmURL
      },
    });
  }

  return clipperInstance as MainModule;
}