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
  min-height: 36px;
  padding: 0 10px 0px 10px;
  background-color: var(--api-example-title-background-color, #ff9800);
  color: var(--api-example-title-color, #000);
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.expand-icon {
  height: 30px;
  width: 30px;
}

.renderer {
  padding: 8px 0;
  display: flex;
  height: 100%;
  transition: 200ms all 200ms;
}

.info-icon {
  margin: 0 12px;
  fill: var(--api-example-accent-color, #FF9800);
  width: 24px;
  height: 24px;
}

.close {
  height: 0%;
  margin: 0;
  padding: 0;
  transition: 200ms all 200ms;
}

api-example-render {
  flex: 1;
  background-color: inherit;
  overflow: auto;
  max-width: 100%;
}
  
.example-description {
  padding: 10px 12px;
}
`;
