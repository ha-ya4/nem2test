import React, { useState } from 'react';
import { useResultState } from '../../../js/hooks';
import { ResultState } from '../../../js/helper';
import { handleResult } from './blockHelper';
import { getBlockByHeight } from '../../../nem/block';

import { Button, TextInput } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import Result from '../../Result';

const AccountInfo = (props) => {
  const [height, setHeight] = useState('');
  const rs = useResultState();

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
          rs.setResult(
            new ResultState(true, false, {}, '', '')
          );
          handleResult(getBlockByHeight(height, window.catapultNode), rs)
        }}
      >
        確認
      </Button>
      <Result result={rs} />
    </div>
  )
}

export default AccountInfo;