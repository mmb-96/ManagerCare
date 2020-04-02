import { element, by, ElementFinder } from 'protractor';

export class CategoriaAscComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-categoria-asc div table .btn-danger'));
  title = element.all(by.css('jhi-categoria-asc div h2#page-heading span')).first();
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

export class CategoriaAscUpdatePage {
  pageTitle = element(by.id('jhi-categoria-asc-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idHijoSelect = element(by.id('field_idHijo'));
  idPadreSelect = element(by.id('field_idPadre'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async idHijoSelectLastOption(): Promise<void> {
    await this.idHijoSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async idHijoSelectOption(option: string): Promise<void> {
    await this.idHijoSelect.sendKeys(option);
  }

  getIdHijoSelect(): ElementFinder {
    return this.idHijoSelect;
  }

  async getIdHijoSelectedOption(): Promise<string> {
    return await this.idHijoSelect.element(by.css('option:checked')).getText();
  }

  async idPadreSelectLastOption(): Promise<void> {
    await this.idPadreSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async idPadreSelectOption(option: string): Promise<void> {
    await this.idPadreSelect.sendKeys(option);
  }

  getIdPadreSelect(): ElementFinder {
    return this.idPadreSelect;
  }

  async getIdPadreSelectedOption(): Promise<string> {
    return await this.idPadreSelect.element(by.css('option:checked')).getText();
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

export class CategoriaAscDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-categoriaAsc-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-categoriaAsc'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
