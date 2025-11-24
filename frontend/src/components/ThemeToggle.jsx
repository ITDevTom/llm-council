import './ThemeToggle.css';

export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label="Toggle dark mode"
    >
      <span className="toggle-pill" data-active={isDark}>
        <span className="toggle-thumb" />
      </span>
      <span className="toggle-label">
        {isDark ? 'Dark mode' : 'Light mode'}
      </span>
    </button>
  );
}
