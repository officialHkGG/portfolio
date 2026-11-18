"use strict";
(() => {
  const root=document.documentElement;
  const translations=[...document.querySelectorAll("[data-en]")].map(el=>({el,sv:el.textContent,en:el.dataset.en}));
  const titles={
    sv:"Hidro Kourkis — Javautvecklare & IT-support, Stockholm",
    en:"Hidro Kourkis — Java Developer & IT Support, Stockholm"
  };
  const languageButton=document.getElementById("language-button");
  const menuButton=document.getElementById("menu-button");
  const nav=document.getElementById("site-nav");
  const header=document.getElementById("site-header");
  const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
  let language="sv";
  try {if(localStorage.getItem("portfolio-language")==="en")language="en";}catch{}

  function setLanguage(value){
    language=value;
    root.lang=value;
    for(const entry of translations){
      entry.el.textContent=value==="sv"?entry.sv:entry.en;
    }
    languageButton.textContent=value==="sv"?"EN":"SV";
    languageButton.setAttribute("aria-label",value==="sv"?"Switch to English":"Byt till svenska");
    nav.setAttribute("aria-label",value==="sv"?"Huvudnavigation":"Main navigation");
    document.title=titles[value];
    if(!nav.classList.contains("is-open")){
      menuButton.setAttribute("aria-label",value==="sv"?"Öppna meny":"Open menu");
    }
    try {localStorage.setItem("portfolio-language",value);}catch{}
  }
  function closeMenu(){
    nav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded","false");
    menuButton.setAttribute("aria-label",language==="sv"?"Öppna meny":"Open menu");
  }
  languageButton.addEventListener("click",()=>setLanguage(language==="sv"?"en":"sv"));
  menuButton.addEventListener("click",()=>{
    const open=nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded",String(open));
    menuButton.setAttribute("aria-label",language==="sv"?(open?"Stäng meny":"Öppna meny"):(open?"Close menu":"Open menu"));
  });
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu));
  document.addEventListener("keydown",event=>{
    if(event.key==="Escape"&&nav.classList.contains("is-open")){
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener("pointerdown",event=>{
    if(nav.classList.contains("is-open")&&!nav.contains(event.target)&&!menuButton.contains(event.target))closeMenu();
  });
  const desktop=window.matchMedia("(min-width:741px)");
  desktop.addEventListener?.("change",event=>{if(event.matches)closeMenu()});
  function updateHeader(){header.classList.toggle("is-scrolled",window.scrollY>8)}
  window.addEventListener("scroll",updateHeader,{passive:true});
  updateHeader();

  const reveals=[...document.querySelectorAll(".reveal")];
  if(!reduceMotion.matches&&"IntersectionObserver" in window){
    root.classList.add("js-motion");
    const observer=new IntersectionObserver((entries,obs)=>{
      for(const entry of entries){
        if(entry.isIntersecting){entry.target.classList.add("is-visible");obs.unobserve(entry.target);}
      }
    },{threshold:0.06,rootMargin:"0px 0px -25px 0px"});
    reveals.forEach(el=>observer.observe(el));
    reduceMotion.addEventListener?.("change",e=>{
      if(e.matches){root.classList.remove("js-motion");observer.disconnect();reveals.forEach(el=>el.classList.add("is-visible"))}
    });
  }
  document.getElementById("year").textContent=String(new Date().getFullYear());
  setLanguage(language);
})();