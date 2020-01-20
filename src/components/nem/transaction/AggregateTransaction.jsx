import React, { useState } from 'react';
import { SendParams, ResultState, FormStateManager, getPrivateKey } from '../../../helper';
import { handleResult } from './transHelper';
import { useResultState } from '../../../hooks';
import { aggregateComplete } from '../../../nem/transactions';

import { Button } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import TransactionForm from '../../TransactionForm';
import Result from '../../Result';

const AggregateTransaction = (props) => {
  const [forms, setForms] = useState(new FormStateManager(2));
  const rs = useResultState();

  return (
    <div>
      <ContentsTitle title="AggregateTransaction" />

      {
        Object.keys(forms.forms).map(name => {
          return <TransactionForm key={name} forms={forms} setForms={setForms} formNum={name}/>
        })
      }

      <Button
        appearance="primary"
        marginTop={10}
        marginRight={3}
        onClick={ () => setForms(forms.add())}
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

          const params = Object.keys(forms.forms).map(name => {
            const f = forms.forms[name];
            return new SendParams(f.recipient, f.amount, f.message)
          })
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