import React from 'react';
import { NODE_LIST } from '../js/constant';

import { Select } from 'evergreen-ui';

const Node = (props) => {
  window.catapultNode = NODE_LIST[0];

  return (
    <div>
      <Select onChange={e => window.catapultNode = e.target.value} >
        {
          NODE_LIST.map((node, i) => {
            return <option key={i} value={node} >{node}</option>
          })
        }
      </Select>
    </div>
  )
}

export default Node;