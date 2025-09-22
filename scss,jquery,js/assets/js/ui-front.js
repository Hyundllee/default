/*********************************
 * UI 스크립트 * 
 * 작성자 : 이동현 *
 * ********************************/ 
/** polyfill **/
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {
        if (this === null) throw new TypeError('this is null or not defined'); 
        let array = Object(this); 
        let length = array.length >>> 0;
        for (let i = 0; i < length; i++) {
            if (i in array) callback.call(thisArg.array[i], i, array); 
        } 
    };
}

if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

if (window.HTMLCollection && !HTMLCollection.prototype.forEach) {
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
}

const ui = {
    pageWidth: 1800, 
    className: {
        lock: '.lock', 
        wrap: '.page', 
        mainWrap: '.page', 
        header: '.page-head', 
        headerInner: '.head-inner', 
        headerLeft: '.head-left', 
        headerRight: '.head-right', 
        title: '.head-title', 
        body: '.page-body', 
        contents: '.page-contents', 
        btnTop: '.btn-page-top', 
        floatingBtn: '.floating-btn', 
        popup: '.popup', 
        topFixed: '.top-fixed'
    },
    basePath: function() {
        let rtnVal = '/static'; 
        if (location.pathname.indexOf('/public') > -1) rtnVal = '/src/main/resources' + rtnVal; 
        else rtnVal = '/portal' + rtnVal; 
        return rtnVal; 
    }, 
    isInit: false,  
}; 

$(function() {
    // ui.device.check(); 

    const $elements = $.find('*[data-include-html]');
    if ($elements.length) {
        ui.html.include().done(ui.init);
    } else {
        ui.init();
    }
});

// HTML include 
ui.html = {
    include: function() {
        const dfd = $.Deferred(); 
        const $elements = $.find('*[data-include-html]'); 
        if ($elements.length) {
            if (location.host) {
                $.each($elements, function (i) {
                    const $this = $(this); 
                    $this.empty(); 
                    const $html = $this.data('include-html'); 
                    const $htmlAry = $html.split('/'); 
                    const $htmlFile = $htmlAry[$htmlAry.length - 1]; 
                    const $docTitle = document.title; 
                    let $title = null; 
                    if ($docTitle.indexOf(' | ') > -1) {
                        $title = $docTitle.split(' | ')[0];
                    }
                    $this.load($html, function(res, sta, xhr) {
                        if (sta === 'success') {
                            if (!$this.attr('class') && !$this.attr('id')) $this.children().unwrap(); 
                            else $this.removeAttr('data-include-html'); 
                        }
                        if (i === $elements.length - 1) {
                            dfd.resolve(); 
                            $(window).trigger('includHtml');
                        }
                    });
                });
            } else {
                dfd.resolve(); 
                $(window).trigger('includHtml');
            }
        } else {
            dfd.resolve(); 
            $(window).trigger('includHtml'); 
        }
        return dfd.promise(); 
    }
};


// 디바이스 확인 
// ui.device = {
//     screenH: window.screen.height, 
//     screenW: window.screen.width, 
//     check: function () {
//         ui.mobile.check(); 
//         ui.pc.check(); 
//     }
// }