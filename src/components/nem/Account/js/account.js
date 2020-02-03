import {
  Account as NemAccount,
  AccountHttp,
  Address,
  MosaicHttp,
} from 'nem2-sdk';
import ResultState from '../../../../js/resultstate';
import { divisibility } from '../../../../js/nemhelper';

export default class Account {
  constructor(setResult, node) {
    this.setResult = setResult;
    this.node = node;
  }

  static createNewAccount()　{
    return NemAccount.generateNewAccount(process.env.REACT_APP_NETWORK_TYPE);
  }

  getAccountInfo(address) {
    let addr;
    try {
      addr = Address.createFromRawAddress(address);
    } catch (err) {
      this.setResult(ResultState.danger(err.message, 'エラー'));
      return;
    }

    new AccountHttp(this.node).getAccountInfo(addr).subscribe(
      async info => {
        info.mosaics = await this.addDivisibility(info.mosaics);
        this.setResult(ResultState.success(info, 'アカウント情報'));
      },
      err => {
        this.setResult(ResultState.danger(err.message, 'エラー'));
      }
    )
  }

  async addDivisibility(mosaics) {
    const m = {};
    const mosaicHttp = new MosaicHttp(this.node, process.env.REACT_APP_NETWORK_TYPE);
    for (const mosaic of mosaics) {
      const res = await mosaicHttp.getMosaic(mosaic.id).toPromise(Promise);
      m[mosaic.id.toHex()] = mosaic.amount.compact() / divisibility(res.divisibility);
    }
    return m;
  }
}