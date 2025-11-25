"""Manage runtime settings for council models."""

import json
import os
from typing import Dict, List, Tuple

from .config import COUNCIL_MODELS, CHAIRMAN_MODEL

SETTINGS_PATH = os.path.join("data", "settings.json")

_settings_cache: Dict[str, List[str] | str] | None = None


def _ensure_data_dir():
  os.makedirs(os.path.dirname(SETTINGS_PATH), exist_ok=True)


def load_settings() -> Dict[str, List[str] | str]:
  """Load settings from disk or fall back to defaults."""
  global _settings_cache
  if _settings_cache is not None:
    return _settings_cache

  defaults = {
      "council_models": COUNCIL_MODELS,
      "chairman_model": CHAIRMAN_MODEL,
  }

  if not os.path.exists(SETTINGS_PATH):
    _settings_cache = defaults
    return defaults

  try:
    with open(SETTINGS_PATH, "r", encoding="utf-8") as f:
      data = json.load(f)
      council_models = data.get("council_models", COUNCIL_MODELS)
      chairman_model = data.get("chairman_model", CHAIRMAN_MODEL)
      _settings_cache = {
          "council_models": council_models,
          "chairman_model": chairman_model,
      }
      return _settings_cache
  except Exception:
    # If parsing fails, fall back to defaults
    _settings_cache = defaults
    return defaults


def save_settings(council_models: List[str], chairman_model: str) -> Dict[str, List[str] | str]:
  """Persist settings to disk and cache."""
  global _settings_cache
  _ensure_data_dir()
  settings = {
      "council_models": council_models,
      "chairman_model": chairman_model,
  }
  with open(SETTINGS_PATH, "w", encoding="utf-8") as f:
    json.dump(settings, f, indent=2)
  _settings_cache = settings
  return settings


def get_settings() -> Dict[str, List[str] | str]:
  """Get the current settings, loading from disk if necessary."""
  return load_settings()


def reset_cache():
  """Reset in-memory cache (useful for tests)."""
  global _settings_cache
  _settings_cache = None
