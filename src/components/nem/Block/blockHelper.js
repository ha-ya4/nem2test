import { ResultState } from '../../../helper';

export function handleResult(response, resultState) {
  const success = (res) => {
    resultState.setResult(new ResultState(false, true, res, 'success', 'ブロック情報'))
  };

  const error = (err) => {
    resultState.setResult(
      new ResultState(false, true, '', 'danger', 'エラー')
    )
  };

  response(success, error)
}