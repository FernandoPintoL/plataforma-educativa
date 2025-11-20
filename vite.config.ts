import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
        // Only run wayfinder in development mode
        // In production (Railway), it may fail due to DB not being ready during build
        ...(process.env.NODE_ENV === 'development' ? [
            wayfinder({
                formVariants: true,
            }),
        ] : []),
    ],
    server: {
        // Listen on all network interfaces so you can access from other devices and any Wi‑Fi network
        // host: '192.168.1.23',
        // port: 5437,
    },
    esbuild: {
        jsx: 'automatic',
    },
});
