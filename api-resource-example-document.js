import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {afterNextRender} from '../../@polymer/polymer/lib/utils/render-status.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import {AmfHelperMixin} from '../../@api-components/amf-helper-mixin/amf-helper-mixin.js';
import '../../@polymer/prism-element/prism-highlighter.js';
import '../../@api-components/api-example-generator/api-example-generator.js';
import './api-example-render.js';
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
 * ## Styling
 *
 * `<api-resource-example-document>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-resource-example-document` | Mixin applied to this elment | `{}`
 * `--api-resource-example-document-title` | Mixin applied to example title | `{}`
 * `--api-resource-example-document-button-active-background-color` | Background color of active "tabble" button | `#e0e0e0`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 * @appliesMixin ApiElements.AmfHelperMixin
 */
class ApiResourceExampleDocument extends AmfHelperMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      @apply --api-resource-example-document;
    }

    .example:not(:last-of-type) {
      margin-bottom: 24px;
    }
    </style>
    <prism-highlighter></prism-highlighter>
    <api-example-generator amf-model="[[amfModel]]" id="exampleGenerator"></api-example-generator>
    <template is="dom-if" if="[[hasExamples]]">
      <template is="dom-repeat" items="[[renderedExamples]]">
        <api-example-render class="example" example="[[item]]" is-json="[[isJson]]" media-type="[[mediaType]]" table="{{table}}" render-table="[[_effectiveTable]]" no-actions="[[noActions]]"></api-example-render>
      </template>
    </template>`;
  }

  static get properties() {
    return {
      /**
       * AMF model for examples.
       * It can be Payload shape, list of Payload shapes, or any shape.
       */
      examples: Array,
      /**
       * Examples media type
       */
      mediaType: String,
      /**
       * Type (model) name for which examples are generated for.
       * This is used by RAML to XML examples processor to wrap the example
       * in type name. If missing this wrapping is omnited.
       */
      typeName: String,
      /**
       * Rendered payload ID (if any) to associate examples with the paylaod.
       */
      payloadId: String,
      /**
       * Computed in a debouncer examples to render.
       */
      renderedExamples: {
        type: Array,
        notify: true,
        readOnly: true
      },
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
      hasExamples: {
        type: Boolean,
        notify: true,
        reflectToAttribute: true,
        value: false,
        computed: '_computeHasArrayValue(renderedExamples)'
      },
      /**
       * If true it will display a table view instead of JSON code.
       * `isJson` must be set to use this option.
       */
      table: {
        type: Boolean,
        value: false,
        observer: '_tableChanged'
      },
      /**
       * Computed value, true if selected media type is application/json
       * or equivalent.
       */
      isJson: {
        type: Boolean,
        value: false,
        computed: '_computeIsJson(mediaType)'
      },
      /**
       * Configuration passed to example generator.
       * When set the generator only returns examples that are defined in API
       * file, without auto generating examples from object properties.
       */
      noAuto: Boolean,
      /**
       * When set the actions row (copy, switch view type) is not rendered.
       */
      noActions: {type: Boolean, value: false},
      /**
       * When set it only renders "raw" examples. To be used when media type context is unknown.
       * This can happen if RAML type document is rendered outside method documentation
       * (not in a request/response body when media type is known).
       *
       * Note, this can return JSON, XML, YAML or any other value
       * depending on original source.
       */
      rawOnly: Boolean,
      _effectiveTable: {
        type: Boolean,
        computed: '_computeEffectiveTable(table, isJson)'
      },
      /**
       * True if current environment has localStorage suppport.
       * Chrome apps do not have localStorage property.
       */
      hasLocalStorage: {
        type: Boolean,
        readOnly: true,
        value: function() {
          /* global chrome */
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
      }
    };
  }

  static get observers() {
    return ['_computeExamples(examples, mediaType, rawOnly, typeName, noAuto, payloadId)'];
  }

  constructor() {
    super();
    this._onStorageChanged = this._onStorageChanged.bind(this);
    this._onJsonTableStateChanged = this._onJsonTableStateChanged.bind(this);
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
   * Updates "table" state in localstorage and disaptches
   * `json-table-state-changed` event.
   *
   * @param {Boolean} state Current "table" state.
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
      window.localStorage.setItem('jsonTableEnabled', state);
      this._dispatchTableState(state);
    }
  }
  /**
   * Dispatches `json-table-state-changed` custom event.
   * @param {Boolean} enabled
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
   * @param {Event} e Storage event
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
   * @param {String} value The value read from the local storage.
   * @return {Boolean} Boolean value read from the value.
   */
  _localStorageValueToBoolean(value) {
    if (!value) {
      return false;
    }
    if (value === 'true') {
      value = true;
    } else {
      value = false;
    }
    return value;
  }
  /**
   * Handler to the incomming `json-table-state-changed` event.
   * Sets the `table` property if it is different.
   *
   * @param {CustomEvent} e
   */
  _onJsonTableStateChanged(e) {
    if (e.composedPath()[0] === this) {
      return;
    }
    const {enabled} = e.detail;
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
    afterNextRender(this, () => {
      this._examplesDebouncer = false;
      this.__computeExamples(this.examples, this.mediaType, this.rawOnly, this.typeName, this.payloadId, this.noAuto);
    });
  }

  __computeExamples(examples, mediaType, rawOnly, typeName, payloadId, noAuto) {
    this._setRenderedExamples(undefined);
    if (!examples || (!mediaType && !rawOnly)) {
      return;
    }
    const opts = {
      typeName,
        typeId: payloadId,
        noAuto,
        rawOnly
    };
    let result;
    if (examples instanceof Array) {
      if (this._hasType(examples[0], this.ns.raml.vocabularies.http + 'Payload')) {
        result = this.$.exampleGenerator.generatePayloadsExamples(examples, mediaType, opts);
      } else {
        for (let i = 0, len = examples.length; i < len; i++) {
          const item = this.$.exampleGenerator.computeExamples(examples[i], mediaType, opts);
          if (item) {
            if (result) {
              result = result.concat(item);
            } else {
              result = item;
            }
          }
        }
      }
    } else if (this._hasType(examples, this.ns.raml.vocabularies.http + 'Payload')) {
      result = this.$.exampleGenerator.generatePayloadExamples(examples, mediaType, opts);
    } else {
      // try anything...
      result = this.$.exampleGenerator.computeExamples(examples, mediaType, opts);
    }
    if (result && result.length) {
      this._setRenderedExamples(result);
    }
  }
  /**
   * Computes value for `isJson` property
   * @param {String} type Current media type.
   * @return {Boolean}
   */
  _computeIsJson(type) {
    return !!(type && type.indexOf('json') !== -1);
  }
  /**
   * Computes value for `_effectiveTable`.
   * @param {Boolean} table Current state of table view for JSON.
   * @param {Boolean} isJson [description]
   * @return {Boolean} True when current media type is JSON and table is enabled.
   */
  _computeEffectiveTable(table, isJson) {
    return !!(isJson && table);
  }
}
window.customElements.define('api-resource-example-document', ApiResourceExampleDocument);
