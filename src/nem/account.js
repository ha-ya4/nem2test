import {
  Account,
  AccountHttp,
  Address,
  CosignatureTransaction,
  Deadline,
  MultisigAccountModificationTransaction,
  MultisigHttp,
  NetworkType,
  TransactionHttp,
  UInt64,
  QueryParams,
} from 'nem2-sdk';
import { hashLock, aggregeteBonded } from './transactions';

/*
export function createMultisigAccount(conf, node) {
  let cosignatoryAccount;
  let cosignatory;
  try {
    cosignatoryAccount = Account.createFromPrivateKey(conf.multisigAccountPublicKey, NetworkType.TEST_NET);
    /*cosignatory = conf.privateKeysKeys.map(key => {
      return PublicAccount.createFromPublicKey(key, NetworkType.TEST_NET);
    })
  } catch (err) {
    console.log(err)
    return {
      error: err
    };
  }

  const modifiTrans = MultisigAccountModificationTransaction.create(
    Deadline.create(),
    1,//parseInt(conf.minApprovalDelta),
    0,//parseInt(conf.minRemovalDelta),
    [PublicAccount.createFromPublicKey('29FD7E3FF762363C0107330E21ECF6105D0860F7148C9CC19DCF9DA3162DF973', NetworkType.TEST_NET),
    PublicAccount.createFromPublicKey('67486F70C31C7AF41C94296E6FECF12C8B09386F5D84ED51688796961E57FFC2', NetworkType.TEST_NET)],
    [],
    NetworkType.TEST_NET,
    UInt64.fromUint(2000000)
  );
}*/

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

export function getMultisigAccountInfo(address, node) {
  const multisigHttp = new MultisigHttp(node);
  let addr;
  try {
    addr = Address.createFromRawAddress(address);
  } catch (err) {
    return {
      error: err
    }
  }

  return (success, error) => {
    multisigHttp.getMultisigAccountInfo(addr).subscribe(res => {
      success(res);
    },
    err => {
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