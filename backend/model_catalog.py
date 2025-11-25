"""Model catalog utilities for OpenRouter models."""

import json
import os
import time
from typing import Any, Dict, List, Literal, Optional, Tuple

import httpx

from .config import OPENROUTER_API_KEY

SNAPSHOT_PATH = os.path.join("data", "availablemodels", "openrouter.json")
OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models"

_cache: Dict[str, Any] | None = None
_cache_expiry: float = 0
_CACHE_TTL_SECONDS = 600  # 10 minutes


def _transform_model(record: Dict[str, Any]) -> Dict[str, Any]:
  """Normalize a model record for UI consumption."""
  model_id = record.get("id")
  label = record.get("label") or record.get("name") or model_id
  top_provider = record.get("top_provider", {}) or {}
  pricing = record.get("pricing", {}) or {}
  return {
      "id": model_id,
      "label": label,
      "context_length": top_provider.get("context_length"),
      "max_completion_tokens": top_provider.get("max_completion_tokens"),
      "is_moderated": top_provider.get("is_moderated"),
      "pricing": {
          "prompt": pricing.get("prompt"),
          "completion": pricing.get("completion"),
      },
  }


def _load_snapshot() -> Optional[List[Dict[str, Any]]]:
  """Load the local snapshot file if present."""
  if not os.path.exists(SNAPSHOT_PATH):
    return None
  try:
    with open(SNAPSHOT_PATH, "r", encoding="utf-8") as f:
      payload = json.load(f)
    data = payload.get("data") or []
    return [_transform_model(item) for item in data if item.get("id")]
  except Exception:
    return None


async def _fetch_live_models(timeout: float = 3.0) -> Optional[List[Dict[str, Any]]]:
  """Fetch live models from OpenRouter."""
  if not OPENROUTER_API_KEY:
    return None

  headers = {
      "Authorization": f"Bearer {OPENROUTER_API_KEY}",
  }
  try:
    async with httpx.AsyncClient(timeout=timeout) as client:
      resp = await client.get(OPENROUTER_MODELS_URL, headers=headers)
      resp.raise_for_status()
      payload = resp.json()
      data = payload.get("data") or []
      return [_transform_model(item) for item in data if item.get("id")]
  except Exception as e:
    print(f"Warning: failed to fetch OpenRouter models: {e}")
    return None


async def get_models(
    force_refresh: bool = False,
) -> Tuple[List[Dict[str, Any]], Literal["live", "cache", "fallback"]]:
  """
  Retrieve available models, preferring live data, then cache, then local snapshot.

  Returns (models, source) where source is "live", "cache", or "fallback".
  """
  global _cache, _cache_expiry
  now = time.time()

  if _cache and _cache_expiry > now and not force_refresh:
    return _cache, "cache"

  models = await _fetch_live_models()
  source: Literal["live", "cache", "fallback"]

  if models:
    _cache = models
    _cache_expiry = now + _CACHE_TTL_SECONDS
    source = "live"
    # Persist live data to snapshot for offline use
    try:
      os.makedirs(os.path.dirname(SNAPSHOT_PATH), exist_ok=True)
      with open(SNAPSHOT_PATH, "w", encoding="utf-8") as f:
        json.dump({"data": models}, f, indent=2)
    except Exception:
      pass
    return models, source

  # If no live data, try cache (if present but expired)
  if _cache:
    source = "cache"
    return _cache, source

  snapshot = _load_snapshot() or []
  source = "fallback"
  _cache = snapshot
  _cache_expiry = now + _CACHE_TTL_SECONDS
  return snapshot, source
