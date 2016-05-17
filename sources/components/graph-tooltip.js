export default class GraphTooltip {

    constructor() {
        this.$element = $('<div />').addClass('tooltip');
        this.hide();
        $('body').append(this.$element);
    }

    show(html, position) {
        this.$element.removeClass('tooltip--hide');
        this.$element.css({
            top: position.y + 'px',
            left: position.x + 'px',
        });
        this.$element.html(html);
    }

    hide() {
        this.$element.addClass('tooltip--hide');
    }
}