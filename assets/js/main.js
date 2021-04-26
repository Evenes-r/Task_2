$(".make-form").click(function () {
    $(".make-form").removeClass('active');
    $(".delete-form").addClass('active');
});
$(".delete-form").click(function () {
    $(".delete-form").removeClass('active');
    $(".make-form").addClass('active');
});
const upload = document.querySelector('#upload');
let addFormObject;
const myForm = document.createElement('form');
const newName = document.createElement('h1');
const newDiv = document.createElement('div');
const before = document.createElement('div');
const after = document.createElement('div');
const circle = document.createElement('div');
upload.addEventListener('change', function (e) {
    try {
        const upload = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', (function (file) {
            return function (e) {
                addFormObject = JSON.parse(e.target.result);
            }
        })(upload));
        reader.readAsText(upload);
    }
    catch (ex) {
        console.log(ex);
    }
});


function clearObject(obj) {
    while (obj.childNodes.length > 0) {
        let oneChild = obj.lastChild;
        obj.removeChild(oneChild);
    }
}

function addPost(post) {
    if (post.name)
        addName(post.name);
    if (post.fields)
        addFields(post.fields);
    if (post.references)
        addReference(post.references);
    if (post.buttons)
        addButton(post.buttons)
}

function addName(form) {
    newName.innerHTML = form;
    newDiv.innerHTML = '<div class="form-left-decoration"></div>' + '<div class="form-right-decoration"></div>' + '<div class="circle"></div>';

    switch (form) {
        case 'addpost':
            newName.innerHTML = 'Add post';
            myForm.classList.add('post')
            break;
        case 'website_color_scheme':
            newName.innerHTML = 'Choose color scheme';
            myForm.classList.add('color')
            break;
        case 'interview':
            newName.innerHTML = 'Interview';
            myForm.classList.add('interview')
            break;
        case 'login':
            newName.innerHTML = 'Login';
            myForm.classList.add('login')
            break;
        case 'register':
            newName.innerHTML = 'Register';
            myForm.classList.add('register')
            break;
    }
    newDiv.append(newName);
}

function addFields(form) {
    for (item of form) {
        const myDiv = document.createElement('div');
        myDiv.classList.add('oneinput');

        for (key in item) {
            if (key === 'label') {
                const myLabel = addLabel(item.label);
                myDiv.append(myLabel);
            } else if (key === 'input') {
                const myInput = addInput(item.input);
                myDiv.append(myInput);
            }
        }
        myForm.append(myDiv);
    }
}

function addLabel(label) {
    let newLabel = document.createElement('label');
    newLabel.innerHTML = label;
    return newLabel;
}


function addInput(input) {
    const newInput = document.createElement('input');

    for (let item in input) {
        if (item === 'filetype') {
            let acceptAttr = '';
            for (fileType of input[item]) {
                acceptAttr += '.' + fileType + ' ';
            }
            newInput.setAttribute('accept', acceptAttr.trim().replace(/ /g, ','));
        } else if (typeof input[item] === 'object') {
            const newOptions = addOptions(input[item], input.type);
            newOptions.classList.add('options');
            if (input.multiple)
                newOptions.setAttribute('multiple', '');
            if (input.required)
                newOptions.setAttribute('required', '');
            return newOptions;
        } else if (item === 'mask') {
            if (input[item] === '+7 (999) 99-99-999') {
                newInput.type = 'text';
                newInput.classList.add('phone');
            } else if (input[item] === '99-99 999999') {
                newInput.type = 'text';
                newInput.classList.add('serial');
            } else if (input[item] === '999-999') {
                newInput.type = 'text';
                newInput.classList.add('code');
            }
        } else if (item === 'checked') {
            if (input[item] === 'false') {
                continue;
            }
        } else if (input.type === 'textarea') {
            return addTextArea(input);
        }
        else {
            newInput.setAttribute(item, input[item]);
        }
    }
    return newInput;
}

function addOptions(options, inputType) {
    const newSelect = document.createElement('select');
    newSelect.setAttribute('size', options.length);
    for (val of options) {
        const option = document.createElement("option");
        option.value = val;
        option.text = val;
        if (inputType === 'color') {
            option.style = `color:${val};  background-color: ${val};`;
            option.text = 'color'
        }
        newSelect.append(option);
    }
    return newSelect;
}

function addButton(buttons) {
    const divForButtons = document.createElement('div');
    divForButtons.classList.add('buttons_submit');
    for (butt of buttons) {
        const button = document.createElement('input');
        button.setAttribute('type', "submit");
        button.setAttribute('value', butt.text);
        button.classList.add('button')
        divForButtons.append(button);
    }
    myForm.append(divForButtons);
}

function addReference(form) {
    for (let i = 0; i < form.length; i++) {
        if (form[i].input) {
            myForm.append(addInput(form[i].input));
            continue;
        }
        const divForA = document.createElement('div');
        divForA.classList.add('reference');
        if (form[i]["text without ref"]) {
            divForA.innerHTML = form[i]["text without ref"] + ' ';
        }

        const newReference = document.createElement('a');

        newReference.href = form[i].ref;
        newReference.innerText = form[i].text;
        divForA.append(newReference)
        myForm.append(divForA);
    }
}

function maskFields() {
    $(".phone").mask("+7 (999) 999-99-99");
    $(".serial").mask("99-99 999999");
    $(".code").mask("999-999");
}

function addTextArea(area) {
    const newTextarea = document.createElement('textarea');
    if (area.required)
        newTextarea.setAttribute('required', '')
    return newTextarea;
}

function madeForm() {
    newDiv.classList.add('container');
    addPost(addFormObject);
    newDiv.append(myForm);
    document.body.append(newDiv);
    maskFields();

}

function deleteForm() {
    clearObject(myForm);
    myForm.remove();
    newName.remove();
    newDiv.remove();
    myForm.classList.remove(...['post', 'color', 'interview', 'login', 'register']);
}