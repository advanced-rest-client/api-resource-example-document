import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {afterNextRender} from '../../@polymer/polymer/lib/utils/render-status.js';
import '../../@advanced-rest-client/clipboard-copy/clipboard-copy.js';
import '../../@advanced-rest-client/arc-icons/arc-icons.js';
import '../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../@advanced-rest-client/json-table/json-table.js';
import '../../@polymer/prism-element/prism-theme-default.js';
import '../../@polymer/paper-button/paper-button.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
/**
 * `api-example-render`
 *
 * Renders a JSON values using Prism highlighter or JSON table.
 *
 * ## Data model
 *
 * The model is generated by `api-example-generator`. Use it to generate
 * view model for examples for AMF shape.
 *
 * ### ExampleModel
 *
 * - **hasRaw** `Boolean` - if true then `raw` property has a value
 * - **hasTitle** `Boolean` - if true then `title` property has a value
 * - **hasUnion** `Boolean` - if true then `values` property has a value
 * - **value** `String`, Optional - Example to render
 * - **title** - `String`, Optional - Example name, only when `hasTitle` is set
 * - **raw** `String`, Optional - Raw value of RAML example. This value is a
 * YAML or JSON schema value. This is only set when raw value is available in
 * the model and it is not JSON/XML.
 * - **values** `Array<ExampleModel>`, Optional - Only when `hasUnion` is set.
 *
 * ## Example
 *
 * ```javascript
 * <api-example-render example="{...}" is-json mime-type="application/json"></api-example-render>
 * ```
 *
 * ## Styling
 *
 * `<api-resource-example-document>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-example-render` | Mixin applied to this elment | `{}`
 * `--code-block` | Mixin applied to the output block | `{}`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 */
class ApiExampleRender extends PolymerElement {
  static get template() {
    return html`
    <style include="prism-theme-default"></style>
    <style>
    :host {
      display: block;
      padding: 4px;
      background-color: var(--code-background-color, #f5f2f0);
      @apply --api-example-render;
    }

    .code-wrapper {
      padding: 8px;
    }

    #output {
      white-space: pre-wrap;
      @apply --code-block;
    }

    [hidden] {
      display: none !important;
    }

    h6 {
      @apply --arc-font-body1;
      font-size: 15px;
      margin: 0 0 4px 4px;
      @apply --api-resource-example-document-title;
    }

    paper-icon-button[active] {
      background-color: var(--api-resource-example-document-button-active-background-color, #e0e0e0);
      border-radius: 50%;
    }

    .union-toggle {
      outline: none;
      background-color: var(--api-type-document-union-button-background-color, transparent);
      color: var(--api-type-document-union-button-color, #000);
    }

    .union-toggle[active] {
      background-color: var(--api-type-document-union-button-active-background-color, #CDDC39);
      color: var(--api-type-document-union-button-active-color, #000);
    }

    .union-type-selector {
      margin: 12px 0;
    }
    </style>
    <template is="dom-if" if="[[isUnion]]" restamp="">
      <div class="union-type-selector">
        <span>Any of:</span>
        <template is="dom-repeat" data-union-repeater="" items="[[unions]]">
          <paper-button class="union-toggle" active="[[_unionTypeActive(selectedUnion, index)]]" on-click="_selectUnion" title\$="Select [[item]] type">[[item]]</paper-button>
        </template>
      </div>
      <template is="dom-if" if="[[unionExample]]">
        <api-example-render example="[[unionExample]]" is-json="[[isJson]]" media-type="[[mediaType]]" table="{{table}}" render-table="[[renderTable]]" no-title="" no-actions="[[noActions]]"></api-example-render>
      </template>
    </template>
    <template is="dom-if" if="[[!isUnion]]">
      <div class="example">
        <template is="dom-if" if="[[_computeRenderTitle(example.hasTitle, noTitle)]]">
          <h6>[[example.title]]</h6>
        </template>
        <template is="dom-if" if="[[!noActions]]">
          <div class="example-actions">
            <paper-icon-button icon="arc:content-copy" data-action="copy" on-click="_copyToClipboard" title="Copy example to clipboard"></paper-icon-button>
            <template is="dom-if" if="[[_isJson]]">
              <paper-icon-button icon="arc:view-column" data-action="table" active="[[table]]" title="Toggle table view" toggles="" on-click="_toggleTable"></paper-icon-button>
            </template>
            <template is="dom-if" if="[[_hasRaw]]">
              <paper-icon-button icon="arc:code" data-action="code" active="[[sourceOpened]]" title="Toggle example source view" toggles="" on-click="_toggleSourceOpened"></paper-icon-button>
            </template>
          </div>
        </template>
        <template is="dom-if" if="[[renderTable]]">
          <json-table json="[[example.value]]"></json-table>
        </template>
        <div class="code-wrapper" hidden="[[renderTable]]">
          <code id="output" class="markdown-html" language-xml=""></code>
        </div>
      </div>
    </template>
    <clipboard-copy content="[[example.value]]"></clipboard-copy>
`;
  }

