import React, { useState } from 'react';
import { StateManager, getPrivateKey } from '../../../js/helper';
import ResultState from '../../../js/resultstate';
import Namespace from './namespace';

import { Button, Text } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import FormManager from '../../FormManager';
import Result from '../../Result';

const NewNamespace = (props) => {
  const [namespace, setNamespace] = useState(new StateManager(1, {name: '', duration:0}));
  const [subNamespace, setSubNamespace] = useState(new StateManager(1, {rootNamespace: '', subNamespace:''}));
  const [result, setResult] = useState(ResultState.init());


  return (
    <div>
      <ContentsTitle title="ネームスペース作成" />

      <div>
        <Text>ルートネームスペース</Text>
        {
          Object.keys(namespace.states).map(name => {
            return <FormManager  key={name} states={namespace} state={namespace.states[name]} set={setNamespace} num={name}/>
          })
        }

        <Button
          appearance="primary"
          marginTop={10}
          onClick={ () => {
            setResult(ResultState.loading());
            new Namespace(setResult, window.catapultNode).newNamespace(namespace.states[1], getPrivateKey());
          }}
        >
          作成
        </Button>
      </div>

      <div style={{marginTop: '30px'}}>
        <Text>サブネームスペース</Text>
        {
          Object.keys(subNamespace.states).map(name => {
            return <FormManager  key={name} states={subNamespace} state={subNamespace.states[name]} set={setSubNamespace} num={name}/>
          })
        }

        <Button
          appearance="primary"
          marginTop={10}
          onClick={ () => {
            setResult(ResultState.loading());
            new Namespace(setResult, window.catapultNode).newSubNamespace(subNamespace.states[1], getPrivateKey());
          }}
        >
          作成
        </Button>
      </div>

      <Result result={result} />
    </div>
  )
}

export default NewNamespace;