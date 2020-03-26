import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  ObjetivosConseguidosComponentsPage,
  ObjetivosConseguidosDeleteDialog,
  ObjetivosConseguidosUpdatePage
} from './objetivos-conseguidos.page-object';

const expect = chai.expect;

describe('ObjetivosConseguidos e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let objetivosConseguidosComponentsPage: ObjetivosConseguidosComponentsPage;
  let objetivosConseguidosUpdatePage: ObjetivosConseguidosUpdatePage;
  let objetivosConseguidosDeleteDialog: ObjetivosConseguidosDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ObjetivosConseguidos', async () => {
    await navBarPage.goToEntity('objetivos-conseguidos');
    objetivosConseguidosComponentsPage = new ObjetivosConseguidosComponentsPage();
    await browser.wait(ec.visibilityOf(objetivosConseguidosComponentsPage.title), 5000);
    expect(await objetivosConseguidosComponentsPage.getTitle()).to.eq('managerCareApp.objetivosConseguidos.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(objetivosConseguidosComponentsPage.entities), ec.visibilityOf(objetivosConseguidosComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ObjetivosConseguidos page', async () => {
    await objetivosConseguidosComponentsPage.clickOnCreateButton();
    objetivosConseguidosUpdatePage = new ObjetivosConseguidosUpdatePage();
    expect(await objetivosConseguidosUpdatePage.getPageTitle()).to.eq('managerCareApp.objetivosConseguidos.home.createOrEditLabel');
    await objetivosConseguidosUpdatePage.cancel();
  });

  it('should create and save ObjetivosConseguidos', async () => {
    const nbButtonsBeforeCreate = await objetivosConseguidosComponentsPage.countDeleteButtons();

    await objetivosConseguidosComponentsPage.clickOnCreateButton();

    await promise.all([
      objetivosConseguidosUpdatePage.setFechaAperturaInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      objetivosConseguidosUpdatePage.setFechaCierreInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      objetivosConseguidosUpdatePage.userSelectLastOption(),
      objetivosConseguidosUpdatePage.objetivoSelectLastOption()
    ]);

    const selectedEstado = objetivosConseguidosUpdatePage.getEstadoInput();
    if (await selectedEstado.isSelected()) {
      await objetivosConseguidosUpdatePage.getEstadoInput().click();
      expect(await objetivosConseguidosUpdatePage.getEstadoInput().isSelected(), 'Expected estado not to be selected').to.be.false;
    } else {
      await objetivosConseguidosUpdatePage.getEstadoInput().click();
      expect(await objetivosConseguidosUpdatePage.getEstadoInput().isSelected(), 'Expected estado to be selected').to.be.true;
    }
    expect(await objetivosConseguidosUpdatePage.getFechaAperturaInput()).to.contain(
      '2001-01-01T02:30',
      'Expected fechaApertura value to be equals to 2000-12-31'
    );
    expect(await objetivosConseguidosUpdatePage.getFechaCierreInput()).to.contain(
      '2001-01-01T02:30',
      'Expected fechaCierre value to be equals to 2000-12-31'
    );

    await objetivosConseguidosUpdatePage.save();
    expect(await objetivosConseguidosUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await objetivosConseguidosComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last ObjetivosConseguidos', async () => {
    const nbButtonsBeforeDelete = await objetivosConseguidosComponentsPage.countDeleteButtons();
    await objetivosConseguidosComponentsPage.clickOnLastDeleteButton();

    objetivosConseguidosDeleteDialog = new ObjetivosConseguidosDeleteDialog();
    expect(await objetivosConseguidosDeleteDialog.getDialogTitle()).to.eq('managerCareApp.objetivosConseguidos.delete.question');
    await objetivosConseguidosDeleteDialog.clickOnConfirmButton();

    expect(await objetivosConseguidosComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
