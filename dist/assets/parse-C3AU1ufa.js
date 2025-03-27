import{r as i}from"./index-Bu01b8jX.js";function I(n,p){const{errors:a,log:d}=p;function g(o){return a.handleSync(()=>{const e=document.getElementById(o);return e?e.checked:void 0},"Error occurred while parsing checkbox.")}function m(o){return a.handleSync(()=>{var h;const e=o.value.trim().toLowerCase(),t=e.match(i.dom.hex),r=e.match(i.dom.hsl),u=e.match(i.dom.rgb);if(t){let l=t[1];return l.length===3&&(l=l.split("").map(c=>c+c).join("")),{format:"hex",value:{hex:n.asHexSet(`#${l}`)}}}if(r)return{format:"hsl",value:{hue:n.asRadial(parseInt(r[1],10)),saturation:n.asPercentile(parseFloat(r[2])),lightness:n.asPercentile(parseFloat(r[3]))}};if(u)return{format:"rgb",value:{red:n.asByteRange(parseInt(u[1],10)),green:n.asByteRange(parseInt(u[2],10)),blue:n.asByteRange(parseInt(u[3],10))}};const s=document.createElement("div");if(s.style.color=e,s.style.color!==""){const l=document.createElement("canvas").getContext("2d");if(l){l.fillStyle=e;const c=(h=l.fillStyle.match(/\d+/g))==null?void 0:h.map(Number);if(c&&c.length===3)return{format:"rgb",value:{red:n.asByteRange(c[0]),green:n.asByteRange(c[1]),blue:n.asByteRange(c[2])}}}}return d.info(`Invalid color input: ${e}`,"parseColorInput"),null},"Error occurred while parsing color input.")}function f(o,e){return a.handleSync(()=>{const t=document.getElementById(o);if(!t)return;const r=t.value;if(!e.includes(r))return e.includes(r)?r:void 0},"Error occurred while parsing dropdown selection.")}function y(o,e,t){return a.handleSync(()=>{const r=parseFloat(o.value.trim());return isNaN(r)?null:e!==void 0&&r<e?e:t!==void 0&&r>t?t:r},"Error occurred while parsing number input.")}function v(o,e){return a.handleSync(()=>{const t=o.value.trim();return e&&!e.test(t)?null:t||null},"Error occurred while parsing text input.")}const x={parseCheckbox:g,parseColorInput:m,parseDropdownSelection:f,parseNumberInput:y,parseTextInput:v};return a.handleSync(()=>x,"Error occurred while creating DOM parsing utilities group.")}export{I as domParsingUtilitiesFactory};
