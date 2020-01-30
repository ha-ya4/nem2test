import React, { useState } from 'react';
import { StateManager, getPrivateKey } from '../../../js/helper';
import ResultState from '../../../js/resultstate';
import Namespace from './namespace';

import { Button } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import FormManager from '../../FormManager';
import Result from '../../Result';

const MultisigTransaction = (props) => {
  const [conf, setConf] = useState(new StateManager(1, {name: '', duration:0}))
  const [result, setResult] = useState(ResultState.init());


  return (
    <div>
      <ContentsTitle title="ネームスペース作成" />
      {
        Object.keys(conf.states).map(name => {
          return <FormManager  key={name} states={conf} state={conf.states[name]} set={setConf} num={name}/>
        })
      }

      <Button
        appearance="primary"
        marginTop={10}
        onClick={ () => {
          setResult(ResultState.loading());
          new Namespace(setResult, window.catapultNode).newNamespace(conf.states[1], getPrivateKey());
        }}
      >
        作成
      </Button>

      <Result result={result} />
    </div>
  )
}

export default MultisigTransaction;