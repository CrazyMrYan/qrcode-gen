import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default [
  // UMD build (包含所有依赖)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/qrcode-gen.js',
      format: 'umd',
      name: 'QRCodeGen',
    },
    plugins: [
      resolve({ browser: true }),
      commonjs()
    ],
  },
  // UMD minified build (包含所有依赖)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/qrcode-gen.min.js',
      format: 'umd',
      name: 'QRCodeGen',
    },
    plugins: [
      resolve({ browser: true }),
      commonjs(),
      terser()
    ],
  },
  // ESM build (保留外部依赖用于npm包)
  {
    input: 'src/index.js',
    output: {
      file: 'dist/qrcode-gen.esm.js',
      format: 'es',
    },
    external: ['qrcode'],
    plugins: [resolve(), commonjs()],
  },
];
