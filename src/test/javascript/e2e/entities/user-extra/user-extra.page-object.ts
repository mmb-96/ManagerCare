import { element, by, ElementFinder } from 'protractor';

export class UserExtraComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-user-extra div table .btn-danger'));
  title = element.all(by.css('jhi-user-extra div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class UserExtraUpdatePage {
  pageTitle = element(by.id('jhi-user-extra-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  userSelect = element(by.id('field_user'));
  idResponsableSelect = element(by.id('field_idResponsable'));
  categoriaSelect = element(by.id('field_categoria'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async userSelectLastOption(): Promise<void> {
    await this.userSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async userSelectOption(option: string): Promise<void> {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect(): ElementFinder {
    return this.userSelect;
  }

  async getUserSelectedOption(): Promise<string> {
    return await this.userSelect.element(by.css('option:checked')).getText();
  }

  async idResponsableSelectLastOption(): Promise<void> {
    await this.idResponsableSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async idResponsableSelectOption(option: string): Promise<void> {
    await this.idResponsableSelect.sendKeys(option);
  }

  getIdResponsableSelect(): ElementFinder {
    return this.idResponsableSelect;
  }

  async getIdResponsableSelectedOption(): Promise<string> {
    return await this.idResponsableSelect.element(by.css('option:checked')).getText();
  }

  async categoriaSelectLastOption(): Promise<void> {
    await this.categoriaSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async categoriaSelectOption(option: string): Promise<void> {
    await this.categoriaSelect.sendKeys(option);
  }

  getCategoriaSelect(): ElementFinder {
    return this.categoriaSelect;
  }

  async getCategoriaSelectedOption(): Promise<string> {
    return await this.categoriaSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class UserExtraDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-userExtra-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-userExtra'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
