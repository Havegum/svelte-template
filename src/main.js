import '../public/global.hash.css';
import App from './App.svelte';

const dev = process.env.dev;
const target = document.getElementById('svelte-project');

const app = new App({ target, props: { target, dev } });

export default app;
