import * as $ from 'jquery';

export function setupScrollToTop(): void {
    const scrollToTopButton: JQuery<HTMLElement> = $('#scroll-to-top');

    $(window).on('scroll', function() {
        const scrollTop: number = $(this).scrollTop() ?? 0; // Застосування значення за замовчуванням
        if (scrollTop > 300) {
            scrollToTopButton.fadeIn();
        } else {
            scrollToTopButton.fadeOut();
        }
    });

    scrollToTopButton.on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
    });
}
