import React, { useState } from 'react';

import { Button } from 'evergreen-ui';
import ContentsTitle from '../../ContentsTitle';
import Result from '../../Result';

const MultisigTransaction = (props) => {
  return (
    <div>
      <ContentsTitle title="MultisigTransaction" />

      <Button
        appearance="primary"
        marginTop={10}
        onClick={ () => {}}
      >
        送金
      </Button>

      {/*<Result successTitle="confirmed"/>*/}
    </div>
  )
}

export default MultisigTransaction;