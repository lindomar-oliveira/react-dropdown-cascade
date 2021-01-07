/* eslint-disable react/no-array-index-key */

import React, {
  cloneElement,
  Component,
  createRef,
  CSSProperties,
  ReactElement,
  ReactNode
} from 'react';

import styles from './Cascade.module.css';
import { classNames } from './utils';

interface FieldNames {
  value: string;
  label: string;
  children: string;
}

interface Item {
  value?: string;
  label?: string;
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
  children: ReactElement;
  defaultValue?: string;
  disabled?: boolean;
  dropdownClassName?: string;
  dropdownStyle?: CSSProperties;
  dropdownMenuClassName?: string;
  dropdownMenuStyle?: CSSProperties;
  dropdownMenuItemClassName?: string;
  dropdownMenuItemStyle?: CSSProperties;
  dropdownSubItemClassName?: string;
  dropdownSubItemStyle?: CSSProperties;
  expandTrigger?: 'click' | 'hover';
  fieldNames?: FieldNames;
  items: Item[];
  onSelect?: (value: string, selectedItems: Omit<Item, 'children'>[]) => void;
  separatorIcon?: string;
}

interface State {
  selectedItems: Item[];
}

class Cascade extends Component<Props, State> {
  static defaultProps: Partial<Props> = {
    disabled: false,
    expandTrigger: 'click',
    fieldNames: {
      value: 'value',
      label: 'label',
      children: 'children'
    },
    separatorIcon: ' > '
  }

  dropdownRef = createRef<HTMLDivElement>();

  state: Readonly<State> = {
    selectedItems: []
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this.onClickOutside);
  }

  getLabel = (): string => {
    const {
      defaultValue,
      fieldNames,
      items,
      separatorIcon
    } = this.props;
    const { selectedItems } = this.state;
    if (selectedItems.length >= 1) {
      return selectedItems
        .map((item) => item[fieldNames.label])
        .join(separatorIcon);
    }
    if (!defaultValue) {
      return '';
    }
    return this.getSelectedItems(items, defaultValue)
      .map((item) => item[fieldNames.label])
      .join(separatorIcon);
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

  handleClick = (): void => {
    document.getElementsByClassName(styles.dropdownMenu)[0].classList.add(styles.show);
    document.addEventListener('click', this.onClickOutside);
  }

  handleSelect = (item: Item): void => {
    const { fieldNames, items, onSelect } = this.props;
    if (!onSelect || item.disabled) {
      return;
    }

    const selectedItems = this.getSelectedItems(items, item[fieldNames.value]);
    this.setState({ selectedItems }, () => onSelect(selectedItems.slice(-1)[0][fieldNames.value], selectedItems));
  }

  onClickOutside = (e: MouseEvent): void => {
    if(!this.dropdownRef.current.contains(e.target as Node)) {
      document.getElementsByClassName(styles.dropdownMenu)[0].classList.remove(styles.show);
    }
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

  renderItems = (items: Item[]): ReactNode => {
    const {
      dropdownMenuClassName,
      dropdownMenuStyle,
      dropdownMenuItemClassName,
      dropdownMenuItemStyle,
      dropdownSubItemClassName,
      dropdownSubItemStyle
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
                    [styles.withSubItem]: true,
                    [dropdownSubItemClassName]: Boolean(dropdownSubItemClassName),
                    [styles.disabled]: disabled
                  })}
                  key={`${index}-${value}`}
                  style={dropdownSubItemStyle}
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

  render(): JSX.Element {
    const {
      children,
      disabled,
      dropdownClassName,
      dropdownStyle,
      expandTrigger,
      items
    } = this.props;

    return (
      <div
        aria-hidden
        className={classNames({
          [styles.dropdown]: true,
          [styles.dropdownOnHover]: expandTrigger === 'hover',
          [dropdownClassName]: Boolean(dropdownClassName)
        })}
        ref={this.dropdownRef}
        style={dropdownStyle}
      >
        {cloneElement(children, {
          disabled,
          onClick: expandTrigger === 'click' ? this.handleClick : undefined,
          readOnly: true,
          value: this.getLabel()
        })}
        {this.renderItems(items)}
      </div>
    );
  }
};

export default Cascade;
