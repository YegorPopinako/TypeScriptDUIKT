import * as $ from 'jquery';

export function setupAnimations(): void {
    $('.animate-on-scroll').each(function() {
        const $element: JQuery<HTMLElement> = $(this);
        const elementOffset: number = $element.offset()?.top ?? 0;
        const scrollTop: number = $(window).scrollTop() ?? 0;
        const windowHeight: number = $(window).height() ?? 0;

        if (scrollTop + windowHeight > elementOffset) {
            $element.addClass('animated');
        }
    });

    $(window).on('scroll', function() {
        $('.animate-on-scroll').each(function() {
            const $element: JQuery<HTMLElement> = $(this);
            const elementOffset: number = $element.offset()?.top ?? 0;
            const scrollTop: number = $(window).scrollTop() ?? 0;
            const windowHeight: number = $(window).height() ?? 0;

            if (scrollTop + windowHeight > elementOffset) {
                $element.addClass('animated');
            }
        });
    });
}
