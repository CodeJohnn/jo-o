(function(){
  var WA="5519971026797";
  function wa(t){return "https://wa.me/"+WA+"?text="+encodeURIComponent(t)}
  var $=function(s,r){return (r||document).querySelector(s)}, $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  $("#yr").textContent=new Date().getFullYear();

  /* menu móvel */
  var menu=$("#menu"), burger=$("#burger");
  function closeMenu(){menu.classList.remove("open");burger.setAttribute("aria-expanded","false");burger.textContent="☰"}
  burger.addEventListener("click",function(){var o=menu.classList.toggle("open");burger.setAttribute("aria-expanded",o);burger.textContent=o?"✕":"☰"});
  $$("#menu a").forEach(function(a){a.addEventListener("click",closeMenu)});

  /* link ativo */
  var links=$$("#menu a.l"), secs=links.map(function(a){return $(a.getAttribute("href"))});
  if("IntersectionObserver" in window){
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle("on",l.getAttribute("href")==="#"+e.target.id)})}})},{rootMargin:"-45% 0px -50% 0px"});
    secs.forEach(function(s){s&&so.observe(s)});
    var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");ro.unobserve(e.target)}})},{threshold:.12});
    $$(".rv").forEach(function(el,i){el.style.transitionDelay=(i%4)*70+"ms";ro.observe(el)});
  }else{$$(".rv").forEach(function(el){el.classList.add("in")})}

  /* efeito de digitação */
  var words=["sistemas web","landing pages","sites profissionais"], wi=0, ci=words[0].length, del=true, ty=$("#typed");
  if(!matchMedia("(prefers-reduced-motion: reduce)").matches){
    (function tick(){
      var w=words[wi];
      if(del){ci--;if(ci<=0){del=false;wi=(wi+1)%words.length;ci=0}}
      else{ci++;if(ci>=words[wi].length){del=true;ty.textContent=words[wi];return setTimeout(tick,1800)}}
      ty.textContent=words[wi].slice(0,ci)||" ";
      setTimeout(tick,del?38:75);
    })();
  }

  /* brilho que segue o cursor + inclinação 3D */
  $$(".card").forEach(function(c){
    c.addEventListener("pointermove",function(e){
      var r=c.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top;
      c.style.setProperty("--mx",x+"px");c.style.setProperty("--my",y+"px");
      if(c.hasAttribute("data-tilt")&&e.pointerType==="mouse"){
        var rx=((y/r.height)-.5)*-10, ry=((x/r.width)-.5)*10;
        c.style.transform="perspective(700px) rotateX("+rx+"deg) rotateY("+ry+"deg) translateY(-6px)";
      }
    });
    c.addEventListener("pointerleave",function(){if(c.hasAttribute("data-tilt"))c.style.transform=""});
  });

  /* filtros */
  $$(".chip").forEach(function(b){b.addEventListener("click",function(){
    $$(".chip").forEach(function(x){x.setAttribute("aria-pressed",x===b)});
    var f=b.dataset.f;
    $$(".proj").forEach(function(p){p.hidden=!(f==="all"||p.dataset.cat===f)});
  })});

  /* detalhes dos projetos. Para ligar um link real, preencha "url" */
  var P={
    ancora:{cat:"Sistema web",t:"Âncora Finanças",d:"Dashboard de finanças pessoais, construído em etapas, para dar clareza sobre para onde o dinheiro vai.",l:["Painel com visão geral de receitas e despesas","Front-end em React e API em Node.js","Dados armazenados em MySQL"],tags:["React","Node.js","MySQL"],url:""},
    barbearia:{cat:"Sistema web",t:"Julio Barbearia",d:"Sistema de gestão para barbearia com front-end e back-end próprios.",l:["Três perfis de usuário com permissões diferentes","Organização de agenda e atendimentos","Interface pensada para uso no dia a dia do balcão"],tags:["Front-end","Back-end","Perfis de acesso"],url:""},
    locomove:{cat:"Plataforma · Protótipo",t:"LocoMove",d:"Protótipo de plataforma de transporte acessível voltada a pessoas com mobilidade reduzida no Brasil.",l:["Foco em acessibilidade desde o desenho da interface","Fluxo pensado para quem precisa de transporte adaptado","Validação da ideia em formato de protótipo"],tags:["Acessibilidade","UX","Protótipo"],url:""},
    biblioteca:{cat:"Site",t:"Biblioteca de Alexandria",d:"Site pessoal para catalogar filmes e séries assistidos, publicado no GitHub Pages.",l:["Busca de títulos pela API do TMDB","Lista salva no navegador com LocalStorage","HTML, CSS e JavaScript puros"],tags:["HTML","CSS","JavaScript","API TMDB"],url:""}
  };
  var dlg=$("#dlg");
  function open(id){
    var p=P[id], card=$('.proj[data-id="'+id+'"]');
    $("#dshot").innerHTML=$(".shot",card).innerHTML;
    $("#dcat").textContent=p.cat;$("#dt").textContent=p.t;$("#dd").textContent=p.d;
    $("#dl").innerHTML=p.l.map(function(x){return "<li>"+x+"</li>"}).join("");
    $("#dtags").innerHTML=p.tags.map(function(x){return "<span>"+x+"</span>"}).join("");
    var cta=$("#dcta");
    if(p.url){cta.href=p.url;cta.textContent="Ver projeto online"}
    else{cta.href=wa("Olá João, vi o projeto "+p.t+" no seu portfólio e quero algo parecido.");cta.textContent="Quero algo parecido"}
    if(dlg.showModal)dlg.showModal();else dlg.setAttribute("open","");
  }
  $$(".proj").forEach(function(c){c.addEventListener("click",function(){open(c.dataset.id)})});
  $("#dx").addEventListener("click",function(){dlg.close()});
  dlg.addEventListener("click",function(e){if(e.target===dlg)dlg.close()});

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
  $("#form").addEventListener("submit",function(e){e.preventDefault()});
  send.addEventListener("click",function(e){
    var ok=nome.value.trim()&&/^\S+@\S+\.\S+$/.test(email.value)&&msg.value.trim().length>4;
    if(!ok){e.preventDefault();hint.textContent="Preencha nome, um e-mail válido e a mensagem para continuar.";hint.className="hint err";(!nome.value.trim()?nome:!/^\S+@\S+\.\S+$/.test(email.value)?email:msg).focus()}
    else{hint.textContent="Abrindo o WhatsApp com a sua mensagem pronta.";hint.className="hint"}
  });
})();
