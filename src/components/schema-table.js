import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import { marked } from 'marked';
import FontStyles from '~/styles/font-styles';
import SchemaStyles from '~/styles/schema-styles';
import CustomStyles from '~/styles/custom-styles';

function getSortedProperties(data) {
  const properties = Object.keys(data);

  const srcOrderedProperties = properties.sort((a, b) => {
    const aValue = String(data[a]).includes('~|~') ? Number(data[a].split('~|~').slice(-1)) : data[a]['::x-index'];
    const bValue = String(data[b]).includes('~|~') ? Number(data[b].split('~|~').slice(-1)) : data[b]['::x-index'];
    return aValue - bValue;
  });

  return srcOrderedProperties;
}

export default class SchemaTable extends LitElement {
  static get properties() {
    return {
      schemaExpandLevel: { type: Number, attribute: 'schema-expand-level' },
      schemaDescriptionExpanded: { type: String, attribute: 'schema-description-expanded' },
      allowSchemaDescriptionExpandToggle: { type: String, attribute: 'allow-schema-description-expand-toggle' },
      schemaHideReadOnly: { type: String, attribute: 'schema-hide-read-only' },
      schemaHideWriteOnly: { type: String, attribute: 'schema-hide-write-only' },
      data: { type: Object },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.schemaExpandLevel || this.schemaExpandLevel < 1) { this.schemaExpandLevel = 99999; }
    if (!this.schemaDescriptionExpanded || !'true false'.includes(this.schemaDescriptionExpanded)) { this.schemaDescriptionExpanded = 'false'; }
    if (!this.schemaHideReadOnly || !'true false'.includes(this.schemaHideReadOnly)) { this.schemaHideReadOnly = 'true'; }
    if (!this.schemaHideWriteOnly || !'true false'.includes(this.schemaHideWriteOnly)) { this.schemaHideWriteOnly = 'true'; }
  }

  static get styles() {
    return [
      FontStyles,
      SchemaStyles,
      css`
      .wrapper {
        border: 1px solid var(--SURFACE-LIGHT-GREY-color);
        border-radius: var(--BORDER-RADIUS-size);
        overflow-x: auto;
      }
      .wrapper .header {
        display:flex;
        padding: 0;
        border-radius: var(--BORDER-RADIUS-size);
      }
      .wrapper .header * {
        font-family:var(--font-regular);
        font-weight:600;
        color:var(--TEXT-GREY-color);
        background-color: var(--bg2);
       }
      .wrapper .header .key {
        padding: 7px 12px 7px 12px;
      }
      .wrapper .header .key-type {
        padding: 7px 12px;
        border-left: solid 1px var(--SURFACE-LIGHT-GREY-color);
        border-right: solid 1px var(--SURFACE-LIGHT-GREY-color);
       }
      .wrapper .header .key-descr {
        padding: 7px 12px;
      }
      .wrapper .td.key-type {
        border-left: solid 1px var(--SURFACE-LIGHT-GREY-color);
        border-right: solid 1px var(--SURFACE-LIGHT-GREY-color);
      }
      .wrapper .td.key-type,
      .wrapper .td.key-descr {
        padding: 5px 12px;
      }

      .table {
        font-size: var(--font-size-small);
        text-align: left;
        line-height: calc(var(--font-size-small) + 6px);
      }
      .table .tr {
        padding: 0;
      }
      .table .td {
        padding: 4px 0;
        overflow: hidden;
        border-top: solid 1px var(--SURFACE-LIGHT-GREY-color);
      }
      .table .key {
        width: 240px;
        min-width: 240px;
        padding-left: 12px;
      }
      .key .key-label {
        font-size: var(--font-size-mono);
      }
      .key.deprecated .key-label {
        color: var(--red);
      }

      .table .key-type {
        white-space: normal;
        width: 150px;
        min-width: 150px;
        word-break: break-all;
      }

      .table .key-descr {
        min-width: 240px;
        width: 100%;
      }

      .collapsed-all-descr .tr:not(.expanded-descr) {
        max-height: calc(var(--font-size-small) + var(--font-size-small));
      }

      .obj-toggle {
        padding: 0 2px;
        border-radius:2px;
        border: 1px solid transparent;
        display: inline-block;
        margin-left: -16px;
        color:var(--primary-color);
        cursor:pointer;
        font-size: calc(var(--font-size-small) + 4px);
        font-family: var(--font-mono);
        background-clip: border-box;
      }
      .obj-toggle:hover {
        border-color: var(--primary-color);
      }
      .tr.expanded + .object-body {
        display:block;
      }
      .tr.collapsed + .object-body {
        display:none;
      }`,
      CustomStyles,
    ];
  }

