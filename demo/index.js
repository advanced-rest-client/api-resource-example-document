import { LitElement, html } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import { ApiDemoPageBase } from '@advanced-rest-client/arc-demo-helper/ApiDemoPage.js';
import '@api-components/api-navigation/api-navigation.js';
import '../api-resource-example-document.js';

class DemoElement extends AmfHelperMixin(LitElement) {}
window.customElements.define('demo-element', DemoElement);

class ApiDemo extends ApiDemoPageBase {
  constructor() {
    super();
    this._mediaChanged = this._mediaChanged.bind(this);

    this.componentName = 'api-resource-example-document';

    this.hasData = false;
    this.singlePayload = true;
  }

  get helper() {
    return document.getElementById('helper');
  }

  get hasData() {
    return this._hasData;
  }

  set hasData(value) {
    this._setObservableProperty('hasData', value);
  }

  get examples() {
    return this._examples;
  }

  set examples(value) {
    this._setObservableProperty('examples', value);
  }

  get mediaTypes() {
    return this._mediaTypes;
  }

  set mediaTypes(value) {
    this._setObservableProperty('mediaTypes', value);
  }

  get payloads() {
    return this._payloads;
  }

  set payloads(value) {
    this._setObservableProperty('payloads', value);
  }

  get singlePayload() {
    return this._singlePayload;
  }

  set singlePayload(value) {
    this._setObservableProperty('singlePayload', value);
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
    const helper = this.helper;
    const webApi = helper._computeWebApi(this.amf);
    const method = helper._computeMethodModel(webApi, selection);
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
    const helper = this.helper;
    const expects = helper._computeExpects(model);
    if (!expects) {
      return;
    }
    let payloads = helper._computePayload(expects);
    if (!payloads) {
      return;
    }
    if (!(payloads instanceof Array)) {
      payloads = [payloads];
    }
    return payloads;
  }

  computeMediaTypes(payloads) {
    if (!payloads) {
      return;
    }
    const helper = this.helper;
    const result = [];
    payloads.forEach((item) => {
      const label = helper._getValue(item, helper.ns.raml.vocabularies.http + 'mediaType');
      if (label) {
        result.push({label});
      }
    });
    return result.length ? result : undefined;
  }

  _mediaChanged(e) {
    this.hasExamples = false;
    const index = e.detail.value;
    if (isNaN(index) || index === -1) {
      return;
    }
    const mediaType = this.mediaTypes[index].label;
    const body = this.payloads[index];
    this.hasExamples = true;
    this.examples = body;
    this.mediaType = mediaType;
  }

  _apiListTemplate() {
    return html`
    <paper-item data-src="demo-api.json">Demo api</paper-item>
    <paper-item data-src="demo-api-compact.json">Demo api - compact model</paper-item>
    <paper-item data-src="raml-types.json">RAML types with raml examples</paper-item>
    <paper-item data-src="raml-types-compact.json">RAML types with raml examples - compact model</paper-item>
    `;
  }

  _examplesTemplate() {
    const hasExamples = this.hasExamples;
    return hasExamples ?
      html`<api-resource-example-document
        .amf="${this.amf}"
        .examples="${this.examples}"
        mediatype="${this.mediaType}"></api-resource-example-document>` :
      html`<p>Examples not found in selected method</p>`;
  }

  contentTemplate() {
    const mediaTypes = this.mediaTypes;
    const hasData = this.hasData;
    return html`
    <demo-element id="helper" .amf="${this.amf}"></demo-element>
    <paper-dropdown-menu label="Select media type" ?hidden="${this.singlePayload}">
      <paper-listbox slot="dropdown-content" id="mediaList" @selected-changed="${this._mediaChanged}">
      ${mediaTypes ? mediaTypes.map((item) => html`<paper-item>${item.label}</paper-item>`) : undefined}
      </paper-listbox>
    </paper-dropdown-menu>
    ${hasData ? this._examplesTemplate() : html`<p>Select an object that contains examples.</p>`}
    `;
  }
}
const instance = new ApiDemo();
instance._render();
