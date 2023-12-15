import { LitElement, html, css } from 'lit';
import { copyToClipboard } from '~/utils/common-utils';
import FontStyles from '~/styles/font-styles';
import BorderStyles from '~/styles/border-styles';
import InputStyles from '~/styles/input-styles';
import CustomStyles from '~/styles/custom-styles';

export default class JsonTree extends LitElement {
  static get properties() {
    return {
      data: { type: Object },
      renderStyle: { type: String, attribute: 'render-style' },
    };
  }

  static get styles() {
    return [
      FontStyles,
      BorderStyles,
      InputStyles,
      css`
      :host{
        display:flex;
      }
      :where(button, input[type="checkbox"], [tabindex="0"]):focus-visible { box-shadow: var(--focus-shadow); }
      :where(input[type="text"], input[type="password"], select, textarea):focus-visible { border-color: var(--primary-color); }
      .json-tree {
        position: relative;
        font-family: var(--font-mono);
        font-size:var(--font-size-small);
        display:inline-block;
        overflow:hidden;
        word-break: break-all;
        flex:1;
        line-height: calc(var(--font-size-small) + 6px);
        min-height: 40px;
        direction: ltr;
        text-align: left;
        padding: 12px;
        background: var(--SURFACE-BACKGROUND-color);
        border-radius: var(--BORDER-RADIUS-size);
      }

      .open-bracket {
        display:inline-block;
        padding: 0 20px 0 0;
        cursor:pointer;
        border: 1px solid transparent;
        border-radius:3px;
      }
      .close-bracket {
        border: 1px solid transparent;
        border-radius:3px;
        display:inline-block;
      }
      .open-bracket:hover {
        color:var(--primary-color);
        background-color:var(--hover-color);
        border: 1px solid var(--border-color);
      }
      .open-bracket.expanded:hover ~ .inside-bracket {
        border-left: 1px solid var(--fg3);
      }
      .open-bracket.expanded:hover ~ .close-bracket {
        color:var(--primary-color);
      }
      .inside-bracket {
        padding-left:12px;
        overflow: hidden;
        border-left:1px dotted var(--border-color);
      }
      .open-bracket.collapsed + .inside-bracket,
      .open-bracket.collapsed + .inside-bracket + .close-bracket {
        display:none;
      }

      .string{color:var(--green);}
      .number{color:var(--blue);}
      .null{color:var(--red);}
      .boolean{color:var(--purple);}
      .object{color:var(--fg)}
      .toolbar {
        position: absolute;
        top:5px;
        right:6px;
        display:flex;
        padding:2px;
        align-items: center;
      }

      .btn-copy .icon {
        pointer-events: none;
      }

      .json-tree:hover .copy-code-btn {
        display: flex;
      }
      .copy-code-btn {
        display: none;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: var(--SURFACE-WHITE-color);
        width: 40px;
        min-width: 40px;
        height: 40px;
        padding: 0;
        margin: 0;
      }
      .copy-code-btn .icon {
        --STROKE-local: var(--ICON-DARK-color);
        width: 24px;
        height: 24px;
        pointer-events: none;
      }
      `,
      CustomStyles,
    ];
  }

  /* eslint-disable indent */
  render() {
    return html`
      <div class = "json-tree"  @click='${(e) => { if (e.target.classList.contains('btn-copy')) { copyToClipboard(JSON.stringify(this.data, null, 2), e); } else { this.toggleExpand(e); } }}'>
        <div class='toolbar'> 
          <button class="toolbar-btn btn-copy copy-code-btn" part="btn btn-fill btn-copy">
            <svg class="icon" style="stroke: var(--STROKE-local);" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 6.82353H6C5.44772 6.82353 5 7.24491 5 7.76471V19.0588C5 19.5786 5.44771 20 6 20H15C15.5523 20 16 19.5786 16 19.0588V17.1765M8 6.82353H15C15.5523 6.82353 16 7.24491 16 7.76471V17.1765M8
              6.82353V4.94118C8 4.42138 8.44772 4 9 4H18C18.5523 4 19 4.42138 19 4.94118V16.2353C19 16.7551 18.5523 17.1765 18 17.1765H16" stroke-width="1.5"/>
            </svg>
          </button>
        </div>
          ${this.generateTree(this.data, true)}
      </div>  
    `;
  }

  generateTree(data, isLast = false) {
    if (data === null) {
      return html`<div class="null" style="display:inline;">null</div>`;
    }
    if (typeof data === 'object' && (data instanceof Date === false)) {
      const detailType = Array.isArray(data) ? 'array' : 'pure_object';
      if (Object.keys(data).length === 0) {
        return html`${(Array.isArray(data) ? '[ ],' : '{ },')}`;
      }
      return html`
      <div class="open-bracket expanded ${detailType === 'array' ? 'array' : 'object'}" > ${detailType === 'array' ? '[' : '{'}</div>
      <div class="inside-bracket">
        ${Object.keys(data).map((key, i, a) => html`
          <div class="item"> 
            ${detailType === 'pure_object' ? html`"${key}":` : ''}
            ${this.generateTree(data[key], i === (a.length - 1))}
          </div>`)
        }
      </div>
      <div class="close-bracket">${detailType === 'array' ? ']' : '}'}${isLast ? '' : ','}</div>
      `;
    }
    return (typeof data === 'string' || data instanceof Date)
      ? html`<span class="${typeof data}">"${data}"</span>${isLast ? '' : ','}`
      : html`<span class="${typeof data}">${data}</span>${isLast ? '' : ','}`;
  }
  /* eslint-enable indent */

  toggleExpand(e) {
    const openBracketEl = e.target;
    if (e.target.classList.contains('open-bracket')) {
      if (openBracketEl.classList.contains('expanded')) {
        openBracketEl.classList.replace('expanded', 'collapsed');
        e.target.innerHTML = e.target.classList.contains('array') ? '[...]' : '{...}';
      } else {
        openBracketEl.classList.replace('collapsed', 'expanded');
        e.target.innerHTML = e.target.classList.contains('array') ? '[' : '{';
      }
    }
  }
}
// Register the element with the browser
customElements.define('json-tree', JsonTree);
