import{r as N}from"./index-Bu01b8jX.js";function O(l){const{isObject:i}=l;function f(t){return i(t)?structuredClone(t):t}function u(t){return!i(t)||Object.isFrozen(t)?t:(Object.keys(t).forEach(n=>{const e=t[n];typeof e=="object"&&e!==null&&u(e)}),Object.freeze(t))}function d(){var s,a;const n=((s=new Error().stack)==null?void 0:s.split(`
`))??[],e=["getCallerInfo","ErrorHandler","Logger","handleSync","handleAsync","Module._compile","Object.<anonymous>","processTicksAndRejections"],c=n.find(o=>!e.some(r=>o.includes(r)));if(!c)return"UNKNOWN CALLER";for(const o of Object.values(N.stackTrace)){const r=c.match(o);if(r){const S=((a=r[1])==null?void 0:a.trim())||"anonymous",h=r[3]??r[2]??"unknown",$=r[4]??"0",y=r[5]??"0";return`${S} (${h}:${$}:${y})`}}return"UNKNOWN CALLER"}function p(){const t=new Date,n=t.getFullYear(),e=String(t.getMonth()+1).padStart(2,"0"),c=String(t.getDate()).padStart(2,"0"),s=String(t.getHours()).padStart(2,"0"),a=String(t.getMinutes()).padStart(2,"0"),o=String(t.getSeconds()).padStart(2,"0");return`${n}-${e}-${c} ${s}:${a}:${o}`}function m(t){return typeof t=="string"&&t.endsWith("%")?parseFloat(t.slice(0,-1)):Number(t)}async function g(t,n){return t.then(e=>(console.log(`[TRACE SUCCESS] ${n}:`,e),e)).catch(e=>{throw console.error(`[TRACE ERROR] ${n}:`,e),e})}return{deepClone:f,deepFreeze:u,getCallerInfo:d,getFormattedTimestamp:p,parseValue:m,tracePromise:g}}export{O as dataHelpersFactory};
