# api-resource-example-document

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
