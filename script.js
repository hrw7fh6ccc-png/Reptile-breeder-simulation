// ============================================
// REPTILE BREEDING SIMULATION
// PART 3
// ============================================


// ============================================
// GAME DATA
// ============================================

let game = {

    day: 1,

    money: 1000,

    animals: [],

    eggs: []

};


// ============================================
// SHOP
// ============================================

const shopAnimals = [

    {
        species: "Ball Python",
        morph: "Normal",
        price: 150,
        icon: "🐍"
    },

    {
        species: "Ball Python",
        morph: "Pastel",
        price: 250,
        icon: "🐍"
    },

    {
        species: "Ball Python",
        morph: "Albino",
        price: 350,
        icon: "🐍"
    },

    {
        species: "Leopard Gecko",
        morph: "Normal",
        price: 100,
        icon: "🦎"
    },

    {
        species: "Leopard Gecko",
        morph: "Mack Snow",
        price: 180,
        icon: "🦎"
    },

    {
        species: "Leopard Gecko",
        morph: "Albino",
        price: 250,
        icon: "🦎"
    },

    {
        species: "Corn Snake",
        morph: "Normal",
        price: 120,
        icon: "🐍"
    },

    {
        species: "Corn Snake",
        morph: "Amelanistic",
        price: 200,
        icon: "🐍"
    },

    {
        species: "Bearded Dragon",
        morph: "Normal",
        price: 180,
        icon: "🦎"
    },

    {
        species: "Crested Gecko",
        morph: "Normal",
        price: 200,
        icon: "🦎"
    }

];


// ============================================
// LOAD
// ============================================

function loadGame() {

    const saved =
        localStorage.getItem(
            "reptileBreedingSimulation"
        );


    if (!saved) {

        return;

    }


    try {

        game =
            JSON.parse(saved);


        if (!game.animals) {

            game.animals = [];

        }


        if (!game.eggs) {

            game.eggs = [];

        }

    }

    catch (error) {

        console.error(
            "Save kon niet geladen worden:",
            error
        );

    }

}


// ============================================
// SAVE
// ============================================

function saveGame() {

    localStorage.setItem(

        "reptileBreedingSimulation",

        JSON.stringify(game)

    );

}


// ============================================
// NAVIGATION
// ============================================

function showPage(pageName) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove(
                "active"
            );

        });


    const page =
        document.getElementById(
            pageName
        );


    if (page) {

        page.classList.add(
            "active"
        );

    }


    updateUI();

}


// ============================================
// NEXT DAY
// ============================================

function nextDay() {

    game.day++;


    updateAnimalAges();


    saveGame();


    updateUI();

}


// ============================================
// AGE SYSTEM
// ============================================

function updateAnimalAges() {

    game.animals.forEach(
        animal => {

            const daysAlive =
                game.day -
                animal.birthDay;


            animal.ageDays =
                Math.max(
                    0,
                    daysAlive
                );


            animal.ageMonths =
                Math.floor(
                    daysAlive / 28
                );


            animal.isAdult =
                animal.ageMonths >=
                animal.adultAgeMonths;


            animal.breedingReady =
                animal.isAdult &&
                animal.health ===
                "Healthy";

        }
    );

}


// ============================================
// RANDOM SEX
// ============================================

function randomSex() {

    return Math.random() < 0.5
        ? "Male"
        : "Female";

}


// ============================================
// ADULT AGE
// ============================================

function getAdultAge(species) {

    if (
        species ===
        "Leopard Gecko"
    ) {

        return 12;

    }


    if (
        species ===
        "Ball Python"
    ) {

        return 18;

    }


    if (
        species ===
        "Corn Snake"
    ) {

        return 18;

    }


    if (
        species ===
        "Bearded Dragon"
    ) {

        return 12;

    }


    if (
        species ===
        "Crested Gecko"
    ) {

        return 12;

    }


    return 12;

}


// ============================================
// BUY ANIMAL
// ============================================

