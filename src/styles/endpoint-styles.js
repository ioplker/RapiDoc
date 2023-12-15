import { css } from 'lit';

export default css`
.only-large-screen { display:none; }
.endpoint-head .path{
  display: flex;
  font-family:var(--font-mono);
  font-size: var(--font-size-small);
  font-weight: 600;
  color: var(--TEXT-DARK-color);
  align-items: center;
  overflow-wrap: break-word;
  word-break: break-all;
}

.endpoint-head .descr {
  font-size: var(--font-size-small);
  color:var(--TEXT-DARK-color);
  font-weight:600;
  align-items: center;
  overflow-wrap: break-word;
  word-break: break-all;
  display:flex;
}
.endpoint-head .collapse-btns .icon {
  --STROKE-local: var(--ICON-GREY-color);
  width: 24px;
  height: 24px;
  margin-left: 8px;
}

.m-endpoint {
  position: relative;
  border-color: transparent;
}

.m-endpoint .border-bg, .m-endpoint .bg {
  position: absolute;
  top: -1px;
  left: -1px;
  border-radius: var(--BORDER-RADIUS-size);
  pointer-events: none;
}
.m-endpoint .border-bg {
  width: calc(100% + 2px);
  height: calc(100% + 2px);
}
.m-endpoint.collapsed:hover .border-bg {
  background: var(--BORDER-gradient);
}
.m-endpoint .bg {
  background: var(--SURFACE-WHITE-color);
  top: 1px;
  left: 1px;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
}

.m-endpoint.expanded .endpoint-head .collapse-btns .icon.open {
  display: none;
}
.m-endpoint.collapsed .endpoint-head .collapse-btns .icon.close {
  display: none;
}

.endpoint-head.put:hover .collapse-btns .icon,
.endpoint-head.patch:hover .collapse-btns .icon {
  --STROKE-local: var(--SURFACE-YELLOW-color);
}
.endpoint-head.post:hover .collapse-btns .icon {
  --STROKE-local: var(--SURFACE-GREEN-color);
}
.endpoint-head.get:hover .collapse-btns .icon {
  --STROKE-local: var(--SURFACE-BLUE-color);
}
.endpoint-head.delete:hover .collapse-btns .icon {
  --STROKE-local: var(--SURFACE-RED-color);
}
.endpoint-head.head:hover .collapse-btns .icon,
.endpoint-head.options:hover .collapse-btns .icon {
  --STROKE-local: var(--ICON-DARK-color);
}

.m-endpoint.expanded{margin-bottom:16px; }

.m-endpoint.put,
.m-endpoint.patch {
   border-color: var(--SURFACE-YELLOW-color);
}
.m-endpoint.post {
  border-color: var(--SURFACE-GREEN-color);
}
.m-endpoint.get {
  border-color: var(--SURFACE-BLUE-color);
}
.m-endpoint.delete {
  border-color: var(--SURFACE-RED-color);
}
.m-endpoint.head,
.m-endpoint.options {
  border-color: var(--SURFACE-GREY-color);
}

.m-endpoint > .endpoint-head{
  display:flex;
  position: relative;
  padding:6px 16px;
  align-items: center;
  cursor: pointer;
}

.m-endpoint > .endpoint-head.expanded{
  border-radius: 8px 8px 0 0;
}

.m-endpoint > .endpoint-head.deprecated:hover {
  filter:opacity(0.6);
}

.m-endpoint .endpoint-body {
  position: relative;
  flex-wrap:wrap;
  padding:16px 0px 0 0px;
}

.m-endpoint .endpoint-body > *:last-child {
  border-radius: 0 0 8px 8px;
}

.m-endpoint .endpoint-body.deprecated{ 
  filter:opacity(0.6);
}

.endpoint-head .deprecated{
  color: var(--light-fg);
  filter:opacity(0.6);
}

.summary{
  padding:8px 12px;
}
.summary .title{
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
  margin-bottom: 6px;
  word-break: break-all;
}

.endpoint-head.expanded.post { border-bottom: solid 1px var(--SURFACE-GREEN-color); }
.endpoint-head.expanded.put,
.endpoint-head.expanded.patch { border-bottom: solid 1px var(--SURFACE-YELLOW-color); }
.endpoint-head.expanded.get { border-bottom: solid 1px var(--SURFACE-BLUE-color); }
.endpoint-head.expanded.delete { border-bottom: solid 1px var(--SURFACE-RED-color); }
.endpoint-head.expanded.head,
.endpoint-head.expanded.options { border-bottom: solid 1px var(--SURFACE-GREY-color); }

.endpoint-head .method{
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-small);
  line-height: calc(var(--font-size-small) + 8px);
  text-transform: uppercase;
  border-radius: var(--BORDER-RADIUS-size);
  font-weight: 600;
  margin-right: 8px;
  padding: 8px 16px 8px 12px;
}
.endpoint-head .method.delete {
  background: var(--SURFACE-LIGHT-RED-color);
}
.endpoint-head .method.delete .icon {
  --STROKE-local: var(--SURFACE-RED-color);
}
.endpoint-head .method.post {
  background: var(--SURFACE-LIGHT-GREEN-color);
}
.endpoint-head .method.post .icon {
  --STROKE-local: var(--SURFACE-GREEN-color);
}
.endpoint-head .method.put,
.endpoint-head .method.patch {
  background: var(--SURFACE-LIGHT-YELLOW-color);
}
.endpoint-head .method.put .icon,
.endpoint-head .method.patch .icon {
  --STROKE-local: var(--SURFACE-YELLOW-color);
}
.endpoint-head .method.get {
  background: var(--SURFACE-LIGHT-BLUE-color);
}
.endpoint-head .method.get .icon {
  --STROKE-local: var(--SURFACE-BLUE-color);
}
.endpoint-head .method.get.deprecated{ background: var(--border-color); }
.endpoint-head .method.head,
.endpoint-head .method.options {
  background: var(--SURFACE-BACKGROUND-color);
}
.endpoint-head .method.head .icon,
.endpoint-head .method.options .icon {
  --STROKE-local: var(--ICON-GREY-color);
}

.req-resp-container {
  display: flex;
  flex-direction: column;
}
.req-resp-container .view-mode-request {
  border-top: solid 1px var(--SURFACE-LIGHT-GREY-color);
}

.view-mode-request,
api-response.view-mode {
  flex:1; 
  min-height:100px;
  padding:16px 12px;
  overflow:hidden;
}
.view-mode-request {
  border-width:0 0 1px 0;
  border-style:solid;
}

.head .view-mode-request,
.options .view-mode-request {
  border-color:var(--SURFACE-GREY-color);
}
.put .view-mode-request,
.patch .view-mode-request {
  border-color:var(--SURFACE-YELLOW-color);
}
.post .view-mode-request { 
  border-color:var(--SURFACE-GREEN-color);
}
.get .view-mode-request { 
  border-color:var(--SURFACE-BLUE-color);
}
.delete .view-mode-request { 
  border-color:var(--SURFACE-RED-color);
}

@media only screen and (min-width: 1024px) {
  .only-large-screen { display:block; }
  .endpoint-head .path{
    font-size: var(--font-size-regular);
  }
  .endpoint-head .m-markdown-small,
  .descr .m-markdown-small{
    display:block;
  }
  .req-resp-container{
    flex-direction: var(--layout, row);
    flex-wrap: nowrap;
  }
  api-response.view-mode {
    padding:16px;
  }
  .view-mode-request.row-layout {
    border-width:0 1px 0 0;
    padding:16px;
  }
  .summary{
    padding:8px 12px;
  }
}
`;
