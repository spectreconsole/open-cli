import React, { useEffect, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import OpenCliExplorer from '@site/src/components/OpenCliExplorer';
import { EXAMPLES, descriptionPath } from '@site/src/data/examples';
import styles from './explorer.module.css';

// The chosen example or URL is kept in the query string so a view can be
// shared. A local file cannot be, so it is only held for the current visit.
function readParams() {
  const params = new URLSearchParams(window.location.search);
  return { example: params.get('example'), src: params.get('src') };
}

function writeParams(values) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(values)) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  // The explorer keeps its own selection in the query string too; it does
  // not survive a switch to another description.
  url.searchParams.delete('command');
  window.history.replaceState(null, '', url);
}

export default function Explorer() {
  const { withBaseUrl } = useBaseUrlUtils();
  const exampleSrc = (id) => withBaseUrl(descriptionPath(id));
  const [src, setSrc] = useState('');
  const [url, setUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const blobRef = useRef(null);

  const releaseBlob = () => {
    if (blobRef.current) URL.revokeObjectURL(blobRef.current);
    blobRef.current = null;
  };

  useEffect(() => {
    const params = readParams();
    if (params.src) {
      setUrl(params.src);
      setSrc(params.src);
    } else {
      const chosen = EXAMPLES.find((e) => e.id === params.example) ?? EXAMPLES[0];
      setSrc(exampleSrc(chosen.id));
    }
    return releaseBlob;
  }, []);

  const example = EXAMPLES.find((e) => exampleSrc(e.id) === src)?.id ?? '';

  const chooseExample = (id) => {
    releaseBlob();
    setFileName('');
    setSrc(exampleSrc(id));
    writeParams({ example: id, src: null });
  };

  const loadUrl = (event) => {
    event.preventDefault();
    const value = url.trim();
    if (!value) return;
    releaseBlob();
    setFileName('');
    setSrc(value);
    writeParams({ example: null, src: value });
  };

  const loadFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    releaseBlob();
    blobRef.current = URL.createObjectURL(file);
    setFileName(file.name);
    setSrc(blobRef.current);
    writeParams({ example: null, src: null });
  };

  return (
    <Layout
      title="Explorer"
      description="Browse an OpenCLI Description interactively."
    >
      <main className="container margin-vert--lg">
        <h1>Explorer</h1>
        <p>
          Browse an OpenCLI Description: pick one of the{' '}
          <Link to="/examples">examples</Link>, enter the URL of a description, or
          open a file from your computer. Files are read in your browser and
          never uploaded.
        </p>

        <div className={styles.toolbar}>
          <label className={styles.field}>
            <span>Example</span>
            <select
              className={styles.input}
              value={example}
              onChange={(e) => chooseExample(e.target.value)}
            >
              {!example && <option value="">—</option>}
              {EXAMPLES.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.label}
                </option>
              ))}
            </select>
          </label>

          <form className={`${styles.field} ${styles.grow}`} onSubmit={loadUrl}>
            <span>URL</span>
            <div className={styles.row}>
              <input
                className={`${styles.input} ${styles.grow}`}
                type="url"
                placeholder="https://example.com/opencli.json"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button type="submit" className="button button--primary">
                Load
              </button>
            </div>
          </form>

          <label className={styles.field}>
            <span>File</span>
            <span className={`button button--secondary ${styles.file}`}>
              {fileName || 'Open file…'}
              <input type="file" accept=".json,application/json" onChange={loadFile} />
            </span>
          </label>
        </div>

        {src && <OpenCliExplorer key={src} src={src} />}
      </main>
    </Layout>
  );
}
