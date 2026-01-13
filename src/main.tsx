import '@/styles/globals.css';
import { hydrateRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App, { type AppProps } from '@/App';
import { initThemeFromStorage } from '@/utils/theme';

declare global {
  interface Window {
    __INITIAL_PROPS__?: AppProps;
  }
}

const rootElement = document.getElementById('root');
const initialProps: AppProps | undefined = window.__INITIAL_PROPS__;
if (rootElement) {
  initThemeFromStorage();
  const queryClient = new QueryClient();
  hydrateRoot(
    rootElement,
    <QueryClientProvider client={queryClient}>
      <App {...(initialProps ?? {})} />
    </QueryClientProvider>
  );
}
