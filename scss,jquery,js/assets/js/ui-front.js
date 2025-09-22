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
    init: function () {
        if (ui.isInit) {
            ui.reInit();
        } else {
            ui.common.init();
        }
    },
    reInit: function () {
        ui.common.init();
    }, 
    loadInit: function () {
        if (ui.isLoadInit) return; 
        ui.isLoadInit = true;
        ui.common.loadInit(); 
    }

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

$(window).on('load', function () {
    ui.loadInit(); 

    $(window).resize();
})

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



// common 
ui.common = {
    init: function () {
        ui.common.menu(); 
        ui.common.menuActive(); 
    },
    loadInit: function () {
        ui.common.menuActive(); 

    },
    menuActive: function () {
        const $menuHtml = $('[data-menu-active]');
        const $menuIdHtml = $('[data-menu-id-view]'); 
        let $gnb = $('#gnb .page-gnb'); 
        let $lnb = $('#lnb'); 
        const $activeClassName = 'active'; 
        const $breadcrumb = $('.breadcrumb'); 
        const $breadcrumbArry = []; 
        let clfMhnm = getUrlParams().clfMhnm; 
        if (!!clfMhnm) clfMhnm = decodeURI(decodeURIComponent(clfMhnm)); 

        function gnbFindTxt(str) {
            $findMenu = $('#gnb .page-gnb , #lnb'); 
            $findMenu.find('a').each(function () {
                const $this = $(this); 
                if ($this.text() === str) $this.parent('li').addClass($activeClassName); 
            }); 
        }

        if ($menuIdHtml.length) {
            function menuIdFn() {
                if (!!clfMhnm) gnbFindTxt(clfMhnm); 
                let menuID = $menuIdHtml.data('menu-id-view'); 
                const $menuID = $("[data-menu-id='" + menuID + "']"); 
                $menuID.each(function() {
                    const $this = $(this); 
                    $this.addClass($activeClassName).parents('li').addClass($activeClassName); 
                    const $lnb = $this.closest('.page-lnb-inner'); 
                    if ($lnb.length) $lnb.removeClass('hide').addClass('active').siblings('.page-lnb-inner').remove();
                });

                const $gnbActive = $gnb.find('.' + $activeClassName); 
                if ($gnbActive.length) {
                    $gnbActive.each(function () {
                        const $this = $(this); 
                        $breadcrumbArry.push($this.children('a').text());
                    });
                }
                const $menuTitEl = $('[data-menu-title]'); 
                if ($menuTitEl.length) {
                    const $menuTit = $menuTitEl.data('menu-title'); 
                    $breadcrumbArry.push($menuTit);
                }
                if ($('.page-title h2').length) {
                    let $title = $breadcrumbArry.length ? $breadcrumbArry[$breadcrumbArry.length - 1] : '타이틀'; 
                    if (menuID.indexOf('API_MGMT') > -1) {
                        const keyNo = getUrlParams().keyNo; 
                        const $subTxt = !!keyNo ? '상세' : '목록'; 
                        $title = $title + ' - ' + $breadcrumbArry[0] + $subTxt;
                    }
                    $('.page-title h2').html($title);
                }
            }

            menuIdFn(); 
            makeBreadcrumb(); 
            ui.common.menu(); 
        } else if ($menuHtml.length) {
            let menuActive = $menuHtml.data('menu-active'); 
            menuActive = menuActive.split(','); 
            const dep1 = menuActive[0] === undefined ? -1 : Number($.trim(menuActive[0]));
            const dep2 = menuActive[1] === undefined ? -1 : Number($.trim(menuActive[1]));
            const dep3 = menuActive[2] === undefined ? -1 : Number($.trim(menuActive[2]));
            function menuActiveFn(type, dep1Selector, dep2Selector, dep3Selector) {
                $gnb = $('#gnb .page-gnb'); 
                $lnb = $('#lnb'); 
                let $dep1; 
                let $dep2; 
                let $dep3; 

                if (dep1 >= 0) {
                    if (type === 'gnb') {
                        if (!$gnb.length) return; 
                        $dep1 = $gnb.find(dep1Selector).eq(dep1); 
                        if ($dep1.length) {
                            $breadcrumbArry.push($dep1.children('a').text()); 
                            $dep1.addClass($activeClassName);
                        } 
                    } else if (type === 'lnb') {
                        if (!$lnb.length) return; 
                        const $lnbInner = $lnb.find(dep1Selector); 
                        if ($lnbInner.length === 1) {
                            $dep1 = $lnbInner;
                        } else {
                            $dep1 = $lnbInner.eq(dep1); 
                            $dep1.removeClass('hide').addClass('active').siblings().remove(); 
                        }
                    }
                }

                if (dep2 >= 0 && $dep1 && $dep1.length) {
                    $dep2 = $dep1.find(dep2Selector).eq(dep2); 
                    console.log($dep2); 
                    if ($dep2.length) {
                        if (type === 'gnb') {
                            $breadcrumbArry.push($dep2.children('a').text()); 
                        }
                        $dep2.addClass($activeClassName);
                    }
                }

                if (dep3 >= 0 && $dep2.length) {
                    $dep3 = $dep2.find(dep3Selector).eq(dep3); 
                    console.log(dep3);
                    if ($dep3.length) {
                        if (type === 'gnb') $breadcrumbArry.push($dep3.children('a').text()); 
                        $dep3.addClass($activeClassName);
                    }
                }
            }

            let menuTimer = 0; 
            setTimeout(function () {
                if (!!clfMhnm) gnbFindTxt(clfMhnm); 
                menuActiveFn('gnb', '> li', '.depth2 > li', '.depth3 > li'); 
                menuActiveFn('lnb', '.page-lnb-inner' , '.page-lnb-menu > li' , '.depth3 > li'); 
                makeBreadcrumb(); 
                ui.common.menu(); 
            }, menuTimer);
        }

        function makeBreadcrumb() {
            if (!$breadcrumb.length || !$breadcrumbArry.length || $breadcrumb.data('init')) return; 
            $breadcrumb.data('init', true); 
            let $etcLi = '';
            if ($breadcrumb.children('li').length > 1) $etcLi = $breadcrumb.children('li').first().next(); 
            $.each($breadcrumbArry, function () {
                const $appendHtml = '<li>' + this + '<li>'; 
                if (!$etcLi) {
                    $breadcrumb.append($appendHtml);
                } else {
                    $etcLi.before($appendHtml); 
                }
            });
        }
        
    }, 
    menu: function () {
        //gnb depth3 
        function menuSetToggle(target) {
            const $target = $(target); 
            if (!$target.length) return; 
            $target.find('li').each(function () {
                const $this = $(this); 
                if ($this.hasClass('not-toggle')) return; 
                const $btn = $this.children('a'); 
                if ($this.children('.depth3').length) {
                    $btn.addClass('toggle'); 
                    if ($this.hasClass('active')) $btn.addClass('open'); 
                }
            });
        }
        menuSetToggle('.page-gnb'); 
        menuSetToggle('.page-lnb-menu'); 
        if ($('.page-lnb-inner .active').length) $('.page-lnb-wrap').removeClass('hide'); 
        else if ($('.page-lnb-inner').length === $('.page-lnb-inner.hide').length) $('.page-lnb-wrap').addClass('hide'); 
        $('.page-lnb-wrap').addClass('show'); 
    }
}