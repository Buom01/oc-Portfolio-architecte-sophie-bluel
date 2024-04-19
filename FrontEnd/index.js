// Containers

const gallery = document.getElementById('portfolio-gallery');
const filters = document.getElementById('portfolio-filters');
const modals = document.getElementsByClassName('modal');
const modalButtons = document.getElementsByClassName('modal_button');


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

function createCategoryElement({id, name})
{
    let root = document.createElement("button");

    root.dataset.id = id;
    root.innerText = name;

    return root;
}


// Inits

async function initWorks()
{
    let works = await getWorks();
    gallery.replaceChildren(...works.map(createWorkElement));
};

async function initCategories()
{
    let categories = await getCategories();
    filters.append(...categories.map(createCategoryElement));
};


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
    [...modals].forEach(
        modal =>
            modal.close()
    )
    if (!!modal)
        document.getElementById(modal).showModal();
}


// Main

(async () =>
{
    await Promise.all([initWorks(), initCategories()]);

    [...filters.children].forEach(
        filter =>
            filter.addEventListener('click', filterClick)
    )

    if (!!sessionStorage.getItem('token'))
        document.body.classList.add('logged');

    [...modalButtons].forEach(
        modalButton =>
            modalButton.addEventListener('click', openModalFromButton)
    )
}
)();