import React, { useState } from 'react';
import { SendParams, ResultState, StateManager, FormState, getPrivateKey } from '../../../js/helper';
import { handleResult } from './transHelper';
import { useResultState } from '../../../js/hooks';
import { aggregateComplete } from '../../../nem/transactions';

import { Button } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import TransactionManager from '../../FormManager';
import Result from '../../Result';

const AggregateTransaction = (props) => {
  const [forms, setForms] = useState(new StateManager(2, FormState.init(), FormState.init()));
  const rs = useResultState();

  return (
    <div>
      <ContentsTitle title="AggregateTransaction" />

      {
        Object.keys(forms.states).map(name => {
          return <TransactionManager  key={name} states={forms} state={forms.states[name]} set={setForms} num={name}/>
        })
      }

      <Button
        appearance="primary"
        marginTop={10}
        marginRight={3}
        onClick={ () => setForms(forms.add(FormState.init()))}
      >
        フォーム追加
      </Button>

      <Button
        appearance="primary"
        marginTop={10}
        onClick={ () => {
          rs.setResult(
            new ResultState(true, false, {}, '', '')
          );

          const params = Object.keys(forms.states).map(name => {
            const f = forms.states[name];
            return new SendParams(f.recipient, f.amount, f.message)
          });

          handleResult(
            aggregateComplete(params, getPrivateKey(), window.catapultNode), rs, window.catapultNode
          );
        }}
      >
        送金
      </Button>

      <Result result={rs} />
    </div>
  )
}

export default AggregateTransaction;