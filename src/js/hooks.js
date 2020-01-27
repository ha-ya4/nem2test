import { useState } from 'react';
import { ResultState } from './helper';

export function useResultState() {
  const [result, setResult] = useState(ResultState.init());
  return {
    result: result,
    setResult: setResult
  };
}