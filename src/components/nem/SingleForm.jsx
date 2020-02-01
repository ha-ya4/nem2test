import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ResultState from '../../js/resultstate';

import { Button, TextInput } from 'evergreen-ui';
import ContentsTitle from '../ContentsTitle';
import Result from '../Result';

const SingleForm = (props) => {
  const [value, setValue] = useState('');
  const [result, setResult] = useState(ResultState.init());

  const handleChange = e => {
    switch (e.target.name) {
      case props.name:
        setValue(e.target.value);
        break;

      default:
        return;
    }
  };

  return (
    <div>
      <ContentsTitle title={props.title} />
      <TextInput placeholder={props.placeholder}  name={props.name} onChange={handleChange} />
      <Button
        appearance="primary"
        onClick={ () => {
          setResult(ResultState.loading())
          props.click(setResult, window.catapultNode, value)
        }}
      >
        確認
      </Button>
      <Result result={result} />
    </div>
  )
}

SingleForm.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  click: PropTypes.func,
}

export default SingleForm;