// Containers

const gallery = document.getElementById('portfolio-gallery');
const modalGallery = document.getElementById('modal-gallery');
const filters = document.getElementById('portfolio-filters');
const categoriesSelect = document.getElementById('category');
const modals = document.getElementsByClassName('modal');
const modalButtons = document.getElementsByClassName('modal_button');
const formAddWork = document.getElementById('form-add-work')
const logoutAction = document.getElementById('logout');


// Getters

async function getWorks()
{
    let res = await fetch("http://localhost:5678/api/works");
    return await res.json();
};
async function getCategories()
{
    let res = await fetch("http://localhost:5678/api/categories");
    return await res.json();
};


// Renderers

function createWorkElement({id, title, imageUrl, alt, categoryId})
{
    let root = document.createElement("figure");
    let caption = document.createElement("figcaption");
    let image = document.createElement("img");

    root.dataset.id = id;
    root.dataset.category = categoryId;
    caption.innerText = title;
    image.setAttribute('alt', alt ?? title);
    image.setAttribute('src', imageUrl);

    root.appendChild(image);
    root.appendChild(caption);

    return root;
}

function createModalWorkElement({id, title, imageUrl, alt, categoryId})
{
    let root = document.createElement("figure");
    let image = document.createElement("img");
    let removeButton = document.createElement("button");

    root.dataset.id = id;
    removeButton.dataset.id = id;
    removeButton.classList.add('modal_gallery_remove')
    removeButton.addEventListener('click', trashcanClick);
    image.setAttribute('alt', alt ?? title);
    image.setAttribute('src', imageUrl);

    root.appendChild(image);
    root.appendChild(removeButton);

    return root;
}

function createCategoryElement({id, name})
{
    let root = document.createElement("button");

    root.dataset.id = id;
    root.innerText = name;

    return root;
}

function createCategoryOption({id, name})
{
    let root = document.createElement("option");

    root.value = id;
    root.innerText = name;

    return root;
}


// Inits

async function initWorks()
{
    let works = await getWorks();

    gallery.replaceChildren(...works.map(createWorkElement));
    modalGallery.replaceChildren(...works.map(createModalWorkElement));
};

async function initCategories()
{
    let categories = await getCategories();

    filters.append(...categories.map(createCategoryElement));
    categoriesSelect.append(...categories.map(createCategoryOption));
};

function initUploadInputs()
{
    let uploadInputs = document.querySelectorAll(`.upload > input[type='file']`);
    let forms = document.querySelectorAll('form');

    uploadInputs.forEach(
        uploadInput =>
            uploadInput.addEventListener('change', uploaderChange)
    );

    forms.forEach(
        form =>
            form.addEventListener('reset', uploaderFormReset)
    );
}


// Actions

function addWork(work)
{
    gallery.append(createWorkElement(work));
    modalGallery.append(createModalWorkElement(work));
}

function removeWork(id)
{
    document.querySelectorAll(`figure[data-id='${id}']`).forEach(
        workFigure =>
            workFigure.remove()
    );
}

async function deleteWork(id)
{
    let res = await fetch(
        `http://localhost:5678/api/works/${id}`,
        {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }
    )
    if (res.ok)
        removeWork(id);
    else
        throw new Error("Suppression échouée pour une raison inconnue");
}

function closeModals()
{
    [...modals].forEach(
        modal =>
            modal.close()
    );
}

async function submitWork(formData)
{
    const res = await fetch(
        `http://localhost:5678/api/works`,
        {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }
    )
    if (res.ok)
        addWork(await res.json());
    else
        throw new Error("Ajout échouée pour raison inconnue");
}

function logout()
{
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    document.body.classList.remove('logged');
}


// Error handling

function showError(e)
{
    let errorMessage = document.createElement('p');
    errorMessage.innerText = e.message || e.toString();

    gallery.classList.remove('gallery');
    gallery.classList.add('error');
    gallery.replaceChildren(errorMessage);
}


// Events Handling

function filterClick({currentTarget: {dataset: {id}}})
{
    [...filters.children].forEach(
        filter =>
        {
            if (filter.dataset.id == id)
                filter.setAttribute('disabled', null)
            else
                filter.removeAttribute('disabled');
        }
    );
    [...gallery.children].forEach(
        work =>
        {
            if (id == 0 || work.dataset.category == id)
                work.classList.remove('filtered');
            else
                work.classList.add('filtered');
        }
    );
}

function openModalFromButton({currentTarget: {dataset: {modal}}})
{
    closeModals();
    if (!!modal)
        document.getElementById(modal).showModal();
}

function closeModalFromBackdrop({target, currentTarget})
{
    if (target == currentTarget)
        closeModals();
}

async function trashcanClick({currentTarget: {dataset: {id}}})
{
    try
    {
        await deleteWork(id);
    }
    catch ({message})
    {
        alert(message);
    }
}

function uploaderChange({currentTarget: {parentNode, files}})
{
    const previewRoot = parentNode.getElementsByClassName('upload_preview')[0];

    if (files.length)
    {
        let file = files[0];
        let preview = document.createElement('img');
        preview.src = URL.createObjectURL(file);
        preview.alt = 'Aperçu';

        previewRoot.replaceChildren(preview);
    }
    else
        previewRoot.replaceChildren();
}

function uploaderFormReset({currentTarget})
{
    const previewRoot = currentTarget.getElementsByClassName('upload_preview')[0];

    previewRoot.replaceChildren();
}

function submitWorkForm(e)
{
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    submitWork(formData)
        .then(
            () =>
            {
                form.reset();
                closeModals();
            }
        )
        .catch(
            ({message}) =>
                alert(message)
        )
}


// Main

(async () =>
{
    if (!!localStorage.getItem('token'))
        document.body.classList.add('logged');

    logoutAction.addEventListener('click', logout);

    [...modalButtons].forEach(
        modalButton =>
            modalButton.addEventListener('click', openModalFromButton)
    );
    [...modals].forEach(
        modal =>
            modal.addEventListener('click', closeModalFromBackdrop)
    );

    initUploadInputs();

    formAddWork.addEventListener('submit', submitWorkForm);

    try
    {
        await Promise.all([initWorks(), initCategories()]);

        [...filters.children].forEach(
            filter =>
                filter.addEventListener('click', filterClick)
        );
    }
    catch (e)
    {
        showError(e);
    }
}
)();