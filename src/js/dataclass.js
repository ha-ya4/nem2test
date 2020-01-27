export class AccountConf {
  constructor(account) {
    this.address = account.address.address;
    this.publicKey = account.publicKey;
    this.privateKey = account.privateKey;
  }
}