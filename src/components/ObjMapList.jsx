import React from 'react';

import { Text } from 'evergreen-ui';

// 受け取ったオブジェクトをリスト表示する
// ネストされている場合このコンポーネントを繰り返す
const ObjMapList = (props) => {
  return (
    <ul>
      {
        Object.keys(props.obj).map((name, i) => {
          return (
            <li key={i}>
              {
                typeof props.obj[name] === 'object'
                ? (
                  <Text marginTop="default" size={props.size}>
                    {name}:&ensp; {'{'}
                    <ObjMapList obj={props.obj[name]} />
                    {'}'}
                  </Text>
                )
                : (
                  <Text marginTop="default" size={props.size}>
                    {name}:&ensp;{props.obj[name]}
                  </Text>
                )
              }
            </li>
          )
        })
      }
    </ul>
  )
}

export default ObjMapList;