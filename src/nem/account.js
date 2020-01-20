import {
  Account,
  AccountHttp,
  Address,
  AggregateTransaction,
  Deadline,
  MultisigAccountModificationTransaction,
  MultisigHttp,
  NetworkType,
  PublicAccount,
  TransactionService,
  UInt64,
  Listener,
} from 'nem2-sdk';
import { hashLock } from './transactions';

export function createNewAccount()　{
  return Account.generateNewAccount(NetworkType.TEST_NET);
}

export function createMultisigAccount(conf, node) {
  let account;
  let cosignatory;
  try {
    account = Account.createFromPrivateKey(conf.privateKey, NetworkType.TEST_NET);
    cosignatory = conf.publicKeys.map(key => {
      return PublicAccount.createFromPublicKey(key, NetworkType.TEST_NET);
    })
  } catch (err) {
    return {
      error: err
    };
  }

  const modifiTrans = MultisigAccountModificationTransaction.create(
    Deadline.create(),
    conf.minApprovalDelta,
    conf.minRemovalDelta,
    cosignatory,
    [],
    NetworkType.TEST_NET,
  );

  const bonded = AggregateTransaction.createBonded(
    Deadline.create(),
    [modifiTrans.toAggregate(account.PublicAccount)],
    NetworkType.TEST_NET,
    [],
    UInt64.fromUint(2000000)
  );

  const signedTx = account.sign(bonded, process.env.REACT_APP_GENERATION_HASH);
  const signedHashLock = hashLock(account);
  const listener = new Listener(node);
  const transactionService = new TransactionService(node);

  listener.open.then(() => {
    transactionService.announceHashLockAggregateBonded(signedHashLock, signedTx, listener);
  });
}

export function getAccountInfo(address, node) {
  const accountHttp = new AccountHttp(node);
  let addr;
  try {
    addr = Address.createFromRawAddress(address);
  } catch (err) {
    return {
      error: err
    }
  }

  return (success, error) => {
    accountHttp.getAccountInfo(addr).subscribe(res => {
      success(res);
    },
    err => {
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