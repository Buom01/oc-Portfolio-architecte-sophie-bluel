const gallery = document.getElementById('gallery');

async function getWorks()
{
    let res = await fetch("http://localhost:5678/api/works");
    return await res.json();
};

function createWorkElement({id, title, imageUrl, alt, categoryId})
{
    let root = document.createElement("figure");
    let caption = document.createElement("figcaption");
    let image = document.createElement("img");

    root.setAttribute('data-id', id);
    root.setAttribute('data-category', categoryId);
    caption.innerText = title;
    image.setAttribute('alt', alt ?? title);
    image.setAttribute('src', imageUrl);

    root.appendChild(image);
    root.appendChild(caption);

    return root;
}

(async () => {
    let works = await getWorks();
    gallery.replaceChildren(...works.map(createWorkElement));
})();