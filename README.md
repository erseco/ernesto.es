# ernesto.es

My personal webpage. You can visit it in [ernesto.es](https://ernesto.es)

## Local preview

With Hugo Extended installed (v0.156 or newer):

```sh
hugo server
```

Open <http://localhost:1313/> and choose **Modo bolsillo**, or visit
<http://localhost:1313/pocket/> directly.

The pocket edition uses the same `config.yml` content as the main portfolio.
Both views share travel locations in `data/places.json`. Its CSS, JavaScript,
and licensed VT323 font are served locally, with no runtime dependencies.

Use the on-screen buttons or arrow keys, A/Enter to choose, and B/Escape to
return. START (or S) opens the main menu; SELECT toggles sound, initially off.
Inside an entry, up/down scroll, A opens its first link, and Tab/Enter access
all links. The top switch turns the console off and on.

## Check the pocket edition

Run `hugo --minify --gc` for the production build. With the local preview open
at `/pocket/`, run `tests/pocket.browser.js` as a browser DevTools snippet
(or paste it into the console). It checks every entry and link, keyboard
navigation, scrolling, selection restoration, power, sound, and viewport
overflow. Run it at desktop and mobile widths.
