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
  padding: 0 10px 0 10px;
  background-color: var(--api-example-title-background-color, #ff9800);
  color: var(--api-example-title-color, #000);
  border-radius: 0 2px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.expand-icon {
  height: 25px;
  width: 25px;
  -moz-transform:none;
  -webkit-transform:none;
  -o-transform:none;
  -ms-transform:none;
  transform:none;
  -webkit-transition: transform 0.2s 0.2s ease;
  -moz-transition: transform 0.2s 0.2s ease;
  -o-transition: transform 0.2s 0.2s ease;
  transition: transform 0.2s 0.2s ease;
}

.expand-icon-wrapper {
  height: 30px;
  width: 30px;
}

.renderer {
  padding: 8px 0;
  display: flex;
  -webkit-transition: all 0.4s 0.1s ease-in-out;
  -moz-transition: all 0.4s 0.1s ease-in-out;
  -o-transition: all 0.4s 0.1s ease-in-out;
  transition: all 0.4s 0.1s ease-in-out;
}

.defaultMaxHeight {
  max-height: var(--api-resource-example-document-max-height, 500px);
}

.collapse {
  max-height: 0;
  margin: 0;
  overflow: hidden;
  padding: 0;
  -webkit-transition: all 0.4s 0.1s ease-in-out;
  -moz-transition: all 0.4s 0.1s ease-in-out;
  -o-transition: all 0.4s 0.1s ease-in-out;
  transition: all 0.4s 0.1s ease-in-out;
}

.expand-icon-collapse {
  -moz-transform: rotate(180deg);
  -webkit-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
  -webkit-transition: transform 0.2s 0.2s ease;
  -moz-transition: transform 0.2s 0.2s ease;
  -o-transition: transform 0.2s 0.2s ease;
  transition: transform 0.2s 0.2s ease;
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
