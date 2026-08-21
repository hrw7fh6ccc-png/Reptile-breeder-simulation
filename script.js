// ============================================
// REPTILE BREEDING SIMULATION
// PART 6 - CLUTCHES & EGG OUTCOMES
// ============================================

let game = {
    day: 1,
    money: 1000,
    animals: [],
    eggs: []
};

let selectedMale = null;
let selectedFemale = null;


// ============================================
// SPECIES SETTINGS
// ============================================

const speciesSettings = {

    "Ball Python": {
        adultMonths: 18,
        incubationDays: 60,
        eggsMin: 4,
        eggsMax: 8
    },

    "Leopard Gecko": {
        adultMonths: 12,
        incubationDays: 45,
        eggsMin: 1,
        eggsMax: 2
    },

    "Corn Snake": {
        adultMonths: 18,
        incubationDays: 60,
        eggsMin: 8,
        eggsMax: 18
    },

    "Bearded Dragon": {
        adultMonths: 12,
        incubationDays: 60,
        eggsMin: 12,
        eggsMax: 25
    },

    "Crested Gecko": {
        adultMonths: 12,
        incubationDays: 70,
        eggsMin: 1,
        eggsMax: 2
    }

};


// ============================================
// MORPH GENES
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
// SAVE
// ============================================

function saveGame() {

    localStorage.setItem(
        "reptileBreedingSimulation",
        JSON.stringify(game)
    );

}


// ============================================
// LOAD
// ============================================

function loadGame() {

    const saved =
        localStorage.getItem(
            "reptileBreedingSimulation"
        );

    if (!saved) return;

    try {

        game = JSON.parse(saved);

        if (!game.animals)
            game.animals = [];

        if (!game.eggs)
            game.eggs = [];

        game.animals.forEach(
            animal => {

                if (!animal.genes) {

                    animal.genes =
                        createGenes(
                            animal.species,
                            animal.morph
                        );

                }

                if (
                    animal.birthDay === undefined
                ) {

                    animal.birthDay = 1;

                }

                animal.adultAgeMonths =
                    speciesSettings[
                        animal.species
                    ]?.adultMonths || 12;

                if (
                    animal.breedingCooldown ===
                    undefined
                ) {

                    animal.breedingCooldown = 0;

                }

            }
        );

    } catch (error) {

        console.error(error);

    }

}


// ============================================
// NAVIGATION
// ============================================

function showPage(pageName) {

    document
        .querySelectorAll(".page")
        .forEach(
            page =>
                page.classList.remove(
                    "active"
                )
        );

    const page =
        document.getElementById(
            pageName
        );

    if (page)
        page.classList.add("active");

    updateUI();

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
// GET ADULT AGE
// ============================================

function getAdultAge(species) {

    return speciesSettings[
        species
    ]?.adultMonths || 12;

}


// ============================================
// GENES
// ============================================

function createGenes(
    species,
    morph
) {

    const database =
        morphDatabase[species];

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

            animal.adultAgeMonths =
                getAdultAge(
                    animal.species
                );

            animal.isAdult =
                animal.ageMonths >=
                animal.adultAgeMonths;

            if (
                animal.breedingCooldown > 0
            ) {

                animal.breedingCooldown--;

            }

            animal.breedingReady =
                animal.isAdult &&
                animal.health ===
                "Healthy" &&
                animal.breedingCooldown <= 0;

        }
    );

}


// ============================================
// NEXT DAY
// ============================================

function nextDay() {

    game.day++;

    updateAnimalAges();

    updateEggs();

    saveGame();

    updateUI();

}


// ============================================
// BUY
// ============================================

function buyAnimal(index) {

    const item =
        shopAnimals[index];

    if (!item) return;

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

        ageDays: 0,

        ageMonths: 0,

        adultAgeMonths:
            getAdultAge(
                item.species
            ),

        isAdult: false,

        breedingReady: false,

        breedingCooldown: 0,

        health:
            "Healthy",

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

}


// ============================================
// BREEDING SELECTION
// ============================================

