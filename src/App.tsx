import { JSX, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Work from './pages/Work';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';

type CommandLink = { url: string; title: string; type: 'internal' | 'blog' | 'projects' | 'social' }
type InitialData = { message?: string; commandLinks?: CommandLink[] } | undefined;

export interface AppProps {
  initialData?: InitialData;
}

export default function App(props: AppProps = {}): JSX.Element {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Layout commandLinks={props.initialData?.commandLinks}>
      <Routes>
        <Route path="/" element={<Home projects={(props.initialData as any)?.projects ?? []} />} />
        <Route path="/work" element={<Work />} />
        <Route path="/about" element={<About message={props.initialData?.message} />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
