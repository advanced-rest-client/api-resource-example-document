/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/tools/tree/master/packages/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   api-example-render.html
 */


// tslint:disable:variable-name Describing an API that's defined elsewhere.
// tslint:disable:no-any describes the API as best we are able today

/// <reference path="../polymer/types/polymer-element.d.ts" />
/// <reference path="../polymer/types/lib/utils/render-status.d.ts" />
/// <reference path="../clipboard-copy/clipboard-copy.d.ts" />
/// <reference path="../arc-icons/arc-icons.d.ts" />
/// <reference path="../paper-icon-button/paper-icon-button.d.ts" />
/// <reference path="../json-table/json-table.d.ts" />
/// <reference path="../prism-element/prism-theme-default.d.ts" />
/// <reference path="../paper-button/paper-button.d.ts" />

declare namespace ApiElements {

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
   */
  class ApiExampleRender extends Polymer.Element {

    /**
     * Data to render.
     */
    example: object|null|undefined;

    /**
     * Examples media type
     */
    mediaType: string|null|undefined;

    /**
     * When true the example is a JSON type example.
     */
    isJson: boolean|null|undefined;

    /**
     * Computed value whether the examples are generated for a union type.
     */
    readonly isUnion: boolean|null|undefined;

    /**
     * List of union type names.
     */
    readonly unions: Array<String|null>|null;

    /**
     * Index of selected union.
     */
    selectedUnion: number|null|undefined;

    /**
     * Computed value of an example selected from union types.
     */
    readonly unionExample: object|null|undefined;

    /**
     * Current state of "table" button. When tru the button is highlighted.
     * Note, this won't trigger rendering table/code view as this property is used
     * by `api-resource-example-document` to handle table state change.
     */
    table: boolean|null|undefined;

    /**
     * When set it renders JSON table instead of code view.
     */
    renderTable: boolean|null|undefined;

    /**
     * Opens example source view (source from API spec file).
     */
    sourceOpened: boolean|null|undefined;

    /**
     * When set the title won't be rendered event if the example has one.
     */
    noTitle: boolean|null|undefined;
    _dataChanged(mediaType: any, example: any): void;
    _renderCode(): void;

    /**
     * Dispatches `syntax-highlight` custom event
     *
     * @param code Code to highlight
     * @param type Mime type of the code
     * @returns Highlighted code.
     */
    highlight(code: String|null, type: String|null): String|null;

    /**
     * Coppies current response text value to clipboard.
     */
    _copyToClipboard(e: Event|null): void;

    /**
     * Resets button icon.
     *
     * @param button Button to reset.
     */
    _resetCopyButtonState(button: Element|null): void;
    _computeIsUnion(example: any): any;
    _computeUnions(isUnion: any, example: any): any;
    _computeUnionExamples(selectedUnion: any, example: any): any;
    _toggleTable(e: any): void;
    _toggleSourceOpened(e: any): void;

    /**
     * Resets union selection when union types list changes.
     *
     * @param types List of current union types.
     */
    _unionTypesChanged(types: any[]|null): void;

    /**
     * Handler for union type button click.
     * Sets `selectedUnion` property.
     */
    _selectUnion(e: ClickEvent|null): void;

    /**
     * Computes if selectedUnion equals current item index.
     */
    _unionTypeActive(selectedUnion: Number|null, index: Number|null): Boolean|null;
    _computeRenderTitle(hasTitle: any, noTitle: any): any;
  }
}

interface HTMLElementTagNameMap {
  "api-example-render": ApiElements.ApiExampleRender;
}
