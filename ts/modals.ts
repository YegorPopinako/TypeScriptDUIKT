import * as $ from 'jquery';

export function setupModals(): void {
    const openModalButtons: JQuery<HTMLElement> = $('[data-open-modal]');
    const closeModalButtons: JQuery<HTMLElement> = $('[data-close-modal]');
    const modals: JQuery<HTMLElement> = $('[data-modal]');

    openModalButtons.on('click', function() {
        const targetModal: JQuery<HTMLElement> = $($(this).data('open-modal') as string);
        targetModal.addClass('is-active');
    });

    closeModalButtons.on('click', function() {
        const modal: JQuery<HTMLElement> = $(this).closest('[data-modal]') as JQuery<HTMLElement>;
        modal.removeClass('is-active');
    });

    $(document).on('click', function(event: JQuery.ClickEvent) {
        if ($(event.target).hasClass('is-active')) {
            $(event.target).removeClass('is-active');
        }
    });
}
