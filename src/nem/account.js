import {
  AccountHttp,
  NetworkType,
  QueryParams,
} from 'nem2-sdk';

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