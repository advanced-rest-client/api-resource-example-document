import { html } from 'lit-element';
import { ApiDemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@api-components/api-navigation/api-navigation.js';
import '../api-resource-example-document.js';

class ApiDemo extends ApiDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'examples', 'mediaTypes', 'payloads', 'singlePayload',
    ]);

    this._mediaChanged = this._mediaChanged.bind(this);

    this.componentName = 'api-resource-example-document';

    this.hasData = false;
    this.singlePayload = true;
  }

  _navChanged(e) {
    const { selected, type } = e.detail;
    if (type === 'method') {
      this._setData(selected);
      this.hasData = true;
    } else {
      this.hasData = false;
    }
  }

  _setData(selection) {
    const list = document.body.querySelector('#mediaList');
    if (list) {
      list.selected = -1;
    }
    const webApi = this._computeWebApi(this.amf);
    const method = this._computeMethodModel(webApi, selection);
    if (!method) {
      this.hasData = false;
      return;
    }
    const payloads = this.computePayloads(method);
    this.hasData = !!(payloads && payloads.length);
    this.singlePayload = this.hasData && payloads.length === 1;
    this.mediaTypes = this.computeMediaTypes(payloads);
    this.payloads = this.hasData ? payloads : undefined;
    if (this.hasData) {
      setTimeout(() => {
        // eslint-disable-next-line no-shadow
        const list = document.body.querySelector('#mediaList');
        if (list) {
          list.selected = 0;
        }
      });
    }
  }

  computePayloads(model) {
    if (!model) {
      return;
    }
    const expects = this._computeExpects(model);
    if (!expects) {
      return;
    }
    let payloads = this._computePayload(expects);
    if (!payloads) {
      return;
    }
    if (!(payloads instanceof Array)) {
      payloads = [payloads];
    }
    // eslint-disable-next-line consistent-return
    return payloads;
  }

  computeMediaTypes(payloads) {
    if (!payloads) {
      return;
    }
    const result = [];
    payloads.forEach((item) => {
      const label = this._getValue(item, this.ns.aml.vocabularies.core.mediaType);
      if (label) {
        result.push({label});
      }
    });
    // eslint-disable-next-line consistent-return
    return result.length ? result : undefined;
  }

  _mediaChanged(e) {
    this.hasExamples = false;
    const index = e.detail.value;
    if (Number.isNaN(index) || index === -1) {
      return;
    }
    const mediaType = this.mediaTypes[index].label;
    const body = this.payloads[index];
    this.hasExamples = true;
    this.examples = body;
    this.mediaType = mediaType;
  }

  _apiListTemplate() {
    const result = [];

    [
      ['stevetest', 'Stevetest'],
      ['demo-api', 'Demo API'],
      ['google-drive-api', 'Google Drive'],
      ['raml-types', 'RAML types with raml examples'],
      ['APIC-332', 'APIC-332'],
    ].forEach(([file, label]) => {
      result[result.length] = html`
      <anypoint-item data-src="${file}-compact.json">${label} - compact model</anypoint-item>
      <anypoint-item data-src="${file}.json">${label}</anypoint-item>`;
    });
    return result;
  }

  _examplesTemplate() {
    const {hasExamples} = this;
    return hasExamples ?
      html`<api-resource-example-document
        .amf="${this.amf}"
        .examples="${this.examples}"
        mediatype="${this.mediaType}"
        minHeight="600px"
        ></api-resource-example-document>` :
      html`<p>Examples not found in selected method</p>`;
  }

  contentTemplate() {
    const {mediaTypes} = this;
    const {hasData} = this;
    return html`
    <anypoint-dropdown-menu ?hidden="${this.singlePayload}">
      <label slot="label">Select media type</label>
      <anypoint-listbox slot="dropdown-content" id="mediaList" @selected-changed="${this._mediaChanged}">
      ${mediaTypes ? mediaTypes.map((item) => html`<anypoint-item>${item.label}</anypoint-item>`) : undefined}
      </anypoint-listbox>
    </anypoint-dropdown-menu>
    ${hasData ? this._examplesTemplate() : html`<p>Select an object that contains examples.</p>`}
    `;
  }
}
const instance = new ApiDemo();
instance._render();
