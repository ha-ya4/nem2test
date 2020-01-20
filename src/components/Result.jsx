import React from 'react';

import { Alert, Pane,  Spinner } from 'evergreen-ui';
import ObjMapList from './ObjMapList';

const Result = (props) => {
  const style = {
    marginTop: 50
  };

  const result = props.result.result;

  return (
    <div>
      <hr style={style}/>

      {   result.isSpinnerShown && (
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginTop={100}
        >
          <Spinner size={80}/>
        </Pane>
      )}

      {  result.isResultShown && (
        <Alert
          intent={ result.intent }
          title={result.title}
          marginTop={20}
        >
          {
            result.intent === 'danger'
            ? result.result
            : <ObjMapList obj={result.result} />
          }
        </Alert>
      )}
    </div>
  )
}

export default Result;