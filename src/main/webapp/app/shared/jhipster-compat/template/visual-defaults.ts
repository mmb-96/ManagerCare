import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

export const VISUAL_DEFAULTS = {
  sortIcon: faSort,
  sortAscIcon: faSortUp,
  sortDescIcon: faSortDown,
  classBadgeTrue: 'badge badge-success',
  classBadgeFalse: 'badge badge-danger',
  classTrue: 'fa fa-lg fa-check text-success',
  classFalse: 'fa fa-lg fa-times text-danger'
} as const;
