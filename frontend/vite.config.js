import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// הפרונט מדבר ישירות מול Supabase (אין בקאנד) — אין צורך בפרוקסי.
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
});
