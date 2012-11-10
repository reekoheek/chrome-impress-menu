function impress2Pdf() {
    var ids = [];
    $('.step').each(function() {
        ids.push($(this).attr('id'));
    });

    $('.press-menu').removeClass('hover').hide();

    chrome.extension.sendRequest({ message: 'captureStart' }, function(response) {
        var captureStep = function() {
            if (ids.length) {
                location.href = '#/' + ids[0];
                setTimeout(function() {
                    chrome.extension.sendRequest({ message: 'captureStep' }, function(response) {
                        ids.shift();
                        captureStep();
                    });
                }, 2000);
            } else {
                chrome.extension.sendRequest({ message: 'captureStop' }, function(response) {
                });
            }
        };
        captureStep();
    });
}

if ($('body').hasClass('impress-enabled')) {
    chrome.extension.sendRequest({ message: 'showPageAction' });

    $('#press-btn-print').click(function(evt) {
        evt.preventDefault();
        impress2Pdf();
        return false;
    });
}