import {
  Account,
  Address,
  Deadline,
  NetworkType,
  MultisigAccountModificationTransaction,
  MultisigHttp,
  UInt64,
} from 'nem2-sdk';
import ResultState from '../../../../js/resultstate';
import { createAggregeteBonded, createHashLock, AggregeteBondedHelper, } from '../../../../js/nemhelper';

export default class MultisigAccount {
  constructor(setResult, node) {
    this.setResult = setResult;
    this.node = node;
    this.wsEndpoint = this.node.replace('http', 'ws');
  }

  create(conf) {
    try {
      const account = Account.createFromPrivateKey(conf.privateKey, NetworkType.TEST_NET);
      const cosignatory = conf.getCosignatoryAccount();
      const modifiTrans = MultisigAccountModificationTransaction.create(
        Deadline.create(),
        conf.minApprovalDelta,
        conf.minRemovalDelta,
        cosignatory.map(account => account.publicAccount),
        [],
        NetworkType.TEST_NET,
        UInt64.fromUint(2000000)
      );

      const bonded = createAggregeteBonded([modifiTrans.toAggregate(account.publicAccount)], []);
      const signedTx = account.sign(bonded, process.env.REACT_APP_GENERATION_HASH);
      const signedHashLock = account.sign(createHashLock(signedTx), process.env.REACT_APP_GENERATION_HASH);

      const bondedHelper = new AggregeteBondedHelper(this.setResult, this.node, signedTx, signedHashLock);
      bondedHelper.announceBonded(account, cosignatory, () => {
        this.getMultisigAccountInfo(account.address.plain());
      })

    } catch (err) {
      this.setResult(ResultState.danger(err.message, 'エラー'));
      return;
    }
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