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
import { classNames, getSelectedItems } from './utils';

export interface Item {
  value: string;
  label: string;
  disabled?: boolean;
  children?: Item[];
}

interface Props {
  children: ReactElement;
  defaultValue?: string;
  dropdownClassName?: string;
  dropdownStyle?: CSSProperties;
  dropdownMenuClassName?: string;
  dropdownMenuStyle?: CSSProperties;
  dropdownMenuItemClassName?: string;
  dropdownMenuItemStyle?: CSSProperties;
  dropdownSubItemClassName?: string;
  dropdownSubItemStyle?: CSSProperties;
  expandTrigger?: 'click' | 'hover';
  items: Item[];
  onSelect?: (value: string, selectedItems: Item[]) => void;
}

interface State {
  selectedItems: Item[];
}

class Cascade extends Component<Props, State> {
  static defaultProps: Partial<Props> = {
    defaultValue: undefined,
    dropdownClassName: undefined,
    dropdownStyle: undefined,
    dropdownMenuClassName: undefined,
    dropdownMenuStyle: undefined,
    dropdownMenuItemClassName: undefined,
    dropdownMenuItemStyle: undefined,
    dropdownSubItemClassName: undefined,
    dropdownSubItemStyle: undefined,
    expandTrigger: 'click',
    onSelect: undefined
  }

  dropdownRef = createRef<HTMLDivElement>();

  state: Readonly<State> = {
    selectedItems: []
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this.onClickOutside);
  }

  getLabel = (): string => {
    const { defaultValue, items } = this.props;
    const { selectedItems } = this.state;
    if (selectedItems.length >= 1) {
      return selectedItems.map(({ label }) => label).join(' > ');
    }
    if (!defaultValue) {
      return '';
    }
    return getSelectedItems(items, defaultValue).map(({ label }) => label).join(' > ');
  }

  handleClick = (): void => {
    document.getElementsByClassName(styles.dropdownMenu)[0].classList.add(styles.show);
    document.addEventListener('click', this.onClickOutside);
  }

  handleSelect = (item: Item): void => {
    const { items, onSelect } = this.props;
    if (!onSelect || item.disabled) {
      return;
    }

    const selectedItems = getSelectedItems(items, item.value);
    this.setState({ selectedItems }, () => onSelect(selectedItems.slice(-1)[0].value, selectedItems));
  }

  onClickOutside = (e: MouseEvent): void => {
    if(!this.dropdownRef.current.contains(e.target as Node)) {
      document.getElementsByClassName(styles.dropdownMenu)[0].classList.remove(styles.show);
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
            if (Array.isArray(item.children) && item.children.length >= 1) {
              return (
                <li
                  className={classNames({
                    [styles.dropdownMenuItem]: true,
                    [styles.withSubItem]: true,
                    [dropdownSubItemClassName]: Boolean(dropdownSubItemClassName),
                    [styles.disabled]: item.disabled
                  })}
                  key={`${index}-${item.value}`}
                  style={dropdownSubItemStyle}
                >
                  {item.label}
                  {this.renderItems(item.children)}
                </li>
              )
            }

            return (
              <li
                aria-hidden
                className={classNames({
                  [styles.dropdownMenuItem]: true,
                  [dropdownMenuItemClassName]: Boolean(dropdownMenuItemClassName),
                  [styles.disabled]: item.disabled
                })}
                key={`${index}-${item.value}`}
                onClick={() => this.handleSelect(item)}
                style={dropdownMenuItemStyle}
              >{item.label}</li>
            );
          })
        }
      </ul>
    );
  }

  render(): JSX.Element {
    const {
      children,
      dropdownClassName,
      dropdownStyle,
      expandTrigger,
      items
    } = this.props;

    return (
      <>
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
            onClick: expandTrigger === 'click' ? this.handleClick : undefined,
            readOnly: true,
            value: this.getLabel()
          })}
          {this.renderItems(items)}
        </div>
      </>
    );
  }
};

export default Cascade;
