import { renderToString } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App, { type AppProps } from '@/App';

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
