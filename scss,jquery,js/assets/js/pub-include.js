function unWrap(el) {
    let elementTpUnwrap = el; 
    let parentElement = elementTpUnwrap.parentNode; 
    while(elementTpUnwrap.firstChild) {
        parentElement.insertBefore(elementTpUnwrap.firstChild, elementTpUnwrap); 
    }
    parentElement.removeChild(elementTpUnwrap);
}

function includeHTML() {
    let z; 
    let elmnt; 
    let file; 
    let xhttp; 
    z = document.getElementsByTagName('*'); 
    for (let i = 0; i < z.length; i++) {
        elmnt = z[i]; 
        file = elmnt.getAttribute('data-include-html'); 

        if (file) {
            xhttp = new XMLHttpRequest(); 
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status === 200) {
                        elmnt.innerHTML = this.responseText; 
                        unWrap(elmnt);
                    }
                    if (this.status === 404) {
                        elmnt.includeHTML = 'Page not found';
                    }
                    elmnt.removeAttribute('data-include-html'); 
                    includeHTML();
                }
            };
            xhttp.open('GET', file, true); 
            xhttp.send();
            return;
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    includeHTML(); 
});