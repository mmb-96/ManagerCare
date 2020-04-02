import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { UserExtraComponentsPage, UserExtraDeleteDialog, UserExtraUpdatePage } from './user-extra.page-object';

const expect = chai.expect;

describe('UserExtra e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let userExtraComponentsPage: UserExtraComponentsPage;
  let userExtraUpdatePage: UserExtraUpdatePage;
  let userExtraDeleteDialog: UserExtraDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load UserExtras', async () => {
    await navBarPage.goToEntity('user-extra');
    userExtraComponentsPage = new UserExtraComponentsPage();
    await browser.wait(ec.visibilityOf(userExtraComponentsPage.title), 5000);
    expect(await userExtraComponentsPage.getTitle()).to.eq('managerCareApp.userExtra.home.title');
    await browser.wait(ec.or(ec.visibilityOf(userExtraComponentsPage.entities), ec.visibilityOf(userExtraComponentsPage.noResult)), 1000);
  });

  it('should load create UserExtra page', async () => {
    await userExtraComponentsPage.clickOnCreateButton();
    userExtraUpdatePage = new UserExtraUpdatePage();
    expect(await userExtraUpdatePage.getPageTitle()).to.eq('managerCareApp.userExtra.home.createOrEditLabel');
    await userExtraUpdatePage.cancel();
  });

  it('should create and save UserExtras', async () => {
    const nbButtonsBeforeCreate = await userExtraComponentsPage.countDeleteButtons();

    await userExtraComponentsPage.clickOnCreateButton();

    await promise.all([
      userExtraUpdatePage.userSelectLastOption(),
      userExtraUpdatePage.idResponsableSelectLastOption(),
      userExtraUpdatePage.categoriaSelectLastOption()
    ]);

    await userExtraUpdatePage.save();
    expect(await userExtraUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await userExtraComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last UserExtra', async () => {
    const nbButtonsBeforeDelete = await userExtraComponentsPage.countDeleteButtons();
    await userExtraComponentsPage.clickOnLastDeleteButton();

    userExtraDeleteDialog = new UserExtraDeleteDialog();
    expect(await userExtraDeleteDialog.getDialogTitle()).to.eq('managerCareApp.userExtra.delete.question');
    await userExtraDeleteDialog.clickOnConfirmButton();

    expect(await userExtraComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
