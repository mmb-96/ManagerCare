/*
 Copyright 2013-2020 the original author or authors from the JHipster project.

 This file is part of the JHipster project, see https://www.jhipster.tech/
 for more information.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import { Pipe, PipeTransform } from '@angular/core';

type FilterPredicate = (value: unknown) => unknown;

// Algoritmo interno legacy; no se expone un pipe adicional "filter".
class CompatibilityFilter {
  transform<T>(input: T[], filter: unknown, field?: string): T[] {
    if (typeof filter === 'undefined' || filter === '') {
      return input;
    }
    const currentFilter: unknown = typeof filter === 'function' ? filter() : filter;
    if (typeof currentFilter === 'number') {
      return input.filter(this.filterByNumber(currentFilter, field));
    }
    if (typeof currentFilter === 'boolean') {
      return input.filter(this.filterByBoolean(currentFilter, field));
    }
    if (typeof currentFilter === 'string') {
      return input.filter(this.filterByString(currentFilter, field));
    }
    if (typeof currentFilter === 'object') {
      return input.filter(this.filterByObject(currentFilter));
    }
    return input.filter(this.filterDefault(currentFilter, field));
  }

  private fieldValue(value: unknown, field?: string): unknown {
    return (value as Record<string, unknown>)[field as string];
  }

  private filterByNumber(filter: number, field?: string): FilterPredicate {
    return value =>
      (value && !filter) || (typeof value === 'object' && field)
        ? this.fieldValue(value, field) && typeof this.fieldValue(value, field) === 'number' && this.fieldValue(value, field) === filter
        : typeof value === 'number' && value === filter;
  }

  private filterByBoolean(filter: boolean, field?: string): FilterPredicate {
    return value =>
      typeof value === 'object' && field
        ? this.fieldValue(value, field) && typeof this.fieldValue(value, field) === 'boolean' && this.fieldValue(value, field) === filter
        : typeof value === 'boolean' && value === filter;
  }

  private filterByString(filter: string, field?: string): FilterPredicate {
    return value =>
      (value && !filter) || (typeof value === 'object' && field)
        ? this.fieldValue(value, field) &&
          typeof this.fieldValue(value, field) === 'string' &&
          (this.fieldValue(value, field) as string).toLowerCase().includes(filter.toLowerCase())
        : typeof value === 'string' && value.toLowerCase().includes(filter.toLowerCase());
  }

  private filterDefault(filter: unknown, field?: string): FilterPredicate {
    return value =>
      (value && !filter) || (typeof value === 'object' && field)
        ? this.fieldValue(value, field) && filter === value
        : filter === value;
  }

  private filterByObject(filter: object | null): FilterPredicate {
    return value => {
      const keys = Object.keys(filter as object);
      let isMatching: unknown = false;
      for (const key of keys) {
        const expected = this.fieldValue(filter, key);
        const actual = this.fieldValue(value, key);
        if (typeof expected === 'number') {
          isMatching = this.filterByNumber(expected)(actual);
        } else if (typeof expected === 'boolean') {
          isMatching = this.filterByBoolean(expected)(actual);
        } else if (typeof expected === 'string') {
          isMatching = this.filterByString(expected)(actual);
        } else {
          isMatching = this.filterDefault(expected)(actual);
        }
      }
      return isMatching;
    };
  }
}

@Pipe({ name: 'pureFilter', pure: true })
export class JhiPureFilterPipe extends CompatibilityFilter implements PipeTransform {}
