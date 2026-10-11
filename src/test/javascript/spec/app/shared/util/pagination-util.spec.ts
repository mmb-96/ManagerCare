import { PaginationUtil } from 'app/shared/util/pagination-util';

describe('PaginationUtil', () => {
  const paginationUtil = new PaginationUtil();

  it('should parse a present page', () => {
    expect(paginationUtil.parsePage('2')).toBe(2);
  });

  it('should extract the predicate from a comma-separated sort', () => {
    expect(paginationUtil.parsePredicate('login,asc')).toBe('login');
  });

  it('should extract the predicate from a URL-encoded sort', () => {
    expect(paginationUtil.parsePredicate('auditEventDate%2Cdesc')).toBe('auditEventDate');
  });

  it('should recognise ascending and descending sorts', () => {
    expect(paginationUtil.parseAscending('login,asc')).toBe(true);
    expect(paginationUtil.parseAscending('auditEventDate,desc')).toBe(false);
  });
});