  /* eslint-disable indent */
  render() {
    return html`
      <div class="table ${this.schemaDescriptionExpanded === 'true' ? 'expanded-all-descr' : 'collapsed-all-descr'}" @click="${(e) => this.handleAllEvents(e)}">
        <div class='toolbar'>
          <div class="toolbar-item schema-root-type ${this.data?.['::type'] || ''} "> ${this.data?.['::type'] || ''} </div>
          ${this.allowSchemaDescriptionExpandToggle === 'true'
            ? html`
              <div style="flex:1"></div>
              <div part="schema-multiline-toggle" class='toolbar-item schema-multiline-toggle' > 
                ${this.schemaDescriptionExpanded === 'true' ? 'В одну строку' : 'В несколько строк'}
              </div>
            `
            : ''
          }
        </div>
        <span part="schema-description" class='highlightable m-markdown' style="margin-bottom:8px;"> ${unsafeHTML(marked(this.data?.['::description'] || ''))} </span>
        <div class="wrapper">
          <div class="header">
            <div class='key'>Поле</div>
            <div class='key-type'>Тип</div>
            <div class='key-descr'>Описание</div>
          </div>
          ${this.data
            ? html`
              ${this.generateTree(
                this.data['::type'] === 'array' ? this.data['::props'] : this.data,
                this.data['::type'],
                this.data['::array-type'],
              )}`
            : ''
          }  
        </div>
      </div>  
    `;
  }

