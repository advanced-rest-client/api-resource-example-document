import { fixture, assert, nextFrame, aTimeout, html } from '@open-wc/testing';
import sinon from 'sinon';
import '@polymer/prism-element/prism-highlighter.js';
import { SafeHtmlUtils } from '../src/ApiExampleRender.js';
import '../api-example-render.js';

/** @typedef {import('..').ApiExampleRender} ApiExampleRender */

const highlighter = document.createElement('prism-highlighter');
document.body.appendChild(highlighter);

describe('ApiExampleRender', () => {
  /**
   * @returns {Promise<ApiExampleRender>}
   */
  async function basicFixture() {
    return (fixture(html`<api-example-render></api-example-render>`));
  }

  /**
   * @returns {Promise<ApiExampleRender>}
   */
  async function jsonFixture() {
    return (fixture(html`<api-example-render media-type="application/json" isJson></api-example-render>`));
  }

  /**
   * @returns {Promise<ApiExampleRender>}
   */
  async function noActionsFixture() {
    return (fixture(html`
      <api-example-render media-type="application/json" isJson noActions></api-example-render>`));
  }

  describe('Basics', () => {
    let element = /** @type ApiExampleRender */ (null);
    beforeEach(async () => {
      element = await jsonFixture();
      element.example = {
        value: '',
        hasRaw: false,
        hasTitle: false,
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
    });

    it('Calls highlight() when code change', async () => {
      const spy = sinon.spy(element, 'highlight');
      element.example = {
        value: 'test',
        hasRaw: false,
        hasTitle: false,
        hasUnion: false,
        isScalar: false,
      };
      await aTimeout(10);
      assert.isTrue(spy.called);
    });
  });

  describe('View rendering', () => {
    let element = /** @type ApiExampleRender */ (null);

    it('Renders actions', async () => {
      element = await basicFixture();
      element.example = {
        value: '{}',
        hasTitle: true,
        hasRaw: false,
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
      const node = element.shadowRoot.querySelector('.example-actions');
      assert.ok(node);
    });

    it('Renders JSON toggle button', async () => {
      element = await jsonFixture();
      element.example = {
        value: '{}',
        hasTitle: true,
        hasRaw: false,
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
      const node = element.shadowRoot.querySelector('[data-action="table"]');
      assert.ok(node);
    });

    it('Renders code toggle view', async () => {
      element = await jsonFixture();
      element.example = {
        value: '{}',
        hasTitle: true,
        hasRaw: true,
        raw: 'test',
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
      const node = element.shadowRoot.querySelector('[data-action="code"]');
      assert.ok(node);
    });

    it('does not render action buttons when is scalar type', async () => {
      element = await basicFixture();
      element.example = {
        value: '{}',
        hasTitle: true,
        hasRaw: true,
        raw: 'test',
        isScalar: true,
        hasUnion: false,
      };
      await nextFrame();
      const node = element.shadowRoot.querySelector('.example-actions');
      assert.notOk(node);
    });
  });

  describe('highlight()', () => {
    let element = /** @type ApiExampleRender */ (null);
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
    let element = /** @type ApiExampleRender */ (null);
    beforeEach(async () => {
      clearTableStorage();
      element = await jsonFixture();
      element.example = {
        value: '{}',
        hasTitle: false,
        hasRaw: false,
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
    });

    it('Toggles "table" property', () => {
      const button = element.shadowRoot.querySelector('[data-action="table"]');
      /** @type HTMLElement */ (button).click();
      assert.isTrue(element.table);
    });

    it('Deactivates sourceOpened', () => {
      element.sourceOpened = true;
      const button = element.shadowRoot.querySelector('[data-action="table"]');
      /** @type HTMLElement */ (button).click();
      assert.isFalse(element.sourceOpened);
    });
  });

  describe('_toggleSourceOpened()', () => {
    let element = /** @type ApiExampleRender */ (null);
    beforeEach(async () => {
      clearTableStorage();
      element = await jsonFixture();
      element.example = {
        value: '{}',
        hasTitle: false,
        hasRaw: true,
        raw: 'test',
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
    });

    it('Toggles "sourceOpened" property', () => {
      const button = element.shadowRoot.querySelector('[data-action="code"]');
      /** @type HTMLElement */ (button).click();
      assert.isTrue(element.sourceOpened);
    });

    it('Deactivates table', () => {
      element.table = true;
      const button = element.shadowRoot.querySelector('[data-action="code"]');
      /** @type HTMLElement */ (button).click();
      assert.isFalse(element.table);
    });
  });

  describe('_selectUnion()', () => {
    let element = /** @type ApiExampleRender */ (null);
    beforeEach(async () => {
      element = await basicFixture();
      element.example = {
        hasUnion: true,
        hasRaw: false,
        hasTitle: false,
        isScalar: false,
        values: [{
          hasTitle: true,
          title: 'test-title',
          value: 'a',
          hasRaw: false,
          hasUnion: false,
          isScalar: false,
        }, {
          hasTitle: true,
          title: 'other-title',
          value: 'b',
          hasRaw: false,
          hasUnion: false,
          isScalar: false,
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
      // @ts-ignore
      nodes[0].active = false;
      /** @type HTMLElement */ (nodes[0]).click();
      await nextFrame();
      assert.isTrue(nodes[0].hasAttribute('activated'));
    });

    it('Changes the selection', async () => {
      await nextFrame();
      const nodes = element.shadowRoot.querySelectorAll('.union-type-selector .union-toggle');
      /** @type HTMLElement */ (nodes[1]).click();
      assert.equal(element.selectedUnion, 1);
    });

    it('Ignores not numeric indexes', async () => {
      await nextFrame();
      const nodes = element.shadowRoot.querySelectorAll('.union-type-selector .union-toggle');
      // @ts-ignore
      nodes[1].dataset.index = 'test';
      /** @type HTMLElement */ (nodes[1]).click();
      assert.equal(element.selectedUnion, 0);
    });
  });

  const hasPartsApi = 'part' in document.createElement('span');

  describe('_copyToClipboard()', () => {
    let element = /** @type ApiExampleRender */ (null);
    beforeEach(async () => {
      element = await basicFixture();
      await nextFrame();
    });

    it('Calls copy() in the `clipboard-copy` element', async () => {
      element.example = {
        value: '{}',
        hasTitle: false,
        hasRaw: false,
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
      const copy = element.shadowRoot.querySelector('clipboard-copy');
      const spy = sinon.spy(copy, 'copy');
      const button = element.shadowRoot.querySelector('[data-action="copy"]');
      /** @type HTMLElement */ (button).click();
      assert.isTrue(spy.called);
    });

    it('Changes the label', async () => {
      element.example = {
        value: '{}',
        hasTitle: false,
        hasRaw: false,
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
      const button = /** @type HTMLElement */ (element.shadowRoot.querySelector('[data-action="copy"]'));
      /** @type HTMLElement */ (button).click();
      assert.notEqual(button.innerText.trim().toLowerCase(), 'copy');
    });

    it('Disables the button', (done) => {
      element.example = {
        value: '{}',
        hasTitle: false,
        hasRaw: false,
        hasUnion: false,
        isScalar: false,
      };
      setTimeout(() => {
        const button = /** @type HTMLButtonElement */ (element.shadowRoot.querySelector('[data-action="copy"]'));
        button.click();
        assert.isTrue(button.disabled);
        done();
      });
    });

    (hasPartsApi ? it : it.skip)('Adds content-action-button-disabled to the button', async () => {
      element.example = {
        value: '{}',
        hasTitle: false,
        hasRaw: false,
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
      const button = /** @type HTMLElement */ (element.shadowRoot.querySelector('[data-action="copy"]'));
      button.click();
      // @ts-ignore
      assert.isTrue(button.part.contains('content-action-button-disabled'));
    });

    (hasPartsApi ? it : it.skip)('Adds code-content-action-button-disabled to the button', async () => {
      element.example = {
        value: '{}',
        hasTitle: false,
        hasRaw: false,
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
      const button = element.shadowRoot.querySelector('[data-action="copy"]');
      /** @type HTMLElement */ (button).click();
      // @ts-ignore
      assert.isTrue(button.part.contains('code-content-action-button-disabled'));
    });
  });

  describe('_resetCopyButtonState()', () => {
    let element = /** @type ApiExampleRender */ (null);
    beforeEach(async () => {
      element = await jsonFixture();
      element.example = {
        value: '{}',
        hasTitle: false,
        hasRaw: false,
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
    });

    it('Changes label back', (done) => {
      element.example = {
        value: '{}',
        hasTitle: false,
        hasRaw: false,
        hasUnion: false,
        isScalar: false,
      };
      setTimeout(() => {
        const button = /** @type HTMLButtonElement */ (element.shadowRoot.querySelector('[data-action="copy"]'));
        button.innerText = 'test';
        element._resetCopyButtonState(button);
        assert.equal(button.innerText.trim().toLowerCase(), 'copy');
        done();
      });
    });

    it('Restores disabled state', (done) => {
      element.example = {
        value: '{}',
        hasTitle: false,
        hasRaw: false,
        hasUnion: false,
        isScalar: false,
      };
      setTimeout(() => {
        const button = /** @type HTMLButtonElement */ (element.shadowRoot.querySelector('[data-action="copy"]'));
        button.click();
        button.disabled = true;
        element._resetCopyButtonState(button);
        assert.isFalse(button.disabled);
        done();
      });
    });

    (hasPartsApi ? it : it.skip)('Removes content-action-button-disabled part from the button', async () => {
      element.example = {
        value: '{}',
        hasTitle: false,
        hasRaw: false,
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
      const button = /** @type HTMLButtonElement */ (element.shadowRoot.querySelector('[data-action="copy"]'));
      button.click();
      element._resetCopyButtonState(button);
      // @ts-ignore
      assert.isFalse(button.part.contains('content-action-button-disabled'));
    });

    (hasPartsApi ? it : it.skip)('Removes code-content-action-button-disabled part from the button', async () => {
      element.example = {
        value: '{}',
        hasTitle: false,
        hasRaw: false,
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
      const button = /** @type HTMLButtonElement */ (element.shadowRoot.querySelector('[data-action="copy"]'));
      button.click();
      element._resetCopyButtonState(button);
      // @ts-ignore
      assert.isFalse(button.part.contains('code-content-action-button-disabled'));
    });
  });

  describe('_computeIsJson()', () => {
    let element = /** @type ApiExampleRender */ (null);
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
    let element = /** @type ApiExampleRender */ (null);
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
        value: '',
        hasRaw: false,
        hasTitle: false,
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
      const node = element.shadowRoot.querySelector('.example-actions');
      assert.ok(node);
    });

    it('Actions are not rendered when no-actions is set', async () => {
      const element = await noActionsFixture();
      element.example = {
        value: '',
        hasRaw: false,
        hasTitle: false,
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
      const node = element.shadowRoot.querySelector('.example-actions');
      assert.notOk(node);
    });
  });

  describe('_renderUnion()', () => {
    let element = /** @type ApiExampleRender */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('returns empty string when no value', () => {
      // @ts-ignore
      const result = element._renderUnion({});
      assert.strictEqual(result, '');
    });

    it('Returns value for unions', () => {
      const result = element._renderUnion({
        hasRaw: false,
        hasTitle: false,
        hasUnion: false,
        isScalar: false,
        values: [{
          hasTitle: true,
          title: 'test-title',
          value: 'a',
          hasRaw: false,
          hasUnion: false,
          isScalar: false,
        }, {
          hasTitle: true,
          title: 'other-title',
          value: 'b',
          hasRaw: false,
          hasUnion: false,
          isScalar: false,
        }]
      });
      assert.typeOf(result, 'object');
    });

    it('Has no api-example-render when no union selected', () => {
      const result = element._renderUnion({
        hasRaw: false,
        hasTitle: false,
        hasUnion: false,
        isScalar: false,
        values: [{
          hasTitle: true,
          title: 'test-title',
          value: 'a',
          hasRaw: false,
          hasUnion: false,
          isScalar: false,
        }]
      });
      // @ts-ignore
      assert.notOk(result.values[1]);
    });

    it('Has api-example-render when union selected', () => {
      element.selectedUnion = 0;
      const result = element._renderUnion({
        hasRaw: false,
        hasTitle: false,
        hasUnion: false,
        isScalar: false,
        values: [{
          hasTitle: true,
          title: 'test-title',
          value: 'a',
          hasRaw: false,
          hasUnion: false,
          isScalar: false,
        }]
      });
      // @ts-ignore
      const tplHtml = result.values[1].getHTML();
      assert.notEqual(tplHtml.indexOf('api-example-render'), -1);
    });
  });

  describe('_computeUnionExamples()', () => {
    let element = /** @type ApiExampleRender */ (null);
    let example;
    beforeEach(async () => {
      element = await basicFixture();
      example = {
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
    });

    it('Returns undefined when no selectedUnion argument', () => {
      const result = element._computeUnionExamples(undefined, example);
      assert.isUndefined(result);
    });

    it('Returns undefined when no example argument', () => {
      const result = element._computeUnionExamples(0, undefined);
      assert.isUndefined(result);
    });

    it('Returns undefined when no values in example', () => {
      delete example.values;
      const result = element._computeUnionExamples(0, example);
      assert.isUndefined(result);
    });

    it('Returns selected value', () => {
      const result = element._computeUnionExamples(0, example);
      assert.deepEqual(result, example.values[0]);
    });
  });

  (hasPartsApi ? describe : describe.skip)('_toggleActionButtonCssPart()', () => {
    let element = /** @type ApiExampleRender */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Adds a part to the target', async () => {
      const target = document.createElement('span');
      element._toggleActionButtonCssPart(target, true);
      // @ts-ignore
      assert.isTrue(target.part.contains('content-action-button-active'), 'Has content-action-button-active part');
      // @ts-ignore
      assert.isTrue(target.part.contains('code-content-action-button-active'),
      'Has code-content-action-button-active part');
    });
    
    it('Removes a part from the target', async () => {
      const target = document.createElement('span');
      // @ts-ignore
      target.part = 'content-action-button-active, code-content-action-button-active';
      element._toggleActionButtonCssPart(target, false);
      // @ts-ignore
      assert.isFalse(target.part.contains('content-action-button-active'), 'Has no content-action-button-active part');
      // @ts-ignore
      assert.isFalse(target.part.contains('code-content-action-button-active'),
        'Has no code-content-action-button-active part');
    });
  });

  describe('SafeHtmlUtils', () => {
    describe('htmlEscape()', () => {
      it('returns the same input when no string', () => {
        const result = SafeHtmlUtils.htmlEscape(22);
        // @ts-ignore
        assert.equal(result, 22);
      });

      it('replaces "&" characters', () => {
        const result = SafeHtmlUtils.htmlEscape('&a&');
        assert.equal(result, '&amp;a&amp;');
      });

      it('replaces "<" characters', () => {
        const result = SafeHtmlUtils.htmlEscape('<a<');
        assert.equal(result, '&lt;a&lt;');
      });

      it('replaces ">" characters', () => {
        const result = SafeHtmlUtils.htmlEscape('>a>');
        assert.equal(result, '&gt;a&gt;');
      });

      it('replaces quote characters', () => {
        const result = SafeHtmlUtils.htmlEscape('"a"');
        assert.equal(result, '&quot;a&quot;');
      });

      it('replaces single quote characters', () => {
        const result = SafeHtmlUtils.htmlEscape("'a'");
        assert.equal(result, '&#39;a&#39;');
      });
    });
  });

  describe('Huge example rendering', () => {
    let element = /** @type ApiExampleRender */ (null);
    let out;
    beforeEach(async () => {
      element = await basicFixture();
      await nextFrame();
    });

    function getString(size=10001) {
      let result = '<element>&"\'';
      for (let i = 0; i < size; i++) {
        result += 'a';
      }
      result += '</result>';
      return result;
    }

    it('renders sanitized code', async () => {
      element.example = {
        value: getString(),
        hasTitle: true,
        hasRaw: false,
        title: 'test',
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
      out = element.shadowRoot.querySelector('#output');
      const result = out.innerHTML;
      // even though the " and ' characters are replaced when reading them back
      // from the output element they are converted to " and '
      assert.equal(result.substr(0, 20), '&lt;element&gt;&amp;');
    });
  });

  describe('a11y', () => {
    let element = /** @type ApiExampleRender */ (null);
    beforeEach(async () => {
      element = await basicFixture();
      element.example = {
        value: '{}',
        hasTitle: true,
        hasRaw: false,
        title: 'test',
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
    });

    it('passes accessibility test', async () => {
      await assert.isAccessible(element, {
        ignoredRules: ['color-contrast']
      });
    });
  });

  describe('_renderExample()', () => {
    let element = /** @type ApiExampleRender */ (null);
    let nodes;

    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets json table example', async () => {
      element.isJson = true;
      element.renderTable = true;
      element.example = {
        value: '{"a":"b"}',
        hasRaw: false,
        hasTitle: false,
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
      nodes = element.shadowRoot.querySelector('json-table');
      assert.isNotNull(nodes);
    });

    it('Sets code example', async () => {
      element.isJson = true;
      element.renderTable = true;
      element.example = {
        value: 'a',
        hasRaw: false,
        hasTitle: false,
        hasUnion: false,
        isScalar: false,
      };
      await nextFrame();
      nodes = element.shadowRoot.querySelector('.code-wrapper');
      assert.isNotNull(nodes);
    });
  });
});
