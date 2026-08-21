// ============================================
// REPTILE BREEDING SIMULATION
// PART 1
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
// LOAD GAME
// ============================================

function loadGame() {

    const saved =
        localStorage.getItem("reptileBreedingSimulation");

    if (!saved) {
        return;
    }

    try {

        game = JSON.parse(saved);

        if (!game.animals) {
            game.animals = [];
        }

        if (!game.eggs) {
            game.eggs = [];
        }

    } catch (error) {

        console.error(
            "Save kon niet geladen worden:",
            error
        );

    }

}


// ============================================
// SAVE GAME
// ============================================

function saveGame() {

    localStorage.setItem(
        "reptileBreedingSimulation",
        JSON.stringify(game)
    );

}


// ============================================
// PAGE SYSTEM
// ============================================

function showPage(pageName) {

    const pages =
        document.querySelectorAll(".page");

    pages.forEach(page => {

        page.classList.remove("active");

    });


    const page =
        document.getElementById(pageName);

    if (page) {

        page.classList.add("active");

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
//
// 28 dagen = 1 maand
//
// Een dier dat op dag 1 geboren wordt:
//
// Dag 1  = 0 maanden
// Dag 28 = 0 maanden
// Dag 29 = 1 maand
// Dag 57 = 2 maanden
//
// ============================================

function updateAnimalAges() {

    game.animals.forEach(animal => {

        const daysAlive =
            game.day - animal.birthDay;

        animal.ageMonths =
            Math.floor(daysAlive / 28);

    });

}


// ============================================
// BUY ANIMAL
// ============================================

function buyAnimal(
    species,
    morph,
    price
) {

    if (game.money < price) {

        alert(
            "Je hebt niet genoeg geld!"
        );

        return;

    }


    game.money -= price;


    const animal = {

        id:
            Date.now() +
            Math.random(),

        species: species,

        morph: morph,

        sex: randomSex(),

        birthDay: game.day,

        ageMonths: 0,

        health: "Healthy"

    };


    game.animals.push(animal);


    saveGame();

    updateUI();


    alert(
        "Je hebt een " +
        morph +
        " " +
        species +
        " gekocht!"
    );

}


// ============================================
// RANDOM SEX
// ============================================

function randomSex() {

    if (Math.random() < 0.5) {

        return "Male";

    }

    return "Female";

}


// ============================================
// GET ANIMAL ICON
// ============================================

function getAnimalIcon(species) {

    if (species === "Leopard Gecko") {

        return "🦎";

    }

    if (species === "Ball Python") {

        return "🐍";

    }

    if (species === "Corn Snake") {

        return "🐍";

    }

    return "🦎";

}


// ============================================
// DISPLAY ANIMALS
// ============================================

function renderAnimals() {

    const container =
        document.getElementById("animalList");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (game.animals.length === 0) {

        container.innerHTML = `

            <div class="card">

                <h3>Je hebt nog geen dieren.</h3>

                <p>
                    Ga naar de shop en koop je
                    eerste reptiel!
                </p>

            </div>

        `;

        return;

    }


    game.animals.forEach(
        (animal, index) => {

            const card =
                document.createElement("div");

            card.className =
                "animal-card";


            const icon =
                getAnimalIcon(
                    animal.species
                );


            card.innerHTML = `

                <div class="animal-icon">
                    ${icon}
                </div>

                <h3>
                    ${animal.species}
                </h3>

                <p>
                    <b>Morph:</b>
                    ${animal.morph}
                </p>

                <p>
                    <b>Geslacht:</b>
                    ${animal.sex}
                </p>

                <p>
                    <b>Leeftijd:</b>
                    ${animal.ageMonths}
                    maanden
                </p>

                <p>
                    <b>Gezondheid:</b>
                    ${animal.health}
                </p>

                <p>
                    <b>ID:</b>
                    ${index + 1}
                </p>

            `;


            container.appendChild(card);

        }
    );

}


// ============================================
// UPDATE UI
// ============================================

function updateUI() {

    const currentMonth =
        Math.floor(
            (game.day - 1) / 28
        );


    document.getElementById("day")
        .textContent = game.day;


    document.getElementById("month")
        .textContent = currentMonth;


    document.getElementById("money")
        .textContent = game.money;


    document.getElementById("homeDay")
        .textContent = game.day;


    document.getElementById("homeMonth")
        .textContent = currentMonth;


    document.getElementById("animalCount")
        .textContent =
        game.animals.length;


    document.getElementById("homeAnimalCount")
        .textContent =
        game.animals.length;


    document.getElementById("eggCount")
        .textContent =
        game.eggs.length;


    document.getElementById("incubatorEggs")
        .textContent =
        game.eggs.length;


    renderAnimals();

}


// ============================================
// START GAME
// ============================================

loadGame();

updateAnimalAges();

updateUI();
// ============================================
// REPTILE BREEDING SIMULATION
// PART 2
// ============================================


let game = {

    day: 1,

    money: 1000,

    animals: [],

    eggs: []

};


// ============================================
// AVAILABLE SHOP ANIMALS
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

        game = JSON.parse(saved);

        if (!game.animals) {
            game.animals = [];
        }

        if (!game.eggs) {
            game.eggs = [];
        }

    } catch (error) {

        console.error(
            "Save kon niet geladen worden.",
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
// PAGE NAVIGATION
// ============================================

function showPage(pageName) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active");

        });


    const selected =
        document.getElementById(pageName);


    if (selected) {

        selected.classList.add("active");

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
// AGE
// ============================================

function updateAnimalAges() {

    game.animals.forEach(animal => {

        const daysAlive =
            game.day - animal.birthDay;

        animal.ageMonths =
            Math.floor(daysAlive / 28);

    });

}


// ============================================
// SHOP DISPLAY
// ============================================

function renderShop() {

    const container =
        document.getElementById("shopList");

    container.innerHTML = "";


    shopAnimals.forEach((item, index) => {

        const card =
            document.createElement("div");

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
                Morph:
                <b>${item.morph}</b>
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


        container.appendChild(card);

    });

}


// ============================================
// BUY
// ============================================

function buyAnimal(shopIndex) {

    const item =
        shopAnimals[shopIndex];


    if (!item) {
        return;
    }


    if (game.money < item.price) {

        alert(
            "Je hebt niet genoeg geld!"
        );

        return;

    }


    game.money -= item.price;


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

        ageMonths:
            0,

        health:
            "Healthy",

        purchasePrice:
            item.price

    };


    game.animals.push(animal);


    saveGame();

    updateUI();


    alert(
        `${item.species} (${item.morph}) `
        + `is toegevoegd aan je collectie!`
    );

}


// ============================================
// SEX
// ============================================

function randomSex() {

    return Math.random() < 0.5
        ? "Male"
        : "Female";

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


    const basePrice =
        animal.purchasePrice || 50;


    const sellPrice =
        Math.floor(basePrice * 0.7);


    const confirmed =
        confirm(
            `Wil je ${animal.name} verkopen ` +
            `voor €${sellPrice}?`
        );


    if (!confirmed) {
        return;
    }


    game.money += sellPrice;


    game.animals.splice(
        index,
        1
    );


    saveGame();

    updateUI();

}


// ============================================
// ANIMAL ICON
// ============================================

function getAnimalIcon(species) {

    if (
        species === "Ball Python" ||
        species === "Corn Snake"
    ) {

        return "🐍";

    }


    return "🦎";

}


// ============================================
// RENDER ANIMALS
// ============================================

function renderAnimals() {

    const container =
        document.getElementById(
            "animalList"
        );


    container.innerHTML = "";


    if (game.animals.length === 0) {

        container.innerHTML = `

            <div class="card">

                <h3>
                    Je hebt nog geen dieren.
                </h3>

                <p>
                    Ga naar de Shop om je
                    eerste reptiel te kopen.
                </p>

            </div>

        `;

        return;

    }


    game.animals.forEach(
        (animal, index) => {

            const card =
                document.createElement("div");


            card.className =
                "animal-card";


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
                    <b>Species:</b>
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

                <p>
                    <b>Health:</b>
                    ${animal.health}
                </p>

                <p>
                    <b>ID:</b>
                    #${index + 1}
                </p>

                <div class="animal-actions">

                    <button
                        class="rename-button"
                        onclick="renameAnimal(${animal.id})"
                    >
                        ✏️ Naam
                    </button>

                    <button
                        class="sell-button"
                        onclick="sellAnimal(${animal.id})"
                    >
                        💰 Verkopen
                    </button>

                </div>

            `;


            container.appendChild(card);

        }
    );

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
        "eggCount"
    ).textContent =
        game.eggs.length;


    document.getElementById(
        "incubatorEggs"
    ).textContent =
        game.eggs.length;


    document.getElementById(
        "homeMoney"
    ).textContent =
        game.money;


    renderAnimals();

    renderShop();

}


// ============================================
// START
// ============================================

loadGame();

updateAnimalAges();

updateUI();