  generateTree(data, dataType = 'object', arrayType = '', key = '', description = '', schemaLevel = 0, indentLevel = 0, readOrWrite = '') {
    if (this.schemaHideReadOnly === 'true') {
      if (dataType === 'array') {
        if (readOrWrite === 'readonly') {
          return;
        }
      }
      if (data && data['::readwrite'] === 'readonly') {
        return;
      }
    }
    if (this.schemaHideWriteOnly === 'true') {
      if (dataType === 'array') {
        if (readOrWrite === 'writeonly') {
          return;
        }
      }
      if (data && data['::readwrite'] === 'writeonly') {
        return;
      }
    }
    if (!data) {
      return html`<div class="null" style="display:inline;">
        <span style='margin-left:${(schemaLevel + 1) * 16}px'> &nbsp; </span>
        <span class="key-label xxx-of-key"> ${key.replace('::OPTION~', '')}</span>
        ${
          dataType === 'array'
            ? html`<span class='mono-font'> [ ] </span>`
            : dataType === 'object'
              ? html`<span class='mono-font'> { } </span>`
              : html`<span class='mono-font'> schema undefined </span>`
        }
      </div>`;
    }

    const newSchemaLevel = data['::type']?.startsWith('xxx-of') ? schemaLevel : (schemaLevel + 1);
    const newIndentLevel = indentLevel + 1;
    const leftPadding = 8 + 16 * (newIndentLevel - 1); // 2 space indentation at each level
    if (Object.keys(data).length === 0) {
      return html`<span class="td key object" style='padding-left:${leftPadding}px'>${key}</span>`;
    }
    let keyLabel = '';
    let keyDescr = '';
    let isOneOfLabel = false;
    if (key.startsWith('::ONE~OF')) {
      keyLabel = key.replace('::ONE~OF', 'Одно из');
      isOneOfLabel = true;
    } else if (key.startsWith('::ANY~OF')) {
      keyLabel = key.replace('::ANY~OF', 'Несколько из');
      isOneOfLabel = true;
    } else if (key.startsWith('::OPTION')) {
      const parts = key.split('~');
      keyLabel = parts[1]; // eslint-disable-line prefer-destructuring
      keyDescr = parts[2]; // eslint-disable-line prefer-destructuring
    } else {
      keyLabel = key;
    }

    let detailObjType = '';
    if (data['::type'] === 'object') {
      if (dataType === 'array') {
        detailObjType = 'array of object'; // Array of Object
      } else {
        detailObjType = data['::dataTypeLabel'] || data['::type'];
      }
    } else if (data['::type'] === 'array') {
      if (dataType === 'array') {
        // detailObjType = 'array of array'; // Array of array
        detailObjType = `array of array ${arrayType !== 'object' ? `of ${arrayType}` : ''}`; // Array of array
      } else {
        detailObjType = data['::dataTypeLabel'] || data['::type'];
      }
    }

    if (typeof data === 'object') {
      return html`
        ${newSchemaLevel >= 0 && key
          ? html`
        <div class='tr ${newSchemaLevel <= this.schemaExpandLevel ? 'expanded' : 'collapsed'} ${data['::type']}' data-obj='${keyLabel}' title="${data['::deprecated'] ? 'Deprecated' : ''}">
              <div class="td key ${data['::deprecated'] ? 'deprecated' : ''}" style='padding-left:${leftPadding}px'>
                ${(keyLabel || keyDescr)
                  ? html`
                    <span class='obj-toggle ${newSchemaLevel < this.schemaExpandLevel ? 'expanded' : 'collapsed'}' data-obj='${keyLabel}'>
                      ${schemaLevel < this.schemaExpandLevel ? '-' : '+'}
                    </span>`
                  : ''
                }
                ${data['::type'] === 'xxx-of-option' || data['::type'] === 'xxx-of-array' || key.startsWith('::OPTION')
                  ? html`<span class="xxx-of-key" style="margin-left:-6px">${keyLabel}</span><span class="${isOneOfLabel ? 'xxx-of-key' : 'xxx-of-descr'}">${keyDescr}</span>`
                  : keyLabel.endsWith('*')
                    ? html`<span class="key-label" style="display:inline-block; margin-left:-6px;">${data['::deprecated'] ? '✗' : ''} ${keyLabel.substring(0, keyLabel.length - 1)}</span><span style='color:var(--red);'>*</span>`
                    : html`<span class="key-label" style="display:inline-block; margin-left:-6px;">${data['::deprecated'] ? '✗' : ''} ${keyLabel === '::props' ? '' : keyLabel}</span>`
                }
                ${data['::type'] === 'xxx-of' && dataType === 'array' ? html`<span style="color:var(--primary-color)">ARRAY</span>` : ''} 
              </div>
              <div class='td key-type' title="${data['::readwrite'] === 'readonly' ? 'Read-Only' : data['::readwrite'] === 'writeonly' ? 'Write-Only' : ''}">
                ${(data['::type'] || '').includes('xxx-of') ? '' : detailObjType}
                ${data['::readwrite'] === 'readonly' ? ' 🆁' : data['::readwrite'] === 'writeonly' ? ' 🆆' : ''}
              </div>
              <div class='td key-descr m-markdown-small' style='line-height:1.7'>${unsafeHTML(marked(description || ''))}</div>
            </div>`
          : html`
            ${data['::type'] === 'array' && dataType === 'array'
              ? html`
                <div class='tr'> 
                  <div class='td key'></div> 
                  <div class='td key-type'>
                    ${arrayType && arrayType !== 'object' ? `${dataType} of ${arrayType}` : dataType}
                  </div> 
                  <div class='td key-descr'></div> 
                </div>`
              : ''
            }`
        }
        <div class='highlightable object-body'>
        ${Array.isArray(data) && data[0]
          ? html`${this.generateTree(data[0], 'xxx-of-option', '', '::ARRAY~OF', '', newSchemaLevel, newIndentLevel, '')}`
          : html`
            ${getSortedProperties(data).map((dataKey) => html`
              ${['::title', '::description', '::type', '::props', '::deprecated', '::array-type', '::readwrite', '::dataTypeLabel', '::nullable', '::x-index'].includes(dataKey)
                ? data[dataKey]['::type'] === 'array' || data[dataKey]['::type'] === 'object'
                  ? html`${this.generateTree(
                    data[dataKey]['::type'] === 'array' ? data[dataKey]['::props'] : data[dataKey],
                      data[dataKey]['::type'],
                      data[dataKey]['::array-type'] || '',
                      dataKey,
                      data[dataKey]['::description'],
                      newSchemaLevel,
                      newIndentLevel,
                      data[dataKey]['::readwrite'] ? data[dataKey]['::readwrite'] : '',
                    )}`
                  : ''
                : html`${this.generateTree(
                  data[dataKey]['::type'] === 'array' ? data[dataKey]['::props'] : data[dataKey],
                  data[dataKey]['::type'],
                  data[dataKey]['::array-type'] || '',
                  dataKey,
                  data[dataKey]?.['::description'] || '',
                  newSchemaLevel,
                  newIndentLevel,
                  data[dataKey]['::readwrite'] ? data[dataKey]['::readwrite'] : '',
                )}`
              }
            `)}
          `
        }
        <div>
      `;
    }

    // For Primitive Data types
    // eslint-disable-next-line no-unused-vars
    const [type, readOrWriteOnly, constraint, defaultValue, allowedValues, pattern, schemaDescription, schemaTitle, deprecated, xIndex] = data.split('~|~');
    if (readOrWriteOnly === '🆁' && this.schemaHideReadOnly === 'true') {
      return;
    }
    if (readOrWriteOnly === '🆆' && this.schemaHideWriteOnly === 'true') {
      return;
    }
    const dataTypeCss = type.replace(/┃.*/g, '').replace(/[^a-zA-Z0-9+]/g, '').substring(0, 4).toLowerCase();
    const descrExpander = `${constraint || defaultValue || allowedValues || pattern ? '<span class="descr-expand-toggle">➔</span>' : ''}`;
    let dataTypeHtml = '';
    if (dataType === 'array') {
      dataTypeHtml = html` 
        <div class='td key-type ${dataTypeCss}' title="${readOrWrite === 'readonly' ? 'Read-Only' : readOrWriteOnly === 'writeonly' ? 'Write-Only' : ''}">
          [${type}] ${readOrWrite === 'readonly' ? '🆁' : readOrWrite === 'writeonly' ? '🆆' : ''}
        </div>`;
    } else {
      dataTypeHtml = html` 
        <div class='td key-type ${dataTypeCss}' title="${readOrWriteOnly === '🆁' ? 'Read-Only' : readOrWriteOnly === '🆆' ? 'Write-Only' : ''}">
          ${type} ${readOrWriteOnly}
        </div>`;
    }
    return html`
      <div class = "tr primitive" title="${deprecated ? 'Deprecated' : ''}">
        <div class="td key ${deprecated}" style='padding-left:${leftPadding}px'>
          ${deprecated ? html`<span style='color:var(--red);'>✗</span>` : ''}
          ${keyLabel?.endsWith('*')
            ? html`
              <span class="key-label">${keyLabel.substring(0, keyLabel.length - 1)}</span><span style='color:var(--red);'>*</span>`
            : key.startsWith('::OPTION')
              ? html`<span class='xxx-of-key'>${keyLabel}</span><span class="xxx-of-descr">${keyDescr}</span>`
              : html`${keyLabel ? html`<span class="key-label"> ${keyLabel}</span>` : html`<span class="xxx-of-descr">${schemaTitle}</span>`}`
          }
        </div>
        ${dataTypeHtml}
        <div class='td key-descr' style='font-size: var(--font-size-small)'>
          ${html`<span class="m-markdown-small">
            ${unsafeHTML(marked(dataType === 'array'
              ? `${descrExpander} ${description}`
              : schemaTitle
                ? `${descrExpander} <b>${schemaTitle}:</b> ${schemaDescription}`
                : `${descrExpander} ${schemaDescription}`))}
          </span>`
          }
          ${constraint ? html`<div class='' style='display:inline-block; line-break:anywhere; margin-right:8px;'> <span class='bold-text'>Ограничения: </span> ${constraint}</div>` : ''}
          ${defaultValue ? html`<div style='display:inline-block; line-break:anywhere; margin-right:8px;'> <span class='bold-text'>По умолчанию: </span>${defaultValue}</div>` : ''}
          ${allowedValues ? html`<div style='display:inline-block; line-break:anywhere; margin-right:8px;'> <span class='bold-text'>${type === 'const' ? 'Значение' : 'Доступно'}: </span>${allowedValues}</div>` : ''}
          ${pattern ? html`<div style='display:inline-block; line-break:anywhere; margin-right:8px;'> <span class='bold-text'>Шаблон: </span>${pattern}</div>` : ''}
        </div>
      </div>
    `;
  }
  /* eslint-enable indent */

  handleAllEvents(e) {
    if (e.target.classList.contains('obj-toggle')) {
      this.toggleObjectExpand(e);
    } else if (e.target.classList.contains('schema-multiline-toggle')) {
      this.schemaDescriptionExpanded = (this.schemaDescriptionExpanded === 'true' ? 'false' : 'true');
    } else if (e.target.classList.contains('descr-expand-toggle')) {
      const trEl = e.target.closest('.tr');
      if (trEl) {
        trEl.classList.toggle('expanded-descr');
        trEl.style.maxHeight = trEl.scrollHeight;
      }
    }
  }

  toggleObjectExpand(e) {
    const rowEl = e.target.closest('.tr');
    if (rowEl.classList.contains('expanded')) {
      rowEl.classList.add('collapsed');
      rowEl.classList.remove('expanded');
      e.target.innerText = '+';
    } else {
      rowEl.classList.remove('collapsed');
      rowEl.classList.add('expanded');
      e.target.innerText = '-';
    }
  }
}
customElements.define('schema-table', SchemaTable);
