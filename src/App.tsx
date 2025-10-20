import { Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Helmet>
                <title>Home | YourSite</title>
                <meta name="description" content="Welcome to YourSite." />
                <link rel="canonical" href="https://yoursite.com/" />
              </Helmet>
              <p>Home</p>
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Helmet>
                <title>About | YourSite</title>
                <meta name="description" content="About us." />
                <link rel="canonical" href="https://yoursite.com/about" />
              </Helmet>
              <p>about</p>
            </>
          }
        />
      </Routes>
    </>
  );
}
