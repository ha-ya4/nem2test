import React, { useState } from 'react';
import Aggregate from './js/aggregete';
import { StateManager, getPrivateKey } from '../../../js/helper';
import { TransactionParamsState as TransPramState, SendParams } from '../../../js/dataclass';
import ResultState from '../../../js/resultstate';

import { Button } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import FormManager from '../../FormManager';
import Result from '../../Result';

const AggregateTransaction = (props) => {
  const [forms, setForms] = useState(new StateManager(2, TransPramState.init(), TransPramState.init()));
  const [result, setResult] = useState(ResultState.init());

  return (
    <div>
      <ContentsTitle title="AggregateTransaction" />

      {
        Object.keys(forms.states).map(name => {
          return <FormManager  key={name} states={forms} state={forms.states[name]} set={setForms} num={name}/>
        })
      }

      <Button
        appearance="primary"
        marginTop={10}
        marginRight={3}
        onClick={ () => setForms(forms.add(TransPramState.init()))}
      >
        フォーム追加
      </Button>

      <Button
        appearance="primary"
        marginTop={10}
        onClick={ () => {
          setResult(ResultState.loading());

          const privateKey = getPrivateKey();
          const params = Object.keys(forms.states).map(name => {
            const f = forms.states[name];
            return new SendParams(f.recipient, f.amount, f.message)
          });
          new Aggregate(setResult, window.catapultNode).sendComplete(params, privateKey);
        }}
      >
        送金
      </Button>

      <Result result={result} />
    </div>
  )
}

export default AggregateTransaction;