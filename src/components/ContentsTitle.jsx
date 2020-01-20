import React from 'react';

import { Heading } from 'evergreen-ui';

const ContentsTitle = (props) => {
  const style = {
    marginBottom: 50
  };

  return (
    <div>
      <Heading size={900} is="h1" marginTop={50}>{props.title}</Heading>
      <hr style={style}/>
    </div>
  )
}

export default ContentsTitle;