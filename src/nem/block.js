import { BlockHttp } from 'nem2-sdk';

export function getBlockByHeight(height, node) {
  const blockHttp = new BlockHttp(node);
  return (success, error) => {
    blockHttp.getBlockByHeight(height).subscribe(res => {
      success(res);
    },
    err => {
      error(err);
    })
  }
}