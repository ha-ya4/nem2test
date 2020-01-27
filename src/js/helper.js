import { toaster } from 'evergreen-ui';
import {
  Account,
  NetworkType
} from 'nem2-sdk';

export class MultisigAccountConf {
  constructor(privateKey, privateKeys, minApprovalDelta, minRemovalDelta) {
    this.privateKey = privateKey;
    this.cosignatoryPrivateKeys = privateKeys;
    this.minApprovalDelta = minApprovalDelta;
    this.minRemovalDelta = minRemovalDelta;
  }

  setPrivateKeysToArray(obj) {
    this.cosignatoryPrivateKeys = Object.keys(obj).map(name => {
      return obj[name].privatekey;
    });
  }

  getCosignatoryAccount() {
    return this.cosignatoryPrivateKeys.map(key => {
      return Account.createFromPrivateKey(key, NetworkType.TEST_NET);
    })
  }
}

export class SendParams {
  constructor(recipientAddress, amount, message) {
    this.recipientAddress = recipientAddress;
    this.amount = amount;
    this.message = message;
  }
}

export class ResultState {
  constructor(isSpinnerShown, isResultShown, result, intent, ReultTitle) {
    this.isSpinnerShown = isSpinnerShown;
    this.isResultShown = isResultShown;
    this.result = result;
    this.intent = intent
    this.title = ReultTitle;
  }

  static init() {
    return new ResultState(false, false, {}, 'success', '')
  }
}

export class FormState {
  constructor(recipient, amount, message) {
    this.recipient = recipient;
    this.amount = amount;
    this.message = message;
  }

  static init() {
    return new FormState('', 0, '');
  }
}

// オブジェクトの表示やuseStateに対応できる書き換えなど管理するclass
export class StateManager {
  // 下のようなオブジェクトを作る
  // quantity=2
  // initobj=[{v:2}, {v:3}]
  /*
    this.states={
      1:{v:2},
      2:{v:3}
    }
  */
  constructor(quantity, ...initObj) {
    this.quantity = quantity;
    this.states = {};
    for (let i = 0; i < quantity; i++) {
      this.states[i+1] = initObj[i];
    }
  }

  set(num, name, value) {
    this.states[num][name] = value;
    return this;
  }

  // 引数のオブジェクトをナンバーを追加してthis.stateに加える
  // 元々あるオブジェクトを一度配列にツメて引数objをpushしStateManagerを作り直す
  add(obj) {
    this.quantity = this.quantity + 1;
    const state = Object.keys(this.states).map(name => {
      return this.states[name];
    });
    state.push(obj);
    return new StateManager(this.quantity, ...state);
  }
}

export function getPrivateKey() {
  const key = localStorage.getItem('privateKey');
  if (key) {
    return key;
  } else {
    toaster.warning('ローカルストレージに秘密鍵が保存されていません');
    return '';
  }
}