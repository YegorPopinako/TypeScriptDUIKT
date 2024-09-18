"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupModals = void 0;
const $ = require("jquery");
function setupModals() {
    const openModalButtons = $('[data-open-modal]');
    const closeModalButtons = $('[data-close-modal]');
    const modals = $('[data-modal]');
    openModalButtons.on('click', function () {
        const targetModal = $($(this).data('open-modal'));
        targetModal.addClass('is-active');
    });
    closeModalButtons.on('click', function () {
        const modal = $(this).closest('[data-modal]');
        modal.removeClass('is-active');
    });
    $(document).on('click', function (event) {
        if ($(event.target).hasClass('is-active')) {
            $(event.target).removeClass('is-active');
        }
    });
}
exports.setupModals = setupModals;
