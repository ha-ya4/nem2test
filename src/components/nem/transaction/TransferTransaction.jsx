import React, { useState } from 'react';
import { StateManager, getPrivateKey } from '../../../js/helper';
import { FormState, SendParams } from '../../../js/dataclass';
import ResultState from '../../../js/resultstate';
import Transfer from './js/transfer';

import { Button } from 'evergreen-ui';
import FormManager from '../../FormManager';
import ContentsTitle from '../../ContentsTitle';
import Result from '../../Result';

const TransferTransaction = () => {
  const [forms, setForms] = useState(new StateManager(1, FormState.init()));
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
          const f = forms.states
          const params = new SendParams(f[1].recipient, f[1].amount, f[1].message)
          const privateKey = getPrivateKey();
          new Transfer(setResult, window.catapultNode).send(params, privateKey);
        }}
      >
        送金
      </Button>

      <Result result={result} />
    </div>
  )
}

export default TransferTransaction;