function buyAnimal(shopIndex) {

    const item =
        shopAnimals[
            shopIndex
        ];


    if (!item) {

        return;

    }


    if (
        game.money <
        item.price
    ) {

        alert(
            "Je hebt niet genoeg geld!"
        );

        return;

    }


    game.money -=
        item.price;


    const animal = {

        id:
            Date.now() +
            Math.random(),

        name:
            item.species,

        species:
            item.species,

        morph:
            item.morph,

        sex:
            randomSex(),

        birthDay:
            game.day,

        ageDays:
            0,

        ageMonths:
            0,

        adultAgeMonths:
            getAdultAge(
                item.species
            ),

        isAdult:
            false,

        breedingReady:
            false,

        health:
            "Healthy",

        purchasePrice:
            item.price

    };


    game.animals.push(
        animal
    );


    saveGame();

    updateUI();


    alert(
        `${item.species} ` +
        `(${item.morph}) ` +
        `is toegevoegd!`
    );

}


// ============================================
// SHOP RENDER
// ============================================

function renderShop() {

    const container =
        document.getElementById(
            "shopList"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    shopAnimals.forEach(
        (item, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card shop-card";


            card.innerHTML = `

                <div class="big-icon">
                    ${item.icon}
                </div>

                <h3>
                    ${item.species}
                </h3>

                <p>
                    ${item.morph}
                </p>

                <p class="price">
                    €${item.price}
                </p>

                <button
                    onclick="buyAnimal(${index})"
                >
                    Kopen
                </button>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// ============================================
// ANIMAL ICON
// ============================================

function getAnimalIcon(
    species
) {

    if (
        species ===
        "Ball Python"
    ) {

        return "🐍";

    }


    if (
        species ===
        "Corn Snake"
    ) {

        return "🐍";

    }


    return "🦎";

}


// ============================================
// BREEDING STATUS
// ============================================

function getBreedingStatus(
    animal
) {

    if (
        animal.health !==
        "Healthy"
    ) {

        return {
            text:
                "Niet geschikt",
            className:
                "young"
        };

    }


    if (
        !animal.isAdult
    ) {

        return {
            text:
                "Nog te jong",
            className:
                "young"
        };

    }


    return {
        text:
            "Breeding ready",
        className:
            "ready"
    };

}


// ============================================
// RENDER ANIMALS
// ============================================

function renderAnimals() {

    const container =
        document.getElementById(
            "animalList"
        );


    if (!container) {

        return;

    }


    container.innerHTML =
        "";


    if (
        game.animals.length === 0
    ) {

        container.innerHTML = `

            <div class="card">

                <h3>
                    Geen dieren
                </h3>

                <p>
                    Ga naar de shop
                    om je eerste reptiel
                    te kopen.
                </p>

            </div>

        `;

        return;

    }


    game.animals.forEach(
        (animal, index) => {

            const status =
                getBreedingStatus(
                    animal
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "animal-card";


            card.onclick =
                () => openAnimalModal(
                    animal.id
                );


            card.innerHTML = `

                <div class="animal-icon">
                    ${getAnimalIcon(
                        animal.species
                    )}
                </div>

                <div class="animal-name">
                    ${animal.name}
                </div>

                <p>
                    ${animal.species}
                </p>

                <p>
                    <b>Morph:</b>
                    ${animal.morph}
                </p>

                <p>
                    <b>Sex:</b>
                    ${animal.sex}
                </p>

                <p>
                    <b>Age:</b>
                    ${animal.ageMonths}
                    maanden
                </p>

                <span
                    class="status ${status.className}"
                >
                    ${status.text}
                </span>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// ============================================
// OPEN ANIMAL
// ============================================

function openAnimalModal(id) {

    const animal =
        game.animals.find(
            a => a.id === id
        );


    if (!animal) {

        return;

    }


    const details =
        document.getElementById(
            "animalDetails"
        );


    const status =
        getBreedingStatus(
            animal
        );


    details.innerHTML = `

        <div
            style="
                text-align:center;
                font-size:70px;
            "
        >
            ${getAnimalIcon(
                animal.species
            )}
        </div>

        <h2>
            ${animal.name}
        </h2>

        <div class="detail-row">
            <span class="detail-title">
                Species
            </span>
            <span>
                ${animal.species}
            </span>
        </div>

        <div class="detail-row">
            <span class="detail-title">
                Morph
            </span>
            <span>
                ${animal.morph}
            </span>
        </div>

        <div class="detail-row">
            <span class="detail-title">
                Sex
            </span>
            <span>
                ${animal.sex}
            </span>
        </div>

        <div class="detail-row">
            <span class="detail-title">
                Age
            </span>
            <span>
                ${animal.ageMonths}
                maanden
                (${animal.ageDays}
                dagen)
            </span>
        </div>

        <div class="detail-row">
            <span class="detail-title">
                Birth Day
            </span>
            <span>
                Dag ${animal.birthDay}
            </span>
        </div>

        <div class="detail-row">
            <span class="detail-title">
                Health
            </span>
            <span>
                ${animal.health}
            </span>
        </div>

        <div class="detail-row">
            <span class="detail-title">
                Adult
            </span>
            <span>
                ${animal.isAdult
                    ? "Ja"
                    : "Nee"}
            </span>
        </div>

        <div class="detail-row">
            <span class="detail-title">
                Breeding
            </span>
            <span>
                ${status.text}
            </span>
        </div>

        <div class="detail-row">
            <span class="detail-title">
                Adult vanaf
            </span>
            <span>
                ${animal.adultAgeMonths}
                maanden
            </span>
        </div>

        <div class="action-row">

            <button
                class="rename-button"
                onclick="
                    renameAnimal(${animal.id})
                "
            >
                ✏️ Naam veranderen
            </button>

            <button
                class="sell-button"
                onclick="
                    sellAnimal(${animal.id})
                "
            >
                💰 Verkopen
            </button>

        </div>

    `;


    document
        .getElementById(
            "animalModal"
        )
        .classList.remove(
            "hidden"
        );

}


// ============================================
// CLOSE MODAL
// ============================================

function closeAnimalModal() {

    document
        .getElementById(
            "animalModal"
        )
        .classList.add(
            "hidden"
        );

}


// ============================================
// RENAME
// ============================================

function renameAnimal(id) {

    const animal =
        game.animals.find(
            a => a.id === id
        );


    if (!animal) {

        return;

    }


    const newName =
        prompt(
            "Nieuwe naam:",
            animal.name
        );


    if (
        newName === null ||
        newName.trim() === ""
    ) {

        return;

    }


    animal.name =
        newName.trim();


    saveGame();

    updateUI();

    openAnimalModal(
        animal.id
    );

}


// ============================================
// SELL
// ============================================

function sellAnimal(id) {

    const index =
        game.animals.findIndex(
            a => a.id === id
        );


    if (index === -1) {

        return;

    }


    const animal =
        game.animals[index];


    const sellPrice =
        Math.floor(
            (animal.purchasePrice || 50)
            * 0.7
        );


    const confirmed =
        confirm(
            `Verkoop ${animal.name} ` +
            `voor €${sellPrice}?`
        );


    if (!confirmed) {

        return;

    }


    game.money +=
        sellPrice;


    game.animals.splice(
        index,
        1
    );


    closeAnimalModal();

    saveGame();

    updateUI();

}


// ============================================
// UPDATE UI
// ============================================

function updateUI() {

    const month =
        Math.floor(
            (game.day - 1) / 28
        );


    document.getElementById(
        "day"
    ).textContent =
        game.day;


    document.getElementById(
        "month"
    ).textContent =
        month;


    document.getElementById(
        "money"
    ).textContent =
        game.money;


    document.getElementById(
        "homeDay"
    ).textContent =
        game.day;


    document.getElementById(
        "homeMonth"
    ).textContent =
        month;


    document.getElementById(
        "animalCount"
    ).textContent =
        game.animals.length;


    document.getElementById(
        "homeAnimalCount"
    ).textContent =
        game.animals.length;


    document.getElementById(
        "homeMoney"
    ).textContent =
        game.money;


    document.getElementById(
        "eggCount"
    ).textContent =
        game.eggs.length;


    document.getElementById(
        "incubatorEggs"
    ).textContent =
        game.eggs.length;


    renderAnimals();

    renderShop();

}


// ============================================
// START GAME
// ============================================

loadGame();

updateAnimalAges();

updateUI();
