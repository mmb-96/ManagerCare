import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CategoriaComponentsPage, CategoriaDeleteDialog, CategoriaUpdatePage } from './categoria.page-object';

const expect = chai.expect;

describe('Categoria e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let categoriaComponentsPage: CategoriaComponentsPage;
  let categoriaUpdatePage: CategoriaUpdatePage;
  let categoriaDeleteDialog: CategoriaDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Categorias', async () => {
    await navBarPage.goToEntity('categoria');
    categoriaComponentsPage = new CategoriaComponentsPage();
    await browser.wait(ec.visibilityOf(categoriaComponentsPage.title), 5000);
    expect(await categoriaComponentsPage.getTitle()).to.eq('managerCareApp.categoria.home.title');
    await browser.wait(ec.or(ec.visibilityOf(categoriaComponentsPage.entities), ec.visibilityOf(categoriaComponentsPage.noResult)), 1000);
  });

  it('should load create Categoria page', async () => {
    await categoriaComponentsPage.clickOnCreateButton();
    categoriaUpdatePage = new CategoriaUpdatePage();
    expect(await categoriaUpdatePage.getPageTitle()).to.eq('managerCareApp.categoria.home.createOrEditLabel');
    await categoriaUpdatePage.cancel();
  });

  it('should create and save Categorias', async () => {
    const nbButtonsBeforeCreate = await categoriaComponentsPage.countDeleteButtons();

    await categoriaComponentsPage.clickOnCreateButton();

    await promise.all([
      categoriaUpdatePage.setNombreInput('nombre'),
      categoriaUpdatePage.setDescripcionInput('descripcion')
      // categoriaUpdatePage.objetivoSelectLastOption(),
      // categoriaUpdatePage.userSelectLastOption(),
    ]);

    expect(await categoriaUpdatePage.getNombreInput()).to.eq('nombre', 'Expected Nombre value to be equals to nombre');
    expect(await categoriaUpdatePage.getDescripcionInput()).to.eq('descripcion', 'Expected Descripcion value to be equals to descripcion');

    await categoriaUpdatePage.save();
    expect(await categoriaUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await categoriaComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Categoria', async () => {
    const nbButtonsBeforeDelete = await categoriaComponentsPage.countDeleteButtons();
    await categoriaComponentsPage.clickOnLastDeleteButton();

    categoriaDeleteDialog = new CategoriaDeleteDialog();
    expect(await categoriaDeleteDialog.getDialogTitle()).to.eq('managerCareApp.categoria.delete.question');
    await categoriaDeleteDialog.clickOnConfirmButton();

    expect(await categoriaComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
