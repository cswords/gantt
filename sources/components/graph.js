import Templater from "../templater";
import GraphItem from "./graph-item";
import GraphMarker from "./graph-marker";
import GraphTooltip from "./graph-tooltip";

export default class Graph {

    constructor(element, data, state) {
        this.element = element.get(0) || element;
        this.$element = $(element)
        this.data = data;
        this.state = state || 'area'; // area || time

        this.items = [];

        this.startDate = new Date(this.data.start_date * 1000);
        this.startDate.setHours(0,0,0,0);
        this.endDate = new Date(this.data.end_date * 1000);
        this.endDate.setHours(24,0,0,0);
        this.totalDays = (this.endDate - this.startDate) / 3600000 / 24;

        this.dayWidth = Math.round(this.$element.width() / this.totalDays);
        this.totalWidth = this.dayWidth * this.totalDays;
        this.$element.width(this.totalWidth);

        this.tooltip = new GraphTooltip();

        this.render();
    }

    calcPostition(time) {
        return Math.floor(this.totalWidth / (this.endDate - this.startDate) * (time - this.startDate));
    }

    calcTime(position) {
        return Math.floor((this.endDate - this.startDate) / this.totalWidth * position + this.startDate.getTime());
    }

    calcWidth(startTime, endTime) {
        return this.calcPostition(endTime) - this.calcPostition(startTime);
    }

    changeState(state) {
        this.state = state;
        this.items.forEach((item) => {
            item.show(this.state);
        })
    }

    render() {
        var $list = $('<ul />');

        this.data.tickets.forEach((data) => {
            var item = new GraphItem(this, data);
            this.items.push(item);
            $list.append(item.render());

            item.show(this.state);
        });

        $list.appendTo(this.$element);

        this._showGrid();
        this._showLabels();
        this._showCurrentDate();
        this._showPointer();

        var startMarker = new GraphMarker(this, 'start-time');
        this.$element.append(startMarker.render());
        startMarker.$element.hide();

        var endMarker = new GraphMarker(this, 'end-time');
        this.$element.append(endMarker.render());
        endMarker.$element.hide();

        this.$element.on('click', (e) => {
            var $item = $(e.target).closest('.graph__item');
            if ($item.length) {
                var item = this.items[$item.index()];
                this.$element.find('.graph__item').addClass('graph__item--shadowed');
                $item.removeClass('graph__item--shadowed');
                startMarker.moveTo(this.calcPostition(item.data.start_date));
                endMarker.moveTo(this.calcPostition(item.data.end_date));
                startMarker.$element.show();
                endMarker.$element.show();
                $('.list__item').addClass('list__item--shadowed');
                $('[data-id=' + $item.attr('id') + ']').removeClass('list__item--shadowed');
            }
            else {
                $('.graph__item').removeClass('graph__item--shadowed');
                startMarker.$element.hide();
                endMarker.$element.hide();
                $('.list__item').removeClass('list__item--shadowed');
            }
        });
    }

    _showGrid() {
        this.$element.css({
            'background-size': this.dayWidth + 'px, ' + this.dayWidth * 7 + 'px',
            'background-position': (1 - this.startDate.getDay()) * this.dayWidth + 'px 0'
        });
    }

    _showLabels(interval) {
        var dates = [];
        var offset, html;
        interval = interval || (this.totalDays < 21) ? 2 : (this.totalDays < 100) ? 5 : 20;

        for (let i=0, total = Math.round(this.totalDays / interval); i < total; i++) {
            let date = new Date(this.startDate.getTime() + i * interval * 86400000);
            dates.push(date.getDate() + '/' + (date.getMonth() + 1));
        }

        offset = this.dayWidth * interval;
        html = dates.map((date) => {
            let item = {
                title: date,
                styles: 'width:' + offset + 'px',
            }
            return Templater.render('<li style="{{styles}}"><i>{{title}}</i></li>', item);
        }).join('');

        $('<ul>' + html + '</ul>').addClass('graph__dates').appendTo(this.$element);

        if ($('body').height() > $(window).height()) {
            $('.graph__dates')
                .clone()
                .addClass('graph__dates--fixed')
                .css('padding-left', $('.graph__dates').offset().left + 'px')
                .appendTo('body');
        }
    }

    _showCurrentDate() {
        var marker = new GraphMarker(this, 'current')
        this.$element.append(marker.render());
        marker.moveTo(this.calcPostition(Date.now()));
    }

    _showPointer() {
        this.$element.append(new GraphMarker(this, 'pointer', true).render());
    }
}