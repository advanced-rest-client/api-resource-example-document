/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
import { LitElement, html } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import { ExampleGenerator } from '@api-components/api-example-generator';
import '@advanced-rest-client/arc-icons/arc-icon.js';
import '../api-example-render.js';
import elementStyles from './styles/Document.js';

/** @typedef {import('lit-element').TemplateResult} TemplateResult */
/** @typedef {import('@advanced-rest-client/arc-types').FormTypes.Example} Example */

/**
 * `api-resource-example-document`
 *
 * Renders list of examples defined in AMF model. It renders values that
 * are structured examples (JSON, RAML type).
 *
 * This element uses `api-example-generator` to generate view model for examples.
 * It can accept AMF's Payload shape, array of Payload shapes, or any other
 * AMF shape. If the shape is compatible (has examples, properties, items, unions etc)
 * then examples list is rendered.
 *
 * The mime type (`media-type`) must be set in order to compute examples.
 *
 * ## Example
 *
 * ```html
 * <api-resource-example-document
 *  payload="[...]"
 *  media-type="application/json"></api-resource-example-document>
 * ```
 *
 */
export class ApiResourceExampleDocument extends AmfHelperMixin(LitElement) {
  get styles() {
    return elementStyles;
  }

  static get properties() {
    return {
      /**
       * AMF model for examples.
       * It can be Payload shape, list of Payload shapes, or any shape.
       */
      examples: { type: Array },
      /**
       * Examples media type
       */
      mediaType: { type: String },
      /**
       * Type (model) name for which examples are generated for.
       * This is used by RAML to XML examples processor to wrap the example
       * in type name. If missing this wrapping is omitted.
       */
      typeName: { type: String },
      /**
       * Rendered payload ID (if any) to associate examples with the payload.
       */
      payloadId: { type: String },
      /**
       * Computed in a debouncer examples to render.
       */
      _renderedExamples: { type: Array },
      /**
       * Computed value, true if there are examples to render.
       * This value is reflected to attribute so the element can be hidden
       * via CSS until examples are set.
       *
       * ```css
       * api-resource-example-document { display: none; }
       * api-resource-example-document[has-examples] { display: block; }
       * ```
       */
      hasExamples: { type: Boolean, reflect: true },
      /**
       * If true it will display a table view instead of JSON code.
       * `isJson` must be set to use this option.
       */
      table: { type: Boolean, reflect: true },
      /**
       * Computed value, true if selected media type is application/json
       * or equivalent.
       */
      isJson: { type: Boolean, reflect: true },
      /**
       * Configuration passed to example generator.
       * When set the generator only returns examples that are defined in API
       * file, without auto generating examples from object properties.
       */
      noAuto: { type: Boolean, reflect: true },
      /**
       * When set the actions row (copy, switch view type) is not rendered.
       */
      noActions: { type: Boolean, reflect: true },
      /**
       * When set it only renders "raw" examples. To be used when media type context is unknown.
       * This can happen if RAML type document is rendered outside method documentation
       * (not in a request/response body when media type is known).
       *
       * Note, this can return JSON, XML, YAML or any other value
       * depending on original source.
       */
      rawOnly: { type: Boolean, reflect: true },
      /**
       * Enables Anypoint compatibility styling
       */
      compatibility: { type: Boolean },
      _effectiveTable: { type: Boolean },
      /**
       * True if current environment has localStorage support.
       * Chrome apps do not have localStorage property.
       */
      _hasLocalStorage: { type: Boolean },
      /**
       * If enabled then the example generator will be called with this option to add
       * read-only properties to the example
       */
      renderReadOnly: { type: Boolean },
      /**
       * If enabled, the example panel would be closed
       */
      _collapseExamplePanel: { type: Boolean, reflect: true },
      minHeight: '',
    };
  }

  get hasLocalStorage() {
    return this._hasLocalStorage;
  }

  /**
   * @returns {Example[]}
   */
  get renderedExamples() {
    return this.__renderedExamples;
  }

  get _renderedExamples() {
    return this.__renderedExamples;
  }

  /**
   * @param {Example[]} value
   */
  set _renderedExamples(value) {
    const old = this.__renderedExamples;
    if (old === value) {
      return;
    }
    this.__renderedExamples = value;
    this.requestUpdate('_renderedExamples', old);
    this.dispatchEvent(new CustomEvent('rendered-examples-changed', {
      composed: true,
      detail: {
        value
      }
    }));
  }

