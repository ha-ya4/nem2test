import React, { useState } from 'react';
import Namespace from './namespace';
import ResultState from '../../../js/resultstate';

import { Button, TextInput } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import Result from '../../Result';

const NamespaceInfo = (props) => {
  const [name, setName] = useState('');
  const [result, setResult] = useState(ResultState.init());

  const handleChange = (e) => {
    switch (e.target.name) {
      case 'name':
        setName(e.target.value);
        break;

      default:
        return;
    }
  };

  return (
    <div>
      <ContentsTitle title="ネームスペース情報" />
      <TextInput placeholder="name"  name="name" onChange={handleChange} />
      <Button
        appearance="primary"
        onClick={ () => {
          setResult(ResultState.loading())
          new Namespace(setResult, window.catapultNode).getNamespaceInfo(name);
        }}
      >
        確認
      </Button>
      <Result result={result} />
    </div>
  )
}

export default NamespaceInfo;