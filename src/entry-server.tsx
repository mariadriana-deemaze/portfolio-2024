import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App, { type AppProps } from './App';

export interface RenderProps extends AppProps {
  location: string;
}

export function render(props: RenderProps): string {
  const queryClient = new QueryClient();
  return renderToString(
    <MemoryRouter initialEntries={[props.location]} initialIndex={0}>
      <QueryClientProvider client={queryClient}>
        <App {...props} />
      </QueryClientProvider>
    </MemoryRouter>
  );
}
