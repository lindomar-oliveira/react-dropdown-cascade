/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-array-index-key */

import React from 'react';

import styles from './Cascade.module.css';
import { classNames } from './helpers';

interface FieldNames {
  value: string;
  label: string;
  children: string;
}

interface Item {
  value?: string | number;
  label?: React.ReactText;
  disabled?: boolean;
  children?: Item[];
  [key: string]: any;
}

interface NormalizeItem extends Item {
  value: string;
  label: string;
  children?: NormalizeItem[];
}

interface Props {
  customInput?: React.ComponentType<any>;
  customInputProps?: { [key: string]: any }; // Generic Object;
  customStyles?: {
    dropdown?: {
      className?: string;
      style?: React.CSSProperties;
    }
    dropdownMenu?: {
      className?: string;
      style?: React.CSSProperties;
    };
    dropdownMenuItem?: {
      className?: string;
      style?: React.CSSProperties;
    };
    dropdownSubitem?: {
      className?: string;
      style?: React.CSSProperties;
    };
  };
  disabled?: boolean;
  expandTrigger?: 'click' | 'hover';
  fieldNames?: FieldNames;
  items: Item[];
  onSelect?: (value: string, selectedItems: Omit<Item, 'children'>[]) => void;
  separatorIcon?: string;
  value: string;
}

class Cascade extends React.Component<Props> {
  static defaultProps: Partial<Props> = {
    disabled: false,
    expandTrigger: 'click',
    fieldNames: {
      value: 'value',
      label: 'label',
      children: 'children'
    },
    items: [],
    separatorIcon: ' > '
  }

  dropdownRef = React.createRef<HTMLDivElement>();

  componentWillUnmount(): void {
    document.removeEventListener('click', this.onClickOutside);
  }

  getSelectedItems = (items: Item[], selectedValue: string): Omit<Item, 'children'>[] => {
    const { fieldNames } = this.props;

    let selectedItems: Item[] = [];
    const search = (itemsz: Item[], ref: Item[] = []) => {
      itemsz.forEach((item) => {
        const {
          children,
          label,
          value,
          ...restItem
        } = this.normalizeItem(item);
        if (value === selectedValue) {
          selectedItems = [...ref, {
            ...restItem,
            [fieldNames.value]: value,
            [fieldNames.label]: label
          }];
        } else if (Array.isArray(children) && children.length >= 1) {
          search(children, [...ref, {
            ...restItem,
            [fieldNames.value]: value,
            [fieldNames.label]: label
          }]);
        }
      });
    }
    search(items);
    return selectedItems;
  }

  getValue = (): string | undefined => {
    const {
      fieldNames,
      items,
      separatorIcon,
      value
    } = this.props;
    if (value) {
      const selectedItems = this.getSelectedItems(items, value);
      return selectedItems
        .map((item) => item[fieldNames.label])
        .join(separatorIcon);
    }
    return undefined;
  }

  handleClick = (): void => {
    document.getElementsByClassName(styles.dropdownMenu)[0].classList.add(styles.show);
    document.addEventListener('click', this.onClickOutside);
  }

  handleSelect = (item: Item): void => {
    const { fieldNames, items, onSelect } = this.props;
    if (!onSelect || item.disabled) return;
    const selectedItems = this.getSelectedItems(items, item[fieldNames.value]);
    onSelect(selectedItems.slice(-1)[0][fieldNames.value], selectedItems);
    this.hideDropdownMenu();
  }

  hideDropdownMenu = (): void => {
    document.getElementsByClassName(styles.dropdownMenu)[0].classList.remove(styles.show);
  }

  normalizeItem = (item: Item): NormalizeItem => {
    const { fieldNames } = this.props;
    const {
      value: valueKey,
      label: labelKey,
      children: childrenKey
    } = fieldNames;
    return {
      // eslint-disable-next-line prefer-object-spread
      ...Object.assign({}, item, {
        [valueKey]: undefined,
        [labelKey]: undefined,
        [childrenKey]: undefined,
        value: item[valueKey],
        label: item[labelKey],
        children: item[childrenKey]
      })
    }
  }

  onClickOutside = (e: MouseEvent): void => {
    if (!this.dropdownRef.current.contains(e.target as Node)) {
      this.hideDropdownMenu();
    }
  }

  renderItems = (items: Item[]): JSX.Element => {
    const {
      customStyles: {
        dropdownMenu: {
          className: dropdownMenuClassName,
          style: dropdownMenuStyle
        } = { className: undefined, style: undefined },
        dropdownMenuItem: {
          className: dropdownMenuItemClassName,
          style: dropdownMenuItemStyle
        } = { className: undefined, style: undefined },
        dropdownSubitem: {
          className: dropdownSubitemClassName,
          style: dropdownSubitemStyle
        } = { className: undefined, style: undefined }
      }
    } = this.props;

    return (
      <ul
        className={classNames({
          [styles.dropdownMenu]: true,
          [dropdownMenuClassName]: Boolean(dropdownMenuClassName)
        })}
        style={dropdownMenuStyle}
      >
        {
          items.map((item, index) => {
            const {
              children,
              disabled,
              label,
              value
            } = this.normalizeItem(item);

            if (Array.isArray(children) && children.length >= 1) {
              return (
                <li
                  className={classNames({
                    [styles.dropdownMenuItem]: true,
                    [styles.withSubitem]: true,
                    [dropdownSubitemClassName]: Boolean(dropdownSubitemClassName),
                    [styles.disabled]: disabled
                  })}
                  key={`${index}-${value}`}
                  style={dropdownSubitemStyle}
                >
                  {label}
                  {this.renderItems(children)}
                </li>
              )
            }

            return (
              <li
                aria-hidden
                className={classNames({
                  [styles.dropdownMenuItem]: true,
                  [dropdownMenuItemClassName]: Boolean(dropdownMenuItemClassName),
                  [styles.disabled]: disabled
                })}
                key={`${index}-${value}`}
                onClick={() => this.handleSelect(item)}
                style={dropdownMenuItemStyle}
              >{label}</li>
            );
          })
        }
      </ul>
    );
  }

  renderInput = (): JSX.Element => {
    const {
      customInput: CustomInput,
      customInputProps,
      disabled,
      expandTrigger
    } = this.props;

    const commonProps = {
      disabled,
      onClick: expandTrigger === 'click' ? this.handleClick : undefined,
      readOnly: true,
      value: this.getValue()
    };

    if (CustomInput) return (<CustomInput {...commonProps} {...customInputProps} />);
    return (<input {...commonProps} />);
  }

  render(): JSX.Element {
    const {
      customStyles: {
        dropdown: {
          className: dropdownClassName,
          style: dropdownStyle
        }
      },
      expandTrigger,
      items
    } = this.props;

    return (
      <div
        aria-hidden
        className={classNames({
          [styles.dropdown]: true,
          [dropdownClassName]: Boolean(dropdownClassName),
          [styles.dropdownOnHover]: expandTrigger === 'hover'
        })}
        ref={this.dropdownRef}
        style={dropdownStyle}
      >
        {this.renderInput()}
        {this.renderItems(items)}
      </div>
    );
  }
};

export default Cascade;
