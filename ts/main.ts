// main.ts
import { setupModals } from "./modal/modals";
import { setupScrollToTop } from './scroll/scrollToTop';
import { setupAnimations } from './animation/animations';
import { fetchData } from './fetch/fetchData';

document.addEventListener('DOMContentLoaded', () => {
    setupModals();
    setupScrollToTop();
    setupAnimations();
    fetchData();
});
