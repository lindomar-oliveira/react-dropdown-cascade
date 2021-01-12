# react-dropdown-cascade

A [React](https://reactjs.org) component inpired by [rc-cascader](https://www.npmjs.com/package/rc-cascader), without external dependencies and styled like [material design](https://material.io/design).

Installation
============

```sh
npm install react-dropdown-cascade --save
```

or

```sh
yarn add react-dropdown-cascade
```

Usage
=======

```jsx
import React, { useState } from 'react';
import DropdownCascade from 'react-dropdown-cascade';

const items = [
  {
    value: '1',
    label: 'Menu 1',
    children: [
      {
        value: '11',
        label: 'Another Item'
      },
      {
        value: '12',
        label: 'More Items',
        children: [
          {
            value: '121',
            label: 'Sub Item A'
          },
          {
            value: '122',
            label: 'Sub Item B',
            disabled: true
          },
          {
            value: '123',
            label: 'Sub Item C'
          }
        ]
      }
    ]
  },
  {
    value: '2',
    label: 'Menu 2'
  },
  {
    value: '3',
    label: 'Menu 3',
    children: [
      {
        value: '31',
        label: 'Hello'
      },
      {
        value: '21',
        label: 'World'
      }
    ]
  }
];

export default function App() {
  const [dropdownValue, setDropdownValue] = useState();

  return (
    <>
      <h1 style={{ margin: 15 }}>react-dropdown-cascade</h1>
      <DropdownCascade
        customStyles={{
          dropdown: {
            style: {
              margin: '5px 20px 15px 20px'
            }
          }
        }}
        items={items}
        onSelect={(value, selectedItems) => {
          console.log(value, selectedItems);
          setDropdownValue(value);
        }}
        value={dropdownValue}
      />
    </>
  );
}
```

Screenshots
===========

![](image1.gif)

API
===

Props

| Prop                      | Type                | Required | Default                                                  | Description                                                              |
|---------------------------|---------------------|----------|----------------------------------------------------------|--------------------------------------------------------------------------|
| customInput               | Component Reference | no       | input                                                    | This allow supporting custom input                                       |
| customInputProps          | boolean             | no       | false                                                    | Additional props for custom input                                        |
| customStyles              | object              | no       | false                                                    | Custom styles                                                            |
| disabled                  | boolean             | no       | false                                                    | Pass disabled to input                                                   |
| expandTrigger             | string              | no       | 'click'                                                  | Trigger that shows the dropdown                                          |
| fieldNames                | object              | no       | { value: 'value', label: 'label', children: 'children' } | Custom field names for label and value and children                      |
| items                     | array               | **yes**  |                                                          | The cascade items                                                        |
| onSelect                  | function            | no       | undefined                                                | Callback with selected value and as 2nd param the items without children |
| separatorIcon             | string              | no       | ' > '                                                    | Custom the separator when path labels join until selection               |
| value                     | string              | no       | undefined                                                | The cascade value                                                        |

License
=======

[MIT](https://choosealicense.com/licenses/mit)
