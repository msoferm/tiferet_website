import { useState, useEffect, useCallback } from 'react';
import { api } from './api.js';

// hook גנרי לטעינת נתונים מנקודת קצה
export function useFetch(path, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(() => {
    setLoading(true);
    api.get(path)
      .then((d) => { setData(d); setError(null); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => { reload(); /* eslint-disable-next-line */ }, deps);

  return { data, loading, error, reload, setData };
}
