import './SettingsButton.css';

export default function SettingsButton({ onClick }) {
  return (
    <button
      type="button"
      className="settings-button"
      onClick={onClick}
      aria-label="Open settings"
    >
      <span className="settings-icon" aria-hidden="true">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M19.4 13.7c.1-.55.1-1.14 0-1.7l1.87-1.46c.18-.14.23-.39.12-.6l-1.77-3.06a.46.46 0 0 0-.57-.2l-2.2.89a7.08 7.08 0 0 0-1.46-.85l-.33-2.35a.47.47 0 0 0-.46-.39h-3.54a.47.47 0 0 0-.46.39l-.33 2.35a7.08 7.08 0 0 0-1.46.85l-2.2-.9a.46.46 0 0 0-.57.2L2.6 9.94c-.1.2-.06.45.12.6L4.6 12c-.1.56-.1 1.15 0 1.7l-1.88 1.46a.48.48 0 0 0-.12.6l1.77 3.06c.12.2.38.3.6.2l2.2-.89c.45.35.95.64 1.46.86l.33 2.35c.04.22.23.39.46.39h3.54c.23 0 .42-.17.46-.39l.33-2.35c.51-.22 1-.51 1.46-.86l2.2.9c.22.09.48 0 .6-.2l1.77-3.06a.48.48 0 0 0-.12-.6L19.4 13.7Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      </span>
      <span className="settings-label">Settings</span>
    </button>
  );
}