  static get is() {
    return 'api-example-render';
  }
  static get properties() {
    return {
      /**
       * Data to render.
       */
      example: Object,
      /**
       * Examples media type
       */
      mediaType: String,
      /**
       * When true the example is a JSON type example.
       */
      isJson: Boolean,
      _isJson: {type: Boolean, value: false, computed: '_computeIsJson(isJson, example.value)'},
      /**
       * Computed value whether the examples are generated for a union type.
       */
      isUnion: {
        type: Boolean,
        computed: '_computeIsUnion(example)'
      },
      /**
       * List of union type names.
       * @type {Array<String>}
       */
      unions: {
        type: Array,
        computed: '_computeUnions(isUnion, example)',
        observer: '_unionTypesChanged'
      },
      /**
       * Index of selected union.
       */
      selectedUnion: Number,
      /**
       * Computed value of an example selected from union types.
       */
      unionExample: {
        type: Object,
        computed: '_computeUnionExamples(selectedUnion, example)'
      },
      /**
       * Current state of "table" button. When tru the button is highlighted.
       * Note, this won't trigger rendering table/code view as this property is used
       * by `api-resource-example-document` to handle table state change.
       */
      table: {
        type: Boolean,
        value: false,
        notify: true
      },
      /**
       * When set it renders JSON table instead of code view.
       */
      renderTable: Boolean,
      /**
       * Opens example source view (source from API spec file).
       */
      sourceOpened: Boolean,
      /**
       * When set the title won't be rendered event if the example has one.
       */
      noTitle: Boolean,
      _hasRaw: {type: Boolean, value: false, computed: '_computeHasRaw(example.value, example.raw)'},
      /**
       * When set the actions row (copy, switch view type) is not rendered.
       */
      noActions: {type: Boolean, value: false}
    };
  }

  static get observers() {
    return ['_dataChanged(mediaType, example, sourceOpened)'];
  }
  /**
   * Computes whether passed value is a valig JSON object, when component is
   * marked to parse JSON data.
   * @param {Boolean} isJson [description]
   * @param {String} value Current example value
   * @return {Boolean}
   */
  _computeIsJson(isJson, value) {
    if (!isJson) {
      return false;
    }
    if (!value) {
      return false;
    }
    try {
      const result = JSON.parse(value);
      return typeof result === 'object';
    } catch (_) {
      return false;
    }
  }

  _computeHasRaw(value, raw) {
    if (!raw) {
      return false;
    }
    return String(raw) !== String(value);
  }

  _dataChanged(mediaType, example) {
    if (this.__changeDebouncer || !example) {
      return;
    }
    this.__changeDebouncer = true;
    afterNextRender(this, () => {
      this.__changeDebouncer = false;
      this._renderCode();
    });
  }

  _renderCode() {
    const example = this.example;
    if (!example || (!example.value && example.values)) {
      return;
    }
    const output = this.shadowRoot.querySelector('#output');
    if (!output) {
      afterNextRender(this, () => this._renderCode());
      return;
    }
    if (this.sourceOpened) {
      output.innerHTML = this.highlight(String(example.raw), 'yaml');
    } else {
      const value = String(example.value);
      if (value) {
        output.innerHTML = this.highlight(value, this.mediaType);
      } else {
        output.innerText = '(no value in example)';
      }
    }
  }
  /**
   * Dispatches `syntax-highlight` custom event
   * @param {String} code Code to highlight
   * @param {String} type Mime type of the code
   * @return {String} Highlighted code.
   */
  highlight(code, type) {
    let lang;
    if (type) {
      if (type.indexOf('json') !== -1) {
        lang = 'json';
      } else if (type.indexOf('xml') !== -1) {
        lang = 'xml';
      }
    }
    const ev = new CustomEvent('syntax-highlight', {
      bubbles: true,
      composed: true,
      detail: {
        code,
        lang
      }
    });
    this.dispatchEvent(ev);
    return ev.detail.code;
  }
  /**
   * Coppies current response text value to clipboard.
   *
   * @param {Event} e
   */
  _copyToClipboard(e) {
    const button = e.target;
    const copy = this.shadowRoot.querySelector('clipboard-copy');
    if (copy.copy()) {
      button.icon = 'arc:done';
    } else {
      button.icon = 'arc:error';
    }
    setTimeout(() => this._resetCopyButtonState(button), 1000);
  }
  /**
   * Resets button icon.
   * @param {Element} button Button to reset.
   */
  _resetCopyButtonState(button) {
    button.icon = 'arc:content-copy';
  }

  _computeIsUnion(example) {
    return !!(example && example.hasUnion);
  }

  _computeUnions(isUnion, example) {
    if (!isUnion || !example || !example.values) {
      return;
    }
    return example.values.map((item) => item.title);
  }

  _computeUnionExamples(selectedUnion, example) {
    if (selectedUnion === undefined || selectedUnion < 0) {
      return;
    }
    if (!example || !example.values) {
      return;
    }
    return example.values[selectedUnion];
  }

  _toggleTable(e) {
    const active = e.target.active;
    this.table = active;
    if (active && this.sourceOpened) {
      this.sourceOpened = !active;
    }
  }

  _toggleSourceOpened(e) {
    const active = e.target.active;
    this.sourceOpened = active;
    if (active && this.table) {
      this.table = !active;
    }
  }
  /**
   * Resets union selection when union types list changes.
   *
   * @param {?Array} types List of current union types.
   */
  _unionTypesChanged(types) {
    if (!types) {
      return;
    }
    this.selectedUnion = 0;
  }
  /**
   * Handler for union type button click.
   * Sets `selectedUnion` property.
   *
   * @param {ClickEvent} e
   */
  _selectUnion(e) {
    const index = e.model.get('index');
    if (this.selectedUnion === index) {
      e.target.active = true;
    } else {
      this.selectedUnion = index;
    }
  }
  /**
   * Computes if selectedUnion equals current item index.
   *
   * @param {Number} selectedUnion
   * @param {Number} index
   * @return {Boolean}
   */
  _unionTypeActive(selectedUnion, index) {
    return selectedUnion === index;
  }

  _computeRenderTitle(hasTitle, noTitle) {
    return !!(hasTitle && !noTitle);
  }
}
window.customElements.define(ApiExampleRender.is, ApiExampleRender);