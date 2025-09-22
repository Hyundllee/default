(function () {
    const $pathname = location.pathname; 
    const $pathAry = $pathname.split('/'); 
    const $reat = $pathAry.length - 6; 
    let path = function () {
        let rtn = ''; 
        if (location.protocol === 'file:') {
            if ($reat) {
                for (let i = 0; i < $reat; i += 1) {
                    rtn += '../'; 
                }
                rtn += '/assets/'; 
            }
        } else {
            if ($pathname.indexOf('/assets/') > -1) {
                rtn = '/assets/'; 
            } else {
                rtn = '/assets/'; 
            }
        }
        return rtn; 
    };
    let str = '<link href="' + path() + 'css/front-ui.css" rel="stylesheet" />';
    // str += '<link href="' + path() + 'css/front.min.css" rel="stylesheet" />'; 

    str += '<script type="text/javascript" src="' + path() + 'js/lib/jquery-3.7.1.min.js"></script>';
    str += '<script type="text/javascript" src="' + path() + 'js/ui-util.js"></script>';
    str += '<script type="text/javascript" src="' + path() + 'js/ui-front.js"></script>';

    document.write(str); 
    const $include = document.querySelector('.__include'); 
    if ($include) {
        try {
            $include.remove();
        } catch (e) {
            $include.parentNode.removeChild($include); 
        }   
    }
})(); 