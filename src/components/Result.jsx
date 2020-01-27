import React from 'react';

import { Alert, Pane,  Spinner } from 'evergreen-ui';
import ObjMapList from './ObjMapList';

const Result = (props) => {
  const style = {
    marginTop: 50
  };

  return (
    <div>
      <hr style={style}/>

      { props.result.isSpinnerShown && (
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          marginTop={100}
        >
          <Spinner size={80}/>
        </Pane>
      )}

      { props.result.isResultShown && (
        <Alert
          intent={ props.result.intent }
          title={props.result.title}
          marginTop={20}
        >
          {
            props.result.intent === 'danger'
            ? props.result.result
            : <ObjMapList obj={props.result.result} />
          }
        </Alert>
      )}
    </div>
  )
}

export default Result;