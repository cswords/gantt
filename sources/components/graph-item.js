import Utils from "../utils"
import Templater from "../templater";

export default class GraphItem {
    constructor(graph, data) {
        this.graph = graph;
        this.data = data;
        this.data.start_date = this.data.start_date * 1000;
        this.data.end_date = this.data.end_date * 1000;
        this.data.deadline = this.data.deadline * 1000;
        this.data.eta = this.data.eta * 1000;
        this.data.release_date = this.data.release_date * 1000;
        this.$element;

        this.template = $('#' + graph.$element.data('item-template')).html();
        this.statsTemplate = $('#' + graph.$element.data('stats-template')).html();
    }

    render() {
        this.$element = $(Templater.render(this.template, this.data));
        this.$element.css({
            left: this.graph.calcPostition(this.data.start_date) + 'px',
            width: this.graph.calcWidth(this.data.start_date, this.data.end_date) + 'px'
        });

        this.$element.on('mouseover', $.proxy(this._showTooltip, this));
        this.$element.on('mouseout', $.proxy(this._hideTooltip, this));

        return this.$element;
    }

    addMarker(timestamp, type) {
        var offset = this.graph.calcPostition(timestamp) - this.graph.calcPostition(this.data.start_date);

        $('<div/>')
            .addClass('graph__item-marker')
            .addClass('graph__item-marker--' + type)
            .attr('title', Utils.formatDate(timestamp, true))
            .css({ left: offset + 'px' })
            .appendTo(this.$element);
    }

    show(state) {
        if (state == 'area') this._showStats();
        else if (state == 'time') this._showHistory();
    }

    _showStats() {
        var $stats = $(document.createDocumentFragment());

        this.data.area_view.forEach((item) => {
            var $stat;

            item.type = item.type.toLowerCase();
            item.title = Utils.formatInterval(item.time);

            $stat = $(Templater.render(this.statsTemplate, item));
            $stat.width(item.percent + '%');
            $stats.append($stat);
        });

        this.$element.html($stats);

        this.addMarker(this.data.deadline, 'deadline');
        this.addMarker(this.data.eta, 'eta');
        this.addMarker(this.data.release_date, 'release');
    }

    _showHistory() {
        var $stats = $(document.createDocumentFragment());

        this.data.time_view.forEach((item) => {
            var $stat;
            item.class = '';
            item.title = item.status;
            $stat = $(Templater.render(this.statsTemplate, item));
            $stat.width(this.graph.calcWidth(item.from * 1000, item.to * 1000));
            $stats.append($stat);
        });

        this.$element.html($stats);

        this.addMarker(this.data.deadline, 'deadline');
        this.addMarker(this.data.eta, 'eta');
        this.addMarker(this.data.release_date, 'release');
    }

    _showTooltip(e) {
        var $element = $(e.target);
        var index = $element.index();
        var position = {};
        var html, data;

        if (!$element.hasClass('graph_item-stats')) return;

        if (this.graph.state == 'area') {
            data = this.data.area_view[index];
            html = data.type.toUpperCase() + '<br>';
            html += 'Spent time: ' + Math.round(data.percent) + '% ('  + Utils.formatInterval(data.time) + ')';
        }
        else if (this.graph.state == 'time') {
            data = this.data.time_view[index];
            html = data.status + '<br>';
            html += 'Spent time: ' + Utils.formatInterval(data.interval);
        }

        position.x = e.pageX;
        position.y = e.pageY;
        this.graph.tooltip.show(html, position);
    }

    _hideTooltip() {
        this.graph.tooltip.hide();
    }
}