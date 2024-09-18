"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAnimations = setupAnimations;
var $ = require("jquery");
function setupAnimations() {
    $('.animate-on-scroll').each(function () {
        var _a, _b, _c, _d;
        var $element = $(this);
        var elementOffset = (_b = (_a = $element.offset()) === null || _a === void 0 ? void 0 : _a.top) !== null && _b !== void 0 ? _b : 0;
        var scrollTop = (_c = $(window).scrollTop()) !== null && _c !== void 0 ? _c : 0;
        var windowHeight = (_d = $(window).height()) !== null && _d !== void 0 ? _d : 0;
        if (scrollTop + windowHeight > elementOffset) {
            $element.addClass('animated');
        }
    });
    $(window).on('scroll', function () {
        $('.animate-on-scroll').each(function () {
            var _a, _b, _c, _d;
            var $element = $(this);
            var elementOffset = (_b = (_a = $element.offset()) === null || _a === void 0 ? void 0 : _a.top) !== null && _b !== void 0 ? _b : 0;
            var scrollTop = (_c = $(window).scrollTop()) !== null && _c !== void 0 ? _c : 0;
            var windowHeight = (_d = $(window).height()) !== null && _d !== void 0 ? _d : 0;
            if (scrollTop + windowHeight > elementOffset) {
                $element.addClass('animated');
            }
        });
    });
}
