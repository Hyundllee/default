/*********************************
 * UI 스크립트 * 
 * 작성자 : 이동현 *
 * ********************************/ 

const getUrlParams = function () {
    const params = {}; 
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (str, key, value) {
        params[key] = value;
    });
    return params; 
}