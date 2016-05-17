import Utils from "../utils"
import Templater from "../templater";

export default class GraphPointer {
    constructor(graph, modificator, moveable) {
        this.graph = graph;
        this.$element = $('<div />').addClass('graph__marker');
        this.$marker = $('<div />').addClass('graph__marker-time');

        if (modificator) {
            this.$element.addClass('graph__marker--' + modificator);
        }

        if (moveable) {
            this.graph.$element.on('mousemove', (e) => {
                this.moveTo(e.clientX - this.graph.$element.offset().left - 2);
            });
        }
    }

    render() {
        this.$element.append(this.$marker);
        this.$element.appendTo(this.graph.$element);

        if ($('body').height() > $(window).height()) {
            this.$marker.css({ top: $(document).scrollTop() + $(window).height() - 76 + 'px' });
            $(window).on('scroll', () => {
                this.$marker.css({ top: $(document).scrollTop() + $(window).height() - 76 + 'px' });
            });
        }
    }

    moveTo(offset) {
        this.$element.css({ left: offset + 'px' });
        this.$marker.text(Utils.formatDate(this.graph.calcTime(offset), this.graph.totalDays > 100));

        if (this.graph.$element.width() - offset < 200) {
            this.$marker.addClass('graph__marker-time--reversed');
        }
        else if (this.graph.$element.width() - offset > 200) {
            this.$marker.removeClass('graph__marker-time--reversed');
        }
    }
}