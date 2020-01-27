import { ResultState } from '../../../js/helper';

export function handleNewMultisigResult(response, resultState) {
  if (response.error) {
    resultState.setResult(
      new ResultState(false, true, response.error.message, 'danger', 'エラー')
    )
    return;
  };

  const status = (res) => {
    resultState.setResult(new ResultState(false, true, res, 'danger', 'tansaction status error'));
  };

  const confirmed  = async (res) => {
    resultState.setResult(new ResultState(false, true, res, 'success', 'マルチシグアカウント作成'))
  };

  const error = (err) => {
    resultState.setResult(
      new ResultState(false, true, err.message, 'danger', 'エラー')
    )
  };

  response(status, confirmed, error)
}
