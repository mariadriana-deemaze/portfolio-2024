import App, { type AppProps } from '@/App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToString } from 'react-dom/server';

export interface RenderProps extends AppProps {
  location: string;
}

export function render(props: RenderProps): string {
  const queryClient = new QueryClient();
  return renderToString(
    <QueryClientProvider client={queryClient}>
      <App {...props} />
    </QueryClientProvider>
  );
}
