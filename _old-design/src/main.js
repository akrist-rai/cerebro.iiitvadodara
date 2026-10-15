import { mount } from 'svelte';
import '@fontsource-variable/imbue';
import '@fontsource-variable/dm-sans';
import './app.css';
import App from './App.svelte';
mount(App, { target: document.getElementById('app') });