  get table() {
    return this._table;
  }

  /**
   * @param {boolean} value
   */
  set table(value) {
    const old = this._table;
    if (old === value) {
      return;
    }
    this._table = value;
    this.requestUpdate('table', old);
    this._tableChanged(value);
    this._effectiveTable = this._computeEffectiveTable(value, this._isJson);
  }

  get mediaType() {
    return this._mediaType;
  }

  /**
   * @param {string} value
   */
  set mediaType(value) {
    const old = this._mediaType;
    if (old === value) {
      return;
    }
    this._mediaType = value;
    this.requestUpdate('mediaType', old);
    this.isJson = this._computeIsJson(value);
    this._computeExamples();
  }

  get isJson() {
    return this._isJson;
  }

  /**
   * @param {boolean} value
   */
  set isJson(value) {
    const old = this._isJson;
    if (old === value) {
      return;
    }
    this._isJson = value;
    this.requestUpdate('isJson', old);
    this._effectiveTable = this._computeEffectiveTable(this._table, value);
  }

  get examples() {
    return this._examples;
  }

  /**
   * @param {object[]} value
   */
  set examples(value) {
    const old = this._examples;
    if (old === value) {
      return;
    }
    this._examples = value;
    this.requestUpdate('examples', old);
    this._computeExamples();
  }

  get rawOnly() {
    return this._rawOnly;
  }

  /**
   * @param {boolean} value
   */
  set rawOnly(value) {
    const old = this._rawOnly;
    if (old === value) {
      return;
    }
    this._rawOnly = value;
    this.requestUpdate('rawOnly', old);
    this._computeExamples();
  }

  get typeName() {
    return this._typeName;
  }

  /**
   * @param {string} value
   */
  set typeName(value) {
    const old = this._typeName;
    if (old === value) {
      return;
    }
    this._typeName = value;
    this.requestUpdate('typeName', old);
    this._computeExamples();
  }

  get noAuto() {
    return this._noAuto;
  }

  /**
   * @param {boolean} value
   */
  set noAuto(value) {
    const old = this._noAuto;
    if (old === value) {
      return;
    }
    this._noAuto = value;
    this.requestUpdate('noAuto', old);
    this._computeExamples();
  }

  get payloadId() {
    return this._payloadId;
  }

  /**
   * @param {string} value
   */
  set payloadId(value) {
    const old = this._payloadId;
    if (old === value) {
      return;
    }
    this._payloadId = value;
    this.requestUpdate('payloadId', old);
    this._computeExamples();
  }

  get hasExamples() {
    return this._hasExamples;
  }

  /**
   * @param {boolean} value
   */
  set hasExamples(value) {
    const old = this._hasExamples;
    if (old === value) {
      return;
    }
    this._hasExamples = value;
    this.requestUpdate('hasExamples', old);
    this.dispatchEvent(new CustomEvent('has-examples-changed', {
      composed: true,
      detail: {
        value
      }
    }));
  }

  get minHeight() {
    return this._minHeight;
  }

  /**
   * @param {string} value
   */
  set minHeight(value) {
    const old = this._minHeight;
    if (old === value) {
      return;
    }
    this._minHeight = value;
    this.requestUpdate('minHeight', old);
    this.dispatchEvent(new CustomEvent('min-height-changed', {
      composed: true,
      detail: {
        value
      }
    }));
  }

  get _collapseExamplePanel() {
    return this.__collapseExamplePanel
  }

  set _collapseExamplePanel(value) {
    const old = this.__collapseExamplePanel;
    if (old === value) {
      return;
    }
    this.__collapseExamplePanel = value;
    this.requestUpdate('_collapseExamplePanel', old);
  }

  constructor() {
    super();
    this._onStorageChanged = this._onStorageChanged.bind(this);
    this._onJsonTableStateChanged = this._onJsonTableStateChanged.bind(this);

    this._hasLocalStorage = this._hasStorageSupport();
    this.noActions = false;
    this.isJson = false;
    this.hasExamples = false;
    this.compatibility = false;
    this.renderReadOnly = false;
    this._collapseExamplePanel = false;
    this._ensureJsonTable();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('storage', this._onStorageChanged);
    window.addEventListener('json-table-state-changed', this._onJsonTableStateChanged);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('storage', this._onStorageChanged);
    window.removeEventListener('json-table-state-changed', this._onJsonTableStateChanged);
  }

