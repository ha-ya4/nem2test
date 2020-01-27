import React from 'react';
import PropTypes from 'prop-types';

import { TextInput } from 'evergreen-ui';

const FormManager = (props) => {
  const handleChange = (e, name) => {
    props.set(props.states.set(props.num, name, e.target.value));
  };

  const style = {
    margin: '15px 0px',
  };

  return (
    <div style={style}>
      {
        Object.keys(props.state).map(name => {
          if (props.exclude.some(exclude => exclude === name)) { return null; }
          return (
            <React.Fragment key={name}>
              <TextInput  placeholder={name} name={name} onChange={(e) => handleChange(e, name)} /><br />
            </React.Fragment>
          )
        })
      }
    </div>
  )
}

FormManager.propTypes = {};
FormManager.defaultProps = {
  exclude: [],
};

export default FormManager;