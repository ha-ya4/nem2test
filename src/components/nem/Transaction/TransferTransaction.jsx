import React, { useState } from 'react';
import { StateManager, getPrivateKey } from '../../../js/helper';
import { TransactionParamsState, SendParams } from '../../../js/dataclass';
import ResultState from '../../../js/resultstate';
import Transfer from './js/transfer';

import { Button } from 'evergreen-ui';
import FormManager from '../../FormManager';
import ContentsTitle from '../../ContentsTitle';
import Result from '../../Result';

const TransferTransaction = () => {
  const [forms, setForms] = useState(new StateManager(1, TransactionParamsState.init()));
  const [result, setResult] = useState(ResultState.init());

  return (
    <div>
      <ContentsTitle title="TransferTransaction" />
      {
        Object.keys(forms.states).map(name => {
          return <FormManager  key={name} states={forms} state={forms.states[name]} set={setForms} num={name}/>
        })
      }

      <Button
        appearance="primary"
        marginTop={10}
        onClick={ () => {
          setResult(ResultState.loading());
          const params = new SendParams(forms.states[1].recipient, forms.states[1].amount, forms.states[1].message);
          new Transfer(setResult, window.catapultNode).send(params, getPrivateKey());
        }}
      >
        送金
      </Button>

      <Result result={result} />
    </div>
  )
}

export default TransferTransaction;