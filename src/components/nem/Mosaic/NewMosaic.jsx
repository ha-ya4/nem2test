import React, { useState } from 'react';
import { StateManager } from '../../../js/helper';
import ResultState from '../../../js/resultstate';

import { Button } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import FormManager from '../../FormManager';
import Result from '../../Result';

const MultisigTransaction = (props) => {
  const [result, setResult] = useState(ResultState.init());

  return (
    <div>
      <ContentsTitle title="モザイク作成" />

      <Button
        appearance="primary"
        marginTop={10}
        onClick={ () => {
          setResult(ResultState.loading());
        }}
      >
        作成
      </Button>

      <Result result={result} />
    </div>
  )
}

export default MultisigTransaction;