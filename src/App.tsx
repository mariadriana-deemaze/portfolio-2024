import { JSX, useEffect, useState, type CSSProperties } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Work from './pages/Work';
import About from './pages/About';
import Blog from './pages/Blog';
import NotFound from './pages/NotFound';

type InitialData = { message?: string } | undefined;

export interface AppProps {
  initialData?: InitialData;
}

export default function App(props: AppProps = {}): JSX.Element {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      <header>
        <nav style={{  display: 'flex', gap: '1rem' }}>
          <a href="/">Home</a>
          <a href="/work">Work</a>
          <a href="/about">About</a>
          <a href="/blog">Blog</a>
        </nav>
      </header>

      <main >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/about" element={<About message={props.initialData?.message} />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        {isClient && (
          <img
            src="https://plus.unsplash.com/premium_photo-1746108793647-561bfeec0b2c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=700"
            alt="Placeholder image"
            width={800}
            height={1000}
            loading="lazy"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }}
          />
        )}
      </main>
    </div>
  );
}
