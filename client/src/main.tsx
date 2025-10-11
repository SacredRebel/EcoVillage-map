import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Error boundary for debugging
const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setError(event.error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-destructive mb-4">Application Error</h2>
          <p className="text-muted-foreground mb-4">
            There was a problem starting the EcoVillage application.
          </p>
          <pre className="text-sm bg-muted p-4 rounded-lg text-left overflow-auto">
            {error?.message || 'Unknown error occurred'}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Initialize app
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error('Root element not found! Make sure index.html has <div id="root"></div>');
} else {
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log('✅ EcoVillage application mounted successfully');
  } catch (error) {
    console.error('❌ Failed to mount application:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: system-ui;">
        <h2 style="color: #dc2626;">Failed to Start Application</h2>
        <p>There was a problem initializing the EcoVillage interactive map.</p>
        <pre style="background: #f3f4f6; padding: 10px; border-radius: 4px; text-align: left; overflow: auto;">
${error instanceof Error ? error.message : String(error)}</pre>
        <button onclick="window.location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
}
