import Templater from "../templater";

export default class List {
    constructor(element, data) {
        this.element = element.get(0) || element;
        this.$element = $(element)
        this.data = data;
        this.template = $('#' + this.$element.data('item-template')).html();

        this.render();
    }

    render() {
        var html = this.data.tickets.map((item) =>
            Templater.render(this.template, item)).join('');

        this.$element.html('<ul>' + html + '</ul>');
    }
}