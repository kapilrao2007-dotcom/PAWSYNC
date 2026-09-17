import { useEffect, useState, useCallback } from 'react';
import api, { getErrorMessage } from '../services/api';

/**
 * Small data-fetching hook with loading / error / empty states so every
 * section of the app can render a polished skeleton, error, or empty
 * state instead of a blank gap (spec section 40 - "Final Quality").
 */
export default function useFetch(url, { params, deps = [], enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    api
      .get(url, { params })
      .then(({ data }) => setData(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, enabled, ...deps]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