  _hasStorageSupport() {
    /* global chrome */
    // @ts-ignore
    if (typeof chrome !== 'undefined' && chrome.i18n) {
      // Chrome apps have `chrome.i18n` property, regular website doesn't.
      // This is to avoid annoying warning message in Chrome apps.
      return false;
    }
    try {
      localStorage.getItem('test');
      return true;
    } catch (_) {
      return false;
    }
  }

  /**
   * When response's content type is JSON the view renders the
   * JSON table element. This function reads current state for the table
   * (if it is turned on) and handles view change if needed.
   */
  _ensureJsonTable() {
    if (!this.hasLocalStorage) {
      return;
    }
    const isTable = this._localStorageValueToBoolean(localStorage.jsonTableEnabled);
    if (this.table !== isTable) {
      this.table = isTable;
    }
  }

  /**
   * Updates "table" state in localStorage and dispatches
   * `json-table-state-changed` event.
   *
   * @param {boolean} state Current "table" state.
   */
  _tableChanged(state) {
    if (state === undefined) {
      return;
    }
    if (!this.hasLocalStorage) {
      this._dispatchTableState(state);
      return;
    }
    if (localStorage.jsonTableEnabled !== String(state)) {
      window.localStorage.setItem('jsonTableEnabled', String(state));
      this._dispatchTableState(state);
    }
  }

  /**
   * Dispatches `json-table-state-changed` custom event.
   * @param {boolean} enabled
   * @return {CustomEvent}
   */
  _dispatchTableState(enabled) {
    const e = new CustomEvent('json-table-state-changed', {
      bubbles: true,
      composed: true,
      detail: {
        enabled
      }
    });
    this.dispatchEvent(e);
    return e;
  }

  /**
   * Updates the value of the `isJsonTable` property when the corresponding localStorage
   * property change.
   *
   * @param {StorageEvent} e Storage event
   */
  _onStorageChanged(e) {
    if (e.key !== 'jsonTableEnabled' || !this.hasLocalStorage) {
      return;
    }
    if (e.newValue === undefined) {
      return;
    }
    const v = this._localStorageValueToBoolean(e.newValue);
    if (this.table !== v) {
      this.table = v;
    }
  }

