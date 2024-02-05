import { css } from 'lit';

export default css`
.tab-panel {
  border: none;
}
.tab-buttons {
  flex-wrap: wrap;
  padding: 4px 4px 0 4px;
  align-items: stretch;
  overflow-y: hidden;
  overflow-x: auto;
  scrollbar-width: thin;
}
.tab-buttons::-webkit-scrollbar {
  height: 1px;
  background-color: var(--border-color);
}
.tab-btn {
  border: none;
  color: var(--light-fg);
  background-color: transparent;
  white-space: nowrap;
  cursor:pointer;
  outline:none;
  font-family:var(--font-regular);
  font-size: 16px;
  font-weight: 600;
  line-height: 18px;
  margin-right:20px;
  margin-bottom: 8px;
  padding:1px;
}
.tab-btn.active {
  font-weight:bold;
  color:var(--primary-color);
}

.tab-btn:hover {
  color:var(--primary-color);
}
.tab-content {
  margin:-1px 0 0 0;
  position:relative;
  min-height: 50px;
}

.tab-content:hover .copy-code-btn {
  opacity: 1;
}

.copy-code-btn {
  opacity: 0;
  display: flex;
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
`;
