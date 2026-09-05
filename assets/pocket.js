(() => {
  const device = document.querySelector('.console');
  const screen = document.querySelector('#screen');
  const status = document.querySelector('#screen-status');
  const welcome = screen.innerHTML;
  const sections = [...document.querySelectorAll('template[data-section]')];
  let view = 'welcome';
  let section = 0;
  let selected = 0;
  let menuSelection = 0;
  let entrySelection = 0;
  let powered = true;
  let sound = false;
  let audio;

  function beep(frequency = 440) {
    if (!sound) return;
    try {
      audio ||= new (window.AudioContext || window.webkitAudioContext)();
      void audio.resume().catch(() => {});
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      oscillator.type = 'square';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.025, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .07);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start();
      oscillator.stop(audio.currentTime + .08);
    } catch { /* Sound is optional when browser audio is unavailable. */ }
  }

  function highlight(focus = false) {
    const buttons = [...screen.querySelectorAll('.screen-menu button')];
    buttons.forEach((button, index) => button.setAttribute('aria-current', String(index === selected)));
    const button = buttons[selected];
    if (button) {
      // Scroll only the LCD, never the surrounding page.
      if (button.offsetTop < screen.scrollTop) screen.scrollTop = button.offsetTop;
      if (button.offsetTop + button.offsetHeight > screen.scrollTop + screen.clientHeight) {
        screen.scrollTop = button.offsetTop + button.offsetHeight - screen.clientHeight;
      }
      if (focus) button.focus({ preventScroll: true });
      status.textContent = `${String(selected + 1).padStart(2, '0')}/${String(buttons.length).padStart(2, '0')} · A ELEGIR · B VOLVER`;
    }
  }

  function renderMenu(title, labels, counts = []) {
    screen.replaceChildren();
    const heading = document.createElement('h2');
    heading.className = 'menu-title';
    heading.textContent = title;
    const menu = document.createElement('nav');
    menu.className = 'screen-menu';
    menu.setAttribute('aria-label', title);
    labels.forEach((label, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      if (counts[index]) {
        const count = document.createElement('small');
        count.textContent = String(counts[index]).padStart(2, '0');
        button.append(count);
      }
      button.addEventListener('focus', () => { selected = index; highlight(); });
      button.addEventListener('click', () => { selected = index; act('accept'); });
      menu.append(button);
    });
    screen.append(heading, menu);
    screen.scrollTop = 0;
    highlight(true);
  }

  function render() {
    const entries = [...sections[section].content.children];
    if (view === 'menu') {
      renderMenu('ELIGE TU DESTINO', sections.map(item => item.dataset.section), sections.map(item => item.content.children.length));
    } else if (view === 'entries') {
      renderMenu(sections[section].dataset.section, entries.map(entry => entry.querySelector('h2').textContent));
    } else if (view === 'detail') {
      screen.replaceChildren(entries[entrySelection].cloneNode(true));
      screen.scrollTop = 0;
      screen.focus({ preventScroll: true });
      status.textContent = '↑↓ LEER · TAB ENLACES · B VOLVER';
    }
    document.title = `${view === 'menu' ? 'Menú' : sections[section].dataset.section} · Pocket Portfolio`;
  }

  function act(action) {
    if (action === 'power') {
      powered = !powered;
      device.classList.toggle('is-off', !powered);
      device.querySelector('[data-action="power"]').setAttribute('aria-pressed', String(powered));
      screen.inert = !powered;
      if (powered) {
        view = 'welcome';
        screen.innerHTML = welcome;
        screen.scrollTop = 0;
        status.textContent = 'PULSA START';
        document.title = 'Pocket Portfolio · Ernesto Serrano';
        beep(880);
      }
      return;
    }
    if (!powered) return;
    if (action === 'sound') {
      sound = !sound;
      device.querySelector('[data-action="sound"]').setAttribute('aria-pressed', String(sound));
      status.textContent = sound ? 'SONIDO ACTIVADO' : 'SONIDO DESACTIVADO';
      beep(660);
      return;
    }
    beep(action === 'accept' || action === 'start' ? 660 : 330);
    if (action === 'start' || (view === 'welcome' && ['accept', 'right'].includes(action))) {
      view = 'menu'; selected = 0; render();
    } else if (action === 'up' || action === 'down') {
      const step = action === 'up' ? -1 : 1;
      if (view === 'detail') {
        screen.scrollTop += step * 45;
      } else {
        const count = screen.querySelectorAll('.screen-menu button').length;
        if (count) { selected = (selected + step + count) % count; highlight(true); }
      }
    } else if (action === 'accept' || action === 'right') {
      if (view === 'menu') {
        section = selected; menuSelection = selected; selected = 0; entrySelection = 0;
        view = sections[section].content.children.length === 1 ? 'detail' : 'entries';
        render();
      } else if (view === 'entries') {
        entrySelection = selected; view = 'detail'; render();
      } else if (view === 'detail') {
        screen.querySelector('a')?.click();
      }
    } else if (action === 'back' || action === 'left') {
      if (view === 'detail' && sections[section].content.children.length > 1) {
        view = 'entries'; selected = entrySelection;
      } else if (view === 'entries' || view === 'detail') {
        view = 'menu'; selected = menuSelection;
      } else return;
      render();
    }
  }

  device.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (button) act(button.dataset.action);
  });
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    // Preserve native Enter/Space activation for focused links and buttons.
    if (['Enter', ' '].includes(event.key) && event.target.closest('a, button')) return;
    if (event.target.closest('a') && !screen.contains(event.target)) return;
    const action = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', Enter: 'accept', a: 'accept', b: 'back', Escape: 'back', s: 'start' }[event.key];
    if (!action) return;
    event.preventDefault();
    const button = device.querySelector(`[data-action="${action}"]`);
    button?.classList.add('pressed');
    setTimeout(() => button?.classList.remove('pressed'), 90);
    act(action);
  });
})();
