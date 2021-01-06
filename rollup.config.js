import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss-modules';
import typescript from 'rollup-plugin-typescript2';

const packageJson = require('./package.json');

export default {
  input: 'src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs'
    },
    {
      file: packageJson.module,
      format: 'es'
    }
  ],
  plugins: [
    commonjs(),
    peerDepsExternal(),
    postcss(),
    typescript({
      typescript: require('typescript'),
      useTsconfigDeclarationDir: true
    })
  ]
};
