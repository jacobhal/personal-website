import { useState, useEffect } from 'react';
import API from './APIServiceUser';

export function useAPI(method, ...params) {
    // ---- State
    const [data, setData]           = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError]         = useState(null);

    // ---- API
    const fetchData = async () => {
      setError(null);
      try {
        setIsLoading(true);
        setData(await API[method](...params));
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    // eslint-disable-next-line
    useEffect(() => { fetchData() }, []);

    return [ data, isLoading, error, fetchData ];
}