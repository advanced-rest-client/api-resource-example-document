import { fixture, assert, nextFrame } from '@open-wc/testing';
import { tap } from '@polymer/iron-test-helpers/mock-interactions.js';
import sinon from 'sinon/pkg/sinon-esm.js';
import '@polymer/prism-element/prism-highlighter.js';
import '../api-example-render.js';

const highlighter = document.createElement('prism-highlighter');
document.body.appendChild(highlighter);

describe('<api-example-render>', () => {
  async function basicFixture() {
    return (await fixture(`<api-example-render></api-example-render>`));
  }

  async function jsonFixture() {
    return (await fixture(`<api-example-render media-type="application/json" isjson></api-example-render>`));
  }

  async function noActionsFixture() {
    return (await fixture(`
      <api-example-render media-type="application/json" isjson noactions></api-example-render>`));
  }

  describe('Basics', () => {
    let element;
    beforeEach(async () => {
      element = await jsonFixture();
      element.example = {
        value: ''
      };
      await nextFrame();
    });

    it('Calls highlight() when code change', (done) => {
      element.example = {
        value: 'test'
      };
      const spy = sinon.spy(element, 'highlight');
      setTimeout(() => {
        assert.isTrue(spy.called);
        done();
      });
    });
  });

  describe('highlight()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Dispatches syntax-highlight event', () => {
      const spy = sinon.spy();
      element.addEventListener('syntax-highlight', spy);
      element.highlight('{}', 'application/json');
      assert.isTrue(spy.called);
    });

    it('Event has "code" property', () => {
      const spy = sinon.spy();
      element.addEventListener('syntax-highlight', spy);
      element.highlight('{}', 'application/json');
      const e = spy.args[0][0];
      assert.typeOf(e.detail.code, 'string');
    });

    it('Event has "lang" property set to json', () => {
      const spy = sinon.spy();
      element.addEventListener('syntax-highlight', spy);
      element.highlight('{}', 'application/json');
      const e = spy.args[0][0];
      assert.equal(e.detail.lang, 'json');
    });

    it('Event has "lang" property set to xml', () => {
      const spy = sinon.spy();
      element.addEventListener('syntax-highlight', spy);
      element.highlight('{}', 'application/xml');
      const e = spy.args[0][0];
      assert.equal(e.detail.lang, 'xml');
    });

    it('Event has no "lang" property', () => {
      const spy = sinon.spy();
      element.addEventListener('syntax-highlight', spy);
      element.highlight('{}', 'application/other');
      const e = spy.args[0][0];
      assert.isUndefined(e.detail.lang);
    });

    it('Returns parsed code', () => {
      const result = element.highlight('{}', 'application/json');
      assert.equal(result, '<span class="token punctuation">{</span><span class="token punctuation">}</span>');
    });
  });

  function clearTableStorage() {
    localStorage.removeItem('jsonTableEnabled');
  }

  describe('_toggleTable()', () => {
    let element;
    beforeEach(async () => {
      clearTableStorage();
      element = await jsonFixture();
      element.example = {
        value: '{}',
        hasTitle: false
      };
      await nextFrame();
    });

    it('Toggles "table" property', () => {
      const button = element.shadowRoot.querySelector('[data-action="table"]');
      button.click();
      assert.isTrue(element.table);
    });

    it('Deactivates sourceOpened', () => {
      element.sourceOpened = true;
      const button = element.shadowRoot.querySelector('[data-action="table"]');
      button.click();
      assert.isFalse(element.sourceOpened);
    });
  });

  describe('_toggleSourceOpened()', () => {
    let element;
    beforeEach(async () => {
      clearTableStorage();
      element = await jsonFixture();
      element.example = {
        value: '{}',
        hasTitle: false,
        hasRaw: true,
        raw: 'test'
      };
      await nextFrame();
    });

    it('Toggles "sourceOpened" property', () => {
      const button = element.shadowRoot.querySelector('[data-action="code"]');
      button.click();
      assert.isTrue(element.sourceOpened);
    });

    it('Deactivates table', () => {
      element.table = true;
      const button = element.shadowRoot.querySelector('[data-action="code"]');
      button.click();
      assert.isFalse(element.table);
    });
  });

  describe('_selectUnion()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.example = {
        hasUnion: true,
        values: [{
          hasTitle: true,
          title: 'test-title',
          value: 'a'
        }, {
          hasTitle: true,
          title: 'other-title',
          value: 'b'
        }]
      };
      await nextFrame();
    });

    it('selectedUnion is 0', () => {
      assert.equal(element.selectedUnion, 0);
    });

    it('Sets event target as active when selecting current selection', async () => {
      await nextFrame();
      const nodes = element.shadowRoot.querySelectorAll('.union-type-selector .union-toggle');
      nodes[0].active = false;
      tap(nodes[0]);
      assert.isTrue(nodes[0].active);
    });

    it('Changes the selection', async () => {
      await nextFrame();
      const nodes = element.shadowRoot.querySelectorAll('.union-type-selector .union-toggle');
      tap(nodes[1]);
      assert.equal(element.selectedUnion, 1);
    });
  });

  describe('_copyToClipboard()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      await nextFrame();
    });

    it('Calls copy() in the `clipboard-copy` element', async () => {
      element.example = {
        value: '{}',
        hasTitle: false
      };
      await nextFrame();
      const copy = element.shadowRoot.querySelector('clipboard-copy');
      const spy = sinon.spy(copy, 'copy');
      const button = element.shadowRoot.querySelector('[data-action="copy"]');
      button.click();
      assert.isTrue(spy.called);
    });

    it('Changes the label', async () => {
      element.example = {
        value: '{}',
        hasTitle: false
      };
      await nextFrame();
      const button = element.shadowRoot.querySelector('[data-action="copy"]');
      button.click();
      assert.notEqual(button.innerText.trim().toLowerCase(), 'copy');
    });

    it('Disables the button', (done) => {
      element.example = {
        value: '{}',
        hasTitle: false
      };
      setTimeout(() => {
        const button = element.shadowRoot.querySelector('[data-action="copy"]');
        button.click();
        assert.isTrue(button.disabled);
        done();
      });
    });
  });

  describe('_resetCopyButtonState()', () => {
    let element;
    beforeEach(async () => {
      element = await jsonFixture();
      element.example = {
        value: '{}',
        hasTitle: false
      };
      await nextFrame();
    });

    it('Changes label back', (done) => {
      element.example = {
        value: '{}',
        hasTitle: false
      };
      setTimeout(() => {
        const button = element.shadowRoot.querySelector('[data-action="copy"]');
        button.innerText = 'test';
        element._resetCopyButtonState(button);
        assert.equal(button.innerText.trim().toLowerCase(), 'copy');
        done();
      });
    });

    it('Restores disabled state', (done) => {
      element.example = {
        value: '{}',
        hasTitle: false
      };
      setTimeout(() => {
        const button = element.shadowRoot.querySelector('[data-action="copy"]');
        button.click();
        button.disabled = true;
        element._resetCopyButtonState(button);
        assert.isFalse(button.disabled);
        done();
      });
    });
  });

  describe('_computeIsJson()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns false when isJson is false', () => {
      const result = element._computeIsJson(false, '{}');
      assert.isFalse(result);
    });

    it('Returns false when not no value', () => {
      const result = element._computeIsJson(true, '');
      assert.isFalse(result);
    });

    it('Returns false when invalid value', () => {
      const result = element._computeIsJson(true, '{"test"}');
      assert.isFalse(result);
    });

    it('Returns true when object', () => {
      const result = element._computeIsJson(true, '{"test": true}');
      assert.isTrue(result);
    });

    it('Returns true when array', () => {
      const result = element._computeIsJson(true, '[{"test": true}]');
      assert.isTrue(result);
    });
  });

  describe('_computeHasRaw()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns false when no raw value', () => {
      const result = element._computeHasRaw('a');
      assert.isFalse(result);
    });

    it('Returns false when values are the same', () => {
      const result = element._computeHasRaw('a', 'a');
      assert.isFalse(result);
    });

    it('Returns true when values are not the same', () => {
      const result = element._computeHasRaw('a', 'b');
      assert.isTrue(result);
    });
  });

  describe('Actions rendering', () => {
    it('Renders actions bar', async () => {
      const element = await jsonFixture();
      element.example = {
        value: ''
      };
      await nextFrame();
      const node = element.shadowRoot.querySelector('.example-actions');
      assert.ok(node);
    });

    it('Actions are not rendered when no-actions is set', async () => {
      const element = await noActionsFixture();
      element.example = {
        value: ''
      };
      await nextFrame();
      const node = element.shadowRoot.querySelector('.example-actions');
      assert.notOk(node);
    });
  });
});
