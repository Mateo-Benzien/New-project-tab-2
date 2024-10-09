// scr/pages/_app.js
import { AuthProvider } from '../context/AuthContext';
import Head from 'next/head';
import '../styles/styles.css';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Your Name or Company" />
        <meta name="description" content="This is a default description for the entire site." />
        <meta name="keywords" content="your, default, keywords, here" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
