import { mount } from 'svelte';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource/silkscreen/400.css';
import '@fontsource/silkscreen/700.css';
import './app.css';
import App from './App.svelte';
mount(App, { target: document.getElementById('app') });
