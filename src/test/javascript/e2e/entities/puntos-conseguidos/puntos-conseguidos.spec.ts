import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  PuntosConseguidosComponentsPage,
  PuntosConseguidosDeleteDialog,
  PuntosConseguidosUpdatePage
} from './puntos-conseguidos.page-object';

const expect = chai.expect;

describe('PuntosConseguidos e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let puntosConseguidosComponentsPage: PuntosConseguidosComponentsPage;
  let puntosConseguidosUpdatePage: PuntosConseguidosUpdatePage;
  let puntosConseguidosDeleteDialog: PuntosConseguidosDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load PuntosConseguidos', async () => {
    await navBarPage.goToEntity('puntos-conseguidos');
    puntosConseguidosComponentsPage = new PuntosConseguidosComponentsPage();
    await browser.wait(ec.visibilityOf(puntosConseguidosComponentsPage.title), 5000);
    expect(await puntosConseguidosComponentsPage.getTitle()).to.eq('managerCareApp.puntosConseguidos.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(puntosConseguidosComponentsPage.entities), ec.visibilityOf(puntosConseguidosComponentsPage.noResult)),
      1000
    );
  });

  it('should load create PuntosConseguidos page', async () => {
    await puntosConseguidosComponentsPage.clickOnCreateButton();
    puntosConseguidosUpdatePage = new PuntosConseguidosUpdatePage();
    expect(await puntosConseguidosUpdatePage.getPageTitle()).to.eq('managerCareApp.puntosConseguidos.home.createOrEditLabel');
    await puntosConseguidosUpdatePage.cancel();
  });

  it('should create and save PuntosConseguidos', async () => {
    const nbButtonsBeforeCreate = await puntosConseguidosComponentsPage.countDeleteButtons();

    await puntosConseguidosComponentsPage.clickOnCreateButton();

    await promise.all([
      puntosConseguidosUpdatePage.setPuntosInput('5'),
      puntosConseguidosUpdatePage.setAnyosInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      puntosConseguidosUpdatePage.userSelectLastOption()
    ]);

    expect(await puntosConseguidosUpdatePage.getPuntosInput()).to.eq('5', 'Expected puntos value to be equals to 5');
    expect(await puntosConseguidosUpdatePage.getAnyosInput()).to.contain(
      '2001-01-01T02:30',
      'Expected anyos value to be equals to 2000-12-31'
    );

    await puntosConseguidosUpdatePage.save();
    expect(await puntosConseguidosUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await puntosConseguidosComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last PuntosConseguidos', async () => {
    const nbButtonsBeforeDelete = await puntosConseguidosComponentsPage.countDeleteButtons();
    await puntosConseguidosComponentsPage.clickOnLastDeleteButton();

    puntosConseguidosDeleteDialog = new PuntosConseguidosDeleteDialog();
    expect(await puntosConseguidosDeleteDialog.getDialogTitle()).to.eq('managerCareApp.puntosConseguidos.delete.question');
    await puntosConseguidosDeleteDialog.clickOnConfirmButton();

    expect(await puntosConseguidosComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
