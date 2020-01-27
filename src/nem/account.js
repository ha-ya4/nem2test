import {
  Account,
  AccountHttp,
  CosignatureTransaction,
  Deadline,
  MultisigAccountModificationTransaction,
  NetworkType,
  TransactionHttp,
  UInt64,
  QueryParams,
} from 'nem2-sdk';
import { aggregeteBonded } from './transactions';

export function createMultisigAccount(conf, node) {
  let account;
  let cosignatory;

  try {
    account = Account.createFromPrivateKey(conf.privateKey, NetworkType.TEST_NET);
    cosignatory = conf.getCosignatoryAccount();
  } catch (err) {
    return {
      error: err
    };
  }

  const modifiTrans = MultisigAccountModificationTransaction.create(
    Deadline.create(),
    parseInt(conf.minApprovalDelta),
    parseInt(conf.minRemovalDelta),
    [],
    cosignatory.map(account => account.publicAccount),
    NetworkType.TEST_NET,
    UInt64.fromUint(2000000)
  );

  const res = aggregeteBonded(node, [modifiTrans.toAggregate(account.publicAccount)], account);
  return (status, confirmed, error) => {
    res(e=>{
      console.log(e)
      //status(e)
    },
    tx => {
      const transHttp = new TransactionHttp(node, NetworkType.TEST_NET);
      const announce = cosignatory.map(acc => {
        const cosignatureTransaction = CosignatureTransaction.create(tx);
        const signedCosignature = acc.signCosignatureTransaction(cosignatureTransaction);
        return transHttp.announceAggregateBondedCosignature(signedCosignature).toPromise(Promise)
      });
      Promise.all(announce).then(values => {
        console.log(values)
        //confirmed(values);
      })
    },
    err => {
      console.log(err)
      error(err);
    })
  }
}

export function bondedInfo(node, address) {
  const accountHttp = new AccountHttp(node, NetworkType.TEST_NET);

  return (success, error) => {
    accountHttp.getAccountPartialTransactions(address, new QueryParams(100)).subscribe(res => {
      success(res);
    },
    err => {
      error(err);
    })
  }
}