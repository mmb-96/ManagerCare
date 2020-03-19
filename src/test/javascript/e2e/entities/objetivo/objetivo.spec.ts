import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ObjetivoComponentsPage, ObjetivoDeleteDialog, ObjetivoUpdatePage } from './objetivo.page-object';

const expect = chai.expect;

describe('Objetivo e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let objetivoComponentsPage: ObjetivoComponentsPage;
  let objetivoUpdatePage: ObjetivoUpdatePage;
  let objetivoDeleteDialog: ObjetivoDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Objetivos', async () => {
    await navBarPage.goToEntity('objetivo');
    objetivoComponentsPage = new ObjetivoComponentsPage();
    await browser.wait(ec.visibilityOf(objetivoComponentsPage.title), 5000);
    expect(await objetivoComponentsPage.getTitle()).to.eq('managerCareApp.objetivo.home.title');
    await browser.wait(ec.or(ec.visibilityOf(objetivoComponentsPage.entities), ec.visibilityOf(objetivoComponentsPage.noResult)), 1000);
  });

  it('should load create Objetivo page', async () => {
    await objetivoComponentsPage.clickOnCreateButton();
    objetivoUpdatePage = new ObjetivoUpdatePage();
    expect(await objetivoUpdatePage.getPageTitle()).to.eq('managerCareApp.objetivo.home.createOrEditLabel');
    await objetivoUpdatePage.cancel();
  });

  it('should create and save Objetivos', async () => {
    const nbButtonsBeforeCreate = await objetivoComponentsPage.countDeleteButtons();

    await objetivoComponentsPage.clickOnCreateButton();

    await promise.all([
      objetivoUpdatePage.setNombreInput('nombre'),
      objetivoUpdatePage.setDescripcionInput('descripcion'),
      objetivoUpdatePage.setUrlInput('url'),
      objetivoUpdatePage.setPuntosInput('5'),
      objetivoUpdatePage.tipoSelectLastOption()
    ]);

    expect(await objetivoUpdatePage.getNombreInput()).to.eq('nombre', 'Expected Nombre value to be equals to nombre');
    expect(await objetivoUpdatePage.getDescripcionInput()).to.eq('descripcion', 'Expected Descripcion value to be equals to descripcion');
    expect(await objetivoUpdatePage.getUrlInput()).to.eq('url', 'Expected Url value to be equals to url');
    expect(await objetivoUpdatePage.getPuntosInput()).to.eq('5', 'Expected puntos value to be equals to 5');

    await objetivoUpdatePage.save();
    expect(await objetivoUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await objetivoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Objetivo', async () => {
    const nbButtonsBeforeDelete = await objetivoComponentsPage.countDeleteButtons();
    await objetivoComponentsPage.clickOnLastDeleteButton();

    objetivoDeleteDialog = new ObjetivoDeleteDialog();
    expect(await objetivoDeleteDialog.getDialogTitle()).to.eq('managerCareApp.objetivo.delete.question');
    await objetivoDeleteDialog.clickOnConfirmButton();

    expect(await objetivoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
