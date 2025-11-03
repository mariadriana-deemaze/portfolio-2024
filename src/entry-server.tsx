import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import App, { type AppProps } from './App';

export interface RenderProps extends AppProps {
  location: string;
}

export function render(props: RenderProps): string {
  return renderToString(
    <MemoryRouter initialEntries={[props.location]} initialIndex={0}>
      <App {...props} />
    </MemoryRouter>
  );
}
