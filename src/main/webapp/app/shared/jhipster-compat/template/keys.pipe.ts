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

export interface CompatKeyValue<T> {
  key: string;
  value: T;
  show?: boolean;
}
type EntryValue<T> = T extends readonly (infer E)[] ? E : T[keyof T];

@Pipe({ name: 'keys', pure: true })
export class JhiKeysPipe implements PipeTransform {
  transform<T>(value: T): CompatKeyValue<EntryValue<T>>[] {
    const keys: CompatKeyValue<EntryValue<T>>[] = [];
    const valueKeys = Object.keys(value as object);
    for (const key of valueKeys) {
      keys.push({ key, value: (value as Record<string, EntryValue<T>>)[key] });
    }
    return keys;
  }
}
