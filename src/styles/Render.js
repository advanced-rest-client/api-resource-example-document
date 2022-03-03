import { css } from 'lit-element';

export default css`
:host {
  display: block;
  background-color: inherit;
}

.code-wrapper {
  padding: 0px;
}

[hidden] {
  display: none !important;
}

.union-toggle {
  outline: none;
  background-color: var(--api-type-document-union-button-background-color, transparent);
  color: var(--api-type-document-union-button-color, #000);
  border-width: 1px;
  border-color: var(--api-body-document-media-button-border-color, #a3b11d);
  border-style: solid;
}

.union-toggle[activated] {
  background-color: var(--api-type-document-union-button-active-background-color, #CDDC39);
  color: var(--api-type-document-union-button-active-color, #000);
}

.action-button[active] {
  background-color: var(--api-resource-example-document-button-active-background-color, #CDDC39);
  color: var(--api-resource-example-document-button-active-color, currentColor);
  text-decoration: var(--api-resource-example-document-button-active-text-decoration);
  text-underline-offset: var(--api-resource-example-document-button-active-text-underline-offset);
}

.union-toggle[focused],
.action-button[active][focused] {
  outline: var(--api-resource-example-document-button-active-outline, auto);
  text-decoration: var(--api-resource-example-document-button-active-text-decoration);
  text-underline-offset: var(--api-resource-example-document-button-active-text-underline-offset);
}

.union-type-selector {
  margin: 0px 8px 12px 0px;
}

.code-wrapper.scalar {
  padding-top: 1px;
}

.example-actions {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
  flex-wrap: wrap;
  flex: 1;
}

anypoint-button {
  margin-bottom: 8px;
  height: 28px;
  color: var(--api-resource-example-document-button-color);
  font-size: var(--api-resource-example-document-button-font-size);
  font-weight: var(--api-resource-example-document-button-font-weight);
}

api-example-render {
  background-color: inherit;
}

json-table,
api-example-render {
  overflow: auto;
  max-width: 100%;
}
`;
