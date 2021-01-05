import type { Item } from './Cascade';

interface ClassName {
  [key: string]: boolean;
}

export function classNames(classes: ClassName): string {
  return Object.entries(classes)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(' ');
}

type SelectedItem = Pick<Item, 'value' | 'label'>;

export function getSelectedItems(items: Item[], selectedValue: string): SelectedItem[] {
  let selectedItems: SelectedItem[] = [];
  function search(itemsz: Item[], ref: Item[] = []) {
    itemsz.forEach(({ children, label, value }) => {
      if (value === selectedValue) {
        selectedItems = [...ref, {
          value,
          label
        }];
      } else if (Array.isArray(children) && children.length >= 1) {
        search(children, [...ref, {
          value,
          label
        }]);
      }
    });
  }
  search(items);
  return selectedItems;
}
