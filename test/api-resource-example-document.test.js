/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import { fixture, assert, nextFrame, aTimeout, html } from '@open-wc/testing';
import sinon from 'sinon';
import { AmfLoader } from './amf-loader.js';
import '../api-resource-example-document.js';

/** @typedef {import('..').ApiResourceExampleDocument} ApiResourceExampleDocument */

describe('ApiResourceExampleDocument', () => {
  /**
   * @returns {Promise<ApiResourceExampleDocument>}
   */
  async function basicFixture() {
    return (fixture(html`<api-resource-example-document></api-resource-example-document>`));
  }

  /**
   * @returns {Promise<ApiResourceExampleDocument>}
   */
  async function jsonFixture() {
    return (fixture(html`
      <api-resource-example-document mediaType="application/json"></api-resource-example-document>`));
  }


  function clearTableStorage() {
    localStorage.removeItem('jsonTableEnabled');
  }

  function getStorageValue() {
    return localStorage.jsonTableEnabled;
  }

  describe('_tableChanged()', () => {
    let element = /** @type ApiResourceExampleDocument */ (null);
    beforeEach(async () => {
      element = await basicFixture();
      clearTableStorage();
    });

    it('Does noting when state is undefined', () => {
      const spy = sinon.spy(element, '_dispatchTableState');
      element._tableChanged(undefined);
      assert.isFalse(spy.called);
    });

    it('Updates state of the local storage', () => {
      element._tableChanged(true);
      let result = getStorageValue();
      assert.equal(result, 'true');
      element._tableChanged(false);
      result = getStorageValue();
      assert.equal(result, 'false');
    });

    it('Calls _dispatchTableState()', () => {
      const spy = sinon.spy(element, '_dispatchTableState');
      element._tableChanged(false);
      assert.isTrue(spy.called);
    });
  });

  describe('_dispatchTableState()', () => {
    let element = /** @type ApiResourceExampleDocument */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Dispatches the event', () => {
      const spy = sinon.spy();
      element.addEventListener('json-table-state-changed', spy);
      element._dispatchTableState(true);
      assert.isTrue(spy.called);
    });

    it('Returns the event', () => {
      const result = element._dispatchTableState(true);
      assert.typeOf(result, 'customevent');
    });

    it('Event is not cancelable', () => {
      const result = element._dispatchTableState(true);
      assert.isFalse(result.cancelable);
    });

    it('Event bubbles', () => {
      const result = element._dispatchTableState(true);
      assert.isTrue(result.bubbles);
    });

    it('Event is composed', () => {
      const result = element._dispatchTableState(true);
      if (result.composed !== undefined) {
        assert.isTrue(result.composed);
      }
    });

    it('Has the sate on detail object', () => {
      const result = element._dispatchTableState(true);
      assert.isTrue(result.detail.enabled);
    });
  });

  describe('_onStorageChanged()', () => {
    let element = /** @type ApiResourceExampleDocument */ (null);
    beforeEach(async () => {
      clearTableStorage();
      element = await basicFixture();
    });

    it('Does nothing when key is not jsonTableEnabled', () => {
      element._onStorageChanged({
        key: 'test'
      });
      assert.isFalse(element.table);
    });

    it('Does nothing when newValue is not set', () => {
      element._onStorageChanged({
        key: 'jsonTableEnabled'
      });
      assert.isFalse(element.table);
    });

    it('Updates table state', () => {
      element._onStorageChanged({
        key: 'jsonTableEnabled',
        newValue: 'true'
      });
      assert.isTrue(element.table);
    });
  });

  describe('_localStorageValueToBoolean()', () => {
    let element = /** @type ApiResourceExampleDocument */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns false when no argument', () => {
      const result = element._localStorageValueToBoolean(undefined);
      assert.isFalse(result);
    });

    it('Returns false', () => {
      const result = element._localStorageValueToBoolean('false');
      assert.isFalse(result);
    });

    it('Returns `true`', () => {
      const result = element._localStorageValueToBoolean('true');
      assert.isTrue(result);
    });
  });

  describe('_onJsonTableStateChanged()', () => {
    let element = /** @type ApiResourceExampleDocument */ (null);
    beforeEach(async () => {
      clearTableStorage();
      element = await basicFixture();
    });

    it('Does nothing when dispatched by self', () => {
      // @ts-ignore
      element._onJsonTableStateChanged({
        composedPath: () => [element],
        detail: {
          enabled: true
        }
      });
      assert.isFalse(element.table);
    });

    it('Does nothing when represents the same value', () => {
      // @ts-ignore
      element._onJsonTableStateChanged({
        composedPath: () => [],
        detail: {
          enabled: false
        }
      });
      assert.isFalse(element.table);
    });

    it('Updates "table" value', () => {
      // @ts-ignore
      element._onJsonTableStateChanged({
        composedPath: () => [],
        detail: {
          enabled: true
        }
      });
      assert.isTrue(element.table);
    });
  });

  describe('_computeExamples()', () => {
    let element = /** @type ApiResourceExampleDocument */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Sets _examplesDebouncer property', () => {
      element._computeExamples();
      assert.isTrue(element._examplesDebouncer);
    });

    it('Eventually calls __computeExamples()', (done) => {
      element._computeExamples();
      const spy = sinon.spy(element, '__computeExamples');
      setTimeout(() => {
        assert.isTrue(spy.called);
        done();
      });
    });

    it('Clears _examplesDebouncer property', (done) => {
      element._computeExamples();
      setTimeout(() => {
        assert.isFalse(element._examplesDebouncer);
        done();
      });
    });
  });

  describe('_computeEffectiveTable()', () => {
    let element = /** @type ApiResourceExampleDocument */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns true when table and JSON', () => {
      const result = element._computeEffectiveTable(true, true);
      assert.isTrue(result);
    });

    it('Returns false when not a JSON', () => {
      const result = element._computeEffectiveTable(true, false);
      assert.isFalse(result);
    });

    it('Returns false when not table', () => {
      const result = element._computeEffectiveTable(false, true);
      assert.isFalse(result);
    });

    it('Returns false when not table and not JSON', () => {
      const result = element._computeEffectiveTable(false, false);
      assert.isFalse(result);
    });
  });

  describe('_computeIsJson()', () => {
    let element = /** @type ApiResourceExampleDocument */ (null);
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns false when no type', () => {
      const result = element._computeIsJson(undefined);
      assert.isFalse(result);
    });

    it('Returns false for non-json media type', () => {
      const result = element._computeIsJson('application/xml');
      assert.isFalse(result);
    });

    it('Returns true for json media type', () => {
      const result = element._computeIsJson('application/json');
      assert.isTrue(result);
    });

    it('Returns true for other json media type', () => {
      const result = element._computeIsJson('application/x-json');
      assert.isTrue(result);
    });
  });

  function getPayloads(element, amf, endpoint) {
    const webApi = element._computeWebApi(amf);
    const endPoint = element._computeEndpointByPath(webApi, endpoint);
    const opKey = element._getAmfKey(element.ns.aml.vocabularies.apiContract.supportedOperation);
    return element._ensureArray(endPoint[opKey]);
  }

  function getPayload(element, amf, endpoint, method) {
    const ops = getPayloads(element, amf, endpoint);
    const op = ops.find((item) => element._getValue(item, element.ns.aml.vocabularies.apiContract.method) === method);
    const expects = element._computeExpects(op);
    return element._ensureArray(element._computePayload(expects));
  }

  function getPayloadSchema(element, amf, endpoint, method, payloadIndex) {
    if (!payloadIndex) {
      payloadIndex = 0;
    }
    const payload = getPayload(element, amf, endpoint, method)[payloadIndex];
    const sKey = element._getAmfKey(element.ns.aml.vocabularies.shapes.schema);
    let schema = payload[sKey];
    if (schema instanceof Array) {
      schema = schema[0];
    }
    return element._resolve(schema);
  }

  function computeExamples(element, amf, endpoint, method, payloadIndex) {
    const schema = getPayloadSchema(element, amf, endpoint, method, payloadIndex);
    const key = element._getAmfKey(element.ns.aml.vocabularies.apiContract.examples);
    return element._ensureArray(schema[key]);
  }

  async function resolveWhenReady(elm, model, path, method, payloadIndex) {
    return new Promise((resolve) => {
      let payload = getPayload(elm, model, path, method);
      if (payloadIndex !== undefined) {
        payload = payload[payloadIndex]
      }
      elm.examples = payload;
      elm.addEventListener('has-examples-changed', function f(e) {
        if (!e.detail.value) {
          return;
        }
        elm.removeEventListener('has-examples-changed', f);
        setTimeout(() => resolve());
      });
    });
  }

  describe('__computeExamples()', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach((item) => {
      describe(String(item[0]), () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(item[1]);
        });

        let element = /** @type ApiResourceExampleDocument */ (null);
        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
          await nextFrame();
        });

        it('Clears _renderedExamples when no examples', () => {
          element._renderedExamples = [{
            value: '{}',
            hasTitle: false,
            hasRaw: false,
            hasUnion: false,
            isScalar: false,
          }];
          // @ts-ignore
          element.__computeExamples();
          assert.isUndefined(element._renderedExamples);
        });

        it('Clears _renderedExamples when examples empty', () => {
          element._renderedExamples = [{
            value: '{}',
            hasTitle: false,
            hasRaw: false,
            hasUnion: false,
            isScalar: false,
          }];
          // @ts-ignore
          element.__computeExamples([]);
          assert.isUndefined(element._renderedExamples);
        });

        it('Clears _renderedExamples when no media type', () => {
          element._renderedExamples = [{
            value: '{}',
            hasTitle: false,
            hasRaw: false,
            hasUnion: false,
            isScalar: false,
          }];
          // @ts-ignore
          element.__computeExamples([{}]);
          assert.isUndefined(element._renderedExamples);
        });

        it('Computes examples from array of Payloads', () => {
          const payloads = getPayload(element, amf, '/IncludedInType', 'post');
          // @ts-ignore
          element.__computeExamples(payloads, 'application/json');
          assert.typeOf(element._renderedExamples, 'array');
          assert.lengthOf(element._renderedExamples, 1);
        });

        it('Computes examples from a single payload', () => {
          const payloads = getPayload(element, amf, '/IncludedInType', 'post');
          // @ts-ignore
          element.__computeExamples(payloads[0], 'application/json');
          assert.typeOf(element.renderedExamples, 'array');
          assert.lengthOf(element.renderedExamples, 1);
        });

        it('Computes examples from a payload\'s schema', () => {
          const payload = getPayload(element, amf, '/IncludedInType', 'post')[0];
          const id = payload['@id'];
          const sKey = element._getAmfKey(element.ns.aml.vocabularies.shapes.schema);
          let schema = payload[sKey];
          if (schema instanceof Array) {
            schema = schema[0];
          }
          // @ts-ignore
          element.__computeExamples(schema, 'application/json', false, undefined, id);
          assert.typeOf(element.renderedExamples, 'array');
          assert.lengthOf(element.renderedExamples, 1);
        });

        it('Computes payload from an Example', () => {
          const examples = computeExamples(element, amf, '/IncludedInType', 'post', 0);
          // @ts-ignore
          element.__computeExamples(examples[0], 'application/json');
          assert.typeOf(element.renderedExamples, 'array');
          assert.lengthOf(element.renderedExamples, 1);
        });

        it('Computes payload from multiple Examples', () => {
          const examples = computeExamples(element, amf, '/IncludedInType', 'post', 0);
          // @ts-ignore
          element.__computeExamples(examples, 'application/json');
          assert.typeOf(element.renderedExamples, 'array');
          assert.lengthOf(element.renderedExamples, 2);
        });

        it('Ignores unknown array items', () => {
          const examples = computeExamples(element, amf, '/IncludedInType', 'post', 0);
          examples.push({});
          // @ts-ignore
          element.__computeExamples(examples, 'application/json');
          assert.typeOf(element.renderedExamples, 'array');
          assert.lengthOf(element.renderedExamples, 2);
        });

        it('Ignores unknown shapes', () => {
          // @ts-ignore
          element.__computeExamples({}, 'application/json');
          assert.isUndefined(element.renderedExamples);
        });

        it('Computes examples without readOnly property', async () => {
          amf = await AmfLoader.load(item[1], 'oas-3-api');
          element.amf = amf;
          await nextFrame();
          const payloads = getPayload(element, amf, '/default', 'post');
          // @ts-ignore
          element.__computeExamples(payloads, 'application/json');
          // @ts-ignore
          assert.equal(element.renderedExamples[0].value.indexOf('"id":'), -1);
        });

        it('Computes examples with readOnly property', async () => {
          amf = await AmfLoader.load(item[1], 'oas-3-api');
          element.amf = amf;
          await nextFrame();
          const payloads = getPayload(element, amf, '/default', 'post');
          element.__computeExamples(payloads, 'application/json', undefined, undefined, undefined, undefined, true);
          // @ts-ignore
          assert.notEqual(element.renderedExamples[0].value.indexOf('"id":'), -1);
        });
      });
    });
  });

  describe('General tests', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach((item) => {
      describe(String(item[0]), () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(item[1]);
        });

        let element = /** @type ApiResourceExampleDocument */ (null);
        beforeEach(async () => {
          element = await jsonFixture();
          element.amf = amf;
          await nextFrame();
        });

        it('Sets hasexamples attribute when examples are generated', (done) => {
          const payloads = getPayload(element, amf, '/IncludedInType', 'post');
          element.examples = payloads;
          element.addEventListener('has-examples-changed', function f(e) {
            // @ts-ignore
            if (!e.detail.value) {
              return;
            }
            element.removeEventListener('has-examples-changed', f);
            setTimeout(() => {
              assert.isTrue(element.hasAttribute('hasexamples'));
              done();
            });
          });
        });

        it('Renders api-example-render for each example', (done) => {
          const payloads = getPayload(element, amf, '/IncludedInline', 'post');
          element.examples = payloads;
          element.addEventListener('has-examples-changed', function f(e) {
            // @ts-ignore
            if (!e.detail.value) {
              return;
            }
            element.removeEventListener('has-examples-changed', f);
            setTimeout(() => {
              const nodes = element.shadowRoot.querySelectorAll('api-example-render');
              assert.lengthOf(nodes, 2);
              done();
            });
          });
        });

        it('renders default title for an example', async () => {
          const payloads = getPayload(element, amf, '/IncludedInType', 'post');
          element.examples = payloads;
          await aTimeout(100);
          const h6 = /** @type HTMLElement */ (element.shadowRoot.querySelector('.example-title'));
          assert.ok(h6);
          assert.equal(h6.innerText.trim(), 'Example');
        });

        it('renders title for an example', async () => {
          const payloads = getPayload(element, amf, '/user-raml-example', 'post');
          element.examples = payloads;
          await aTimeout(100);
          const titles = /** @type NodeListOf<HTMLElement> */ (element.shadowRoot.querySelectorAll('.example-title'));
          assert.lengthOf(titles, 4, 'has 4 examples');
          assert.equal(titles[0].innerText.trim(), 'User 1');
          assert.equal(titles[1].innerText.trim(), 'User 2');
          assert.equal(titles[2].innerText.trim(), 'User 3');
          assert.equal(titles[3].innerText.trim(), 'User 4');
        });

        it('should expand example panel when _handleCollapsePanel is called',  async () => {
          const payloads = getPayload(element, amf, '/IncludedInline', 'post');
          element.examples = payloads;
          await aTimeout(100);

          const examplePanelNoCollapsed = /** @type HTMLElement */ (element.shadowRoot.querySelector('.collapse'));
          assert.isNull(examplePanelNoCollapsed);
          const expandIconNoCollapsed = /** @type HTMLElement */ (element.shadowRoot.querySelector('.expand-icon-collapse'));
          assert.isNull(expandIconNoCollapsed);

          setTimeout(() => element._handleCollapsePanel());

          const examplePanelCollapsed = /** @type HTMLElement */ (element.shadowRoot.querySelector('.collapse'));
          assert.isDefined(examplePanelCollapsed);
          const expandIconCollapsed = /** @type HTMLElement */ (element.shadowRoot.querySelector('.expand-icon-collapse'));
          assert.isDefined(expandIconCollapsed);
        });

        it('should expand example panel on click ',  async () => {
          const payloads = getPayload(element, amf, '/IncludedInline', 'post');
          element.examples = payloads;
          await aTimeout(100);

          const examplePanel = /** @type HTMLElement */ (element.shadowRoot.querySelector('.renderer'));
          examplePanel.click()
          await aTimeout(100);

          const examplePanelCollapsed = /** @type HTMLElement */ (element.shadowRoot.querySelector('.collapse'));
          const expandIconCollapsed = /** @type HTMLElement */ (element.shadowRoot.querySelector('.expand-icon-collapse'));
          assert.isDefined(examplePanelCollapsed);
          assert.isDefined(expandIconCollapsed);
        });
      });
    });
  });

  describe('APIC-332', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach((item) => {
      describe(String(item[0]), () => {
        let amf;
        before(async () => {
          amf = await AmfLoader.load(item[1], 'APIC-332');
        });

        let element = /** @type ApiResourceExampleDocument */ (null);
        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
          await nextFrame();
        });

        it('renders description for an example', async () => {
          element.mediaType = 'application/json';
          await resolveWhenReady(element, amf, '/organization', 'post', 0);
          const description = /** @type HTMLElement */ (element.shadowRoot.querySelector('.example-description'));
          assert.equal(description.innerText, 'This description for the example is never shown');
        });
      });
    });
  });

  describe('_computeExampleTitle()', () => {
    let element = /** @type ApiResourceExampleDocument */ (null);

    beforeEach(async () => {
      element = await basicFixture();
      await nextFrame();
    });

    it('returns "Example" if no title is present', () => {
      const example = {};
      const title = element._computeExampleTitle(example);
      assert.equal(title, 'Example');
    });

    it('returns "Example" if title is a variation of the media type', () => {
      const example = {
        title: 'application/json10',
      };
      element.mediaType = 'application/json';
      const title = element._computeExampleTitle(example);
      assert.equal(title, 'Example');
    });

    it('returns the example title', () => {
      const example = {
        title: 'Example test title',
      };
      element.mediaType = 'application/json';
      const title = element._computeExampleTitle(example);
      assert.equal(title, 'Example test title');
    });
  });

  describe('_computeExampleDescription()', () => {
    let element = /** @type ApiResourceExampleDocument */ (null);

    beforeEach(async () => {
      element = await basicFixture();
      await nextFrame();
    });

    it('returns empty if no description is present', () => {
      const example = {};
      const description = element._computeExampleDescription(example);
      assert.equal(description, '');
    });

    it('returns description if present', () => {
      const example = {
        description: "example description",
      };
      const title = element._computeExampleDescription(example);
      assert.equal(title, example.description);
    });
  });

  describe('a11y', () => {
    let element = /** @type ApiResourceExampleDocument */ (null);
    let amf;
    before(async () => {
      amf = await AmfLoader.load();
    });

    beforeEach(async () => {
      element = await jsonFixture();
      element.amf = amf;
    });

    it('passes accessibility test', async () => {
      await resolveWhenReady(element, amf, '/IncludedInType', 'post');
      await assert.isAccessible(element, {
        ignoredRules: ['color-contrast']
      });
    });
  });
});
