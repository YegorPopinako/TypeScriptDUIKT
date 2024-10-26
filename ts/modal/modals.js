"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupModals = setupModals;
var $ = require("jquery");
function setupModals() {
    var openModalButtons = $('[data-open-modal]');
    var closeModalButtons = $('[data-close-modal]');
    var modals = $('[data-modal]');
    openModalButtons.on('click', function () {
        var targetModal = $($(this).data('open-modal'));
        targetModal.addClass('is-active');
    });
    closeModalButtons.on('click', function () {
        var modal = $(this).closest('[data-modal]');
        modal.removeClass('is-active');
    });
    $(document).on('click', function (event) {
        if ($(event.target).hasClass('is-active')) {
            $(event.target).removeClass('is-active');
        }
    });
}
