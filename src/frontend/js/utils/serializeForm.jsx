// https://gist.github.com/bullgare/5336154

export default function serializeForm(form, encodeURI=false) {
    let encodeFunctor = d => d;
    if (encodeURI) {
        encodeFunctor = d => encodeURIComponent(d);
    }

    if (!form || form.nodeName !== 'FORM') {
        return;
    }
    var i, j,
        obj = {};
    for (i = form.elements.length - 1; i >= 0; i = i - 1) {
        if (form.elements[i].name === '') {
            continue;
        }
        switch (form.elements[i].nodeName) {
        case 'INPUT':
            switch (form.elements[i].type) {
            case 'text':
            case 'tel':
            case 'email':
            case 'hidden':
            case 'password':
            case 'button':
            case 'reset':
            case 'submit':
                obj[form.elements[i].name] = encodeFunctor(form.elements[i].value);
                break;
            case 'checkbox':
                if (form.elements[i].checked) {
                    obj[form.elements[i].name] = true;
                } else {
                    obj[form.elements[i].name] = false;
                }
                break;
            case 'radio':
                if (form.elements[i].checked) {
                    obj[form.elements[i].name] = encodeFunctor(form.elements[i].value);
                }
                break;
            case 'file':
                break;
            }
            break;
        case 'TEXTAREA':
            obj[form.elements[i].name] = encodeFunctor(form.elements[i].value);
            break;
        case 'SELECT':
            switch (form.elements[i].type) {
            case 'select-one':
                obj[form.elements[i].name] = encodeFunctor(form.elements[i].value);
                break;
            case 'select-multiple':
                for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                    if (form.elements[i].options[j].selected) {
                        obj[form.elements[i].name] = encodeFunctor(form.elements[i].options[j].value);
                    }
                }
                break;
            }
            break;
        case 'BUTTON':
            switch (form.elements[i].type) {
            case 'reset':
            case 'submit':
            case 'button':
                obj[form.elements[i].name] = encodeFunctor(form.elements[i].value);
                break;
            }
            break;
        }
    }
    for (let key in obj) {
        if (obj[key] === '') {
            obj[key] = null;
        }
    }
    return obj;
}