import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CategoriaAscComponentsPage, CategoriaAscDeleteDialog, CategoriaAscUpdatePage } from './categoria-asc.page-object';

const expect = chai.expect;

describe('CategoriaAsc e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let categoriaAscComponentsPage: CategoriaAscComponentsPage;
  let categoriaAscUpdatePage: CategoriaAscUpdatePage;
  let categoriaAscDeleteDialog: CategoriaAscDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load CategoriaAscs', async () => {
    await navBarPage.goToEntity('categoria-asc');
    categoriaAscComponentsPage = new CategoriaAscComponentsPage();
    await browser.wait(ec.visibilityOf(categoriaAscComponentsPage.title), 5000);
    expect(await categoriaAscComponentsPage.getTitle()).to.eq('managerCareApp.categoriaAsc.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(categoriaAscComponentsPage.entities), ec.visibilityOf(categoriaAscComponentsPage.noResult)),
      1000
    );
  });

  it('should load create CategoriaAsc page', async () => {
    await categoriaAscComponentsPage.clickOnCreateButton();
    categoriaAscUpdatePage = new CategoriaAscUpdatePage();
    expect(await categoriaAscUpdatePage.getPageTitle()).to.eq('managerCareApp.categoriaAsc.home.createOrEditLabel');
    await categoriaAscUpdatePage.cancel();
  });

  it('should create and save CategoriaAscs', async () => {
    const nbButtonsBeforeCreate = await categoriaAscComponentsPage.countDeleteButtons();

    await categoriaAscComponentsPage.clickOnCreateButton();

    await promise.all([categoriaAscUpdatePage.idHijoSelectLastOption(), categoriaAscUpdatePage.idPadreSelectLastOption()]);

    await categoriaAscUpdatePage.save();
    expect(await categoriaAscUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await categoriaAscComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last CategoriaAsc', async () => {
    const nbButtonsBeforeDelete = await categoriaAscComponentsPage.countDeleteButtons();
    await categoriaAscComponentsPage.clickOnLastDeleteButton();

    categoriaAscDeleteDialog = new CategoriaAscDeleteDialog();
    expect(await categoriaAscDeleteDialog.getDialogTitle()).to.eq('managerCareApp.categoriaAsc.delete.question');
    await categoriaAscDeleteDialog.clickOnConfirmButton();

    expect(await categoriaAscComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
