require('./scss/app.scss');

import TicketList from "./components/list";
import Graph from "./components/graph"

var url = '/mocks.json';

var state, graph, tickets;

$(document).ready(function() {
    state = location.hash.substr(1) || 'area';
    $('.switcher__link[href=#' + state +']').addClass('active');
    window.onhashchange = function() {
        state = location.hash.substr(1) || 'area';
        graph.changeState(state);
        $('.switcher__link').removeClass('active');
        $('.switcher__link[href=#' + state +']').addClass('active');
    };

    $.ajax({
        url: url
    }).done(function(data) {
        $('.preloader').hide();
        $('.container').show();
        tickets = new TicketList($('#tickets'), data);
        graph = new Graph($('#graph'), data, state);
    });
});