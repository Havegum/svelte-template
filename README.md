# Svelte project
## Available commands
- `yarn dev` Builds the project, watches for changes, and starts a development server on [localhost:5000](http://localhost:5000).
- `yarn build` Builds the project for production.


## App props
The following properties are received by `src/App.svelte` *(or whatever file gets mounted by the entry point)*:
* `dev` – a boolean indicating whether we're in dev mode or not.
* `target` – the HTML element the app is mounting to.
