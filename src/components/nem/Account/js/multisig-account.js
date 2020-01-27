import {
  //Account,
  Address,
  //NetworkType,
  //MultisigAccountModificationTransaction,
  MultisigHttp,
} from 'nem2-sdk';
import ResultState from '../../../../js/resultstate';

export default class MultisigAccount {
  constructor(setResult, node) {
    this.setResult = setResult;
    this.node = node;
  }

  getMultisigAccountInfo(address) {
    let addr;
    try {
      addr = Address.createFromRawAddress(address);
    } catch (err) {
      this.setResult(ResultState.danger(err.message, 'エラー'));
      return;
    }

    new MultisigHttp(this.node).getMultisigAccountInfo(addr).subscribe(
      info => {
        this.setResult(ResultState.success(info, 'マルチシグアカウント情報'));
      },
      err => {
        this.setResult(ResultState.danger(err.message, 'エラー'));
      }
    )
  }
}