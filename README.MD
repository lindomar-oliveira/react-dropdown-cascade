# react-dropdown-cascade

A [React](https://reactjs.org) component inpired by [rc-cascader](https://www.npmjs.com/package/rc-cascader) and without external dependencies.

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
import React from 'react';
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
  return (
    <>
      <h1 style={{ margin: 15 }}>react-dropdown-cascade</h1>
      <DropdownCascade
        dropdownStyle={{ margin: '5px 20px 15px 20px' }}
        items={items}
        onSelect={(value, selectedItems) => console.log(value, selectedItems)}
      >
        <input placeholder="Click here" style={{ height: 24, width: 300 }} />
      </DropdownCascade>
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

| Prop                      | Type                                            | Required | Default   | Description                                    |
|---------------------------|-------------------------------------------------|----------|-----------|------------------------------------------------|
| defaultValue              | string                                          | no       | undefined | Initial value                                   |
| dropdownClassName         | string                                          | no       | undefined | The additional className of dropdown           |
| dropdownStyle             | CSSProperties                                   | no       | undefined | The additional style of dropdown               |
| dropdownMenuClassName     | string                                          | no       | undefined | The additional className of dropdown menu      |
| dropdownMenuStyle         | CSSProperties                                   | no       | undefined | The additional style of dropdown menu          |
| dropdownMenuItemClassName | string                                          | no       | undefined | The additional className of dropdown menu item |
| dropdownMenuItemStyle     | CSSProperties                                   | no       | undefined | The additional style of dropdown menu item     |
| dropdownSubItemClassName  | string                                          | no       | undefined | The additional className of dropdown subitem   |
| dropdownSubItemStyle      | CSSProperties                                   | no       | undefined | The additional style of dropdown subitem       |
| expandTrigger             | "click" \| "hover"                              | no       | "click"   | Trigger that shows the dropdown                |
| items                     | Item[]                                          | **yes**  |           | The data for cascade                           |
| onSelect                  | (value: string, selectedItems: Item[]) => void; | no       | undefined | Callback when selecting an item                |

### Item

```ts
interface Item {
  value: string;
  label: string;
  disabled?: boolean;
  children?: Item[];
}
```

License
=======

[MIT](https://choosealicense.com/licenses/mit)
