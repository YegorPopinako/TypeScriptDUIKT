// main.ts
import { setupModals } from "./ts/modals";
import { setupScrollToTop } from './ts/scrollToTop';
import { setupAnimations } from './ts/animations';
import { fetchData } from './ts/fetchData';

document.addEventListener('DOMContentLoaded', () => {
    setupModals();
    setupScrollToTop();
    setupAnimations();
    fetchData();
});
