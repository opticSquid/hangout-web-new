import "@fontsource/roboto-flex/400.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AccessTokenProvider } from "./lib/provider/access-token-provider.tsx";
import { ErrorBoundary } from "react-error-boundary";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Make the app full screen on iOS Safari */}
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-status-bar-style" content="default" />
    <meta name="mobile-web-app-title" content="HangOut" />
    {/* Theme color for Android Chrome */}
    <meta name="theme-color" content="#000000" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="touch-icon" href="/icons/icon-192x192.png" />
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <AccessTokenProvider>
        <App />
      </AccessTokenProvider>
    </ErrorBoundary>
  </StrictMode>
);
