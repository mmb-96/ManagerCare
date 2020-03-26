import { element, by, ElementFinder } from 'protractor';

export class PuntosConseguidosComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-puntos-conseguidos div table .btn-danger'));
  title = element.all(by.css('jhi-puntos-conseguidos div h2#page-heading span')).first();
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

export class PuntosConseguidosUpdatePage {
  pageTitle = element(by.id('jhi-puntos-conseguidos-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  puntosInput = element(by.id('field_puntos'));
  anyosInput = element(by.id('field_anyos'));

  userSelect = element(by.id('field_user'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setPuntosInput(puntos: string): Promise<void> {
    await this.puntosInput.sendKeys(puntos);
  }

  async getPuntosInput(): Promise<string> {
    return await this.puntosInput.getAttribute('value');
  }

  async setAnyosInput(anyos: string): Promise<void> {
    await this.anyosInput.sendKeys(anyos);
  }

  async getAnyosInput(): Promise<string> {
    return await this.anyosInput.getAttribute('value');
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

export class PuntosConseguidosDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-puntosConseguidos-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-puntosConseguidos'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
