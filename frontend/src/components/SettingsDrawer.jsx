import { useEffect, useState } from 'react';
import './SettingsDrawer.css';

export default function SettingsDrawer({
  isOpen,
  onClose,
  settings,
  onSave,
  onReset,
}) {
  const [councilModels, setCouncilModels] = useState(settings.councilModels);
  const [chairmanModel, setChairmanModel] = useState(settings.chairmanModel);

  useEffect(() => {
    setCouncilModels(settings.councilModels);
    setChairmanModel(settings.chairmanModel);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleMemberChange = (index, value) => {
    setCouncilModels((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleAddMember = () => {
    setCouncilModels((prev) => [...prev, '']);
  };

  const handleRemoveMember = (index) => {
    setCouncilModels((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const normalizedCouncil = councilModels
      .map((m) => m.trim())
      .filter((m) => m.length > 0);
    const chairman = chairmanModel.trim() || settings.chairmanModel;
    onSave({
      councilModels: normalizedCouncil,
      chairmanModel: chairman,
    });
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div
        className="settings-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <div className="settings-header">
          <div>
            <h3>Settings</h3>
            <p className="settings-subtitle">
              Configure council members and the chairman model.
              <br />
              <strong>Note:</strong> Backend still uses values from
              <code className="inline-code"> backend/config.py</code>.
            </p>
          </div>
          <button className="close-btn" type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="settings-body" onSubmit={handleSave}>
          <section className="settings-section">
            <div className="section-title">
              <div>
                <h4>Council members</h4>
                <p className="section-help">
                  List of OpenRouter model identifiers. These are the models that will
                  debate in Stage 1 and rank in Stage 2.
                </p>
              </div>
              <button
                type="button"
                className="ghost-btn"
                onClick={handleAddMember}
              >
                + Add member
              </button>
            </div>

            <div className="model-list">
              {councilModels.map((model, index) => (
                <div className="model-row" key={index}>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) =>
                      handleMemberChange(index, e.target.value)
                    }
                    placeholder="provider/model-name"
                  />
                  <button
                    type="button"
                    className="ghost-btn danger"
                    onClick={() => handleRemoveMember(index)}
                    aria-label={`Remove council member ${index + 1}`}
                  >
                    Remove
                  </button>
                </div>
              ))}
              {councilModels.length === 0 && (
                <div className="empty-rows">
                  No council members. Add at least one model to proceed.
                </div>
              )}
            </div>
          </section>

          <section className="settings-section">
            <h4>Chairman model</h4>
            <p className="section-help">
              The chairman synthesizes the final Stage 3 answer.
            </p>
            <input
              type="text"
              value={chairmanModel}
              onChange={(e) => setChairmanModel(e.target.value)}
              placeholder="provider/model-name"
            />
          </section>

          <section className="settings-section">
            <h4>Upcoming</h4>
            <p className="section-help">
              Next iteration: fetch available models from OpenRouter and persist
              settings server-side so the backend uses your choices.
            </p>
          </section>

          <div className="settings-actions">
            <button type="button" className="ghost-btn" onClick={onReset}>
              Reset to defaults
            </button>
            <div className="action-right">
              <button type="button" className="ghost-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="primary-btn">
                Save settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
