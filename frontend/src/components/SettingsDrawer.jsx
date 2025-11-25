import { useEffect, useMemo, useState } from 'react';
import './SettingsDrawer.css';

export default function SettingsDrawer({
  isOpen,
  onClose,
  settings,
  onSave,
  onReset,
  models,
  modelsSource,
  isLoading,
  isSaving,
  error,
  onReload,
}) {
  const [councilModels, setCouncilModels] = useState([]);
  const [chairmanModel, setChairmanModel] = useState('');

  // Precompute model options before any early returns to keep hooks order stable
  const modelOptions = useMemo(() => {
    const base = Array.isArray(models) ? [...models] : [];
    const existingIds = new Set(base.map((m) => m.id));
    const extras = [...(settings?.council_models || []), settings?.chairman_model || ''].filter(Boolean);
    extras.forEach((id) => {
      if (!existingIds.has(id)) {
        base.push({ id, label: id });
      }
    });
    return base.sort((a, b) => a.label.localeCompare(b.label));
  }, [models, settings]);

  useEffect(() => {
    if (isOpen) {
      setCouncilModels(settings?.council_models || []);
      setChairmanModel(settings?.chairman_model || '');
    }
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const hasModels = modelOptions.length > 0;

  const handleMemberChange = (index, value) => {
    setCouncilModels((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleAddMember = () => {
    setCouncilModels((prev) => [...prev, hasModels ? (modelOptions[0]?.id || '') : '']);
  };

  const handleRemoveMember = (index) => {
    setCouncilModels((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const normalizedCouncil = councilModels
      .map((m) => m.trim())
      .filter((m) => m.length > 0);
    const chairman = chairmanModel.trim() || normalizedCouncil[0] || settings?.chairman_model || '';
    onSave({
      council_models: normalizedCouncil,
      chairman_model: chairman,
    });
  };

  const renderCouncilInput = (value, index) => {
    if (hasModels) {
      return (
        <select
          value={value}
          onChange={(e) => handleMemberChange(index, e.target.value)}
        >
          <option value="">Select a model</option>
          {modelOptions.map((model) => (
            <option key={model.id} value={model.id}>
              {model.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={(e) => handleMemberChange(index, e.target.value)}
        placeholder="provider/model-name"
      />
    );
  };

  const chairmanSelect = hasModels ? (
    <select
      value={chairmanModel}
      onChange={(e) => setChairmanModel(e.target.value)}
    >
      <option value="">Select a model</option>
      {modelOptions.map((model) => (
        <option key={model.id} value={model.id}>
          {model.label}
        </option>
      ))}
    </select>
  ) : (
    <input
      type="text"
      value={chairmanModel}
      onChange={(e) => setChairmanModel(e.target.value)}
      placeholder="provider/model-name"
    />
  );

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
              Configure council members and the chairman model. Pick from the available
              OpenRouter catalog or enter IDs manually if none are loaded.
            </p>
          </div>
          <button className="close-btn" type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="settings-body" onSubmit={handleSave}>
          {error && <div className="settings-banner warning">{error}</div>}
          {modelsSource && (
            <div className="settings-banner info">
              Models source: {modelsSource}.
              {onReload && (
                <button
                  type="button"
                  className="ghost-btn inline"
                  onClick={onReload}
                  disabled={isLoading}
                >
                  Refresh
                </button>
              )}
            </div>
          )}
          {isLoading && (
            <div className="settings-banner info">Loading settings and models...</div>
          )}

          <section className="settings-section">
            <div className="section-title">
              <div>
                <h4>Council members</h4>
                <p className="section-help">
                  Models that will debate in Stage 1 and rank peers in Stage 2.
                </p>
              </div>
              <button
                type="button"
                className="ghost-btn"
                onClick={handleAddMember}
                disabled={isLoading}
              >
                + Add member
              </button>
            </div>

            <div className="model-list">
              {councilModels.map((model, index) => (
                <div className="model-row" key={index}>
                  {renderCouncilInput(model, index)}
                  <button
                    type="button"
                    className="ghost-btn danger"
                    onClick={() => handleRemoveMember(index)}
                    aria-label={`Remove council member ${index + 1}`}
                    disabled={isLoading}
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
            {chairmanSelect}
          </section>

          <div className="settings-actions">
            <button
              type="button"
              className="ghost-btn"
              onClick={onReset}
              disabled={isLoading || isSaving}
            >
              Reset to defaults
            </button>
            <div className="action-right">
              <button
                type="button"
                className="ghost-btn"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-btn"
                disabled={isSaving || isLoading}
              >
                {isSaving ? 'Saving...' : 'Save settings'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
