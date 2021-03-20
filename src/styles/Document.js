import { css } from 'lit-element';

export default css`
:host {
  display: block;
}

.example:not(:last-of-type) {
  margin-bottom: 24px;
}

.item-container {
  border-left: 3px var(--api-example-accent-color, #FF9800) solid;
  border-radius: 2px;
  background-color: var(--api-example-background-color, var(--code-background-color, #f5f7f9));
  margin: 20px 0;
}

.example-title {
  font-weight: var(--arc-font-body1-font-weight);
  line-height: var(--arc-font-body1-line-height);
  font-size: 1rem;
  display: var(--api-example-title-display, block);
  padding: 8px 12px;
  background-color: var(--api-example-title-background-color, #ff9800);
  color: var(--api-example-title-color, #000);
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;
}

.renderer {
  padding: 8px 0;
  display: flex;
}

.info-icon {
  margin: 0 12px;
  fill: var(--api-example-accent-color, #FF9800);
  width: 24px;
  height: 24px;
}

api-example-render {
  flex: 1;
  background-color: inherit;
  overflow: auto;
  max-width: 100%;
}
`;
