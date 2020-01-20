import { divisibility } from '../../../nem/func';
import { mosaicInfo } from '../../../nem/mosaic';
import { ResultState } from '../../../helper';

export function handleResult(response, resultState, node) {
  if (response.error) {
    resultState.setResult(
      new ResultState(false, true, response.error.message, 'danger', 'エラー')
    )
    return;
  };

  const success = async (res) => {
    res.mosaics = await addDivisibility(res.mosaics, node)
    resultState.setResult(new ResultState(false, true, res, 'success', 'アカウント情報'))
  };

  const error = (err) => {
    resultState.setResult(
      new ResultState(false, true, err, 'danger', 'エラー')
    )
  };

  response(success, error)
}

async function addDivisibility(mosaics, node) {
  const m = {};
  for (const mosaic of mosaics) {
    const res = await mosaicInfo(mosaic.id, node).toPromise(Promise);
    m[mosaic.id.toHex()] = mosaic.amount.compact() / divisibility(res.divisibility);
  }
  return m;
}
