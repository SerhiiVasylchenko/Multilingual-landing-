$(document).ready(function() {

    var $switcher = $('.lang_switcher'),
        href = window.location.pathname,
        href_name = href.replace(/\//g, '');

    if(href_name == 'en') {
        $switcher.find('.active').removeClass('active');
        $switcher.find('.en').addClass('active')
    }

});
