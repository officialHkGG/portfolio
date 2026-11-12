"use strict";
(() => {
  const root = document.documentElement;
  const button = document.getElementById("language-toggle");
  const menu = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");
  const translated = [...document.querySelectorAll("[data-en]")].map(el => ({el, sv: el.textContent, en: el.dataset.en}));
  const titles = {sv:"Hidro Kourkis – Javautvecklare & IT-support i Stockholm",en:"Hidro Kourkis – Java Developer & IT Support in Stockholm"};
  let language = "sv";
  try { if(localStorage.getItem("portfolio-language")==="en") language="en"; } catch {}
  function setLanguage(next) {
    language = next;
    root.lang = next;
    for(const {el,sv,en} of translated) el.textContent = next==="en"?en:sv;
    button.textContent=next==="sv"?"EN":"SV";
    button.setAttribute("aria-label", next==="sv"?"Switch to English":"Byt till svenska");
    document.title=titles[next];
    nav.setAttribute("aria-label",next==="sv"?"Huvudnavigation":"Main navigation");
    menu.setAttribute("aria-label",next==="sv"?"Öppna meny":"Open menu");
    try { localStorage.setItem("portfolio-language",next); } catch {}
  }
  function closeMenu() {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded","false");
  }
  button.addEventListener("click",()=>setLanguage(language==="sv"?"en":"sv"));
  menu.addEventListener("click",()=>{
    const open=nav.classList.toggle("open");
    menu.setAttribute("aria-expanded",String(open));
    menu.setAttribute("aria-label",language==="sv"?(open?"Stäng meny":"Öppna meny"):(open?"Close menu":"Open menu"));
  });
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu));
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("open")){closeMenu();menu.focus();}});
  window.matchMedia("(min-width:621px)").addEventListener?.("change",closeMenu);
  document.getElementById("year").textContent=String(new Date().getFullYear());
  setLanguage(language);
})();
