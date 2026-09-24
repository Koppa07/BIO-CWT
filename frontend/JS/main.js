const API_URL = 'http://localhost:3000/api';


async function loadMaterials() {
    const container =
        document.querySelector('#materials-container');

    if (!container) {
        return;
    }

    try {
        const response =
            await fetch(`${API_URL}/materials`);

        if (!response.ok) {
            throw new Error(
                'Failed to load materials'
            );
        }

        const materials =
            await response.json();

        container.innerHTML = '';

        materials.forEach((material) => {
            const element =
                createMaterialElement(material);

            container.appendChild(element);
        });

    } catch (error) {
        console.error(
            'Materials error:',
            error
        );

        container.innerHTML = `
            <p>
                Failed to load materials.
            </p>
        `;
    }
}


function createMaterialElement(material) {
    const element =
        document.createElement('div');

    element.className =
        'materials__item';


    const featuresHTML =
        material.features
            .map((feature) => {

                return `
                    <div class="materials__info__infos">

                        <div>
                            <img
                                src="${feature.icon}"
                                alt="${feature.type}"
                            >
                        </div>

                        <p>
                            ${escapeHTML(feature.feature)}
                        </p>

                    </div>
                `;
            })
            .join('');


    element.innerHTML = `

        <div class="materials__photos">

            <div class="photos">

                <img
                    src="${material.image_url}"
                    alt="${escapeHTML(material.title)}"
                >

            </div>

            <h3>
                ${escapeHTML(material.title)}
            </h3>

        </div>


        <div class="materials__info">

            ${featuresHTML}

        </div>

    `;


    return element;
}

let projects = [];

let currentProjectIndex = 0;


async function loadProjects() {

    const container =
        document.querySelector('#project-container');

    if (!container) {
        return;
    }


    try {

        const response =
            await fetch(`${API_URL}/projects`);


        if (!response.ok) {

            throw new Error(
                'Failed to load projects'
            );

        }


        projects =
            await response.json();


        if (projects.length === 0) {

            container.innerHTML = `
                <p>No projects available.</p>
            `;

            return;
        }


        currentProjectIndex = 0;

        renderProject();

        renderProjectDots();


    } catch (error) {

        console.error(
            'Projects error:',
            error
        );


        container.innerHTML = `
            <p>
                Failed to load projects.
            </p>
        `;
    }
}


function renderProject() {

    const container =
        document.querySelector('#project-container');


    if (
        !container ||
        projects.length === 0
    ) {
        return;
    }


    const project =
        projects[currentProjectIndex];


    container.innerHTML = `

        <img
            src="${project.image_url}"
            alt="${escapeHTML(project.title)}"
        >

    `;
}


function renderProjectDots() {
    const container = document.querySelector('#projects-dots');

    if (!container) {
        return;
    }

    container.innerHTML = '';

    projects.forEach((project, index) => {
        const dot = document.createElement('button');

        dot.type = 'button';
        dot.className = 'project-dot';

        const img = document.createElement('img');

        img.src = index === currentProjectIndex
            ? 'images/circle_active.png'
            : 'images/circle_empty.png';

        img.alt = '';

        dot.appendChild(img);

        dot.addEventListener('click', () => {
            currentProjectIndex = index;

            renderProject();
            renderProjectDots();
        });

        container.appendChild(dot);
    });
}


function nextProject() {

    if (projects.length === 0) {
        return;
    }


    currentProjectIndex++;


    if (
        currentProjectIndex >=
        projects.length
    ) {
        currentProjectIndex = 0;
    }


    renderProject();

    renderProjectDots();
}


function previousProject() {

    if (projects.length === 0) {
        return;
    }


    currentProjectIndex--;


    if (currentProjectIndex < 0) {

        currentProjectIndex =
            projects.length - 1;

    }


    renderProject();

    renderProjectDots();
}


function setupConsultationForm() {

    const form =
        document.querySelector(
            '.questions form'
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        'submit',
        async (event) => {

            event.preventDefault();


            const name =
                form
                    .querySelector('#name')
                    .value
                    .trim();


            const phone =
                form
                    .querySelector('#phone')
                    .value
                    .trim();


            const question =
                form
                    .querySelector('#question')
                    .value
                    .trim();


            if (
                !name ||
                !phone ||
                !question
            ) {

                showFormMessage(
                    'Please fill in all fields.',
                    true
                );

                return;
            }


            const button =
                form.querySelector(
                    'button[type="submit"]'
                );


            button.disabled = true;

            button.textContent = 'Sending...';


            try {

                const response =
                    await fetch(
                        `${API_URL}/consultations`,
                        {
                            method: 'POST',

                            headers: {
                                'Content-Type':
                                    'application/json'
                            },

                            body: JSON.stringify({
                                name,
                                phone,
                                question
                            })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        'Failed to send request'
                    );
                }


                form.reset();


                showFormMessage(
                    'Thank you! Your request has been sent.',
                    false
                );


            } catch (error) {

                console.error(
                    'Consultation error:',
                    error
                );


                showFormMessage(
                    'Something went wrong. Please try again.',
                    true
                );


            } finally {

                button.disabled = false;

                button.textContent = 'Send';

            }

        }
    );
}


function showFormMessage(
    message,
    isError
) {

    let element =
        document.querySelector(
            '#form-message'
        );


    if (!element) {

        element =
            document.createElement('p');

        element.id =
            'form-message';


        const form =
            document.querySelector(
                '.questions form'
            );


        form.appendChild(element);
    }


    element.textContent =
        message;


    element.className =
        isError
            ? 'form-message error'
            : 'form-message success';
}


function escapeHTML(value) {

    const element =
        document.createElement('div');

    element.textContent =
        value ?? '';


    return element.innerHTML;
}


function setupProjectSlider() {

    const nextButton =
        document.querySelector(
            '#projects-next'
        );


    const previousButton =
        document.querySelector(
            '#projects-prev'
        );


    if (nextButton) {

        nextButton.addEventListener(
            'click',
            nextProject
        );

    }


    if (previousButton) {

        previousButton.addEventListener(
            'click',
            previousProject
        );

    }
}


document.addEventListener(
    'DOMContentLoaded',
    () => {

        loadMaterials();

        loadProjects();

        setupConsultationForm();

        setupProjectSlider();

    }
);