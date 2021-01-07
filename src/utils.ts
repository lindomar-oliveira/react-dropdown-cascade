/* eslint-disable import/prefer-default-export */

interface ClassName {
  [key: string]: boolean;
}

export function classNames(classes: ClassName): string {
  return Object.entries(classes)
    .filter(([, value]) => value)
    .map(([key]) => key)
    .join(' ');
}
