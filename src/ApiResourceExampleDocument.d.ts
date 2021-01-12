import { LitElement, TemplateResult, CSSResult } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import '@polymer/prism-element/prism-highlighter.js';
import '@advanced-rest-client/arc-icons/arc-icon.js';
import '../api-example-render.js';
import { Example } from '@advanced-rest-client/arc-types/src/forms/FormTypes';

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
 * @fires rendered-examples-changed
 * @fires has-examples-changed
 * @fires json-table-state-changed
 */
export class ApiResourceExampleDocument extends AmfHelperMixin(LitElement) {
  get styles(): CSSResult;

  /**
   * AMF model for examples.
   * It can be Payload shape, list of Payload shapes, or any shape.
   */
  examples: object[];
  /**
   * Examples media type
   * @attribute
   */
  mediaType: string;
  /**
   * Type (model) name for which examples are generated for.
   * This is used by RAML to XML examples processor to wrap the example
   * in type name. If missing this wrapping is omitted.
   * @attribute
   */
  typeName: string;
  /**
   * Rendered payload ID (if any) to associate examples with the payload.
   * @attribute
   */
  payloadId: string;
  /**
   * Computed in a debouncer examples to render.
   */
  _renderedExamples: Example[];
  /**
   * Computed value, true if there are examples to render.
   * This value is reflected to attribute so the element can be hidden
   * via CSS until examples are set.
   *
   * ```css
   * api-resource-example-document { display: none; }
   * api-resource-example-document[has-examples] { display: block; }
   * ```
   * @attribute
   */
  hasExamples: boolean;
  /**
   * If true it will display a table view instead of JSON code.
   * `isJson` must be set to use this option.
   * @attribute
   */
  table: boolean;
  /**
   * Computed value, true if selected media type is application/json
   * or equivalent.
   * @attribute
   */
  isJson: boolean;
  /**
   * Configuration passed to example generator.
   * When set the generator only returns examples that are defined in API
   * file, without auto generating examples from object properties.
   * @attribute
   */
  noAuto: boolean;
  /**
   * When set the actions row (copy, switch view type) is not rendered.
   * @attribute
   */
  noActions: boolean;
  /**
   * When set it only renders "raw" examples. To be used when media type context is unknown.
   * This can happen if RAML type document is rendered outside method documentation
   * (not in a request/response body when media type is known).
   *
   * Note, this can return JSON, XML, YAML or any other value
   * depending on original source.
   * @attribute
   */
  rawOnly: boolean;
  /**
   * Enables Anypoint compatibility styling
   * @attribute
   */
  compatibility: boolean;
  _effectiveTable: boolean;
  /**
   * True if current environment has localStorage support.
   * Chrome apps do not have localStorage property.
   */
  _hasLocalStorage: boolean;
  /**
   * If enabled then the example generator will be called with this option to add
   * read-only properties to the example
   * @attribute
   */
  renderReadOnly: boolean;

  _examplesDebouncer: boolean;

  get hasLocalStorage(): boolean;

  get renderedExamples(): Example[];

  constructor();

  connectedCallback(): void;

  disconnectedCallback(): void;

  _hasStorageSupport(): boolean;

  /**
   * When response's content type is JSON the view renders the
   * JSON table element. This function reads current state for the table
   * (if it is turned on) and handles view change if needed.
   */
  _ensureJsonTable(): void;

  /**
   * Updates "table" state in localStorage and dispatches
   * `json-table-state-changed` event.
   *
   * @param state Current "table" state.
   */
  _tableChanged(state: boolean): void;

  /**
   * Dispatches `json-table-state-changed` custom event.
   */
  _dispatchTableState(enabled: boolean): CustomEvent;

  /**
   * Updates the value of the `isJsonTable` property when the corresponding localStorage
   * property change.
   *
   * @param {StorageEvent} e Storage event
   */
  _onStorageChanged(e): void;

  /**
   * Reads the local value (always a string) as a boolean value.
   *
   * @param {string} value The value read from the local storage.
   * @return {boolean} Boolean value read from the value.
   */
  _localStorageValueToBoolean(value: string): boolean;

  /**
   * Handler to the incoming `json-table-state-changed` event.
   * Sets the `table` property if it is different.
   */
  _onJsonTableStateChanged(e: CustomEvent): void;

  /**
   * Runs the debouncer to update examples list.
   */
  _computeExamples(): void;

  __computeExamples(examples: object[], mediaType: string, rawOnly: boolean, typeName: string, payloadId: string, noAuto: boolean, renderReadOnly: boolean): void;

  /**
   * Computes value for `isJson` property
   * @param {string} type Current media type.
   * @return {boolean}
   */
  _computeIsJson(type: string): boolean;

  /**
   * Computes value for `_effectiveTable`.
   * @param {boolean} table Current state of table view for JSON.
   * @param {boolean} isJson [description]
   * @return {boolean} True when current media type is JSON and table is enabled.
   */
  _computeEffectiveTable(table: boolean, isJson: boolean): boolean;

  _tableCHangedHandler(e: Event): void;

  _titleTemplate(example: Example): TemplateResult|string;

  _examplesTemplate(examples: Example[]): TemplateResult[];

  render(): TemplateResult;
}
