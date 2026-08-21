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
