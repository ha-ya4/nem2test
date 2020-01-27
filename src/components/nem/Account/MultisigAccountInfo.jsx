import React, { useState } from 'react';
import MultisigAccount from './js/multisig-account';
import ResultState from '../../../js/resultstate';

import { Button, TextInput } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import Result from '../../Result2';

const MultisigAccountInfo = (props) => {
  const [address, setAddress] = useState('');
  const [result, setResult] = useState(ResultState.init());

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
      <ContentsTitle title="マルチシグアカウント情報" />
      <TextInput placeholder="address"  name="address" onChange={handleChange} />
      <Button
        appearance="primary"
        onClick={ () => {
          setResult(ResultState.loading())
          new MultisigAccount(setResult, window.catapultNode).getMultisigAccountInfo(address);
        }}
      >
        確認
      </Button>
      <Result result={result} />
    </div>
  )
}

export default MultisigAccountInfo;