  /**
   * Reads the local value (always a string) as a boolean value.
   *
   * @param {string} value The value read from the local storage.
   * @return {boolean} Boolean value read from the value.
   */
  _localStorageValueToBoolean(value) {
    if (!value) {
      return false;
    }
    let result;
    if (value === 'true') {
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  /**
   * Handler to the incoming `json-table-state-changed` event.
   * Sets the `table` property if it is different.
   *
   * @param {CustomEvent} e
   */
  _onJsonTableStateChanged(e) {
    if (e.composedPath()[0] === this) {
      return;
    }
    const { enabled } = e.detail;
    if (enabled !== this.table) {
      this.table = enabled;
    }
  }

  /**
   * Runs the debouncer to update examples list.
   */
  _computeExamples() {
    if (this._examplesDebouncer) {
      return;
    }
    this._examplesDebouncer = true;
    setTimeout(() => {
      this._examplesDebouncer = false;
      this.__computeExamples(this.examples, this.mediaType, this.rawOnly, this.typeName, this.payloadId, this.noAuto, this.renderReadOnly);
    });
  }

  /**
   * @param {object[]} examples
   * @param {string} mediaType
   * @param {boolean} rawOnly
   * @param {string} typeName
   * @param {string} payloadId
   * @param {boolean} noAuto
   * @param {boolean} renderReadOnly
   */
  __computeExamples(examples, mediaType, rawOnly, typeName, payloadId, noAuto, renderReadOnly) {
    this._renderedExamples = undefined;
    this.hasExamples = false;
    if (!examples || (!mediaType && !rawOnly)) {
      return;
    }
    const opts = {
      typeName,
      typeId: payloadId,
      noAuto,
      rawOnly,
      renderReadOnly,
    };
    const generator = new ExampleGenerator(this.amf);
    let result;
    if (Array.isArray(examples)) {
      if (this._hasType(examples[0], this.ns.aml.vocabularies.apiContract.Payload)) {
        result = generator.generatePayloadsExamples(examples, mediaType, opts);
      } else {
        for (let i = 0, len = examples.length; i < len; i++) {
          const item = generator.computeExamples(examples[i], mediaType, opts);
          if (item) {
            if (result) {
              result = result.concat(item);
            } else {
              result = item;
            }
          }
        }
      }
    } else if (this._hasType(examples, this.ns.aml.vocabularies.apiContract.Payload)) {
      result = generator.generatePayloadExamples(examples, mediaType, opts);
    } else {
      // try anything...
      result = generator.computeExamples(examples, mediaType, opts);
    }
    if (result && result.length) {
      this._renderedExamples = /** @type Example[] */ (result);
      this.hasExamples = true;
    }
  }

  /**
   * Computes value for `isJson` property
   * @param {string} type Current media type.
   * @return {boolean}
   */
  _computeIsJson(type) {
    return !!(type && type.indexOf('json') !== -1);
  }

  /**
   * Computes value for `_effectiveTable`.
   * @param {boolean} table Current state of table view for JSON.
   * @param {boolean} isJson [description]
   * @return {boolean} True when current media type is JSON and table is enabled.
   */
  _computeEffectiveTable(table, isJson) {
    return !!(isJson && table);
  }

  _tableCHangedHandler(e) {
    this.table = e.detail.value;
  }

  /**
   * Collapse the current example panel
   */
  _handleCollapsePanel() {
    const examplePanel = this.shadowRoot.querySelector('.renderer')
    const icon = this.shadowRoot.querySelector('.expand-icon')
    icon.classList.toggle('expand-icon-collapse')
    examplePanel.classList.toggle('collapse')

    this._collapseExamplePanel = !this._collapseExamplePanel
  }

  /**
   * @param {Example} example
   * @returns {TemplateResult|string} 
   */
  _titleTemplate(example) {
    const { compatibility } = this;

    if (example.isScalar) {
      return '';
    }
    const label = this._computeExampleTitle(example);
    return html`<div
      class="example-title"
      @click="${this._handleCollapsePanel}"
      @keyup="${this._handleCollapsePanel}"
      ?compatibility="${compatibility}"
    >
      <span>${label}</span>
      <anypoint-icon-button
        class="expand-icon-wrapper"
        data-action="collapse"
        title="Collapse panel"
      >
          <arc-icon class="expand-icon" icon="expandLess"></arc-icon> 
      </anypoint-icon-button>
    </div>`;
  }

  /**
   * @param {Example} example
   * @returns {string}
   */
  _computeExampleDescription(example) {
    const { description } = example
    return !description ? '' : description;
  }

  /**
   * @param {Example} example
   * @returns {TemplateResult|string}
   */
  _descriptionTemplate(example) {
    if (example.isScalar) {
      return '';
    }
    const description = this._computeExampleDescription(example)
    if (!description) {
      return '';
    }
    return html`<div class="example-description">${description}</div>`;
  }

  /**
   * Returns title to render for example
   * @param {Example} example 
   * @returns {String} 'Example' or the example's title
   */
  _computeExampleTitle(example) {
    if (!example.title || this._exampleTitleIsMediaType(example)) {
      return 'Example';
    }
    return example.title;
  }

  /**
   * Determines whether an example's title is just a variation
   * of the current media type + a number
   * @param {Example} example 
   * @returns {Boolean}
   */
  _exampleTitleIsMediaType(example) {
    const { mediaType } = this;
    const { title } = example;
    return Boolean(title.match(`^${mediaType}(\\d)+$`));
  }

  /**
   * @param {Example[]} examples
   * @returns {TemplateResult[]} 
   */
  _examplesTemplate(examples) {
    let parts = 'content-action-button, code-content-action-button, content-action-button-disabled, ';
    parts += 'code-content-action-button-disabled content-action-button-active, ';
    parts += 'code-content-action-button-active, code-wrapper, example-code-wrapper, markdown-html';
    return examples.map((item) => html`
    <div class="item-container">
      ${this._titleTemplate(item)}
      ${this._descriptionTemplate(item)}
      <div class="renderer" style="min-height: ${this.minHeight}">
        <api-example-render
          exportParts="${parts}"
          class="example"
          .example="${item}"
          .mediaType="${this.mediaType}"
          ?isJson="${this.isJson}"
          ?table="${this.table}"
          ?renderTable="${this._effectiveTable}"
          ?noActions="${this.noActions}"
          ?compatibility="${this.compatibility}"
          @table-changed="${this._tableCHangedHandler}"
        ></api-example-render>
      </div>
    </div>
      `);
  }

  render() {
    const examples = (this.renderedExamples || []);
    return html`<style>${this.styles}</style>
    ${examples.length ? this._examplesTemplate(examples) : ''}`;
  }
}
