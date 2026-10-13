import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { CompatibilitySubjectModule, JhiSortDirective, JhiSortByDirective } from './compat-subject';

@Component({ template: `<table><tr jhiSort [(predicate)]="predicate" [(ascending)]="ascending" [callback]="callback"><th jhiSortBy="id"><fa-icon [icon]="icon"></fa-icon></th><th jhiSortBy="name"><fa-icon [icon]="icon"></fa-icon></th></tr></table>` })
class SortHost {
  predicate = 'id';
  ascending = true;
  icon = faSort;
  callback = jest.fn();
}

describe('Sort template compatibility', () => {
  it('emits new-field state in predicate, ascending, callback order', () => {
    const sort = new JhiSortDirective();
    sort.predicate = 'id'; sort.ascending = false;
    const events: string[] = [];
    sort.predicateChange.subscribe(value => events.push('predicate:' + value));
    sort.ascendingChange.subscribe(value => events.push('ascending:' + value));
    sort.callback = () => events.push('callback:' + sort.predicate + ':' + sort.ascending);
    sort.sort('name');
    expect(events).toEqual(['predicate:name', 'ascending:true', 'callback:name:true']);
  });

  it('toggles direction on the same field', () => {
    const sort = new JhiSortDirective();
    sort.predicate = 'id'; sort.ascending = true; sort.callback = jest.fn();
    sort.sort('id'); expect(sort.ascending).toBe(false);
    sort.sort('id'); expect(sort.ascending).toBe(true);
    expect(sort.callback).toHaveBeenCalledTimes(2);
  });

  function fixtureForSort(): ComponentFixture<SortHost> {
    TestBed.configureTestingModule({ imports: [CompatibilitySubjectModule], declarations: [SortHost] });
    return TestBed.createComponent(SortHost);
  }

  it('preserves effective FontAwesome rendering while recording legacy iconProp changes', () => {
    const fixture = fixtureForSort(); fixture.detectChanges();
    const headers = fixture.debugElement.queryAll(By.directive(JhiSortByDirective));
    const firstIcon = headers[0].query(By.directive(FaIconComponent)).componentInstance as FaIconComponent;
    expect(firstIcon.icon).toBe(faSort);
    expect(Reflect.get(firstIcon, 'iconProp')).toBe(faSortUp);
    expect(headers[0].nativeElement.querySelector('svg').getAttribute('data-icon')).toBe('sort');
    headers[0].nativeElement.click(); fixture.detectChanges();
    expect(Reflect.get(firstIcon, 'iconProp')).toBe(faSortDown);
    expect(firstIcon.icon).toBe(faSort);
    expect(headers[0].nativeElement.querySelector('svg').getAttribute('data-icon')).toBe('sort');
    headers[1].nativeElement.click(); fixture.detectChanges();
    expect(fixture.componentInstance.predicate).toBe('name');
    expect(fixture.componentInstance.ascending).toBe(true);
    expect(fixture.componentInstance.callback).toHaveBeenCalledTimes(2);
    expect(Reflect.get(firstIcon, 'iconProp')).toBe(faSort);
  });

  it('ignores clicks when the parent predicate is _score or empty', () => {
    const fixture = fixtureForSort(); fixture.componentInstance.predicate = '_score'; fixture.detectChanges();
    const header = fixture.debugElement.query(By.directive(JhiSortByDirective));
    header.nativeElement.click();
    expect(fixture.componentInstance.callback).not.toHaveBeenCalled();
    expect(fixture.componentInstance.predicate).toBe('_score');
    fixture.componentInstance.predicate = ''; fixture.detectChanges(); header.nativeElement.click();
    expect(fixture.componentInstance.callback).not.toHaveBeenCalled();
  });
});
