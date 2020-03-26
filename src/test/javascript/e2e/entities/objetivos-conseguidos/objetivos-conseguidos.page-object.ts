import { element, by, ElementFinder } from 'protractor';

export class ObjetivosConseguidosComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-objetivos-conseguidos div table .btn-danger'));
  title = element.all(by.css('jhi-objetivos-conseguidos div h2#page-heading span')).first();
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

export class ObjetivosConseguidosUpdatePage {
  pageTitle = element(by.id('jhi-objetivos-conseguidos-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  estadoInput = element(by.id('field_estado'));
  fechaAperturaInput = element(by.id('field_fechaApertura'));
  fechaCierreInput = element(by.id('field_fechaCierre'));

  userSelect = element(by.id('field_user'));
  objetivoSelect = element(by.id('field_objetivo'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  getEstadoInput(): ElementFinder {
    return this.estadoInput;
  }

  async setFechaAperturaInput(fechaApertura: string): Promise<void> {
    await this.fechaAperturaInput.sendKeys(fechaApertura);
  }

  async getFechaAperturaInput(): Promise<string> {
    return await this.fechaAperturaInput.getAttribute('value');
  }

  async setFechaCierreInput(fechaCierre: string): Promise<void> {
    await this.fechaCierreInput.sendKeys(fechaCierre);
  }

  async getFechaCierreInput(): Promise<string> {
    return await this.fechaCierreInput.getAttribute('value');
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

  async objetivoSelectLastOption(): Promise<void> {
    await this.objetivoSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async objetivoSelectOption(option: string): Promise<void> {
    await this.objetivoSelect.sendKeys(option);
  }

  getObjetivoSelect(): ElementFinder {
    return this.objetivoSelect;
  }

  async getObjetivoSelectedOption(): Promise<string> {
    return await this.objetivoSelect.element(by.css('option:checked')).getText();
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

export class ObjetivosConseguidosDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-objetivosConseguidos-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-objetivosConseguidos'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
