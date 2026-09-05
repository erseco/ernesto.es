// Run as a browser DevTools snippet on /pocket/ after `hugo server`.
(() => {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const screen = document.querySelector('#screen');
  const control = name => document.querySelector(`.console [data-action="${name}"]`);
  const press = name => control(name).click();
  const key = name => document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }));
  const buttons = () => [...screen.querySelectorAll('.screen-menu button')];
  const text = element => element.textContent.replace(/\s+/g, ' ').trim();
  const templates = [...document.querySelectorAll('template[data-section]')];
  assert(screen && templates.length === 11, 'All eleven portfolio sections exist');
  if (control('power').getAttribute('aria-pressed') === 'false') press('power');
  if (control('sound').getAttribute('aria-pressed') === 'true') press('sound');
  press('start');
  assert(buttons().length === templates.length, 'START opens the complete menu');
  const pageScroll = window.scrollY;
  key('ArrowUp');
  let selected = screen.querySelector('[aria-current="true"]');
  assert(selected === buttons().at(-1), 'Up wraps to the last menu item');
  assert(selected.getBoundingClientRect().bottom <= screen.getBoundingClientRect().bottom + 1, 'Last item stays visible inside LCD');
  assert(window.scrollY === pageScroll, 'Cruceta scrolls only the LCD');
  key('ArrowDown');
  assert(screen.querySelector('[aria-current="true"]') === buttons()[0], 'Down wraps to the first item');
  key('a');
  assert(screen.querySelector('article'), 'Keyboard A opens biography');
  key('Escape');
  assert(buttons().length === templates.length, 'Escape restores the menu');

  let entriesChecked = 0;
  let linksChecked = 0;
  templates.forEach((template, sectionIndex) => {
    const entries = [...template.content.children];
    buttons()[sectionIndex].click();
    entries.forEach((entry, entryIndex) => {
      if (entries.length > 1) buttons()[entryIndex].click();
      assert(text(screen.querySelector('article')) === text(entry), `${template.dataset.section}: complete entry ${entryIndex + 1}`);
      const sourceLinks = [...entry.querySelectorAll('a')];
      const links = [...screen.querySelectorAll('a')];
      links.forEach((link, index) => {
        assert(link.href === sourceLinks[index].href && /^(https?:|mailto:)/.test(link.href), 'Source links are preserved');
        assert(link.rel.includes('noopener'), 'External links isolate the new tab');
        linksChecked++;
      });
      if (links.length) {
        let activated = false;
        links[0].addEventListener('click', event => { event.preventDefault(); activated = true; }, { once: true });
        press('accept');
        assert(activated, 'Physical A opens the entry link');
      }
      if (screen.scrollHeight > screen.clientHeight) {
        press('down');
        assert(screen.scrollTop > 0, 'Long content scrolls with the cruceta');
      }
      entriesChecked++;
      press('back');
      if (entries.length > 1) assert(buttons()[entryIndex].getAttribute('aria-current') === 'true', 'Back restores entry selection');
    });
    if (entries.length > 1) press('back');
    assert(buttons()[sectionIndex].getAttribute('aria-current') === 'true', 'Back restores section selection');
  });

  press('sound');
  assert(control('sound').getAttribute('aria-pressed') === 'true', 'SELECT enables optional sound');
  press('sound');
  press('power');
  assert(screen.inert && getComputedStyle(screen).visibility === 'hidden', 'Power off hides and disables the screen');
  press('start');
  assert(screen.inert, 'START cannot operate a powered-off console');
  press('power');
  assert(!screen.inert && screen.querySelector('.welcome'), 'Power on restores the title screen');
  assert(document.documentElement.scrollWidth <= window.innerWidth, 'Page fits viewport without horizontal overflow');
  const result = `PASS: ${templates.length} sections, ${entriesChecked} complete entries, ${linksChecked} links; keyboard, scrolling, back, power and sound controls.`;
  console.info(result);
  return result;
})();