function selectMale(id) {

    const animal =
        game.animals.find(
            a => a.id === id
        );

    if (!animal) return;

    if (animal.sex !== "Male") {

        alert(
            "Dit dier is geen mannetje."
        );

        return;

    }

    if (!animal.breedingReady) {

        alert(
            "Dit mannetje is nog niet klaar."
        );

        return;

    }

    selectedMale =
        animal;

    updateBreedingUI();

}


function selectFemale(id) {

    const animal =
        game.animals.find(
            a => a.id === id
        );

    if (!animal) return;

    if (animal.sex !== "Female") {

        alert(
            "Dit dier is geen vrouwtje."
        );

        return;

    }

    if (!animal.breedingReady) {

        alert(
            "Dit vrouwtje is nog niet klaar."
        );

        return;

    }

    selectedFemale =
        animal;

    updateBreedingUI();

}


// ============================================
// INHERIT
// ============================================

function inheritAllele(
    alleles
) {

    if (
        !alleles ||
        alleles.length !== 2
    ) {

        return "A";

    }

    return alleles[
        Math.floor(
            Math.random() * 2
        )
    ];

}


// ============================================
// CHILD GENES
// ============================================

function createChildGenes(
    father,
    mother
) {

    const childGenes = {};

    const genes =
        new Set([
            ...Object.keys(
                father.genes || {}
            ),

            ...Object.keys(
                mother.genes || {}
            )
        ]);


    genes.forEach(
        gene => {

            const fatherGene =
                father.genes[
                    gene
                ] || ["A", "A"];

            const motherGene =
                mother.genes[
                    gene
                ] || ["A", "A"];


            childGenes[gene] = [

                inheritAllele(
                    fatherGene
                ),

                inheritAllele(
                    motherGene
                )

            ];

        }
    );


    return childGenes;

}


// ============================================
// MORPH
// ============================================

