import { element, by, ElementFinder } from 'protractor';

export class ObjetivoComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-objetivo div table .btn-danger'));
  title = element.all(by.css('jhi-objetivo div h2#page-heading span')).first();
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

export class ObjetivoUpdatePage {
  pageTitle = element(by.id('jhi-objetivo-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  nombreInput = element(by.id('field_nombre'));
  descripcionInput = element(by.id('field_descripcion'));
  urlInput = element(by.id('field_url'));
  puntosInput = element(by.id('field_puntos'));

  tipoSelect = element(by.id('field_tipo'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setNombreInput(nombre: string): Promise<void> {
    await this.nombreInput.sendKeys(nombre);
  }

  async getNombreInput(): Promise<string> {
    return await this.nombreInput.getAttribute('value');
  }

  async setDescripcionInput(descripcion: string): Promise<void> {
    await this.descripcionInput.sendKeys(descripcion);
  }

  async getDescripcionInput(): Promise<string> {
    return await this.descripcionInput.getAttribute('value');
  }

  async setUrlInput(url: string): Promise<void> {
    await this.urlInput.sendKeys(url);
  }

  async getUrlInput(): Promise<string> {
    return await this.urlInput.getAttribute('value');
  }

  async setPuntosInput(puntos: string): Promise<void> {
    await this.puntosInput.sendKeys(puntos);
  }

  async getPuntosInput(): Promise<string> {
    return await this.puntosInput.getAttribute('value');
  }

  async tipoSelectLastOption(): Promise<void> {
    await this.tipoSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async tipoSelectOption(option: string): Promise<void> {
    await this.tipoSelect.sendKeys(option);
  }

  getTipoSelect(): ElementFinder {
    return this.tipoSelect;
  }

  async getTipoSelectedOption(): Promise<string> {
    return await this.tipoSelect.element(by.css('option:checked')).getText();
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

export class ObjetivoDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-objetivo-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-objetivo'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
