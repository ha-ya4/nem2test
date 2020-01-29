import {
  Account,
  Address,
  CosignatureTransaction,
  Deadline,
  NetworkType,
  MultisigAccountModificationTransaction,
  MultisigHttp,
  Listener,
  TransactionHttp,
  TransactionService,
  ReceiptHttp,
  UInt64,
} from 'nem2-sdk';
import { merge } from "rxjs/operators";
import ResultState from '../../../../js/resultstate';
import { createAggregeteBonded, createHashLock } from '../../../../js/nemhelper';

export default class MultisigAccount {
  constructor(setResult, node) {
    this.setResult = setResult;
    this.node = node;
    this.wsEndpoint = this.node.replace('http', 'ws');
  }

  announceBondedCosignature(transHttp, cosignatory, agrregateTx, address) {
    const announce = cosignatory.map(account => {
      const cosignatureTransaction = CosignatureTransaction.create(agrregateTx);
      const signedCosignature = account.signCosignatureTransaction(cosignatureTransaction);
      return transHttp.announceAggregateBondedCosignature(signedCosignature);
    });

    announce[0].pipe(merge(...announce.slice(1))).subscribe(
      res => {
        this.setResult(ResultState.none(res, 'cosignature response'));
      },
      err => {
        this.setResult(ResultState.danger(err.message, 'エラー'));
      },
      () => {
        setTimeout(() => {
          this.getMultisigAccountInfo(address);
        }, 30000);
      }
    );
  }

  create(conf) {
    const receiptHttp = new ReceiptHttp(this.node, NetworkType.TEST_NET);
    const transHttp = new TransactionHttp(this.node, NetworkType.TEST_NET);
    const transactionService = new TransactionService(transHttp, receiptHttp);
    const listener = new Listener(this.wsEndpoint, WebSocket);

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

      listener.open().then(() => {
        listener.status(account.address).subscribe(err => {
          this.setResult(ResultState.danger(err.code, 'tansaction status error'));
          listener.close();
        });

        transactionService.announceHashLockAggregateBonded(signedHashLock, signedTx, listener).subscribe(
          tx => {
            this.setResult(ResultState.none(tx, 'aggregate bonded response'));
            this.announceBondedCosignature(transHttp, cosignatory, tx, account.address.plain())
            listener.close();
          },
          err => {
            this.setResult(ResultState.danger(err.message, 'エラー'));
            listener.close();
          }
        )
      });

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