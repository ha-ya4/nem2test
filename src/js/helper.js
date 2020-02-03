import { toaster } from 'evergreen-ui';
import {
  Account,
} from 'nem2-sdk';
import { SendParams } from './dataclass';

export class MultisigAccountConf {
  constructor(privateKey, privateKeys, minApprovalDelta, minRemovalDelta) {
    this.privateKey = privateKey;
    this.cosignatoryPrivateKeys = privateKeys;
    this.minApprovalDelta = parseInt(minApprovalDelta);
    this.minRemovalDelta = parseInt(minRemovalDelta);
  }

  setPrivateKeysToArray(obj) {
    this.cosignatoryPrivateKeys = Object.keys(obj).map(name => {
      return obj[name].privatekey;
    });
  }

  getCosignatoryAccount() {
    return this.cosignatoryPrivateKeys.map(key => {
      return Account.createFromPrivateKey(key, process.env.REACT_APP_NETWORK_TYPE);
    })
  }
}

export class MultisigSendParams {
  constructor(recipientAddress, amount, message, multisigPubKey, privateKeys) {
    this.params = new SendParams(recipientAddress, amount, message)
    this.multisigPubKey = multisigPubKey;
    this.cosignatoryPrivateKeys = privateKeys;
  }

  setPrivateKeysToArray(obj) {
    this.cosignatoryPrivateKeys = Object.keys(obj).map(name => {
      return obj[name].privatekey;
    });
  }

  getCosignatoryAccount() {
    return this.cosignatoryPrivateKeys.map(key => {
      return Account.createFromPrivateKey(key, process.env.REACT_APP_NETWORK_TYPE);
    })
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
    const state = Object.keys(this.states).map(name => {
      return this.states[name];
    });
    return new StateManager(this.quantity, ...state);
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