function calculateVisibleMorph(
    animal
) {

    const genes =
        animal.genes || {};


    if (
        animal.species ===
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
        animal.species ===
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
        animal.species ===
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


    return animal.morph ||
        "Normal";

}


// ============================================
// CLUTCH SIZE
// ============================================

function getClutchSize(
    species
) {

    const settings =
        speciesSettings[
            species
        ];

    if (!settings)
        return 1;

    return Math.floor(
        Math.random() *
        (
            settings.eggsMax -
            settings.eggsMin +
            1
        )
    ) +
        settings.eggsMin;

}


// ============================================
// EGG FERTILITY
// ============================================

function determineFertility() {

    // 90% fertilized
    return Math.random() < 0.90;

}


// ============================================
// EGG HEALTH
// ============================================

function determineEggHealth() {

    const roll =
        Math.random();

    if (roll < 0.05)
        return "Damaged";

    if (roll < 0.12)
        return "Weak";

    return "Healthy";

}


// ============================================
// CREATE EGG
// ============================================

function createEgg(
    father,
    mother
) {

    const genes =
        createChildGenes(
            father,
            mother
        );


    const fakeAnimal = {

        species:
            father.species,

        genes:
            genes

    };


    const predictedMorph =
        calculateVisibleMorph(
            fakeAnimal
        );


    const settings =
        speciesSettings[
            father.species
        ];


    const fertile =
        determineFertility();


    const health =
        determineEggHealth();


    return {

        id:
            Date.now() +
            Math.random(),

        species:
            father.species,

        genes:
            genes,

        predictedMorph:
            predictedMorph,

        fatherId:
            father.id,

        motherId:
            mother.id,

        createdDay:
            game.day,

        hatchDay:
            game.day +
            settings.incubationDays,

        fertile:
            fertile,

        health:
            health,

        status:
            "Incubating"

    };

}


// ============================================
// BREED
// ============================================

function startBreeding() {

    if (
        !selectedMale ||
        !selectedFemale
    ) {

        alert(
            "Selecteer eerst beide ouders."
        );

        return;

    }


    if (
        selectedMale.species !==
        selectedFemale.species
    ) {

        alert(
            "Je kunt alleen dezelfde soort fokken."
        );

        return;

    }


    if (
        !selectedMale.breedingReady ||
        !selectedFemale.breedingReady
    ) {

        alert(
            "Een van de dieren is niet klaar."
        );

        return;

    }


    // 90% chance breeding works

    if (
        Math.random() > 0.90
    ) {

        selectedMale.breedingCooldown =
            14;

        selectedFemale.breedingCooldown =
            28;

        alert(
            "❌ De breeding is mislukt."
        );

        selectedMale = null;
        selectedFemale = null;

        saveGame();
        updateUI();

        return;

    }


    const clutchSize =
        getClutchSize(
            selectedFemale.species
        );


    let created =
        0;


    for (
        let i = 0;
        i < clutchSize;
        i++
    ) {

        const egg =
            createEgg(
                selectedMale,
                selectedFemale
            );

        game.eggs.push(
            egg
        );

        created++;

    }


    selectedMale.breedingCooldown =
        14;

    selectedFemale.breedingCooldown =
        28;


    saveGame();

    updateUI();


    alert(
        `🥚 Breeding gelukt!\n\n` +
        `Clutch: ${created} eieren!`
    );


    selectedMale = null;

    selectedFemale = null;

    updateBreedingUI();

}


// ============================================
// EGG UPDATE
// ============================================

function updateEggs() {

    game.eggs.forEach(
        egg => {

            if (
                game.day >=
                egg.hatchDay
            ) {

                egg.status =
                    "Ready";

            }

        }
    );

}


// ============================================
// HATCH
// ============================================

function hatchEgg(index) {

    const egg =
        game.eggs[index];

    if (!egg)
        return;


    if (
        game.day <
        egg.hatchDay
    ) {

        alert(
            "Het ei moet nog incuberen."
        );

        return;

    }


    // infertile egg

    if (!egg.fertile) {

        game.eggs.splice(
            index,
            1
        );

        saveGame();

        updateUI();

        alert(
            "🥚 Het ei was infertiel."
        );

        return;

    }


    // damaged egg

    if (
        egg.health ===
        "Damaged"
    ) {

        game.eggs.splice(
            index,
            1
        );

        saveGame();

        updateUI();

        alert(
            "Het ei is helaas niet uitgekomen."
        );

        return;

    }


    const weak =
        egg.health ===
        "Weak";


    const childGenes =
        egg.genes;


    const child = {

        id:
            Date.now() +
            Math.random(),

        name:
            egg.species +
            " Baby",

        species:
            egg.species,

        morph:
            calculateVisibleMorph({

                species:
                    egg.species,

                genes:
                    childGenes

            }),

        sex:
            randomSex(),

        birthDay:
            game.day,

        ageDays: 0,

        ageMonths: 0,

        adultAgeMonths:
            getAdultAge(
                egg.species
            ),

        isAdult: false,

        breedingReady: false,

        breedingCooldown: 0,

        health:
            weak
                ? "Weak"
                : "Healthy",

        genes:
            childGenes,

        fatherId:
            egg.fatherId,

        motherId:
            egg.motherId

    };


    game.animals.push(
        child
    );


    game.eggs.splice(
        index,
        1
    );


    saveGame();

    updateUI();


    if (weak) {

        alert(
            `🐣 Baby geboren!\n\n` +
            `${child.species}\n` +
            `${child.morph}\n\n` +
            `⚠️ De baby is zwak.`
        );

    }

    else {

        alert(
            `🐣 Baby geboren!\n\n` +
            `${child.species}\n` +
            `Morph: ${child.morph}\n` +
            `Geslacht: ${child.sex}`
        );

    }

}


// ============================================
// RENDER EGGS
// ============================================

function renderEggs() {

    const container =
        document.getElementById(
            "eggList"
        );

    if (!container)
        return;


    container.innerHTML = "";


    if (
        game.eggs.length === 0
    ) {

        container.innerHTML = `

            <div class="card">

                <h3>
                    🥚 Geen eieren
                </h3>

                <p>
                    Ga naar Breeding
                    om eieren te krijgen.
                </p>

            </div>

        `;

        return;

    }


    game.eggs.forEach(
        (egg, index) => {

            const daysLeft =
                Math.max(
                    0,
                    egg.hatchDay -
                    game.day
                );


            let statusText =
                "🥚 Incubating";


            if (
                egg.status ===
                "Ready"
            ) {

                statusText =
                    "🐣 Ready";

            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "egg-card";


            card.innerHTML = `

                <div class="egg-icon">
                    🥚
                </div>

                <h3>
                    ${egg.species}
                </h3>

                <p>
                    Mogelijke morph:
                    <b>
                        ${egg.predictedMorph}
                    </b>
                </p>

                <p>
                    Status:
                    ${statusText}
                </p>

                <p>
                    Egg health:
                    ${egg.health}
                </p>

                <p>
                    ${
                        egg.fertile
                        ? "🟢 Fertile"
                        : "🔴 Infertile"
                    }
                </p>

                <p>
                    ${daysLeft}
                    dagen over
                </p>

                ${
                    daysLeft === 0

                    ?

                    `
                    <button
                        onclick="
                            hatchEgg(${index})
                        "
                    >
                        🐣 Uitbroeden
                    </button>
                    `

                    :

                    `
                    <button disabled>
                        🥚 Incubating
                    </button>
                    `
                }

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
    )
        return "🐍";

    if (
        species ===
        "Corn Snake"
    )
        return "🐍";

    return "🦎";

}


// ============================================
// ANIMAL LIST
// ============================================

function renderAnimals() {

    const container =
        document.getElementById(
            "animalList"
        );

    if (!container)
        return;


    container.innerHTML = "";


    if (
        game.animals.length === 0
    ) {

        container.innerHTML = `

            <div class="card">

                <h3>
                    Nog geen dieren
                </h3>

                <p>
                    Koop je eerste reptiel
                    in de shop.
                </p>

            </div>

        `;

        return;

    }


    game.animals.forEach(
        animal => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "animal-card";


            card.onclick =
                () =>
                    openAnimalModal(
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
                    🧬
                    ${calculateVisibleMorph(
                        animal
                    )}
                </p>

                <p>
                    ${animal.sex}
                </p>

                <p>
                    Leeftijd:
                    ${animal.ageMonths}
                    maanden
                </p>

                <p>
                    ${
                        animal.health ===
                        "Healthy"
                        ? "🟢 Healthy"
                        : "🟡 Weak"
                    }
                </p>

            `;


            container.appendChild(
                card
            );

        }
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

    if (!container)
        return;


    container.innerHTML = "";


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
// BREEDING UI
// ============================================

function renderBreedingAnimals() {

    const container =
        document.getElementById(
            "breedingAnimals"
        );

    if (!container)
        return;


    container.innerHTML = "";


    const adults =
        game.animals.filter(
            animal =>
                animal.isAdult &&
                animal.health ===
                "Healthy"
        );


    if (
        adults.length === 0
    ) {

        container.innerHTML = `

            <p>
                Je hebt nog geen
                volwassen gezonde dieren.
            </p>

        `;

        return;

    }


    adults.forEach(
        animal => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "breeding-animal";


            div.innerHTML = `

                <b>
                    ${getAnimalIcon(
                        animal.species
                    )}

                    ${animal.name}
                </b>

                <p>
                    ${animal.species}
                </p>

                <p>
                    ${calculateVisibleMorph(
                        animal
                    )}
                </p>

                <p>
                    ${animal.sex}
                </p>

                <button
                    onclick="
                        ${
                            animal.sex ===
                            "Male"

                            ? `selectMale(${animal.id})`

                            : `selectFemale(${animal.id})`
                        }
                    "
                >

                    ${
                        animal.sex ===
                        "Male"

                        ? "♂ Kies vader"

                        : "♀ Kies moeder"
                    }

                </button>

            `;


            container.appendChild(
                div
            );

        }
    );

}


// ============================================
// BREEDING HEADER
// ============================================

function updateBreedingUI() {

    const male =
        document.getElementById(
            "maleSelection"
        );

    const female =
        document.getElementById(
            "femaleSelection"
        );

    const button =
        document.getElementById(
            "breedButton"
        );

    const message =
        document.getElementById(
            "breedingMessage"
        );


    if (selectedMale) {

        male.innerHTML = `

            <div class="animal-icon">
                ${getAnimalIcon(
                    selectedMale.species
                )}
            </div>

            <b>
                ${selectedMale.name}
            </b>

            <p>
                ${selectedMale.species}
            </p>

            <p>
                ${calculateVisibleMorph(
                    selectedMale
                )}
            </p>

        `;

    }
    else {

        male.innerHTML =
            "<p>Kies een mannetje.</p>";

    }


    if (selectedFemale) {

        female.innerHTML = `

            <div class="animal-icon">
                ${getAnimalIcon(
                    selectedFemale.species
                )}
            </div>

            <b>
                ${selectedFemale.name}
            </b>

            <p>
                ${selectedFemale.species}
            </p>

            <p>
                ${calculateVisibleMorph(
                    selectedFemale
                )}
            </p>

        `;

    }
    else {

        female.innerHTML =
            "<p>Kies een vrouwtje.</p>";

    }


    button.disabled =
        !selectedMale ||
        !selectedFemale;


    if (
        selectedMale &&
        selectedFemale
    ) {

        if (
            selectedMale.species !==
            selectedFemale.species
        ) {

            message.innerHTML = `

                <div class="warning">

                    ❌ Verschillende soorten.

                </div>

            `;

            button.disabled = true;

        }
        else {

            message.innerHTML = `

                <div class="success">

                    🧬 Klaar om te breeden!

                    <br><br>

                    Er kunnen meerdere
                    eieren ontstaan.

                </div>

            `;

        }

    }


    renderBreedingAnimals();

}


// ============================================
// MODAL
// ============================================

function openAnimalModal(id) {

    const animal =
        game.animals.find(
            a => a.id === id
        );

    if (!animal)
        return;


    const details =
        document.getElementById(
            "animalDetails"
        );


    let genesHTML = "";


    Object.keys(
        animal.genes || {}
    ).forEach(
        gene => {

            genesHTML += `

                <div class="gene">

                    <span>
                        ${gene}
                    </span>

                    <b>
                        ${
                            animal.genes[
                                gene
                            ].join("")
                        }
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
            <span>
                Soort
            </span>

            <b>
                ${animal.species}
            </b>
        </div>

        <div class="detail-row">
            <span>
                Morph
            </span>

            <b>
                ${calculateVisibleMorph(
                    animal
                )}
            </b>
        </div>

        <div class="detail-row">
            <span>
                Geslacht
            </span>

            <b>
                ${animal.sex}
            </b>
        </div>

        <div class="detail-row">
            <span>
                Leeftijd
            </span>

            <b>
                ${animal.ageMonths}
                maanden
            </b>
        </div>

        <div class="detail-row">
            <span>
                Gezondheid
            </span>

            <b>
                ${animal.health}
            </b>
        </div>

        <div class="gene-box">

            <h3>
                🧬 Genen
            </h3>

            ${genesHTML}

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
// UPDATE
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
        "animalCount"
    ).textContent =
        game.animals.length;


    document.getElementById(
        "eggCount"
    ).textContent =
        game.eggs.length;


    document.getElementById(
        "homeDay"
    ).textContent =
        game.day;


    document.getElementById(
        "homeMonth"
    ).textContent =
        month;


    document.getElementById(
        "homeMoney"
    ).textContent =
        game.money;


    document.getElementById(
        "homeAnimalCount"
    ).textContent =
        game.animals.length;


    document.getElementById(
        "homeEggCount"
    ).textContent =
        game.eggs.length;


    renderAnimals();

    renderShop();

    renderBreedingAnimals();

    renderEggs();

    updateBreedingUI();

}


// ============================================
// START
// ============================================

loadGame();

updateAnimalAges();

updateEggs();

updateUI();




// ============================================
// REPTILE BREEDING SIMULATION
// PART 7 - RECESSIVE & HIDDEN GENETICS
// ============================================


// ============================================
// GENETIC TYPES
// ============================================

const geneticTypes = {

    "Ball Python": {

        Albino: {
            type: "recessive",
            gene: "albino",
            normal: "A",
            mutated: "a"
        },

        Clown: {
            type: "recessive",
            gene: "clown",
            normal: "C",
            mutated: "c"
        },

        Pied: {
            type: "recessive",
            gene: "pied",
            normal: "P",
            mutated: "p"
        },

        Pastel: {
            type: "dominant",
            gene: "pastel",
            normal: "P",
            mutated: "p"
        }

    },


    "Leopard Gecko": {

        Albino: {
            type: "recessive",
            gene: "albino",
            normal: "A",
            mutated: "a"
        },

        Tremper: {
            type: "recessive",
            gene: "tremper",
            normal: "T",
            mutated: "t"
        },

        Eclipse: {
            type: "recessive",
            gene: "eclipse",
            normal: "E",
            mutated: "e"
        }

    },


    "Corn Snake": {

        Amelanistic: {
            type: "recessive",
            gene: "amel",
            normal: "A",
            mutated: "a"
        },

        Anery: {
            type: "recessive",
            gene: "anery",
            normal: "N",
            mutated: "n"
        },

        Motley: {
            type: "recessive",
            gene: "motley",
            normal: "M",
            mutated: "m"
        }

    }

};


// ============================================
// GENERATE RANDOM HIDDEN GENES
// ============================================

function generateHiddenGenes(
    species,
    visibleMorph
) {

    const result = {};

    const speciesGenes =
        geneticTypes[species];

    if (!speciesGenes)
        return result;


    Object.keys(
        speciesGenes
    ).forEach(
        morph => {

            const data =
                speciesGenes[morph];


            const gene =
                data.gene;


            // Already visible morph
            if (
                morph === visibleMorph
            ) {

                if (
                    data.type ===
                    "recessive"
                ) {

                    result[gene] = [
                        data.mutated,
                        data.mutated
                    ];

                }
                else {

                    result[gene] = [
                        data.mutated,
                        data.normal
                    ];

                }

                return;

            }


            // Small chance animal carries
            // a hidden recessive gene

            if (
                data.type ===
                "recessive"
            ) {

                const roll =
                    Math.random();

                if (
                    roll < 0.15
                ) {

                    result[gene] = [
                        data.mutated,
                        data.normal
                    ];

                }
                else {

                    result[gene] = [
                        data.normal,
                        data.normal
                    ];

                }

            }

            else {

                result[gene] = [
                    data.normal,
                    data.normal
                ];

            }

        }
    );


    return result;

}


// ============================================
// CHECK IF HET
// ============================================

function isHet(
    genes,
    gene,
    mutated
) {

    if (!genes)
        return false;


    const pair =
        genes[gene];


    if (!pair)
        return false;


    return (
        pair.includes(mutated) &&
        pair.includes(
            pair.find(
                allele =>
                    allele !== mutated
            )
        )
    );

}


// ============================================
// CHECK HOMO RECESSIVE
// ============================================

function isHomozygousRecessive(
    genes,
    gene,
    mutated
) {

    if (!genes)
        return false;


    const pair =
        genes[gene];


    if (!pair)
        return false;


    return (
        pair[0] === mutated &&
        pair[1] === mutated
    );

}


// ============================================
// GENETIC STATUS
// ============================================

function getGeneStatus(
    animal,
    morph
) {

    const data =
        geneticTypes[
            animal.species
        ]?.[morph];


    if (!data)
        return "Unknown";


    const genes =
        animal.genes || {};


    const pair =
        genes[
            data.gene
        ];


    if (!pair)
        return "Normal";


    if (
        data.type ===
        "recessive"
    ) {

        if (
            pair[0] ===
            data.mutated &&
            pair[1] ===
            data.mutated
        ) {

            return "Visual";

        }


        if (
            pair.includes(
                data.mutated
            )
        ) {

            return "Het";

        }


        return "Normal";

    }


    if (
        data.type ===
        "dominant"
    ) {

        if (
            pair.includes(
                data.mutated
            )
        ) {

            return "Visual";

        }

        return "Normal";

    }


    return "Unknown";

}


// ============================================
// GET HIDDEN GENES
// ============================================

function getHiddenGenes(
    animal
) {

    const hidden = [];

    const species =
        geneticTypes[
            animal.species
        ];

    if (!species)
        return hidden;


    Object.keys(
        species
    ).forEach(
        morph => {

            const data =
                species[morph];


            if (
                data.type !==
                "recessive"
            )
                return;


            const status =
                getGeneStatus(
                    animal,
                    morph
                );


            if (
                status ===
                "Het"
            ) {

                hidden.push(
                    morph
                );

            }

        }
    );


    return hidden;

}


// ============================================
// IMPROVE ANIMAL GENETICS
// ============================================

function upgradeAnimalGenetics(
    animal
) {

    const hiddenGenes =
        generateHiddenGenes(
            animal.species,
            animal.morph
        );


    if (!animal.genes)
        animal.genes = {};


    Object.keys(
        hiddenGenes
    ).forEach(
        gene => {

            if (
                !animal.genes[gene]
            ) {

                animal.genes[gene] =
                    hiddenGenes[gene];

            }

        }
    );

}


// ============================================
// GET PARENT ALLELE
// ============================================

function getRandomAllele(
    animal,
    gene
) {

    if (
        !animal.genes ||
        !animal.genes[gene]
    ) {

        return null;

    }


    const pair =
        animal.genes[gene];


    return pair[
        Math.floor(
            Math.random() * 2
        )
    ];

}


// ============================================
// MAKE BABY GENE
// ============================================

function makeBabyGene(
    father,
    mother,
    gene
) {

    const fatherAllele =
        getRandomAllele(
            father,
            gene
        );


    const motherAllele =
        getRandomAllele(
            mother,
            gene
        );


    if (
        fatherAllele === null ||
        motherAllele === null
    ) {

        return null;

    }


    return [
        fatherAllele,
        motherAllele
    ];

}


// ============================================
// CALCULATE BABY GENES
// ============================================

function calculateBabyGenetics(
    father,
    mother
) {

    const babyGenes = {};


    const allGenes =
        new Set([
            ...Object.keys(
                father.genes || {}
            ),

            ...Object.keys(
                mother.genes || {}
            )
        ]);


    allGenes.forEach(
        gene => {

            const result =
                makeBabyGene(
                    father,
                    mother,
                    gene
                );


            if (result) {

                babyGenes[gene] =
                    result;

            }

        }
    );


    return babyGenes;

}


// ============================================
// DETERMINE BABY MORPH
// ============================================

function determineBabyMorph(
    species,
    genes
) {

    const genetics =
        geneticTypes[
            species
        ];


    if (!genetics)
        return "Normal";


    const visualMorphs = [];


    Object.keys(
        genetics
    ).forEach(
        morph => {

            const data =
                genetics[morph];


            const pair =
                genes[
                    data.gene
                ];


            if (!pair)
                return;


            if (
                data.type ===
                "recessive"
            ) {

                if (
                    pair[0] ===
                    data.mutated &&
                    pair[1] ===
                    data.mutated
                ) {

                    visualMorphs.push(
                        morph
                    );

                }

            }


            if (
                data.type ===
                "dominant"
            ) {

                if (
                    pair.includes(
                        data.mutated
                    )
                ) {

                    visualMorphs.push(
                        morph
                    );

                }

            }

        }
    );


    if (
        visualMorphs.length === 0
    ) {

        return "Normal";

    }


    return visualMorphs.join(
        " + "
    );

}


// ============================================
// BREEDING RESULT PREVIEW
// ============================================

function previewBreedingGenetics() {

    if (
        !selectedMale ||
        !selectedFemale
    ) {

        return;

    }


    if (
        selectedMale.species !==
        selectedFemale.species
    ) {

        return;

    }


    const species =
        selectedMale.species;


    const genetics =
        geneticTypes[
            species
        ];


    if (!genetics)
        return;


    let text =
        "🧬 Breeding preview\n\n";


    Object.keys(
        genetics
    ).forEach(
        morph => {

            const data =
                genetics[morph];


            if (
                data.type !==
                "recessive"
            )
                return;


            const fatherGenes =
                selectedMale.genes[
                    data.gene
                ];


            const motherGenes =
                selectedFemale.genes[
                    data.gene
                ];


            if (
                !fatherGenes ||
                !motherGenes
            )
                return;


            let mutatedFather =
                fatherGenes.filter(
                    allele =>
                        allele ===
                        data.mutated
                ).length;


            let mutatedMother =
                motherGenes.filter(
                    allele =>
                        allele ===
                        data.mutated
                ).length;


            let probability =
                0;


            for (
                let f = 0;
                f < 2;
                f++
            ) {

                for (
                    let m = 0;
                    m < 2;
                    m++
                ) {

                    if (
                        fatherGenes[f] ===
                        data.mutated &&
                        motherGenes[m] ===
                        data.mutated
                    ) {

                        probability +=
                            25;

                    }

                }

            }


            if (
                probability > 0
            ) {

                text +=
                    `${morph}: ${probability}% visual\n`;

            }

        }
    );


    console.log(
        text
    );

}


// ============================================
// SHOW GENETICS
// ============================================

function showAnimalGenetics(
    animal
) {

    upgradeAnimalGenetics(
        animal
    );


    const hiddenGenes =
        getHiddenGenes(
            animal
        );


    let result =
        `🧬 ${animal.name}\n\n`;


    result +=
        `Visible morph: ${
            determineBabyMorph(
                animal.species,
                animal.genes
            )
        }\n\n`;


    if (
        hiddenGenes.length > 0
    ) {

        result +=
            "🔒 Hidden / Het genes:\n";


        hiddenGenes.forEach(
            gene => {

                result +=
                    `• Het ${gene}\n`;

            }
        );

    }
    else {

        result +=
            "Geen bekende het-genen.";

    }


    alert(
        result
    );

}


// ============================================
// PATCH BABY CREATION
// ============================================

function createAdvancedBaby(
    father,
    mother
) {

    const genes =
        calculateBabyGenetics(
            father,
            mother
        );


    const morph =
        determineBabyMorph(
            father.species,
            genes
        );


    return {

        id:
            Date.now() +
            Math.random(),

        name:
            father.species +
            " Baby",

        species:
            father.species,

        morph:
            morph,

        sex:
            randomSex(),

        birthDay:
            game.day,

        ageDays: 0,

        ageMonths: 0,

        adultAgeMonths:
            getAdultAge(
                father.species
            ),

        isAdult: false,

        breedingReady: false,

        breedingCooldown: 0,

        health:
            Math.random() <
            0.10
                ? "Weak"
                : "Healthy",

        genes:
            genes,

        fatherId:
            father.id,

        motherId:
            mother.id

    };

}


// ============================================
// UPDATE ALL GENETICS
// ============================================

function updateAllGenetics() {

    game.animals.forEach(
        animal => {

            upgradeAnimalGenetics(
                animal
            );

        }
    );

}


// ============================================
// DEBUG / TEST
// ============================================

function showSelectedGenetics() {

    if (selectedMale) {

        showAnimalGenetics(
            selectedMale
        );

    }


    if (selectedFemale) {

        showAnimalGenetics(
            selectedFemale
        );

    }

}


// ============================================
// START PART 7
// ============================================

updateAllGenetics();

saveGame();

updateUI();

console.log(
    "🧬 Part 7 genetics loaded!"
);
