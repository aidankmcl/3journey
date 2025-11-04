// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';
import fg from 'fast-glob';

const PARENT_DIR_NAME = 'lessons';

function htmlInputs() {
  // finds lessons/foo/index.html => input key "lessons/foo"
  const files = fg.sync(`${PARENT_DIR_NAME}/**/index.html`, { dot: false });
  const inputs: Record<string, string> = {};
  for (const f of files) {
    const key = f.replace(/\/index\.html$/, ''); // "lessons/foo"
    inputs[key] = resolve(__dirname, f);
  }

  // also include the root index.html if you have one
  if (!inputs['index'] && fg.sync('index.html').length) {
    inputs['index'] = resolve(__dirname, 'index.html');
  }

  return inputs;
}

export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, 'shared'),
    },
  },
  build: {
    rollupOptions: {
      input: htmlInputs(),
    },
  },
});
