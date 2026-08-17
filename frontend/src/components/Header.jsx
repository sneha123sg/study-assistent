import { Brain, Sparkles } from "lucide-react";

export default function Header({ onLogoClick }) {
  return (
    <header className="topbar">
      <button className="brand" onClick={onLogoClick}>
        <div className="brand-icon">
          <Brain size={21} />
        </div>

        <div>
          <span className="brand-name">StudyFlow</span>
          <span className="brand-tagline">AI-powered active learning</span>
        </div>
      </button>

      <div className="ai-badge">
        <Sparkles size={15} />
        <span>AI Study Engine</span>
      </div>
    </header>
  );
}
