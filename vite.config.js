import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
                    'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
                },
            },
        },
    },
});
