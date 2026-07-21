/**
 * ErrorBanner — dismissible red banner. Extracted from ProvidersPage inline markup.
 * Consumers: all pages. Renders null when `message` is falsy.
 */
export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-xs text-red-600">
      <i className="fa-solid fa-circle-exclamation" />
      {message}
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Dismiss error" className="ml-auto">
          <i className="fa-solid fa-xmark" />
        </button>
      )}
    </div>
  );
}
