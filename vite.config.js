import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: '/',

  build: {
    outDir: 'dist',
    emptyOutDir: true,

    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Deterministic chunk names — easier to audit
        entryFileNames: 'assets/bp.[name].[hash].js',
        chunkFileNames: 'assets/bp.[name].[hash].js',
        assetFileNames: 'assets/bp.[name].[hash][extname]',

        // Manual chunk splitting — keeps large modules out of the main bundle
        manualChunks: {
          'core':     [
            './src/core/constants.js',
            './src/core/security.js',
            './src/core/utils.js',
            './src/core/analytics.js',
          ],
          'firebase': ['./src/core/firebase.js'],
          'engines':  [
            './src/engine/skill-library.js',
            './src/engine/bls.js',
            './src/engine/crosswalk.js',
            './src/engine/values.js',
            './src/engine/evidence.js',
            './src/engine/verification.js',
            './src/engine/match.js',
            './src/engine/job-analysis.js',
          ],
          'admin':    [
            './src/admin/index.js',
            './src/admin/overview.js',
            './src/admin/users.js',
            './src/admin/costs.js',
            './src/admin/roadmap.js',
            './src/admin/architecture.js',
          ],
          'wb':       [
            './src/features/wb-wizard.js',
            './src/features/wb-compare.js',
          ],
          'scouting': ['./src/features/scouting.js'],
          'views':    [
            './src/views/welcome.js',
            './src/views/network.js',
            './src/views/jobs.js',
            './src/views/blueprint.js',
            './src/views/reports.js',
            './src/views/settings.js',
            './src/views/user-data.js',
          ],
        },
      },
    },

    // Don't inline small assets — keep JSON data files as separate fetches
    assetsInlineLimit: 0,

    // Source maps for debugging in production (can disable later)
    sourcemap: true,

    // Target modern browsers — no need to support IE
    target: 'es2020',
  },

  // Dev server config
  server: {
    port: 3000,
    open: true,
  },
});
