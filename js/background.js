var steps = [];

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    switch (request.message) {
        case 'showPageAction':
            chrome.pageAction.show(sender.tab.id);
            break;
        case 'captureStart':
            steps = [];
            sendResponse({message: 'ok'});
            break;
        case 'captureStep':
            chrome.tabs.captureVisibleTab(null, null, function(dataUrl) {
                steps.push(dataUrl);
                sendResponse({message: 'ok'});
            });
            break;
        case 'captureStop':
            var doc = new jsPDF("l");

            var first = true;
            for (var i in steps) {
                if (!first) doc.addPage();
                else first = false;
                imgData = atob(steps[i].slice('data:image/jpeg;base64,'.length));
                doc.addImage(imgData, 'JPEG', 0, 0, 297, 210);
            }

            chrome.tabs.create({
                url: doc.output('datauristring'),
                active: true
            }, function(w) {
                // console.log(w);
            });
            sendResponse({message: 'ok'});
            break;
        default:
            console.log('Unimplemented yet');
    }
    
});

chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, {code:"impress2Pdf()"});
});