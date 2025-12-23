import Head from 'next/head';
import FileUpload from '../components/FileUpload.js';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>JPG to WebP Converter</title>
        <meta name="description" content="Convert your images to WebP locally" />
      </Head>

      <main>
        <h1>JPG to WebP Converter</h1>
        <p>Uses your local server configuration.</p>
        <FileUpload />
      </main>
    </div>
  );
}