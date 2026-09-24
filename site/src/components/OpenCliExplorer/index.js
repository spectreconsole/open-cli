import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';

const TAG = 'opencli-explorer';
const SCRIPT_ID = 'opencli-explorer-script';
const SCRIPT_SRC = '/opencli-explorer.js';

// The explorer is authored in Vue and shipped as a custom element, so it is
// loaded on demand here rather than from the global `scripts` config. That
// keeps its bundle off every other page of the site.
function Element({ src, height }) {
  const scriptSrc = useBaseUrl(SCRIPT_SRC);
  const [ready, setReady] = useState(() => Boolean(customElements.get(TAG)));

  useEffect(() => {
    if (ready) return undefined;

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = scriptSrc;
      document.head.appendChild(script);
    }

    let cancelled = false;
    customElements.whenDefined(TAG).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [ready, scriptSrc]);

  if (!ready) {
    return <div style={{ minHeight: height, opacity: 0.6 }}>Loading explorer…</div>;
  }

  return React.createElement(TAG, { src });
}

export default function OpenCliExplorer({ src, height = 480 }) {
  return (
    <BrowserOnly fallback={<div style={{ minHeight: height }} />}>
      {() => <Element src={src} height={height} />}
    </BrowserOnly>
  );
}
