const i=()=>({debounce(t,r){let e=null;return(...o)=>{e&&clearTimeout(e),e=setTimeout(()=>{t(...o)},r)}}});export{i as timeHelpersFactory};
