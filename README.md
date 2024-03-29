# DEPRECATED

This component is being deprecated. The code base has been moved to [api-documentation](https://github.com/advanced-rest-client/api-documentation) module. This module will be archived when [PR 37](https://github.com/advanced-rest-client/api-documentation/pull/37) is merged.

-----

[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-resource-example-document.svg)](https://www.npmjs.com/package/@api-components/api-resource-example-document)

[![Tests and publishing](https://github.com/advanced-rest-client/api-resource-example-document/actions/workflows/deployment.yml/badge.svg)](https://github.com/advanced-rest-client/api-resource-example-document/actions/workflows/deployment.yml)

A viewer for examples in a resource based on AMF model

```html
<api-resource-example-document examples='[{"http://schema.org/name":[{"@value":"Example1"}],"http://raml.org/vocabularies/document#value":[{"@value":"{{\n    \"value\":true}"}]}]'></api-resource-example-document>
```

## Version compatibility

This version only works with AMF model version 2 (AMF parser >= 4.0.0).
For compatibility with previous model version use `3.x.x` version of the component.

## Usage

### Installation

```sh
npm install --save @api-components/api-resource-example-document
```

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@api-components/api-resource-example-document/api-resource-example-document.js';
    </script>
  </head>
  <body>
    <api-resource-example-document amf-model="..."></api-resource-example-document>
  </body>
</html>
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@api-components/api-resource-example-document/api-resource-example-document.js';

class SampleElement extends LitElement {
  render() {
    return html`
    <api-resource-example-document
      .amf="${this.model}"
      .examples="${this.examples}"
      .mediaType="${this.examplesMediaType}"></api-resource-example-document>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

## Development

```sh
git clone https://github.com/advanced-rest-client/api-resource-example-document
cd api-resource-example-document
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```

### Properties
| Name               | Type      | Required | Default | Comment                                                                                                                                                                                                                                                                         |
|--------------------|-----------|----------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| examples           | object[]  | yes      | -       | AMF model for examples. It can be Payload shape, list of Payload shapes, or any shape.                                                                                                                                                                                          |
| mediaType          | string    | yes      | -       | Examples media type                                                                                                                                                                                                                                                             |
| typeName           | string    | no       | -       | Type (model) name for which examples are generated for. This is used by RAML to XML examples processor to wrap the example in type name. If missing this wrapping is omitted.                                                                                                   |
| payloadId          | string    | no       | -       | Rendered payload ID (if any) to associate examples with the payload.                                                                                                                                                                                                            |
| _renderedExamples  | Example[] | no       | -       | Computed in a debouncer examples to render.                                                                                                                                                                                                                                     |
| hasExamples        | boolean   | no       | false   | Computed value, true if there are examples to render. This value is reflected to attribute so the element can be hidden via CSS until examples are set. ```api-resource-example-document { display: none; } api-resource-example-document[has-examples] { display: block; } ``` |
| table              | boolean   | no       | -       | If true it will display a table view instead of JSON code. `isJson` must be set to use this option.                                                                                                                                                                             |
| isJson             | boolean   | no       | false   | Computed value, true if selected media type is application/json or equivalent.                                                                                                                                                                                                  |
| noAuto             | boolean   | no       | -       | Configuration passed to example generator. When set the generator only returns examples that are defined in API file, without auto generating examples from object properties.                                                                                                  |
| noActions          | boolean   | no       | false   | When set the actions row (copy, switch view type) is not rendered.                                                                                                                                                                                                              |
| rawOnly            | boolean   | no       | -       | When set it only renders "raw" examples. To be used when media type context is unknown. This can happen if RAML type document is rendered outside method documentation (not in a request/response body when media type is known).                                               |
| compatibility      | boolean   | no       | false   | Enables Anypoint compatibility styling                                                                                                                                                                                                                                          |
| _effectiveTable    | boolean   | no       | -       |                                                                                                                                                                                                                                                                                 |
| _hasLocalStorage   | boolean   | no       | -       | True if current environment has localStorage support. Chrome apps do not have localStorage property.                                                                                                                                                                            |
| _renderReadOnly    | boolean   | no       | false   | If enabled then the example generator will be called with this option to add read-only properties to the example                                                                                                                                                                |
| _examplesDebouncer | boolean   | no       | -       |                                                                                                                                                                                                                                                                                 |




