import {
  BlockHttp,
  ChainHttp
} from 'nem2-sdk';
import ResultState from '../../../js/resultstate';

export default class Block {
  constructor(setResult, node) {
    this.setResult = setResult;
    this.node = node;
  }

  getBlockByHeight(height) {
    new BlockHttp(this.node).getBlockByHeight(height).subscribe(
      block => {
        this.setResult(ResultState.success(block, 'ブロック情報'));
      },
      err => {
        this.setResult(ResultState.danger(err.message, 'エラー'));
      }
    )
  }

  getBlockchainHeight() {
    new ChainHttp(this.node).getBlockchainHeight().subscribe(
      res => {
        this.setResult(ResultState.success({height:res.toString()}, 'ブロック情報'));
      },
      err => {
        this.setResult(ResultState.danger(err.message, 'エラー'));
      }
    )
  }
}