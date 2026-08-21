// ============================================
// REPTILE BREEDING SIMULATION
// PART 4 - GENETICS
// ============================================


let game = {

    day: 1,

    money: 1000,

    animals: [],

    eggs: []

};


// ============================================
// MORPH DATABASE
// ============================================
//
// Allelen:
//
// AA = twee dominante allelen
// Aa = één dominant + één recessief
// aa = twee recessieve allelen
//
// Recessieve morphs worden pas zichtbaar
// wanneer een dier twee kopieën heeft.
//
// ============================================

const morphDatabase = {

    "Ball Python": {

        "Normal": {
            genes: {
                albino: ["A", "A"],
                pastel: ["P", "P"]
            }
        },

        "Pastel": {
            genes: {
                albino: ["A", "A"],
                pastel: ["P", "p"]
            }
        },

        "Albino": {
            genes: {
                albino: ["a", "a"],
                pastel: ["P", "P"]
            }
        }

    },


    "Leopard Gecko": {

        "Normal": {
            genes: {
                albino: ["A", "A"],
                snow: ["S", "S"]
            }
        },

        "Mack Snow": {
            genes: {
                albino: ["A", "A"],
                snow: ["S", "s"]
            }
        },

        "Albino": {
            genes: {
                albino: ["a", "a"],
                snow: ["S", "S"]
            }
        }

    },


    "Corn Snake": {

        "Normal": {
            genes: {
                amel: ["A", "A"]
            }
        },

        "Amelanistic": {
            genes: {
                amel: ["a", "a"]
            }
        }

    },


    "Bearded Dragon": {

        "Normal": {
            genes: {
                hypo: ["H", "H"]
            }
        }

    },


    "Crested Gecko": {

        "Normal": {
            genes: {
                patternless: ["P", "P"]
            }
        }

    }

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


        // Zorg dat oude dieren
        // ook genetica krijgen.

        game.animals.forEach(
            animal => {

                if (!animal.genes) {

                    animal.genes =
                        createGenes(
                            animal.species,
                            animal.morph
                        );

                }

            }
        );

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
// CREATE GENES
// ============================================

function createGenes(
    species,
    morph
) {

    const database =
        morphDatabase[
            species
        ];


    if (
        database &&
        database[morph]
    ) {

        return JSON.parse(
            JSON.stringify(
                database[morph].genes
            )
        );

    }


    return {};

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
// ADULT AGE
// ============================================

function getAdultAge(species) {

    if (
        species ===
        "Ball Python"
    ) {
        return 18;
    }

    if (
        species ===
        "Leopard Gecko"
    ) {
        return 12;
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
// RANDOM SEX
// ============================================

function randomSex() {

    return Math.random() < 0.5
        ? "Male"
        : "Female";

}


// ============================================
// BUY ANIMAL
// ============================================

function buyAnimal(
    shopIndex
) {

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
            item.price,

        genes:
            createGenes(
                item.species,
                item.morph
            )

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
// SHOP
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
                    Morph:
                    <b>${item.morph}</b>
                </p>

                <p class="price">
                    €${item.price}
                </p>

                <button
                    onclick="
                        buyAnimal(${index})
                    "
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
// GENOTYPE TEXT
// ============================================

function genotypeText(
    alleles
) {

    if (
        !alleles ||
        alleles.length !== 2
    ) {

        return "Unknown";

    }


    return alleles.join("");

}


// ============================================
// MORPH FROM GENES
// ============================================

function calculateVisibleMorph(
    animal
) {

    const species =
        animal.species;


    const genes =
        animal.genes || {};


    if (
        species ===
        "Ball Python"
    ) {

        if (
            genes.albino &&
            genes.albino[0] === "a" &&
            genes.albino[1] === "a"
        ) {

            return "Albino";

        }


        if (
            genes.pastel &&
            genes.pastel.includes("p")
        ) {

            return "Pastel";

        }


        return "Normal";

    }


    if (
        species ===
        "Leopard Gecko"
    ) {

        if (
            genes.albino &&
            genes.albino[0] === "a" &&
            genes.albino[1] === "a"
        ) {

            return "Albino";

        }


        if (
            genes.snow &&
            genes.snow.includes("s")
        ) {

            return "Mack Snow";

        }


        return "Normal";

    }


    if (
        species ===
        "Corn Snake"
    ) {

        if (
            genes.amel &&
            genes.amel[0] === "a" &&
            genes.amel[1] === "a"
        ) {

            return "Amelanistic";

        }


        return "Normal";

    }


    return animal.morph;

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
                    ${calculateVisibleMorph(
                        animal
                    )}
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
                    🧬 Genetica aanwezig
                </p>

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

function openAnimalModal(
    id
) {

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


    let genesHTML = "";


    const genes =
        animal.genes || {};


    Object.keys(genes).forEach(
        geneName => {

            genesHTML += `

                <div class="gene">

                    <span>
                        ${geneName}
                    </span>

                    <b>
                        ${genotypeText(
                            genes[geneName]
                        )}
                    </b>

                </div>

            `;

        }
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
                Visible Morph
            </span>
            <span>
                ${calculateVisibleMorph(
                    animal
                )}
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
                Health
            </span>
            <span>
                ${animal.health}
            </span>
        </div>

        <div class="gene-box">

            <h3>
                🧬 Genotype
            </h3>

            ${genesHTML}

        </div>

        <div class="card">

            <h3>
                ℹ️ Genetica
            </h3>

            <p>
                A = dominante versie
            </p>

            <p>
                a = recessieve versie
            </p>

            <p>
                Bij recessieve morphs moet
                een dier twee recessieve
                allelen hebben om de morph
                zichtbaar te maken.
            </p>

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
// START
// ============================================

loadGame();

updateAnimalAges();

updateUI();
