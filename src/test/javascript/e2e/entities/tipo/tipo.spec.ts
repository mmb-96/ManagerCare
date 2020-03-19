import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { TipoComponentsPage, TipoDeleteDialog, TipoUpdatePage } from './tipo.page-object';

const expect = chai.expect;

describe('Tipo e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let tipoComponentsPage: TipoComponentsPage;
  let tipoUpdatePage: TipoUpdatePage;
  let tipoDeleteDialog: TipoDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Tipos', async () => {
    await navBarPage.goToEntity('tipo');
    tipoComponentsPage = new TipoComponentsPage();
    await browser.wait(ec.visibilityOf(tipoComponentsPage.title), 5000);
    expect(await tipoComponentsPage.getTitle()).to.eq('managerCareApp.tipo.home.title');
    await browser.wait(ec.or(ec.visibilityOf(tipoComponentsPage.entities), ec.visibilityOf(tipoComponentsPage.noResult)), 1000);
  });

  it('should load create Tipo page', async () => {
    await tipoComponentsPage.clickOnCreateButton();
    tipoUpdatePage = new TipoUpdatePage();
    expect(await tipoUpdatePage.getPageTitle()).to.eq('managerCareApp.tipo.home.createOrEditLabel');
    await tipoUpdatePage.cancel();
  });

  it('should create and save Tipos', async () => {
    const nbButtonsBeforeCreate = await tipoComponentsPage.countDeleteButtons();

    await tipoComponentsPage.clickOnCreateButton();

    await promise.all([tipoUpdatePage.setNombreInput('nombre')]);

    expect(await tipoUpdatePage.getNombreInput()).to.eq('nombre', 'Expected Nombre value to be equals to nombre');

    await tipoUpdatePage.save();
    expect(await tipoUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await tipoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Tipo', async () => {
    const nbButtonsBeforeDelete = await tipoComponentsPage.countDeleteButtons();
    await tipoComponentsPage.clickOnLastDeleteButton();

    tipoDeleteDialog = new TipoDeleteDialog();
    expect(await tipoDeleteDialog.getDialogTitle()).to.eq('managerCareApp.tipo.delete.question');
    await tipoDeleteDialog.clickOnConfirmButton();

    expect(await tipoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
