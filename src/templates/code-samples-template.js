import { html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js'; // eslint-disable-line import/extensions
import Prism from 'prismjs';
import { copyToClipboard } from '~/utils/common-utils';

/* eslint-disable indent */
export default function codeSamplesTemplate(xCodeSamples) {
  return html`
  <section class="table-title" style="margin-top:24px;"><span class="code-samples-title">Примеры кода</span></div>
  <div class="tab-panel col code-samples"
    @click="${
      (e) => {
        if (e.target.parentElement.classList.contains('tab-btn')) {
          e.target.parentElement.click();
          return;
        }

        if (!e.target.classList.contains('tab-btn')) { return; }
        const clickedTab = e.target.dataset.tab;

        const tabButtons = [...e.currentTarget.querySelectorAll('.tab-btn')];
        const tabContents = [...e.currentTarget.querySelectorAll('.tab-content')];
        tabButtons.forEach((tabBtnEl) => tabBtnEl.classList[tabBtnEl.dataset.tab === clickedTab ? 'add' : 'remove']('active'));
        tabContents.forEach((tabBodyEl) => { tabBodyEl.style.display = (tabBodyEl.dataset.tab === clickedTab ? 'block' : 'none'); });
      }
    }">
    <div class="tab-buttons row">
      <button class="tab-btn active" data-tab="---hidden---">Скрыть</button>
      ${xCodeSamples.map((v, i) => html`<button class="tab-btn" data-tab = '${v.lang}${i}'> ${v.label || v.lang} </button>`)}
    </div>
    ${xCodeSamples.map((v, i) => html`
      <div class="tab-content m-markdown" style= "display:none;" data-tab = '${v.lang}${i}'>
        <button class="toolbar-btn copy-code-btn" style = "position:absolute; top:12px; right:8px" @click='${(e) => { copyToClipboard(v.source, e); }}'>
          <svg class="icon" style="stroke: var(--STROKE-local);" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 6.82353H6C5.44772 6.82353 5 7.24491 5 7.76471V19.0588C5 19.5786 5.44771 20 6 20H15C15.5523 20 16 19.5786 16 19.0588V17.1765M8 6.82353H15C15.5523 6.82353 16 7.24491 16 7.76471V17.1765M8
              6.82353V4.94118C8 4.42138 8.44772 4 9 4H18C18.5523 4 19 4.42138 19 4.94118V16.2353C19 16.7551 18.5523 17.1765 18 17.1765H16" stroke-width="1.5"/>
          </svg>
        </button>
        <pre><code class="language">${Prism.languages[v.lang?.toLowerCase()] ? unsafeHTML(Prism.highlight(v.source, Prism.languages[v.lang?.toLowerCase()], v.lang?.toLowerCase())) : v.source}</code></pre>
      </div>`)
    }
  </div>  
  </section>`;
}
/* eslint-enable indent */
