import React, { useState } from 'react';
import Block from './block';
import ResultState from '../../../js/resultstate';

import { Button, TextInput } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import Result from '../../Result';

const BlockInfo = (props) => {
  const [height, setHeight] = useState('');
  const [result, setResult] = useState(ResultState.init());

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'height':
        setHeight(e.target.value);
        break;

      default:
        return;
    }
  };

  return (
    <div>
      <ContentsTitle title="ブロック情報" />
      <TextInput placeholder="height" name="height" onChange={handleChange} />
      <Button
        appearance="primary"
        onClick={ () => {
          setResult(ResultState.loading());
          new Block(setResult, window.catapultNode).getBlockByHeight(height);
        }}
      >
        確認
      </Button>
      <Result result={result} />
    </div>
  )
}

export default BlockInfo;