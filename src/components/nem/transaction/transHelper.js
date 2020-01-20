import { ResultState } from '../../../helper';
import { addDivisibilityTransResponse } from '../../../nem/func';

export function handleResult(response, resultState, node) {
  // announceする前に出たエラーのハンドリング
  if (response.error) {
    resultState.setResult(
      new ResultState(false, true, response.error.message, 'danger', 'エラー')
    )
    return;
  }

  // announceのレスポンスのハンドリング
  response.res.subscribe(res => {
    resultState.setResult(new ResultState(true, true, res, 'none', 'announce response'))
  },
  err => {
    resultState.setResult(
      new ResultState(false, true, err.code, 'danger', 'エラー')
    )
    return;
  });

  // listenerのハンドリング
  handleListener(response.listener, resultState, node)
}

function handleListener(listener, resultState, node) {
  const unconfirmed = (res) => {
    console.log(res);
  };

  const confirmed = async (res) => {
    await addDivisibilityTransResponse(res, node);
    res.transactionInfo.heightCompact = res.transactionInfo.height.compact()
    resultState.setResult(new ResultState(false, true, res, 'success', 'confirmed'))
  };

  const error = (err) => {
    resultState.setResult(
      new ResultState(false, true, err, 'danger', 'エラー')
    )
  };

  listener(unconfirmed, confirmed, error);
}