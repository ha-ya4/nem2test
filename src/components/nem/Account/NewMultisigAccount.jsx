import React, { useState } from 'react';
import { getAccountInfo } from '../../../nem/account';
import { handleResult } from './accountHelper';
import { ResultState } from '../../../helper';
import { useResultState } from '../../../hooks';

import { Button, TextInput } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import Result from '../../Result';

const NewMultisigAccount = (props) => {
  const [address, setAddress] = useState('');
  const rs = useResultState();

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'address':
        setAddress(e.target.value);
        break;

      default:
        return;
    }
  };

  return (
    <div>
      <ContentsTitle title="マルチシグアカウント作成" />
      <TextInput placeholder="address"  name="address" onChange={handleChange} />
      <Button
        appearance="primary"
        onClick={ () => {
          rs.setResult(
            new ResultState(true, false, {}, '', '')
          );
          handleResult(getAccountInfo(address, window.catapultNode), rs, window.catapultNode)
        }}
      >
        確認
      </Button>
      <Result result={rs} />
    </div>
  )
}

export default NewMultisigAccount;