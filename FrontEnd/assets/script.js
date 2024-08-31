//Déclaration des variables globales
let actualFilterId = 0;
let allProjets = [];

//Récupèrent les données depuis l'API
const fetchProjects = async () => {
    try {
        const response = await fetch('http://localhost:5678/api/works');
        const data = await response.json();
        if(response.status >= 400) {
            throw "une erreur est arrivée"
        }
        allProjets = data;
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des projets :', error);
    }
};

const fetchCategories = async () => {
    try {
        const response = await fetch('http://localhost:5678/api/categories');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories', error);
        throw error;
    }
};

//Affiche les projets filtrés dans la galerie
const initProjets = async (fetch = true) => {
    if (fetch) {
        await fetchProjects();
    }

    const projects = allProjets;
    const target = document.getElementsByClassName('gallery');
    target[0].innerHTML = '';

    const filteredProjects = projects.filter(project => project.categoryId === actualFilterId || actualFilterId === 0);
    for (let index = 0; index < filteredProjects.length; index++) {
        const elementDom = document.createElement('figure');
        const img = document.createElement('img');
        img.src = filteredProjects[index].imageUrl;
        img.alt = filteredProjects[index].title;
        
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = filteredProjects[index].title;
        elementDom.appendChild(img);
        elementDom.appendChild(figcaption);
        target[0].appendChild(elementDom);
    }
}

//Crée les boutons de filtre et gère leur comportement
const initFilters = async () => {
    const allCategories = await fetchCategories();
    const target = document.getElementsByClassName('filters');

    allCategories.unshift({name: "Tous", active: true, id: 0});

    for (let index = 0; index < allCategories.length; index++) {
        const element = allCategories[index];
        const button = document.createElement('button');
        button.textContent = element.name;
        if (element.active) {
            button.classList.add('active');
        }

        target[0].appendChild(button);
        button.addEventListener('click', function() {
            this.classList.add('active');
            document.querySelectorAll('.filters button').forEach(button => {
                if (button !== this) {
                    button.classList.remove('active');
                }
            });
            actualFilterId = element.id;
            initProjets(false);
        });
    }
}

//Configure l'affichage des projets et des filtres dès que la page est chargée
window.addEventListener('load', async () => {
    initProjets();
    initFilters();
});