"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupScrollToTop = void 0;
const $ = require("jquery");
function setupScrollToTop() {
    const scrollToTopButton = $('#scroll-to-top');
    $(window).on('scroll', function () {
        var _a;
        const scrollTop = (_a = $(this).scrollTop()) !== null && _a !== void 0 ? _a : 0; // Застосування значення за замовчуванням
        if (scrollTop > 300) {
            scrollToTopButton.fadeIn();
        }
        else {
            scrollToTopButton.fadeOut();
        }
    });
    scrollToTopButton.on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 800);
    });
}
exports.setupScrollToTop = setupScrollToTop;
