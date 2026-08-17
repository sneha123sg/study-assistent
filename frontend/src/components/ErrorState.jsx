import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorState({ message, onRetry }) {
  return (
    <section className="error-state">
      <div className="error-icon">
        <AlertTriangle size={25} />
      </div>

      <h3>We hit a small problem</h3>

      <p>{message}</p>

      <button onClick={onRetry}>
        <RotateCcw size={16} />
        Try again
      </button>
    </section>
  );
}
