(function(){
  var WA="5519971026797";
  function wa(t){return "https://wa.me/"+WA+"?text="+encodeURIComponent(t)}
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  $("#yr").textContent=new Date().getFullYear();

  /* menu móvel */
  var menu=$("#menu"), burger=$("#burger");
  function closeMenu(){menu.classList.remove("open");burger.setAttribute("aria-expanded","false");burger.textContent="☰";burger.setAttribute("aria-label","Abrir menu")}
  burger.addEventListener("click",function(){var o=menu.classList.toggle("open");burger.setAttribute("aria-expanded",o);burger.textContent=o?"✕":"☰";burger.setAttribute("aria-label",o?"Fechar menu":"Abrir menu")});
  $$("#menu a").forEach(function(a){a.addEventListener("click",closeMenu)});

  document.addEventListener("keydown",function(e){if(e.key==="Escape")closeMenu()});
  window.addEventListener("resize",function(){if(window.innerWidth>1000)closeMenu()});

  /* link ativo */
  var links=$$("#menu a.l"), secs=links.map(function(a){return $(a.getAttribute("href"))});
  if("IntersectionObserver" in window){
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle("on",l.getAttribute("href")==="#"+e.target.id)})}})},{rootMargin:"-45% 0px -50% 0px"});
    secs.forEach(function(s){s&&so.observe(s)});
    var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");ro.unobserve(e.target)}})},{threshold:.12});
    $$(".rv").forEach(function(el,i){el.style.transitionDelay=(i%4)*70+"ms";ro.observe(el)});
  }else{$$(".rv").forEach(function(el){el.classList.add("in")})}

  /* atalhos de serviço preenchem o formulário */
  $$("[data-svc]").forEach(function(a){a.addEventListener("click",function(){
    var map={"site institucional":0,"landing page":1,"sistema web":2};
    $("#tipo").selectedIndex=map[a.dataset.svc];build();
  })});

  /* copiar */
  $$(".copy").forEach(function(b){b.addEventListener("click",function(){
    var done=function(){b.textContent="Copiado";setTimeout(function(){b.textContent="Copiar"},1600)};
    var fallback=function(){var s=window.getSelection(),r=document.createRange();r.selectNodeContents(b.previousElementSibling.querySelector(".v"));s.removeAllRanges();s.addRange(r);b.textContent="Selecionado";setTimeout(function(){b.textContent="Copiar"},1600)};
    try{navigator.clipboard.writeText(b.dataset.copy).then(done,fallback)}catch(e){fallback()}
  })});

  /* formulário → WhatsApp */
  var nome=$("#nome"),email=$("#email"),tipo=$("#tipo"),msg=$("#msg"),send=$("#send"),hint=$("#hint");
  function build(){
    var t="Olá João! Meu nome é "+(nome.value||"[nome]")+".\nPreciso de: "+tipo.value+".\n\n"+(msg.value||"[descreva seu projeto]")+"\n\nMeu e-mail: "+(email.value||"[e-mail]");
    send.href=wa(t);
  }
  [nome,email,tipo,msg].forEach(function(el){el.addEventListener("input",build)});
  build();
  $("#form").addEventListener("submit",function(e){e.preventDefault();send.click()});
  send.addEventListener("click",function(e){
    var ok=nome.value.trim()&&/^\S+@\S+\.\S+$/.test(email.value)&&msg.value.trim().length>4;
    if(!ok){e.preventDefault();hint.textContent="Preencha nome, um e-mail válido e a mensagem para continuar.";hint.className="hint err";(!nome.value.trim()?nome:!/^\S+@\S+\.\S+$/.test(email.value)?email:msg).focus()}
    else{hint.textContent="Abrindo o WhatsApp com a sua mensagem pronta.";hint.className="hint"}
  });
})();
