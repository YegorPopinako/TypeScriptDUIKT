"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// main.ts
const modals_1 = require("./ts/modals");
const scrollToTop_1 = require("./ts/scrollToTop");
const animations_1 = require("./ts/animations");
const fetchData_1 = require("./ts/fetchData");
document.addEventListener('DOMContentLoaded', () => {
    (0, modals_1.setupModals)();
    (0, scrollToTop_1.setupScrollToTop)();
    (0, animations_1.setupAnimations)();
    (0, fetchData_1.fetchData)();
});
