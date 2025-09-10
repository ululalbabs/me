document.addEventListener('DOMContentLoaded', () => {

  /* ===== DROPDOWN: #customDropdown ===== */
  (function initDropdown() {
    const dropdown = document.getElementById('customDropdown');
    if (!dropdown) return;

    const btn = dropdown.querySelector('.dropdown-btn');
    const list = dropdown.querySelector('.dropdown-list');
    if (!btn || !list) return;

    if (!list.id) list.id = `dropdown-list-${Math.random().toString(36).slice(2,8)}`;
    btn.setAttribute('aria-controls', list.id);
    btn.setAttribute('aria-expanded', btn.getAttribute('aria-expanded') || 'false');

    const options = Array.from(list.querySelectorAll('li'));
    if (!options.length) return;

    options.forEach(opt => {
      opt.setAttribute('role', opt.getAttribute('role') || 'option');
      opt.setAttribute('tabindex', opt.getAttribute('tabindex') || '-1');
      opt.setAttribute('aria-selected', opt.getAttribute('aria-selected') || 'false');
    });

    let selectedIndex = options.findIndex(o => o.getAttribute('aria-selected') === 'true');
    if (selectedIndex < 0) selectedIndex = 0;

    const labelEl = btn.querySelector('.label');
    if (labelEl) labelEl.textContent = options[selectedIndex].textContent.trim();

    const focusOption = idx => options[(idx + options.length) % options.length].focus();
    const updateSelection = (idx, {updateLabel=true}={}) => {
      idx = (idx + options.length) % options.length;
      options.forEach((opt,i) => opt.setAttribute('aria-selected', i===idx?'true':'false'));
      selectedIndex = idx;
      if (updateLabel && labelEl) labelEl.textContent = options[idx].textContent.trim();
    };

    const openDropdown = () => { list.classList.add('open'); btn.classList.add('active'); btn.setAttribute('aria-expanded','true'); focusOption(selectedIndex); };
    const closeDropdown = () => { list.classList.remove('open'); btn.classList.remove('active'); btn.setAttribute('aria-expanded','false'); };

    btn.addEventListener('click', e => { e.stopPropagation(); list.classList.contains('open') ? closeDropdown() : openDropdown(); });

    btn.addEventListener('keydown', e => {
      if (['ArrowDown','Enter',' '].includes(e.key) || e.code==='Space') { e.preventDefault(); openDropdown(); }
      else if (e.key==='ArrowUp') { e.preventDefault(); updateSelection(options.length-1,{updateLabel:false}); openDropdown(); }
    });

    options.forEach((opt, idx) => {
      opt.addEventListener('click', e => {
        e.stopPropagation();
        updateSelection(idx);
        closeDropdown();
        if (opt.dataset.value) window.location.href = opt.dataset.value;
      });
      opt.addEventListener('keydown', e => {
        let newIndex;
        switch(e.key){
          case 'ArrowDown': e.preventDefault(); newIndex=(idx+1)%options.length; focusOption(newIndex); updateSelection(newIndex,{updateLabel:false}); break;
          case 'ArrowUp': e.preventDefault(); newIndex=(idx-1+options.length)%options.length; focusOption(newIndex); updateSelection(newIndex,{updateLabel:false}); break;
          case 'Home': e.preventDefault(); focusOption(0); updateSelection(0,{updateLabel:false}); break;
          case 'End': e.preventDefault(); focusOption(options.length-1); updateSelection(options.length-1,{updateLabel:false}); break;
          case 'Enter': case ' ': case 'Space': e.preventDefault(); opt.click(); break;
          case 'Escape': e.preventDefault(); closeDropdown(); btn.focus(); break;
        }
      });
      opt.addEventListener('focus', () => options.forEach((o,i)=>o.setAttribute('aria-selected',i===idx?'true':'false')));
    });

    document.addEventListener('click', e => { if(!dropdown.contains(e.target)) closeDropdown(); });
    document.addEventListener('keydown', e => { if(e.key==='Escape' && list.classList.contains('open')) { closeDropdown(); btn.focus(); } });
  })();


  /* ===== TYPING EFFECT ===== */
  (function typingEffectLoop() {
    const text = "w o r k s";
    const element = document.querySelector('.section-title');
    const speed = 100;
    const delayAfter = 1000;

    element.innerHTML = "";
    const spans = text.split("").map(char => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.opacity = 0;
      element.appendChild(span);
      return span;
    });

    let i = 0;
    let typing = true;

    function loop() {
      if (typing) {
        spans[i].style.opacity = 1;
        i++;
        if (i < spans.length) {
          setTimeout(loop, speed);
        } else {
          typing = false;
          setTimeout(loop, delayAfter);
        }
      } else {
        i--;
        spans[i].style.opacity = 0;
        if (i > 0) {
          setTimeout(loop, speed / 2);
        } else {
          typing = true;
          setTimeout(loop, speed);
        }
      }
    }

    loop();
  })();

  /* ===== CONTACT BUBBLE ===== */
  (function initContactBubble() {
    const contactWrapper = document.getElementById('contactWrapper');
    const contactBtn = document.getElementById('contactBtn');
    if (!contactWrapper || !contactBtn) return;

    contactBtn.setAttribute('aria-expanded', contactWrapper.classList.contains('active')?'true':'false');

    contactBtn.addEventListener('click', e => {
      e.stopPropagation();
      const active = contactWrapper.classList.toggle('active');
      contactBtn.setAttribute('aria-expanded', active?'true':'false');
    });

    document.addEventListener('click', e => {
      if(!contactWrapper.contains(e.target) && contactWrapper.classList.contains('active')){
        contactWrapper.classList.remove('active');
        contactBtn.setAttribute('aria-expanded','false');
      }
    });

    document.addEventListener('keydown', e => {
      if(e.key==='Escape' && contactWrapper.classList.contains('active')){
        contactWrapper.classList.remove('active');
        contactBtn.setAttribute('aria-expanded','false');
        contactBtn.focus();
      }
    });

    const contactIcons = document.getElementById('contactIcons');
    if(contactIcons) contactIcons.addEventListener('click', ev => ev.stopPropagation());
  })();


  /* ===== RESPECT PREFERS-REDUCED-MOTION ===== */
  (function respectReducedMotion() {
    try {
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
        document.querySelectorAll('.dropdown-list, .gallery-item img, .contact-icons')
          .forEach(el=>el.style.transition='none');
      }
    } catch(e){/* ignore */}
  })();

});