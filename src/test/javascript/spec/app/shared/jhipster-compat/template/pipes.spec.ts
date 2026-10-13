import { JhiKeysPipe, JhiPureFilterPipe, JhiOrderByPipe } from './compat-subject';

describe('Template pipe compatibility', () => {
  it('preserves Object.keys order and object values', () => {
    const input = { z: 1, a: 2 };
    expect(new JhiKeysPipe().transform(input)).toEqual([{ key: 'z', value: 1 }, { key: 'a', value: 2 }]);
  });
  it('preserves array index keys as strings', () => {
    expect(new JhiKeysPipe().transform(['b', 'a'])).toEqual([{ key: '0', value: 'b' }, { key: '1', value: 'a' }]);
  });
  [null, undefined].forEach(value => it('preserves keys error for ' + String(value), () => {
    expect(() => new JhiKeysPipe().transform(value)).toThrow();
  }));

  it('returns the original array for empty or undefined filter', () => {
    const input = ['A', 'B']; const pipe = new JhiPureFilterPipe();
    expect(pipe.transform(input, '')).toBe(input); expect(pipe.transform(input, undefined)).toBe(input);
  });
  it('filters strings case-insensitively', () => {
    expect(new JhiPureFilterPipe().transform(['Alpha', 'beta'], 'AL')).toEqual(['Alpha']);
  });
  it('filters by an object field', () => {
    expect(new JhiPureFilterPipe().transform([{ name: 'Alpha' }, { name: 'beta' }], 'AL', 'name')).toEqual([{ name: 'Alpha' }]);
  });
  it('evaluates a function filter', () => {
    expect(new JhiPureFilterPipe().transform(['Alpha', 'beta'], () => 'be')).toEqual(['beta']);
  });
  it('filters numbers without coercion', () => {
    expect(new JhiPureFilterPipe().transform([1, 2, '1'], 1)).toEqual([1]);
  });
  it('filters boolean primitives', () => {
    expect(new JhiPureFilterPipe().transform([true, false, 1], false)).toEqual([false]);
  });
  it('filters thread state objects', () => {
    const input = [{ threadState: 'WAITING' }, { threadState: 'RUNNABLE' }];
    expect(new JhiPureFilterPipe().transform(input, { threadState: 'RUNNABLE' }, 'ignored')).toEqual([input[1]]);
  });
  it('preserves the empty-object quirk', () => {
    expect(new JhiPureFilterPipe().transform([{ state: 'A' }], {})).toEqual([]);
  });
  it('preserves overwrite rather than AND for multiple object properties', () => {
    const input = [{ first: 'wrong', second: 'match' }];
    expect(new JhiPureFilterPipe().transform(input, { first: 'expected', second: 'match' })).toEqual(input);
  });

  it('sorts the same primitive array ascending and reverse', () => {
    const input = [3, 1, 2]; const pipe = new JhiOrderByPipe();
    expect(pipe.transform(input)).toBe(input); expect(input).toEqual([1, 2, 3]);
    expect(pipe.transform(input, '', true)).toBe(input); expect(input).toEqual([3, 2, 1]);
  });
  it('preserves predicate sorting and stable equality', () => {
    const first = { name: 'a', id: 1 }; const second = { name: 'a', id: 2 }; const third = { name: 'b', id: 3 };
    const input = [third, first, second]; const pipe = new JhiOrderByPipe();
    expect(pipe.transform(input, 'name')).toBe(input); expect(input).toEqual([first, second, third]);
    pipe.transform(input, 'name', true); expect(input).toEqual([third, first, second]);
  });
  [null, undefined].forEach(value => it('preserves orderBy error for ' + String(value), () => {
    expect(() => new JhiOrderByPipe().transform(value as unknown as object[])).toThrow();
  }));
});
