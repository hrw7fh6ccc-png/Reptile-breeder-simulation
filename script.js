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





// ============================================
// REPTILE BREEDING SIMULATION
// PART 8 - INCUBATOR SYSTEM
// ============================================


// ============================================
// INCUBATORS
// ============================================

let incubators = [
    {
        id: 1,
        name: "Basic Incubator",
        capacity: 10,
        temperature: 29,
        humidity: 60,
        eggs: []
    }
];


// ============================================
// SPECIES INCUBATION SETTINGS
// ============================================

const incubationSettings = {

    "Ball Python": {
        temperatureMin: 27,
        temperatureMax: 32,
        humidityMin: 55,
        humidityMax: 70
    },

    "Leopard Gecko": {
        temperatureMin: 26,
        temperatureMax: 30,
        humidityMin: 70,
        humidityMax: 85
    },

    "Corn Snake": {
        temperatureMin: 27,
        temperatureMax: 30,
        humidityMin: 60,
        humidityMax: 75
    },

    "Bearded Dragon": {
        temperatureMin: 27,
        temperatureMax: 31,
        humidityMin: 50,
        humidityMax: 65
    },

    "Crested Gecko": {
        temperatureMin: 22,
        temperatureMax: 27,
        humidityMin: 70,
        humidityMax: 85
    }

};


// ============================================
// GET INCUBATOR
// ============================================

function getIncubator(id) {

    return incubators.find(
        incubator => incubator.id === id
    );

}


// ============================================
// CHECK INCUBATOR CONDITIONS
// ============================================

function getEggCondition(egg, incubator) {

    const settings =
        incubationSettings[egg.species];

    if (!settings) {
        return "Normal";
    }

    const temperatureGood =
        incubator.temperature >=
        settings.temperatureMin &&
        incubator.temperature <=
        settings.temperatureMax;

    const humidityGood =
        incubator.humidity >=
        settings.humidityMin &&
        incubator.humidity <=
        settings.humidityMax;


    if (
        temperatureGood &&
        humidityGood
    ) {

        return "Good";

    }


    if (
        temperatureGood ||
        humidityGood
    ) {

        return "Warning";

    }


    return "Danger";

}


// ============================================
// ADD EGG TO INCUBATOR
// ============================================

function addEggToIncubator(
    eggIndex,
    incubatorId = 1
) {

    const incubator =
        getIncubator(incubatorId);

    if (!incubator) {
        alert("Incubator bestaat niet.");
        return;
    }


    if (
        incubator.eggs.length >=
        incubator.capacity
    ) {

        alert(
            "❌ De incubator zit vol!"
        );

        return;

    }


    const egg =
        game.eggs[eggIndex];

    if (!egg) {
        return;
    }


    incubator.eggs.push(egg);

    game.eggs.splice(
        eggIndex,
        1
    );


    saveGame();

    renderIncubators();

    renderEggs();

}


// ============================================
// REMOVE EGG
// ============================================

function removeEggFromIncubator(
    incubatorId,
    eggId
) {

    const incubator =
        getIncubator(incubatorId);

    if (!incubator) {
        return;
    }


    const index =
        incubator.eggs.findIndex(
            egg =>
                egg.id === eggId
        );


    if (index === -1) {
        return;
    }


    const egg =
        incubator.eggs[index];


    game.eggs.push(
        egg
    );


    incubator.eggs.splice(
        index,
        1
    );


    saveGame();

    renderIncubators();

    renderEggs();

}


// ============================================
// CHANGE TEMPERATURE
// ============================================

function changeIncubatorTemperature(
    incubatorId,
    amount
) {

    const incubator =
        getIncubator(incubatorId);

    if (!incubator) {
        return;
    }


    incubator.temperature +=
        amount;


    if (
        incubator.temperature < 15
    ) {

        incubator.temperature = 15;

    }


    if (
        incubator.temperature > 40
    ) {

        incubator.temperature = 40;

    }


    saveGame();

    renderIncubators();

}


// ============================================
// CHANGE HUMIDITY
// ============================================

function changeIncubatorHumidity(
    incubatorId,
    amount
) {

    const incubator =
        getIncubator(incubatorId);

    if (!incubator) {
        return;
    }


    incubator.humidity +=
        amount;


    if (
        incubator.humidity < 20
    ) {

        incubator.humidity = 20;

    }


    if (
        incubator.humidity > 100
    ) {

        incubator.humidity = 100;

    }


    saveGame();

    renderIncubators();

}


// ============================================
// INCUBATOR DAILY UPDATE
// ============================================

function updateIncubators() {

    incubators.forEach(
        incubator => {

            incubator.eggs.forEach(
                egg => {

                    const condition =
                        getEggCondition(
                            egg,
                            incubator
                        );


                    // Good conditions
                    if (
                        condition ===
                        "Good"
                    ) {

                        if (
                            egg.incubationHealth ===
                            undefined
                        ) {

                            egg.incubationHealth =
                                100;

                        }


                        egg.incubationHealth =
                            Math.min(
                                100,
                                egg.incubationHealth +
                                1
                            );

                    }


                    // Warning
                    if (
                        condition ===
                        "Warning"
                    ) {

                        if (
                            egg.incubationHealth ===
                            undefined
                        ) {

                            egg.incubationHealth =
                                100;

                        }


                        egg.incubationHealth =
                            Math.max(
                                0,
                                egg.incubationHealth -
                                2
                            );

                    }


                    // Danger
                    if (
                        condition ===
                        "Danger"
                    ) {

                        if (
                            egg.incubationHealth ===
                            undefined
                        ) {

                            egg.incubationHealth =
                                100;

                        }


                        egg.incubationHealth =
                            Math.max(
                                0,
                                egg.incubationHealth -
                                5
                            );


                        // Egg can become damaged
                        if (
                            egg.incubationHealth <=
                            0
                        ) {

                            egg.health =
                                "Damaged";

                        }

                    }

                }
            );

        }
    );


    saveGame();

}


// ============================================
// HATCH EGGS INSIDE INCUBATOR
// ============================================

function hatchIncubatorEgg(
    incubatorId,
    eggId
) {

    const incubator =
        getIncubator(incubatorId);

    if (!incubator) {
        return;
    }


    const index =
        incubator.eggs.findIndex(
            egg =>
                egg.id === eggId
        );


    if (index === -1) {
        return;
    }


    const egg =
        incubator.eggs[index];


    if (
        game.day <
        egg.hatchDay
    ) {

        alert(
            `🥚 Dit ei moet nog ${
                egg.hatchDay -
                game.day
            } dagen incuberen.`
        );

        return;

    }


    // Infertile
    if (!egg.fertile) {

        incubator.eggs.splice(
            index,
            1
        );

        saveGame();

        renderIncubators();

        alert(
            "🥚 Het ei was infertiel."
        );

        return;

    }


    // Damaged
    if (
        egg.health ===
        "Damaged" ||
        egg.incubationHealth <= 0
    ) {

        incubator.eggs.splice(
            index,
            1
        );

        saveGame();

        renderIncubators();

        alert(
            "❌ Het ei heeft het helaas niet gehaald."
        );

        return;

    }


    const genes =
        egg.genes || {};


    const morph =
        typeof determineBabyMorph ===
        "function"

            ? determineBabyMorph(
                egg.species,
                genes
            )

            : egg.predictedMorph ||
              "Normal";


    const baby = {

        id:
            Date.now() +
            Math.random(),

        name:
            egg.species +
            " Baby",

        species:
            egg.species,

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
                egg.species
            ),

        isAdult: false,

        breedingReady: false,

        breedingCooldown: 0,

        health:
            egg.health === "Weak"
                ? "Weak"
                : "Healthy",

        genes:
            genes,

        fatherId:
            egg.fatherId,

        motherId:
            egg.motherId

    };


    game.animals.push(
        baby
    );


    incubator.eggs.splice(
        index,
        1
    );


    saveGame();

    updateUI();

    renderIncubators();


    alert(
        `🐣 BABY GEBOREN!\n\n` +
        `${baby.species}\n` +
        `Morph: ${baby.morph}\n` +
        `Geslacht: ${baby.sex}\n` +
        `Gezondheid: ${baby.health}`
    );

}


// ============================================
// RENDER INCUBATORS
// ============================================

function renderIncubators() {

    const container =
        document.getElementById(
            "incubatorList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    incubators.forEach(
        incubator => {

            const box =
                document.createElement(
                    "div"
                );


            box.className =
                "incubator-card";


            let eggsHTML = "";


            if (
                incubator.eggs.length === 0
            ) {

                eggsHTML = `
                    <p>
                        🥚 Geen eieren
                    </p>
                `;

            }
            else {

                incubator.eggs.forEach(
                    egg => {

                        const daysLeft =
                            Math.max(
                                0,
                                egg.hatchDay -
                                game.day
                            );


                        const condition =
                            getEggCondition(
                                egg,
                                incubator
                            );


                        let conditionIcon =
                            "🟢";


                        if (
                            condition ===
                            "Warning"
                        ) {

                            conditionIcon =
                                "🟡";

                        }


                        if (
                            condition ===
                            "Danger"
                        ) {

                            conditionIcon =
                                "🔴";

                        }


                        eggsHTML += `

                            <div class="incubator-egg">

                                <span>
                                    🥚
                                    ${egg.species}
                                </span>

                                <span>
                                    ${conditionIcon}
                                    ${condition}
                                </span>

                                <span>
                                    ${daysLeft}
                                    dagen
                                </span>

                                ${
                                    daysLeft === 0

                                    ?

                                    `
                                    <button
                                        onclick="
                                        hatchIncubatorEgg(
                                            ${incubator.id},
                                            ${egg.id}
                                        )
                                        "
                                    >
                                        🐣 Hatch
                                    </button>
                                    `

                                    :

                                    ""
                                }

                                <button
                                    onclick="
                                    removeEggFromIncubator(
                                        ${incubator.id},
                                        ${egg.id}
                                    )
                                    "
                                >
                                    Verwijder
                                </button>

                            </div>

                        `;

                    }
                );

            }


            box.innerHTML = `

                <h2>
                    🌡️ ${incubator.name}
                </h2>

                <p>
                    Eieren:
                    ${incubator.eggs.length}
                    /
                    ${incubator.capacity}
                </p>

                <hr>

                <h3>
                    Temperatuur
                </h3>

                <strong>
                    ${incubator.temperature}°C
                </strong>

                <br><br>

                <button
                    onclick="
                    changeIncubatorTemperature(
                        ${incubator.id},
                        -1
                    )
                    "
                >
                    −
                </button>

                <button
                    onclick="
                    changeIncubatorTemperature(
                        ${incubator.id},
                        1
                    )
                    "
                >
                    +
                </button>


                <h3>
                    Luchtvochtigheid
                </h3>

                <strong>
                    ${incubator.humidity}%
                </strong>

                <br><br>

                <button
                    onclick="
                    changeIncubatorHumidity(
                        ${incubator.id},
                        -5
                    )
                    "
                >
                    −5%
                </button>

                <button
                    onclick="
                    changeIncubatorHumidity(
                        ${incubator.id},
                        5
                    )
                    "
                >
                    +5%
                </button>


                <hr>

                <h3>
                    🥚 Eieren
                </h3>

                ${eggsHTML}

            `;


            container.appendChild(
                box
            );

        }
    );

}


// ============================================
// INCUBATOR GAME-DAY PATCH
// ============================================

const originalNextDay =
    typeof nextDay === "function"
        ? nextDay
        : null;


function advanceDayWithIncubator() {

    game.day++;


    updateAnimalAges();

    updateEggs();

    updateIncubators();


    saveGame();

    updateUI();

    renderIncubators();

}


// ============================================
// INITIALIZE INCUBATION HEALTH
// ============================================

function initializeIncubationHealth() {

    incubators.forEach(
        incubator => {

            incubator.eggs.forEach(
                egg => {

                    if (
                        egg.incubationHealth ===
                        undefined
                    ) {

                        egg.incubationHealth =
                            100;

                    }

                }
            );

        }
    );

}


// ============================================
// SAVE INCUBATORS
// ============================================

function saveIncubators() {

    localStorage.setItem(
        "reptileIncubators",
        JSON.stringify(
            incubators
        )
    );

}


// ============================================
// LOAD INCUBATORS
// ============================================

function loadIncubators() {

    const saved =
        localStorage.getItem(
            "reptileIncubators"
        );


    if (!saved) {
        return;
    }


    try {

        incubators =
            JSON.parse(saved);

    }
    catch (error) {

        console.error(
            "Incubator save error:",
            error
        );

    }

}


// ============================================
// AUTO SAVE
// ============================================

setInterval(
    () => {

        saveGame();

        saveIncubators();

    },
    5000
);


// ============================================
// START PART 8
// ============================================

loadIncubators();

initializeIncubationHealth();

renderIncubators();

saveIncubators();

console.log(
    "🌡️ Part 8 - Incubator system loaded!"
);





// ============================================
// REPTILE BREEDING SIMULATION
// PART 9 - BABY GROWTH & CARE
// ============================================


// ============================================
// CARE SETTINGS
// ============================================

const careSettings = {

    "Ball Python": {
        foodEveryDays: 7,
        waterEveryDays: 2
    },

    "Leopard Gecko": {
        foodEveryDays: 3,
        waterEveryDays: 2
    },

    "Corn Snake": {
        foodEveryDays: 7,
        waterEveryDays: 2
    },

    "Bearded Dragon": {
        foodEveryDays: 2,
        waterEveryDays: 1
    },

    "Crested Gecko": {
        foodEveryDays: 2,
        waterEveryDays: 1
    }

};


// ============================================
// ADD CARE DATA
// ============================================

function initializeAnimalCare(animal) {

    if (animal.foodLevel === undefined) {
        animal.foodLevel = 100;
    }

    if (animal.waterLevel === undefined) {
        animal.waterLevel = 100;
    }

    if (animal.happiness === undefined) {
        animal.happiness = 100;
    }

    if (animal.lastFedDay === undefined) {
        animal.lastFedDay = game.day;
    }

    if (animal.lastWaterDay === undefined) {
        animal.lastWaterDay = game.day;
    }

}


// ============================================
// UPDATE CARE
// ============================================

function updateAnimalCare() {

    game.animals.forEach(animal => {

        initializeAnimalCare(animal);

        animal.foodLevel =
            Math.max(
                0,
                animal.foodLevel - 3
            );

        animal.waterLevel =
            Math.max(
                0,
                animal.waterLevel - 5
            );


        // Low food

        if (animal.foodLevel < 30) {

            animal.health = "Weak";

            animal.happiness =
                Math.max(
                    0,
                    animal.happiness - 5
                );

        }


        // Low water

        if (animal.waterLevel < 20) {

            animal.health = "Weak";

            animal.happiness =
                Math.max(
                    0,
                    animal.happiness - 8
                );

        }


        // Good care

        if (
            animal.foodLevel >= 70 &&
            animal.waterLevel >= 70
        ) {

            animal.happiness =
                Math.min(
                    100,
                    animal.happiness + 2
                );

        }


        // Healthy recovery

        if (
            animal.foodLevel >= 80 &&
            animal.waterLevel >= 80 &&
            animal.happiness >= 60
        ) {

            animal.health = "Healthy";

        }

    });

}


// ============================================
// FEED ANIMAL
// ============================================

function feedAnimal(id) {

    const animal =
        game.animals.find(
            a => a.id === id
        );

    if (!animal) {
        return;
    }


    initializeAnimalCare(animal);


    animal.foodLevel =
        Math.min(
            100,
            animal.foodLevel + 45
        );


    animal.happiness =
        Math.min(
            100,
            animal.happiness + 5
        );


    animal.lastFedDay =
        game.day;


    if (
        animal.foodLevel >= 70 &&
        animal.waterLevel >= 50
    ) {

        animal.health = "Healthy";

    }


    saveGame();

    updateUI();


    alert(
        `🍽️ ${animal.name} is gevoerd!`
    );

}


// ============================================
// GIVE WATER
// ============================================

function giveAnimalWater(id) {

    const animal =
        game.animals.find(
            a => a.id === id
        );

    if (!animal) {
        return;
    }


    initializeAnimalCare(animal);


    animal.waterLevel =
        Math.min(
            100,
            animal.waterLevel + 60
        );


    animal.lastWaterDay =
        game.day;


    if (
        animal.foodLevel >= 50 &&
        animal.waterLevel >= 70
    ) {

        animal.health = "Healthy";

    }


    saveGame();

    updateUI();


    alert(
        `💧 ${animal.name} heeft water gekregen!`
    );

}


// ============================================
// AGE CHECK
// ============================================

function updateGrowthStages() {

    game.animals.forEach(animal => {

        initializeAnimalCare(animal);


        const oldAdultStatus =
            animal.isAdult;


        animal.ageDays =
            Math.max(
                0,
                game.day - animal.birthDay
            );


        // 28 days = 1 month

        animal.ageMonths =
            Math.floor(
                animal.ageDays / 28
            );


        animal.adultAgeMonths =
            getAdultAge(
                animal.species
            );


        animal.isAdult =
            animal.ageMonths >=
            animal.adultAgeMonths;


        animal.breedingReady =
            animal.isAdult &&
            animal.health === "Healthy" &&
            animal.breedingCooldown <= 0;


        // Animal became adult

        if (
            !oldAdultStatus &&
            animal.isAdult
        ) {

            animal.happiness =
                Math.min(
                    100,
                    animal.happiness + 10
                );


            console.log(
                `${animal.name} is volwassen geworden!`
            );

        }

    });

}


// ============================================
// DAILY GROWTH
// ============================================

function processDailyAnimalGrowth() {

    updateAnimalAges();

    updateGrowthStages();

    updateAnimalCare();

}


// ============================================
// ANIMAL STATUS
// ============================================

function getAnimalStatus(animal) {

    initializeAnimalCare(animal);


    if (
        animal.health === "Weak"
    ) {

        return "⚠️ Heeft extra verzorging nodig";

    }


    if (
        animal.foodLevel < 40
    ) {

        return "🍽️ Heeft honger";

    }


    if (
        animal.waterLevel < 30
    ) {

        return "💧 Heeft dorst";

    }


    if (
        animal.happiness < 40
    ) {

        return "😟 Niet gelukkig";

    }


    return "🟢 Alles goed";

}


// ============================================
// CARE MODAL
// ============================================

function openCarePanel(id) {

    const animal =
        game.animals.find(
            a => a.id === id
        );

    if (!animal) {
        return;
    }


    initializeAnimalCare(animal);


    const details =
        document.getElementById(
            "animalDetails"
        );


    if (!details) {
        return;
    }


    details.innerHTML = `

        <div
            style="
                text-align:center;
                font-size:60px;
            "
        >
            ${getAnimalIcon(
                animal.species
            )}
        </div>


        <h2>
            ${animal.name}
        </h2>


        <p>
            ${animal.species}
        </p>


        <hr>


        <h3>
            ❤️ Gezondheid
        </h3>

        <p>
            ${animal.health}
        </p>


        <h3>
            🍽️ Voeding
        </h3>

        <p>
            ${animal.foodLevel}%
        </p>


        <button
            onclick="
                feedAnimal(${animal.id})
            "
        >
            🍽️ Voeren
        </button>


        <h3>
            💧 Water
        </h3>

        <p>
            ${animal.waterLevel}%
        </p>


        <button
            onclick="
                giveAnimalWater(${animal.id})
            "
        >
            💧 Water geven
        </button>


        <h3>
            😊 Happiness
        </h3>

        <p>
            ${animal.happiness}%
        </p>


        <hr>


        <h3>
            📅 Leeftijd
        </h3>

        <p>
            ${animal.ageMonths}
            maanden
        </p>


        <p>
            ${
                animal.isAdult
                    ? "🟢 Volwassen"
                    : "🐣 Jong dier"
            }
        </p>


        <p>
            ${getAnimalStatus(animal)}
        </p>

    `;


    const modal =
        document.getElementById(
            "animalModal"
        );


    if (modal) {

        modal.classList.remove(
            "hidden"
        );

    }

}


// ============================================
// REPLACE ANIMAL MODAL CLICK
// ============================================

function openAnimalCareFromCard(id) {

    openCarePanel(id);

}


// ============================================
// DAILY GAME SYSTEM
// ============================================

function runDailySimulation() {

    game.day++;


    processDailyAnimalGrowth();

    updateEggs();

    updateIncubators();


    saveGame();

    saveIncubators();


    updateUI();

    renderIncubators();

}


// ============================================
// SAFE NEXT DAY BUTTON
// ============================================

function nextSimulationDay() {

    runDailySimulation();

}


// ============================================
// INITIALIZE ALL ANIMALS
// ============================================

function initializeAllAnimalCare() {

    game.animals.forEach(
        animal => {

            initializeAnimalCare(
                animal
            );

        }
    );

}


// ============================================
// START PART 9
// ============================================

initializeAllAnimalCare();

updateGrowthStages();

updateAnimalCare();

updateUI();


console.log(
    "🐣 Part 9 - Baby growth & care loaded!"
);






// ============================================
// REPTILE BREEDING SIMULATION
// PART 10 - MONEY & MARKET
// ============================================


// ============================================
// MARKET SETTINGS
// ============================================

const marketSettings = {

    "Ball Python": {
        "Normal": 120,
        "Pastel": 220,
        "Albino": 350,
        "Clown": 500,
        "Pied": 450
    },

    "Leopard Gecko": {
        "Normal": 80,
        "Mack Snow": 180,
        "Albino": 220,
        "Tremper": 250,
        "Eclipse": 300
    },

    "Corn Snake": {
        "Normal": 100,
        "Amelanistic": 180,
        "Anery": 200,
        "Motley": 220
    },

    "Bearded Dragon": {
        "Normal": 150
    },

    "Crested Gecko": {
        "Normal": 180
    }

};


// ============================================
// MARKET HISTORY
// ============================================

if (!game.sales) {
    game.sales = [];
}


// ============================================
// GET MARKET PRICE
// ============================================

function getMarketPrice(animal) {

    const speciesPrices =
        marketSettings[
            animal.species
        ];

    if (!speciesPrices) {
        return 50;
    }


    const morph =
        animal.morph ||
        "Normal";


    let price =
        speciesPrices[morph];


    if (!price) {
        price =
            speciesPrices["Normal"] ||
            50;
    }


    // Young animals are worth less

    if (!animal.isAdult) {
        price *= 0.75;
    }


    // Weak animals are worth less

    if (
        animal.health ===
        "Weak"
    ) {

        price *= 0.50;

    }


    // High happiness gives a small bonus

    if (
        animal.happiness >= 90
    ) {

        price *= 1.10;

    }


    return Math.round(price);

}


// ============================================
// SELL ANIMAL
// ============================================

function sellAnimal(id) {

    const index =
        game.animals.findIndex(
            animal =>
                animal.id === id
        );


    if (index === -1) {
        return;
    }


    const animal =
        game.animals[index];


    const price =
        getMarketPrice(
            animal
        );


    const confirmSale =
        confirm(
            `Wil je ${animal.name} verkopen voor €${price}?`
        );


    if (!confirmSale) {
        return;
    }


    game.money += price;


    game.sales.push({

        animalName:
            animal.name,

        species:
            animal.species,

        morph:
            animal.morph,

        price:
            price,

        day:
            game.day

    });


    game.animals.splice(
        index,
        1
    );


    // Remove from breeding selection

    if (
        selectedMale &&
        selectedMale.id === id
    ) {

        selectedMale = null;

    }


    if (
        selectedFemale &&
        selectedFemale.id === id
    ) {

        selectedFemale = null;

    }


    saveGame();

    updateUI();

    updateBreedingUI();


    alert(
        `💰 Verkocht voor €${price}!`
    );

}


// ============================================
// SELL BABY
// ============================================

function sellBaby(id) {

    const animal =
        game.animals.find(
            a => a.id === id
        );


    if (!animal) {
        return;
    }


    if (
        animal.isAdult
    ) {

        alert(
            "Dit dier is geen baby meer."
        );

        return;

    }


    sellAnimal(id);

}


// ============================================
// GET TOTAL COLLECTION VALUE
// ============================================

function getCollectionValue() {

    let total = 0;


    game.animals.forEach(
        animal => {

            total +=
                getMarketPrice(
                    animal
                );

        }
    );


    return Math.round(total);

}


// ============================================
// MARKET PAGE
// ============================================

function renderMarket() {

    const container =
        document.getElementById(
            "marketList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        game.animals.length === 0
    ) {

        container.innerHTML = `

            <div class="card">

                <h3>
                    Geen dieren te verkopen
                </h3>

            </div>

        `;

        return;

    }


    game.animals.forEach(
        animal => {

            const price =
                getMarketPrice(
                    animal
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            card.innerHTML = `

                <div
                    style="
                        font-size:50px;
                    "
                >
                    ${getAnimalIcon(
                        animal.species
                    )}
                </div>


                <h3>
                    ${animal.name}
                </h3>


                <p>
                    ${animal.species}
                </p>


                <p>
                    🧬
                    ${animal.morph}
                </p>


                <p>
                    ${
                        animal.isAdult
                            ? "Adult"
                            : "Baby"
                    }
                </p>


                <h3>
                    💰 €${price}
                </h3>


                <button
                    onclick="
                        sellAnimal(
                            ${animal.id}
                        )
                    "
                >
                    Verkopen
                </button>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// ============================================
// SALES HISTORY
// ============================================

function renderSalesHistory() {

    const container =
        document.getElementById(
            "salesHistory"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !game.sales ||
        game.sales.length === 0
    ) {

        container.innerHTML = `

            <p>
                Nog geen dieren verkocht.
            </p>

        `;

        return;

    }


    [...game.sales]
        .reverse()
        .slice(0, 20)
        .forEach(
            sale => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "sale-history";


                div.innerHTML = `

                    <p>
                        💰
                        <b>
                            ${sale.animalName}
                        </b>
                        verkocht voor
                        <b>
                            €${sale.price}
                        </b>
                    </p>

                    <small>
                        Dag ${sale.day}
                        —
                        ${sale.morph}
                    </small>

                `;


                container.appendChild(
                    div
                );

            }
        );

}


// ============================================
// MONEY STATS
// ============================================

function renderMoneyStats() {

    const money =
        document.getElementById(
            "marketMoney"
        );


    const value =
        document.getElementById(
            "collectionValue"
        );


    const sales =
        document.getElementById(
            "totalSales"
        );


    if (money) {

        money.textContent =
            `€${game.money}`;

    }


    if (value) {

        value.textContent =
            `€${getCollectionValue()}`;

    }


    if (sales) {

        sales.textContent =
            game.sales
                ? game.sales.length
                : 0;

    }

}


// ============================================
// RANDOM MARKET EVENT
// ============================================

function marketEvent() {

    const roll =
        Math.random();


    // 5% chance

    if (
        roll > 0.05
    ) {

        return;

    }


    const events = [

        {
            text:
                "🔥 Vraag naar Ball Pythons is gestegen!",
            species:
                "Ball Python",
            multiplier:
                1.25
        },

        {
            text:
                "🦎 Leopard Geckos zijn populair!",
            species:
                "Leopard Gecko",
            multiplier:
                1.20
        },

        {
            text:
                "📉 De reptielenmarkt is tijdelijk gezakt.",
            species:
                "ALL",
            multiplier:
                0.85
        }

    ];


    const event =
        events[
            Math.floor(
                Math.random() *
                events.length
            )
        ];


    if (
        event.species ===
        "ALL"
    ) {

        Object.keys(
            marketSettings
        ).forEach(
            species => {

                Object.keys(
                    marketSettings[
                        species
                    ]
                ).forEach(
                    morph => {

                        marketSettings[
                            species
                        ][morph] =
                            Math.round(
                                marketSettings[
                                    species
                                ][morph] *
                                event.multiplier
                            );

                    }
                );

            }
        );

    }
    else {

        if (
            marketSettings[
                event.species
            ]
        ) {

            Object.keys(
                marketSettings[
                    event.species
                ]
            ).forEach(
                morph => {

                    marketSettings[
                        event.species
                    ][morph] =
                        Math.round(
                            marketSettings[
                                event.species
                            ][morph] *
                            event.multiplier
                        );

                }
            );

        }

    }


    alert(
        `📈 MARKT EVENT\n\n${event.text}`
    );

}


// ============================================
// DAILY MARKET UPDATE
// ============================================

function updateMarketDaily() {

    marketEvent();

    renderMarket();

    renderMoneyStats();

}


// ============================================
// MARKET BUY BONUS
// ============================================

function getBuyingPrice(
    species,
    morph
) {

    const item =
        shopAnimals.find(
            animal =>
                animal.species ===
                species &&
                animal.morph ===
                morph
        );


    if (item) {
        return item.price;
    }


    return 100;

}


// ============================================
// FINANCIAL SUMMARY
// ============================================

function getFinancialSummary() {

    const collectionValue =
        getCollectionValue();


    const totalSales =
        (game.sales || [])
            .reduce(
                (
                    total,
                    sale
                ) =>
                    total +
                    sale.price,
                0
            );


    return {

        money:
            game.money,

        collectionValue:
            collectionValue,

        totalSales:
            totalSales,

        animals:
            game.animals.length,

        eggs:
            game.eggs.length

    };

}


// ============================================
// DAILY ECONOMY
// ============================================

function processDailyEconomy() {

    updateMarketDaily();

    renderMarket();

    renderMoneyStats();

}


// ============================================
// START PART 10
// ============================================

if (!game.sales) {
    game.sales = [];
}


renderMarket();

renderSalesHistory();

renderMoneyStats();


console.log(
    "💰 Part 10 - Money & Market loaded!"
);





// ============================================
// REPTILE BREEDING SIMULATION
// PART 11 - SHOP & UPGRADES
// ============================================


// ============================================
// UPGRADE DATA
// ============================================

const upgradeData = {

    incubator: [
        {
            level: 1,
            capacity: 10,
            price: 0,
            name: "Basic Incubator"
        },
        {
            level: 2,
            capacity: 20,
            price: 500,
            name: "Large Incubator"
        },
        {
            level: 3,
            capacity: 40,
            price: 1200,
            name: "Professional Incubator"
        },
        {
            level: 4,
            capacity: 80,
            price: 3000,
            name: "Breeding Facility"
        }
    ],

    habitat: [
        {
            level: 1,
            capacity: 20,
            price: 0,
            name: "Basic Room"
        },
        {
            level: 2,
            capacity: 40,
            price: 750,
            name: "Reptile Room"
        },
        {
            level: 3,
            capacity: 80,
            price: 1800,
            name: "Large Reptile Room"
        },
        {
            level: 4,
            capacity: 150,
            price: 4000,
            name: "Professional Facility"
        }
    ]

};


// ============================================
// PLAYER UPGRADES
// ============================================

if (!game.upgrades) {

    game.upgrades = {

        incubatorLevel: 1,

        habitatLevel: 1,

        breedingLevel: 1

    };

}


// ============================================
// GET UPGRADE
// ============================================

function getUpgrade(
    type,
    level
) {

    const list =
        upgradeData[type];

    if (!list) {
        return null;
    }


    return list.find(
        upgrade =>
            upgrade.level === level
    );

}


// ============================================
// UPGRADE INCUBATOR
// ============================================

function upgradeIncubator() {

    const currentLevel =
        game.upgrades.incubatorLevel;


    const nextLevel =
        currentLevel + 1;


    const upgrade =
        getUpgrade(
            "incubator",
            nextLevel
        );


    if (!upgrade) {

        alert(
            "🌟 Je incubator is al maximaal!"
        );

        return;

    }


    if (
        game.money <
        upgrade.price
    ) {

        alert(
            `❌ Je hebt €${upgrade.price} nodig.`
        );

        return;

    }


    game.money -=
        upgrade.price;


    game.upgrades.incubatorLevel =
        nextLevel;


    incubators.forEach(
        incubator => {

            incubator.capacity =
                upgrade.capacity;

            incubator.name =
                upgrade.name;

        }
    );


    saveGame();

    saveIncubators();

    updateUI();

    renderIncubators();

    renderUpgrades();


    alert(
        `⬆️ Incubator upgraded!\n\n` +
        `${upgrade.name}\n` +
        `Capaciteit: ${upgrade.capacity} eieren`
    );

}


// ============================================
// UPGRADE HABITAT
// ============================================

function upgradeHabitat() {

    const currentLevel =
        game.upgrades.habitatLevel;


    const nextLevel =
        currentLevel + 1;


    const upgrade =
        getUpgrade(
            "habitat",
            nextLevel
        );


    if (!upgrade) {

        alert(
            "🌟 Je habitat is al maximaal!"
        );

        return;

    }


    if (
        game.money <
        upgrade.price
    ) {

        alert(
            `❌ Je hebt €${upgrade.price} nodig.`
        );

        return;

    }


    game.money -=
        upgrade.price;


    game.upgrades.habitatLevel =
        nextLevel;


    saveGame();

    updateUI();

    renderUpgrades();


    alert(
        `🏠 Habitat upgraded!\n\n` +
        `${upgrade.name}\n` +
        `Capaciteit: ${upgrade.capacity} dieren`
    );

}


// ============================================
// BREEDING UPGRADE
// ============================================

function upgradeBreedingFacility() {

    const level =
        game.upgrades.breedingLevel;


    const prices = {

        2: 1000,

        3: 2500,

        4: 5000

    };


    const next =
        level + 1;


    if (!prices[next]) {

        alert(
            "🌟 Breeding facility is maximaal!"
        );

        return;

    }


    if (
        game.money <
        prices[next]
    ) {

        alert(
            `❌ Je hebt €${prices[next]} nodig.`
        );

        return;

    }


    game.money -=
        prices[next];


    game.upgrades.breedingLevel =
        next;


    saveGame();

    updateUI();

    renderUpgrades();


    alert(
        `🧬 Breeding Facility level ${next}!`
    );

}


// ============================================
// SHOP ITEM UPGRADES
// ============================================

const facilityItems = [

    {
        id: "heatmat",
        name: "🌡️ Extra Heatmat",
        price: 250,
        description:
            "Helpt om stabiele temperaturen te houden."
    },

    {
        id: "humidifier",
        name: "💧 Humidifier",
        price: 350,
        description:
            "Helpt bij het behouden van luchtvochtigheid."
    },

    {
        id: "thermometer",
        name: "🌡️ Digitale Thermometer",
        price: 150,
        description:
            "Nauwkeurigere temperatuurcontrole."
    },

    {
        id: "scale",
        name: "⚖️ Reptile Scale",
        price: 200,
        description:
            "Je kunt het gewicht van dieren volgen."
    }

];


// ============================================
// OWNED ITEMS
// ============================================

if (!game.facilityItems) {

    game.facilityItems = [];

}


// ============================================
// BUY FACILITY ITEM
// ============================================

function buyFacilityItem(id) {

    const item =
        facilityItems.find(
            facilityItem =>
                facilityItem.id === id
        );


    if (!item) {
        return;
    }


    if (
        game.facilityItems.includes(
            id
        )
    ) {

        alert(
            "Je hebt dit item al."
        );

        return;

    }


    if (
        game.money <
        item.price
    ) {

        alert(
            `❌ Je hebt €${item.price} nodig.`
        );

        return;

    }


    game.money -=
        item.price;


    game.facilityItems.push(
        id
    );


    saveGame();

    updateUI();

    renderUpgrades();


    alert(
        `✅ ${item.name} gekocht!`
    );

}


// ============================================
// RENDER UPGRADES
// ============================================

function renderUpgrades() {

    const container =
        document.getElementById(
            "upgradeList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    // ----------------------------------------
    // INCUBATOR
    // ----------------------------------------

    const incubatorLevel =
        game.upgrades.incubatorLevel;


    const nextIncubator =
        getUpgrade(
            "incubator",
            incubatorLevel + 1
        );


    const incubatorCard =
        document.createElement(
            "div"
        );


    incubatorCard.className =
        "card";


    incubatorCard.innerHTML = `

        <h2>
            🌡️ Incubator
        </h2>

        <p>
            Level:
            <b>
                ${incubatorLevel}
            </b>
        </p>

        <p>
            Capaciteit:
            ${
                getUpgrade(
                    "incubator",
                    incubatorLevel
                )?.capacity || 10
            }
            eieren
        </p>

        ${
            nextIncubator

            ?

            `
            <p>
                Volgende:
                ${nextIncubator.name}
            </p>

            <p>
                💰 €${nextIncubator.price}
            </p>

            <button
                onclick="
                    upgradeIncubator()
                "
            >
                ⬆️ Upgrade
            </button>
            `

            :

            `
            <p>
                🌟 MAX LEVEL
            </p>
            `
        }

    `;


    container.appendChild(
        incubatorCard
    );


    // ----------------------------------------
    // HABITAT
    // ----------------------------------------

    const habitatLevel =
        game.upgrades.habitatLevel;


    const nextHabitat =
        getUpgrade(
            "habitat",
            habitatLevel + 1
        );


    const habitatCard =
        document.createElement(
            "div"
        );


    habitatCard.className =
        "card";


    habitatCard.innerHTML = `

        <h2>
            🏠 Habitat
        </h2>

        <p>
            Level:
            <b>
                ${habitatLevel}
            </b>
        </p>

        <p>
            Capaciteit:
            ${
                getUpgrade(
                    "habitat",
                    habitatLevel
                )?.capacity || 20
            }
            dieren
        </p>

        ${
            nextHabitat

            ?

            `
            <p>
                Volgende:
                ${nextHabitat.name}
            </p>

            <p>
                💰 €${nextHabitat.price}
            </p>

            <button
                onclick="
                    upgradeHabitat()
                "
            >
                ⬆️ Upgrade
            </button>
            `

            :

            `
            <p>
                🌟 MAX LEVEL
            </p>
            `
        }

    `;


    container.appendChild(
        habitatCard
    );


    // ----------------------------------------
    // BREEDING
    // ----------------------------------------

    const breedingLevel =
        game.upgrades.breedingLevel;


    const breedingCard =
        document.createElement(
            "div"
        );


    breedingCard.className =
        "card";


    breedingCard.innerHTML = `

        <h2>
            🧬 Breeding Facility
        </h2>

        <p>
            Level:
            <b>
                ${breedingLevel}
            </b>
        </p>

        <p>
            Hogere levels geven
            betere breedingmogelijkheden.
        </p>


        ${
            breedingLevel < 4

            ?

            `
            <button
                onclick="
                    upgradeBreedingFacility()
                "
            >
                ⬆️ Upgrade
            </button>
            `

            :

            `
            <p>
                🌟 MAX LEVEL
            </p>
            `
        }

    `;


    container.appendChild(
        breedingCard
    );


    // ----------------------------------------
    // FACILITY ITEMS
    // ----------------------------------------

    facilityItems.forEach(
        item => {

            const owned =
                game.facilityItems.includes(
                    item.id
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "card";


            card.innerHTML = `

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ${item.description}
                </p>

                ${
                    owned

                    ?

                    `
                    <p>
                        ✅ In bezit
                    </p>
                    `

                    :

                    `
                    <p>
                        💰 €${item.price}
                    </p>

                    <button
                        onclick="
                            buyFacilityItem(
                                '${item.id}'
                            )
                        "
                    >
                        Kopen
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
// SHOP SEARCH
// ============================================

function searchShop(
    searchText
) {

    const text =
        searchText
            .toLowerCase()
            .trim();


    const cards =
        document.querySelectorAll(
            ".shop-card"
        );


    cards.forEach(
        card => {

            const content =
                card.textContent
                    .toLowerCase();


            if (
                content.includes(
                    text
                )
            ) {

                card.style.display =
                    "";

            }
            else {

                card.style.display =
                    "none";

            }

        }
    );

}


// ============================================
// SHOP FILTER
// ============================================

function filterShop(
    species
) {

    const cards =
        document.querySelectorAll(
            ".shop-card"
        );


    cards.forEach(
        card => {

            if (
                species ===
                "all"
            ) {

                card.style.display =
                    "";

                return;

            }


            const content =
                card.textContent
                    .toLowerCase();


            if (
                content.includes(
                    species.toLowerCase()
                )
            ) {

                card.style.display =
                    "";

            }
            else {

                card.style.display =
                    "none";

            }

        }
    );

}


// ============================================
// START PART 11
// ============================================

if (!game.upgrades) {

    game.upgrades = {

        incubatorLevel: 1,

        habitatLevel: 1,

        breedingLevel: 1

    };

}


if (!game.facilityItems) {

    game.facilityItems = [];

}


renderUpgrades();

updateUI();

saveGame();


console.log(
    "🏠 Part 11 - Shop & Upgrades loaded!"
);




// ============================================
// REPTILE BREEDING SIMULATION
// PART 12 - FINAL GAME SYSTEM
// ============================================


// ============================================
// GAME VERSION
// ============================================

const GAME_VERSION = "1.0.0";


// ============================================
// DEFAULT GAME DATA
// ============================================

function createDefaultGame() {

    return {

        day: 1,

        money: 1000,

        animals: [],

        eggs: [],

        sales: [],

        upgrades: {

            incubatorLevel: 1,

            habitatLevel: 1,

            breedingLevel: 1

        },

        facilityItems: [],

        statistics: {

            animalsBorn: 0,

            eggsLaid: 0,

            animalsSold: 0,

            moneyEarned: 0

        }

    };

}


// ============================================
// MAKE SURE GAME DATA EXISTS
// ============================================

function repairGameData() {

    if (!game) {

        game =
            createDefaultGame();

    }


    if (
        game.day === undefined
    ) {

        game.day = 1;

    }


    if (
        game.money === undefined
    ) {

        game.money = 1000;

    }


    if (
        !Array.isArray(
            game.animals
        )
    ) {

        game.animals = [];

    }


    if (
        !Array.isArray(
            game.eggs
        )
    ) {

        game.eggs = [];

    }


    if (
        !Array.isArray(
            game.sales
        )
    ) {

        game.sales = [];

    }


    if (
        !game.upgrades
    ) {

        game.upgrades = {

            incubatorLevel: 1,

            habitatLevel: 1,

            breedingLevel: 1

        };

    }


    if (
        !game.statistics
    ) {

        game.statistics = {

            animalsBorn: 0,

            eggsLaid: 0,

            animalsSold: 0,

            moneyEarned: 0

        };

    }


    if (
        !Array.isArray(
            game.facilityItems
        )
    ) {

        game.facilityItems = [];

    }

}


// ============================================
// SAVE GAME
// ============================================

function saveGameFinal() {

    repairGameData();


    const saveData = {

        version:
            GAME_VERSION,

        game:
            game,

        incubators:
            incubators

    };


    localStorage.setItem(

        "reptileBreederSave",

        JSON.stringify(
            saveData
        )

    );

}


// ============================================
// LOAD GAME
// ============================================

function loadGameFinal() {

    const saved =
        localStorage.getItem(
            "reptileBreederSave"
        );


    if (!saved) {

        repairGameData();

        return;

    }


    try {

        const data =
            JSON.parse(
                saved
            );


        if (
            data.game
        ) {

            game =
                data.game;

        }


        if (
            data.incubators
        ) {

            incubators =
                data.incubators;

        }


        repairGameData();


        console.log(
            "💾 Save loaded!"
        );

    }
    catch (error) {

        console.error(
            "Save could not be loaded:",
            error
        );

        repairGameData();

    }

}


// ============================================
// RESET GAME
// ============================================

function resetGame() {

    const confirmed =
        confirm(
            "⚠️ Weet je zeker dat je helemaal opnieuw wilt beginnen?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        "reptileBreederSave"
    );


    game =
        createDefaultGame();


    incubators = [

        {

            id: 1,

            name:
                "Basic Incubator",

            capacity:
                10,

            temperature:
                29,

            humidity:
                60,

            eggs: []

        }

    ];


    selectedMale = null;

    selectedFemale = null;


    saveGameFinal();


    location.reload();

}


// ============================================
// NEXT DAY
// ============================================

function nextGameDay() {

    repairGameData();


    game.day++;


    // ----------------------------
    // ANIMAL AGE
    // ----------------------------

    game.animals.forEach(
        animal => {

            if (
                animal.birthDay ===
                undefined
            ) {

                animal.birthDay =
                    game.day;

            }


            animal.ageDays =
                Math.max(
                    0,
                    game.day -
                    animal.birthDay
                );


            animal.ageMonths =
                Math.floor(
                    animal.ageDays /
                    28
                );


            if (
                typeof getAdultAge ===
                "function"
            ) {

                animal.adultAgeMonths =
                    getAdultAge(
                        animal.species
                    );

            }


            if (
                animal.adultAgeMonths !==
                undefined
            ) {

                animal.isAdult =
                    animal.ageMonths >=
                    animal.adultAgeMonths;

            }

        }
    );


    // ----------------------------
    // CARE
    // ----------------------------

    if (
        typeof updateAnimalCare ===
        "function"
    ) {

        updateAnimalCare();

    }


    // ----------------------------
    // INCUBATOR
    // ----------------------------

    if (
        typeof updateIncubators ===
        "function"
    ) {

        updateIncubators();

    }


    // ----------------------------
    // EGGS
    // ----------------------------

    if (
        typeof updateEggs ===
        "function"
    ) {

        updateEggs();

    }


    // ----------------------------
    // BREEDING COOLDOWNS
    // ----------------------------

    game.animals.forEach(
        animal => {

            if (
                animal.breedingCooldown >
                0
            ) {

                animal.breedingCooldown--;

            }

        }
    );


    // ----------------------------
    // MARKET
    // ----------------------------

    if (
        typeof marketEvent ===
        "function"
    ) {

        marketEvent();

    }


    // ----------------------------
    // STATISTICS
    // ----------------------------

    if (
        !game.statistics
    ) {

        game.statistics = {

            animalsBorn: 0,

            eggsLaid: 0,

            animalsSold: 0,

            moneyEarned: 0

        };

    }


    saveGameFinal();


    updateFinalUI();


    renderIncubators();

    renderMarket();

    renderUpgrades();


    alert(
        `📅 DAG ${game.day}\n\n` +
        `Je reptielen zijn 1 dag ouder!`
    );

}


// ============================================
// FINAL DASHBOARD
// ============================================

function updateFinalUI() {

    repairGameData();


    const dayElement =
        document.getElementById(
            "gameDay"
        );


    const moneyElement =
        document.getElementById(
            "gameMoney"
        );


    const animalElement =
        document.getElementById(
            "animalCount"
        );


    const eggElement =
        document.getElementById(
            "eggCount"
        );


    const valueElement =
        document.getElementById(
            "collectionValue"
        );


    if (dayElement) {

        dayElement.textContent =
            `Dag ${game.day}`;

    }


    if (moneyElement) {

        moneyElement.textContent =
            `€${game.money}`;

    }


    if (animalElement) {

        animalElement.textContent =
            game.animals.length;

    }


    if (eggElement) {

        eggElement.textContent =
            game.eggs.length;

    }


    if (valueElement) {

        if (
            typeof getCollectionValue ===
            "function"
        ) {

            valueElement.textContent =
                `€${getCollectionValue()}`;

        }

    }

}


// ============================================
// FINAL ANIMAL RENDERER
// ============================================

function renderFinalAnimals() {

    const container =
        document.getElementById(
            "animalList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    game.animals.forEach(
        animal => {

            if (
                typeof initializeAnimalCare ===
                "function"
            ) {

                initializeAnimalCare(
                    animal
                );

            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "animal-card";


            const price =
                typeof getMarketPrice ===
                "function"

                    ? getMarketPrice(
                        animal
                    )

                    : 0;


            card.innerHTML = `

                <div
                    class="animal-icon"
                >
                    ${
                        typeof getAnimalIcon ===
                        "function"

                        ?

                        getAnimalIcon(
                            animal.species
                        )

                        :

                        "🦎"
                    }
                </div>


                <h3>
                    ${animal.name}
                </h3>


                <p>
                    ${animal.species}
                </p>


                <p>
                    🧬
                    ${animal.morph || "Normal"}
                </p>


                <p>
                    ${
                        animal.isAdult
                            ? "🟢 Adult"
                            : "🐣 Baby"
                    }
                </p>


                <p>
                    📅
                    ${animal.ageMonths || 0}
                    maanden
                </p>


                <p>
                    ❤️
                    ${animal.health || "Healthy"}
                </p>


                <p>
                    🍽️
                    ${animal.foodLevel || 0}%
                </p>


                <p>
                    💧
                    ${animal.waterLevel || 0}%
                </p>


                <div
                    class="animal-buttons"
                >

                    <button
                        onclick="
                            openCarePanel(
                                ${animal.id}
                            )
                        "
                    >
                        ❤️ Verzorgen
                    </button>


                    <button
                        onclick="
                            feedAnimal(
                                ${animal.id}
                            )
                        "
                    >
                        🍽️ Voeren
                    </button>


                    <button
                        onclick="
                            giveAnimalWater(
                                ${animal.id}
                            )
                        "
                    >
                        💧 Water
                    </button>


                    <button
                        onclick="
                            sellAnimal(
                                ${animal.id}
                            )
                        "
                    >
                        💰 €${price}
                    </button>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// ============================================
// FINAL EGG RENDERER
// ============================================

function renderFinalEggs() {

    const container =
        document.getElementById(
            "eggList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        game.eggs.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                🥚 Geen eieren

            </div>

        `;

        return;

    }


    game.eggs.forEach(
        (egg, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "egg-card";


            const daysLeft =
                Math.max(
                    0,
                    (
                        egg.hatchDay ||
                        game.day
                    ) -
                    game.day
                );


            card.innerHTML = `

                <h3>
                    🥚 ${egg.species}
                </h3>


                <p>
                    Status:
                    ${
                        egg.fertile
                            ? "🟢 Fertile"
                            : "🔴 Infertile"
                    }
                </p>


                <p>
                    Hatch over:
                    ${daysLeft}
                    dagen
                </p>


                <button
                    onclick="
                        addEggToIncubator(
                            ${index},
                            1
                        )
                    "
                >
                    🌡️ In incubator
                </button>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// ============================================
// FINAL STATISTICS
// ============================================

function renderStatistics() {

    const container =
        document.getElementById(
            "statistics"
        );


    if (!container) {
        return;
    }


    const stats =
        game.statistics;


    container.innerHTML = `

        <h2>
            📊 Statistics
        </h2>


        <p>
            📅 Dagen gespeeld:
            ${game.day}
        </p>


        <p>
            🐣 Dieren geboren:
            ${stats.animalsBorn}
        </p>


        <p>
            🥚 Eieren gelegd:
            ${stats.eggsLaid}
        </p>


        <p>
            💰 Dieren verkocht:
            ${stats.animalsSold}
        </p>


        <p>
            💵 Geld verdiend:
            €${stats.moneyEarned}
        </p>


        <p>
            🦎 Dieren in collectie:
            ${game.animals.length}
        </p>


    `;

}


// ============================================
// OPEN GAME TAB
// ============================================

function openGameTab(
    tab
) {

    const sections =
        document.querySelectorAll(
            ".game-section"
        );


    sections.forEach(
        section => {

            section.style.display =
                "none";

        }
    );


    const target =
        document.getElementById(
            tab
        );


    if (target) {

        target.style.display =
            "block";

    }


    // Update everything

    updateFinalUI();

    renderFinalAnimals();

    renderFinalEggs();

    renderIncubators();

    renderMarket();

    renderUpgrades();

    renderStatistics();

}


// ============================================
// CLOSE MODALS
// ============================================

function closeModal(
    id
) {

    const modal =
        document.getElementById(
            id
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

}


// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener(
    "keydown",
    event => {

        // N = next day

        if (
            event.key
                .toLowerCase() ===
            "n"
        ) {

            nextGameDay();

        }


        // Escape = close modal

        if (
            event.key ===
            "Escape"
        ) {

            document
                .querySelectorAll(
                    ".modal"
                )
                .forEach(
                    modal => {

                        modal.classList.add(
                            "hidden"
                        );

                    }
                );

        }

    }
);


// ============================================
// AUTO SAVE
// ============================================

setInterval(
    () => {

        saveGameFinal();

    },
    10000
);


// ============================================
// INITIALIZE FINAL GAME
// ============================================

loadGameFinal();

repairGameData();


game.animals.forEach(
    animal => {

        if (
            typeof initializeAnimalCare ===
            "function"
        ) {

            initializeAnimalCare(
                animal
            );

        }

    }
);


updateFinalUI();

renderFinalAnimals();

renderFinalEggs();

renderIncubators();

renderMarket();

renderUpgrades();

renderStatistics();


console.log(
    "🐍 REPTILE BREEDING SIMULATION 1.0 LOADED!"
);

console.log(
    "📅 Current day:",
    game.day
);

console.log(
    "💰 Money:",
    game.money
);

console.log(
    "🦎 Animals:",
    game.animals.length
);

console.log(
    "🥚 Eggs:",
    game.eggs.length
);


// ============================================
// REPTILE BREEDING SIMULATION
// PART 13 - MORE MORPHS
// ============================================


// ============================================
// EXTRA BALL PYTHON MORPHS
// ============================================

Object.assign(
    geneticTypes["Ball Python"],
    {

        Spider: {
            type: "dominant",
            gene: "spider",
            normal: "S",
            mutated: "s"
        },

        Enchi: {
            type: "dominant",
            gene: "enchi",
            normal: "E",
            mutated: "e"
        },

        Mojave: {
            type: "dominant",
            gene: "mojave",
            normal: "M",
            mutated: "m"
        },

        Lesser: {
            type: "dominant",
            gene: "lesser",
            normal: "L",
            mutated: "l"
        },

        Banana: {
            type: "dominant",
            gene: "banana",
            normal: "B",
            mutated: "b"
        },

        Pinstripe: {
            type: "dominant",
            gene: "pinstripe",
            normal: "I",
            mutated: "i"
        },

        Cinnamon: {
            type: "dominant",
            gene: "cinnamon",
            normal: "N",
            mutated: "n"
        },

        "Orange Dream": {
            type: "dominant",
            gene: "orangeDream",
            normal: "O",
            mutated: "o"
        },

        GHI: {
            type: "dominant",
            gene: "ghi",
            normal: "G",
            mutated: "g"
        },

        Axanthic: {
            type: "recessive",
            gene: "axanthic",
            normal: "X",
            mutated: "x"
        },

        "Genetic Stripe": {
            type: "recessive",
            gene: "geneticStripe",
            normal: "Y",
            mutated: "y"
        }

    }
);


// ============================================
// EXTRA LEOPARD GECKO MORPHS
// ============================================

Object.assign(
    geneticTypes["Leopard Gecko"],
    {

        "Mack Snow": {
            type: "dominant",
            gene: "mackSnow",
            normal: "M",
            mutated: "m"
        },

        "Super Snow": {
            type: "dominant",
            gene: "superSnow",
            normal: "S",
            mutated: "s"
        },

        Tangerine: {
            type: "dominant",
            gene: "tangerine",
            normal: "T",
            mutated: "t"
        },

        Blizzard: {
            type: "recessive",
            gene: "blizzard",
            normal: "B",
            mutated: "b"
        },

        Patternless: {
            type: "recessive",
            gene: "patternless",
            normal: "P",
            mutated: "p"
        },

        Eclipse: {
            type: "recessive",
            gene: "eclipse",
            normal: "E",
            mutated: "e"
        },

        Enigma: {
            type: "dominant",
            gene: "enigma",
            normal: "N",
            mutated: "n"
        },

        "Rainwater Albino": {
            type: "recessive",
            gene: "rainwater",
            normal: "R",
            mutated: "r"
        },

        "Bell Albino": {
            type: "recessive",
            gene: "bellAlbino",
            normal: "A",
            mutated: "a"
        },

        "Tremper Albino": {
            type: "recessive",
            gene: "tremperAlbino",
            normal: "T",
            mutated: "t"
        },

        RAPTOR: {
            type: "recessive",
            gene: "raptor",
            normal: "Q",
            mutated: "q"
        }

    }
);


// ============================================
// EXTRA CORN SNAKE MORPHS
// ============================================

Object.assign(
    geneticTypes["Corn Snake"],
    {

        Snow: {
            type: "recessive",
            gene: "snow",
            normal: "S",
            mutated: "s"
        },

        Hypo: {
            type: "recessive",
            gene: "hypo",
            normal: "H",
            mutated: "h"
        },

        Stripe: {
            type: "recessive",
            gene: "stripe",
            normal: "T",
            mutated: "t"
        },

        Lavender: {
            type: "recessive",
            gene: "lavender",
            normal: "L",
            mutated: "l"
        },

        Caramel: {
            type: "recessive",
            gene: "caramel",
            normal: "C",
            mutated: "c"
        },

        Bloodred: {
            type: "recessive",
            gene: "bloodred",
            normal: "B",
            mutated: "b"
        },

        Tessera: {
            type: "dominant",
            gene: "tessera",
            normal: "E",
            mutated: "e"
        },

        Motley: {
            type: "recessive",
            gene: "motley",
            normal: "M",
            mutated: "m"
        }

    }
);


// ============================================
// ADD MORE SPECIES
// ============================================

geneticTypes["Bearded Dragon"] = {

    Hypo: {
        type: "recessive",
        gene: "hypo",
        normal: "H",
        mutated: "h"
    },

    Translucent: {
        type: "recessive",
        gene: "trans",
        normal: "T",
        mutated: "t"
    },

    Leatherback: {
        type: "dominant",
        gene: "leatherback",
        normal: "L",
        mutated: "l"
    },

    Dunner: {
        type: "dominant",
        gene: "dunner",
        normal: "D",
        mutated: "d"
    },

    Witblits: {
        type: "recessive",
        gene: "witblits",
        normal: "W",
        mutated: "w"
    }

};


geneticTypes["Crested Gecko"] = {

    Dalmatian: {
        type: "dominant",
        gene: "dalmatian",
        normal: "D",
        mutated: "d"
    },

    Pinstripe: {
        type: "dominant",
        gene: "pinstripe",
        normal: "P",
        mutated: "p"
    },

    Harlequin: {
        type: "dominant",
        gene: "harlequin",
        normal: "H",
        mutated: "h"
    },

    LillyWhite: {
        type: "dominant",
        gene: "lillyWhite",
        normal: "L",
        mutated: "l"
    },

    Phantom: {
        type: "recessive",
        gene: "phantom",
        normal: "F",
        mutated: "f"
    }

};


// ============================================
// ADD MARKET PRICES
// ============================================

Object.assign(
    marketSettings["Ball Python"],
    {

        Spider: 250,
        Enchi: 280,
        Mojave: 300,
        Lesser: 350,
        Banana: 400,
        Pinstripe: 300,
        Cinnamon: 280,
        "Orange Dream": 450,
        GHI: 500,
        Axanthic: 600,
        "Genetic Stripe": 700

    }
);


Object.assign(
    marketSettings["Leopard Gecko"],
    {

        "Mack Snow": 180,
        "Super Snow": 350,
        Tangerine: 300,
        Blizzard: 250,
        Patternless: 250,
        Enigma: 300,
        "Rainwater Albino": 350,
        "Bell Albino": 350,
        "Tremper Albino": 300,
        RAPTOR: 500

    }
);


Object.assign(
    marketSettings["Corn Snake"],
    {

        Snow: 250,
        Hypo: 180,
        Stripe: 200,
        Lavender: 300,
        Caramel: 220,
        Bloodred: 350,
        Tessera: 300

    }
);


Object.assign(
    marketSettings["Bearded Dragon"],
    {

        Hypo: 250,
        Translucent: 300,
        Leatherback: 350,
        Dunner: 300,
        Witblits: 400

    }
);


Object.assign(
    marketSettings["Crested Gecko"],
    {

        Dalmatian: 250,
        Pinstripe: 300,
        Harlequin: 350,
        LillyWhite: 600,
        Phantom: 450

    }
);


// ============================================
// MORPH DATABASE
// ============================================

function getAvailableMorphs(species) {

    if (
        !geneticTypes[species]
    ) {

        return [];

    }


    return Object.keys(
        geneticTypes[species]
    );

}


// ============================================
// SHOW ALL MORPHS
// ============================================

function showAvailableMorphs(
    species
) {

    const morphs =
        getAvailableMorphs(
            species
        );


    if (
        morphs.length === 0
    ) {

        alert(
            "Geen morphs gevonden."
        );

        return;

    }


    let text =
        `🧬 ${species} MORPHS\n\n`;


    morphs.forEach(
        morph => {

            const data =
                geneticTypes[
                    species
                ][morph];


            const type =
                data.type ===
                "recessive"

                    ? "🔒 Recessive"

                    : "🧬 Dominant";


            const price =
                marketSettings[
                    species
                ]?.[morph] || 50;


            text +=
                `• ${morph} — ${type} — €${price}\n`;

        }
    );


    alert(text);

}


// ============================================
// MORPH INFORMATION
// ============================================

function showMorphInfo(
    species,
    morph
) {

    const data =
        geneticTypes[
            species
        ]?.[morph];


    if (!data) {

        alert(
            "Morph niet gevonden."
        );

        return;

    }


    const price =
        marketSettings[
            species
        ]?.[morph] || 50;


    let text =

        `🧬 ${morph}\n\n` +

        `Species: ${species}\n` +

        `Type: ${data.type}\n` +

        `Gene: ${data.gene}\n` +

        `Marktprijs: €${price}\n`;


    if (
        data.type ===
        "recessive"
    ) {

        text +=
            "\n🔒 Deze morph is recessive.\n" +
            "Een dier kan het gen verborgen dragen als Het.";

    }
    else {

        text +=
            "\n🧬 Deze morph is dominant.";

    }


    alert(text);

}


// ============================================
// RANDOM MORPH
// ============================================

function getRandomMorph(
    species
) {

    const morphs =
        getAvailableMorphs(
            species
        );


    if (
        morphs.length === 0
    ) {

        return "Normal";

    }


    return morphs[
        Math.floor(
            Math.random() *
            morphs.length
        )
    ];

}


// ============================================
// MORPH COUNT
// ============================================

function getMorphCount() {

    let count = 0;


    Object.keys(
        geneticTypes
    ).forEach(
        species => {

            count +=
                Object.keys(
                    geneticTypes[
                        species
                    ]
                ).length;

        }
    );


    return count;

}


// ============================================
// GENETIC SUMMARY
// ============================================

function getGeneticSummary(
    animal
) {

    if (!animal) {
        return "";
    }


    if (
        !animal.genes
    ) {

        return "Geen genetische gegevens.";

    }


    const hidden =
        getHiddenGenes(
            animal
        );


    if (
        hidden.length === 0
    ) {

        return "Geen bekende Het-genen.";

    }


    return (
        "Het: " +
        hidden.join(
            ", "
        )
    );

}


// ============================================
// INITIALIZE NEW MORPHS
// ============================================

function initializeMorphGenetics() {

    game.animals.forEach(
        animal => {

            if (
                typeof upgradeAnimalGenetics ===
                "function"
            ) {

                upgradeAnimalGenetics(
                    animal
                );

            }

        }
    );

}


// ============================================
// MORPH STATISTICS
// ============================================

function getMorphStatistics() {

    const stats = {};


    game.animals.forEach(
        animal => {

            const morph =
                animal.morph ||
                "Normal";


            if (
                !stats[morph]
            ) {

                stats[morph] = 0;

            }


            stats[morph]++;

        }
    );


    return stats;

}


// ============================================
// SHOW MORPH COLLECTION
// ============================================

function showMorphCollection() {

    const stats =
        getMorphStatistics();


    let text =
        "📚 MORPH COLLECTION\n\n";


    Object.keys(
        stats
    ).forEach(
        morph => {

            text +=
                `• ${morph}: ${stats[morph]}\n`;

        }
    );


    text +=
        `\n🧬 Beschikbare morphs: ${getMorphCount()}`;


    alert(text);

}


// ============================================
// START PART 13
// ============================================

initializeMorphGenetics();


console.log(
    "🧬 Part 13 - Extra morphs loaded!"
);


console.log(
    "Total morphs:",
    getMorphCount()
);




// ============================================
// REPTILE BREEDING SIMULATION
// PART 14 - NEW SPECIES
// ============================================


// ============================================
// NEW SPECIES - GENETICS
// ============================================

// 🐍 GREEN ANACONDA

geneticTypes["Green Anaconda"] = {

    Normal: {
        type: "normal",
        gene: "normal",
        normal: "A",
        mutated: "A"
    },

    Albino: {
        type: "recessive",
        gene: "albino",
        normal: "A",
        mutated: "a"
    },

    Anery: {
        type: "recessive",
        gene: "anery",
        normal: "N",
        mutated: "n"
    }

};


// 🐍 RETICULATED PYTHON

geneticTypes["Reticulated Python"] = {

    Normal: {
        type: "normal",
        gene: "normal",
        normal: "A",
        mutated: "A"
    },

    Albino: {
        type: "recessive",
        gene: "albino",
        normal: "A",
        mutated: "a"
    },

    Golden Child: {
        type: "dominant",
        gene: "goldenChild",
        normal: "G",
        mutated: "g"
    },

    Platinum: {
        type: "dominant",
        gene: "platinum",
        normal: "P",
        mutated: "p"
    }

};


// 🦎 GARGOYLE GECKO

geneticTypes["Gargoyle Gecko"] = {

    Normal: {
        type: "normal",
        gene: "normal",
        normal: "A",
        mutated: "A"
    },

    Stripe: {
        type: "dominant",
        gene: "stripe",
        normal: "S",
        mutated: "s"
    },

    Reticulated: {
        type: "dominant",
        gene: "reticulated",
        normal: "R",
        mutated: "r"
    },

    Orange: {
        type: "dominant",
        gene: "orange",
        normal: "O",
        mutated: "o"
    }

};


// 🦎 AFRICAN FAT-TAILED GECKO

geneticTypes["African Fat-Tailed Gecko"] = {

    Normal: {
        type: "normal",
        gene: "normal",
        normal: "A",
        mutated: "A"
    },

    Albino: {
        type: "recessive",
        gene: "albino",
        normal: "A",
        mutated: "a"
    },

    Patternless: {
        type: "recessive",
        gene: "patternless",
        normal: "P",
        mutated: "p"
    },

    Whiteout: {
        type: "dominant",
        gene: "whiteout",
        normal: "W",
        mutated: "w"
    }

};


// 🐢 RED-EARED SLIDER

geneticTypes["Red-Eared Slider"] = {

    Normal: {
        type: "normal",
        gene: "normal",
        normal: "A",
        mutated: "A"
    },

    Albino: {
        type: "recessive",
        gene: "albino",
        normal: "A",
        mutated: "a"
    },

    Hypo: {
        type: "recessive",
        gene: "hypo",
        normal: "H",
        mutated: "h"
    }

};


// 🦎 PANTHER CHAMELEON

geneticTypes["Panther Chameleon"] = {

    Normal: {
        type: "normal",
        gene: "normal",
        normal: "A",
        mutated: "A"
    },

    Blue: {
        type: "dominant",
        gene: "blue",
        normal: "B",
        mutated: "b"
    },

    Red: {
        type: "dominant",
        gene: "red",
        normal: "R",
        mutated: "r"
    },

    High Red: {
        type: "dominant",
        gene: "highRed",
        normal: "H",
        mutated: "h"
    }

};


// 🦎 VEILED CHAMELEON

geneticTypes["Veiled Chameleon"] = {

    Normal: {
        type: "normal",
        gene: "normal",
        normal: "A",
        mutated: "A"
    },

    Blue: {
        type: "dominant",
        gene: "blue",
        normal: "B",
        mutated: "b"
    },

    Turquoise: {
        type: "dominant",
        gene: "turquoise",
        normal: "T",
        mutated: "t"
    },

    Yellow: {
        type: "dominant",
        gene: "yellow",
        normal: "Y",
        mutated: "y"
    }

};


// 🦎 JACKSON'S CHAMELEON

geneticTypes["Jackson's Chameleon"] = {

    Normal: {
        type: "normal",
        gene: "normal",
        normal: "A",
        mutated: "A"
    },

    High Green: {
        type: "dominant",
        gene: "highGreen",
        normal: "G",
        mutated: "g"
    },

    Blue: {
        type: "dominant",
        gene: "blue",
        normal: "B",
        mutated: "b"
    }

};


// ============================================
// MARKET PRICES
// ============================================

marketSettings["Green Anaconda"] = {

    Normal: 800,
    Albino: 1800,
    Anery: 1500

};


marketSettings["Reticulated Python"] = {

    Normal: 700,
    Albino: 1600,
    "Golden Child": 1200,
    Platinum: 1400

};


marketSettings["Gargoyle Gecko"] = {

    Normal: 180,
    Stripe: 300,
    Reticulated: 280,
    Orange: 350

};


marketSettings["African Fat-Tailed Gecko"] = {

    Normal: 150,
    Albino: 250,
    Patternless: 280,
    Whiteout: 350

};


marketSettings["Red-Eared Slider"] = {

    Normal: 80,
    Albino: 250,
    Hypo: 180

};


marketSettings["Panther Chameleon"] = {

    Normal: 300,
    Blue: 500,
    Red: 600,
    "High Red": 750

};


marketSettings["Veiled Chameleon"] = {

    Normal: 100,
    Blue: 180,
    Turquoise: 220,
    Yellow: 200

};


marketSettings["Jackson's Chameleon"] = {

    Normal: 180,
    "High Green": 300,
    Blue: 350

};


// ============================================
// INCUBATION SETTINGS
// ============================================

incubationSettings["Green Anaconda"] = {

    temperatureMin: 27,
    temperatureMax: 30,

    humidityMin: 70,
    humidityMax: 90

};


incubationSettings["Reticulated Python"] = {

    temperatureMin: 28,
    temperatureMax: 31,

    humidityMin: 70,
    humidityMax: 90

};


incubationSettings["Gargoyle Gecko"] = {

    temperatureMin: 22,
    temperatureMax: 27,

    humidityMin: 65,
    humidityMax: 80

};


incubationSettings["African Fat-Tailed Gecko"] = {

    temperatureMin: 25,
    temperatureMax: 29,

    humidityMin: 60,
    humidityMax: 80

};


incubationSettings["Red-Eared Slider"] = {

    temperatureMin: 26,
    temperatureMax: 30,

    humidityMin: 70,
    humidityMax: 85

};


incubationSettings["Panther Chameleon"] = {

    temperatureMin: 24,
    temperatureMax: 29,

    humidityMin: 60,
    humidityMax: 80

};


incubationSettings["Veiled Chameleon"] = {

    temperatureMin: 24,
    temperatureMax: 30,

    humidityMin: 50,
    humidityMax: 75

};


incubationSettings["Jackson's Chameleon"] = {

    temperatureMin: 20,
    temperatureMax: 26,

    humidityMin: 60,
    humidityMax: 80

};


// ============================================
// CARE SETTINGS
// ============================================

careSettings["Green Anaconda"] = {

    foodEveryDays: 10,
    waterEveryDays: 1

};


careSettings["Reticulated Python"] = {

    foodEveryDays: 10,
    waterEveryDays: 1

};


careSettings["Gargoyle Gecko"] = {

    foodEveryDays: 2,
    waterEveryDays: 1

};


careSettings["African Fat-Tailed Gecko"] = {

    foodEveryDays: 3,
    waterEveryDays: 1

};


careSettings["Red-Eared Slider"] = {

    foodEveryDays: 2,
    waterEveryDays: 1

};


careSettings["Panther Chameleon"] = {

    foodEveryDays: 1,
    waterEveryDays: 1

};


careSettings["Veiled Chameleon"] = {

    foodEveryDays: 1,
    waterEveryDays: 1

};


careSettings["Jackson's Chameleon"] = {

    foodEveryDays: 1,
    waterEveryDays: 1

};


// ============================================
// ADULT AGES
// ============================================

const extraAdultAges = {

    "Green Anaconda": 36,

    "Reticulated Python": 36,

    "Gargoyle Gecko": 18,

    "African Fat-Tailed Gecko": 18,

    "Red-Eared Slider": 48,

    "Panther Chameleon": 12,

    "Veiled Chameleon": 12,

    "Jackson's Chameleon": 12

};


const originalGetAdultAge =
    typeof getAdultAge ===
    "function"
        ? getAdultAge
        : null;


function getAdultAgeWithNewSpecies(
    species
) {

    if (
        extraAdultAges[species]
    ) {

        return extraAdultAges[
            species
        ];

    }


    if (originalGetAdultAge) {

        return originalGetAdultAge(
            species
        );

    }


    return 12;

}


// ============================================
// ANIMAL ICONS
// ============================================

const extraAnimalIcons = {

    "Green Anaconda": "🐍",

    "Reticulated Python": "🐍",

    "Gargoyle Gecko": "🦎",

    "African Fat-Tailed Gecko": "🦎",

    "Red-Eared Slider": "🐢",

    "Panther Chameleon": "🦎",

    "Veiled Chameleon": "🦎",

    "Jackson's Chameleon": "🦎"

};


const oldGetAnimalIcon =
    typeof getAnimalIcon ===
    "function"
        ? getAnimalIcon
        : null;


function getAnimalIconWithNewSpecies(
    species
) {

    if (
        extraAnimalIcons[species]
    ) {

        return extraAnimalIcons[
            species
        ];

    }


    if (oldGetAnimalIcon) {

        return oldGetAnimalIcon(
            species
        );

    }


    return "🦎";

}


// ============================================
// SPECIES LIST
// ============================================

const allGameSpecies = [

    "Ball Python",

    "Leopard Gecko",

    "Corn Snake",

    "Bearded Dragon",

    "Crested Gecko",

    "Green Anaconda",

    "Reticulated Python",

    "Gargoyle Gecko",

    "African Fat-Tailed Gecko",

    "Red-Eared Slider",

    "Panther Chameleon",

    "Veiled Chameleon",

    "Jackson's Chameleon"

];


// ============================================
// SHOW SPECIES
// ============================================

function showAllSpecies() {

    let text =
        "🦎 REPTILE COLLECTION\n\n";


    allGameSpecies.forEach(
        (species, index) => {

            const morphCount =
                geneticTypes[
                    species
                ]
                    ? Object.keys(
                        geneticTypes[
                            species
                        ]
                    ).length
                    : 0;


            text +=
                `${index + 1}. ${species} — ${morphCount} morphs\n`;

        }
    );


    text +=
        `\nTotaal: ${allGameSpecies.length} soorten`;


    alert(text);

}


// ============================================
// START PART 14
// ============================================

console.log(
    "🐍 Part 14 - New species loaded!"
);

console.log(
    "Species:",
    allGameSpecies.length
);

console.log(
    "New species added:",
    8
);







// ============================================
// REPTILE BREEDING SIMULATION
// PART 15 - MONTHLY TIME & INCUBATION
// ============================================


// ============================================
// TIME SETTINGS
// ============================================

const DAYS_PER_MONTH = 28;


// ============================================
// INCUBATION RANGES
// Minimum en maximum maanden per soort
// ============================================

const incubationMonths = {

    "Ball Python": {
        min: 1,
        max: 2
    },

    "Leopard Gecko": {
        min: 1,
        max: 2
    },

    "Corn Snake": {
        min: 1,
        max: 2
    },

    "Bearded Dragon": {
        min: 1,
        max: 2
    },

    "Crested Gecko": {
        min: 1,
        max: 3
    },

    "Green Anaconda": {
        min: 2,
        max: 4
    },

    "Reticulated Python": {
        min: 2,
        max: 4
    },

    "Gargoyle Gecko": {
        min: 1,
        max: 3
    },

    "African Fat-Tailed Gecko": {
        min: 1,
        max: 2
    },

    "Red-Eared Slider": {
        min: 2,
        max: 4
    },

    "Panther Chameleon": {
        min: 1,
        max: 3
    },

    "Veiled Chameleon": {
        min: 1,
        max: 3
    },

    "Jackson's Chameleon": {
        min: 2,
        max: 4
    }

};


// ============================================
// RANDOM INCUBATION TIME
// ============================================

function getIncubationMonths(species) {

    const settings =
        incubationMonths[species];


    if (!settings) {

        return 1;

    }


    const range =
        settings.max -
        settings.min +
        1;


    return (
        Math.floor(
            Math.random() * range
        ) +
        settings.min
    );

}


// ============================================
// GET INCUBATION INFO
// ============================================

function getIncubationInfo(species) {

    const settings =
        incubationMonths[species];


    if (!settings) {

        return {
            min: 1,
            max: 1
        };

    }


    return settings;

}


// ============================================
// CREATE EGG
// ============================================

function createMonthlyEgg(
    species,
    parents = []
) {

    const incubationTime =
        getIncubationMonths(
            species
        );


    const egg = {

        id:
            Date.now() +
            Math.floor(
                Math.random() * 10000
            ),

        species:
            species,

        parents:
            parents,

        laidMonth:
            game.month || 1,

        hatchMonth:
            (
                game.month || 1
            ) +
            incubationTime,

        incubationMonths:
            incubationTime,

        monthsRemaining:
            incubationTime,

        fertile:
            true,

        status:
            "Waiting"

    };


    game.eggs.push(
        egg
    );


    if (
        game.statistics
    ) {

        game.statistics.eggsLaid++;

    }


    saveGameFinal();


    return egg;

}


// ============================================
// MONTH DISPLAY
// ============================================

function getMonthDisplay() {

    const month =
        game.month || 1;


    return `Maand ${month}`;

}


// ============================================
// NEXT MONTH
// ============================================

function nextMonth() {

    repairGameData();


    // ----------------------------------------
    // MONTH
    // ----------------------------------------

    if (
        !game.month
    ) {

        game.month = 1;

    }


    game.month++;


    // ----------------------------------------
    // DAY
    // ----------------------------------------

    game.day =
        (
            game.month - 1
        ) *
        DAYS_PER_MONTH +
        1;


    // ----------------------------------------
    // AGE ANIMALS
    // ----------------------------------------

    game.animals.forEach(
        animal => {

            if (
                animal.ageMonths ===
                undefined
            ) {

                animal.ageMonths = 0;

            }


            animal.ageMonths++;


            animal.ageDays =
                animal.ageMonths *
                DAYS_PER_MONTH;


            // Adult check

            const adultAge =
                getAdultAgeWithNewSpecies(
                    animal.species
                );


            animal.isAdult =
                animal.ageMonths >=
                adultAge;

        }
    );


    // ----------------------------------------
    // EGGS
    // ----------------------------------------

    processMonthlyEggs();


    // ----------------------------------------
    // BREEDING COOLDOWN
    // ----------------------------------------

    game.animals.forEach(
        animal => {

            if (
                animal.breedingCooldown
                &&
                animal.breedingCooldown > 0
            ) {

                animal.breedingCooldown--;

            }

        }
    );


    // ----------------------------------------
    // CARE
    // ----------------------------------------

    if (
        typeof updateAnimalCare ===
        "function"
    ) {

        updateAnimalCare();

    }


    // ----------------------------------------
    // INCUBATORS
    // ----------------------------------------

    if (
        typeof updateIncubators ===
        "function"
    ) {

        updateIncubators();

    }


    // ----------------------------------------
    // MARKET
    // ----------------------------------------

    if (
        typeof marketEvent ===
        "function"
    ) {

        marketEvent();

    }


    // ----------------------------------------
    // SAVE
    // ----------------------------------------

    saveGameFinal();


    // ----------------------------------------
    // UI
    // ----------------------------------------

    updateFinalUI();

    renderFinalAnimals();

    renderFinalEggs();

    renderIncubators();

    renderMarket();

    renderUpgrades();

    renderStatistics();


    updateMonthlyDisplay();


    alert(
        `📅 MAAND ${game.month}\n\n` +
        `Alle dieren zijn 1 maand ouder geworden!`
    );

}


// ============================================
// PROCESS EGGS
// ============================================

function processMonthlyEggs() {

    const hatchedEggs = [];


    game.eggs.forEach(
        egg => {

            if (
                egg.status ===
                "Hatched"
            ) {

                return;

            }


            // Eén maand voorbij

            if (
                egg.monthsRemaining ===
                undefined
            ) {

                egg.monthsRemaining =
                    egg.incubationMonths ||
                    1;

            }


            egg.monthsRemaining--;


            // --------------------------------
            // EGG STILL INCUBATING
            // --------------------------------

            if (
                egg.monthsRemaining > 0
            ) {

                egg.status =
                    "Incubating";


                return;

            }


            // --------------------------------
            // HATCH
            // --------------------------------

            egg.status =
                "Hatched";


            hatchedEggs.push(
                egg
            );

        }
    );


    // ----------------------------------------
    // HATCH EGGS
    // ----------------------------------------

    hatchedEggs.forEach(
        egg => {

            hatchMonthlyEgg(
                egg
            );

        }
    );


    // Remove hatched eggs

    game.eggs =
        game.eggs.filter(
            egg =>
                egg.status !==
                "Hatched"
        );

}


// ============================================
// HATCH EGG
// ============================================

function hatchMonthlyEgg(
    egg
) {

    // ----------------------------------------
    // INFERTILE
    // ----------------------------------------

    if (
        egg.fertile === false
    ) {

        console.log(
            "🥚 Infertile egg did not hatch."
        );

        return;

    }


    // ----------------------------------------
    // BABY CREATION
    // ----------------------------------------

    let morph =
        "Normal";


    if (
        typeof getOffspringMorph ===
        "function"
    ) {

        try {

            morph =
                getOffspringMorph(
                    egg.parents
                );

        }
        catch (
            error
        ) {

            console.log(
                "Morph calculation fallback."
            );

        }

    }


    const baby = {

        id:
            Date.now() +
            Math.floor(
                Math.random() * 100000
            ),

        name:
            `${egg.species} Baby`,

        species:
            egg.species,

        morph:
            morph,

        ageMonths:
            0,

        ageDays:
            0,

        birthMonth:
            game.month,

        birthDay:
            game.day,

        isAdult:
            false,

        health:
            "Healthy",

        foodLevel:
            100,

        waterLevel:
            100,

        breedingCooldown:
            0,

        parents:
            egg.parents || []

    };


    // ----------------------------------------
    // ADD BABY
    // ----------------------------------------

    game.animals.push(
        baby
    );


    // ----------------------------------------
    // STATISTICS
    // ----------------------------------------

    if (
        !game.statistics
    ) {

        game.statistics = {

            animalsBorn: 0,

            eggsLaid: 0,

            animalsSold: 0,

            moneyEarned: 0

        };

    }


    game.statistics.animalsBorn++;


    console.log(
        `🐣 ${egg.species} hatched!`
    );


    console.log(
        `🧬 Morph: ${morph}`
    );

}


// ============================================
// GET EGG TIME REMAINING
// ============================================

function getEggTimeRemaining(
    egg
) {

    if (
        egg.monthsRemaining ===
        undefined
    ) {

        return 0;

    }


    return Math.max(
        0,
        egg.monthsRemaining
    );

}


// ============================================
// EGG STATUS TEXT
// ============================================

function getEggStatus(
    egg
) {

    const remaining =
        getEggTimeRemaining(
            egg
        );


    if (
        remaining <= 0
    ) {

        return "🐣 Ready to hatch";

    }


    if (
        remaining === 1
    ) {

        return "🥚 1 maand";

    }


    return (
        `🥚 ${remaining} maanden`
    );

}


// ============================================
// MONTHLY EGG RENDERER
// ============================================

function renderMonthlyEggs() {

    const container =
        document.getElementById(
            "eggList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        game.eggs.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                🥚 Geen eieren

            </div>

        `;

        return;

    }


    game.eggs.forEach(
        egg => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "egg-card";


            const status =
                getEggStatus(
                    egg
                );


            card.innerHTML = `

                <h3>
                    🥚 ${egg.species}
                </h3>

                <p>
                    🧬
                    ${egg.morph || "Onbekend"}
                </p>

                <p>
                    ${
                        egg.fertile
                            ? "🟢 Fertile"
                            : "🔴 Infertile"
                    }
                </p>

                <p>
                    ${status}
                </p>

                <p>
                    Totale incubatie:
                    ${egg.incubationMonths}
                    maand(en)
                </p>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// ============================================
// MONTH DISPLAY
// ============================================

function updateMonthlyDisplay() {

    const monthElement =
        document.getElementById(
            "gameMonth"
        );


    const dayElement =
        document.getElementById(
            "gameDay"
        );


    if (monthElement) {

        monthElement.textContent =
            `Maand ${game.month}`;

    }


    if (dayElement) {

        dayElement.textContent =
            `Dag ${game.day}`;

    }

}


// ============================================
// MONTH BUTTON
// ============================================

function createMonthButton() {

    let button =
        document.getElementById(
            "nextMonthButton"
        );


    if (!button) {

        button =
            document.createElement(
                "button"
            );


        button.id =
            "nextMonthButton";


        button.textContent =
            "⏩ Volgende maand";


        button.onclick =
            nextMonth;


        document.body.appendChild(
            button
        );

    }

}


// ============================================
// COMPATIBILITY WITH OLD DAY SYSTEM
// ============================================

// De oude dagknop blijft bestaan,
// maar gaat nu automatisch naar
// de volgende maand.

function nextGameDay() {

    nextMonth();

}


// ============================================
// INITIALIZE MONTH
// ============================================

function initializeMonthlySystem() {

    if (
        !game.month
    ) {

        game.month = 1;

    }


    if (
        !game.day
    ) {

        game.day = 1;

    }


    updateMonthlyDisplay();

    renderMonthlyEggs();

    createMonthButton();

}


// ============================================
// SAVE MONTH SYSTEM
// ============================================

function saveMonthlySystem() {

    saveGameFinal();

}


// ============================================
// START PART 15
// ============================================

initializeMonthlySystem();

saveMonthlySystem();


console.log(
    "📅 Part 15 - Monthly system loaded!"
);

console.log(
    "🗓️ Current month:",
    game.month
);

console.log(
    "🥚 Eggs use species-specific incubation times."
);






// ============================================
// PART 16 - PAGE NAVIGATION
// ============================================

function showPage(pageName) {

    // Alle pagina's verbergen
    const pages = document.querySelectorAll(".page");

    pages.forEach(function(page) {
        page.classList.remove("active");
    });


    // Gevraagde pagina zoeken
    const selectedPage =
        document.getElementById(pageName);


    // Als de pagina bestaat: tonen
    if (selectedPage) {

        selectedPage.classList.add("active");

    } else {

        console.error(
            "Pagina bestaat niet:",
            pageName
        );

        return;
    }


    // ----------------------------------------
    // PAGINA SPECIFIEKE UPDATES
    // ----------------------------------------

    if (pageName === "home") {

        updateHomePage();

    }


    if (pageName === "animals") {

        renderFinalAnimals();

    }


    if (pageName === "shop") {

        renderShopPage();

        renderUpgrades();

    }


    if (pageName === "breeding") {

        renderBreedingPage();

    }


    if (pageName === "incubator") {

        renderMonthlyEggs();

        renderIncubators();

    }


    // Algemene UI
    updateFinalUI();

    updateHomePage();

}


// ============================================
// HOME UPDATE
// ============================================

function updateHomePage() {

    const day =
        game.day || 1;

    const month =
        game.month || 1;

    const money =
        game.money || 0;

    const animalCount =
        game.animals
            ? game.animals.length
            : 0;

    const eggCount =
        game.eggs
            ? game.eggs.length
            : 0;


    // Header
    const headerDay =
        document.getElementById("day");

    const headerMonth =
        document.getElementById("month");

    const headerMoney =
        document.getElementById("money");

    const headerAnimals =
        document.getElementById("animalCount");

    const headerEggs =
        document.getElementById("eggCount");


    if (headerDay)
        headerDay.textContent = day;

    if (headerMonth)
        headerMonth.textContent = month;

    if (headerMoney)
        headerMoney.textContent = money;

    if (headerAnimals)
        headerAnimals.textContent =
            animalCount;

    if (headerEggs)
        headerEggs.textContent =
            eggCount;


    // Home
    const homeDay =
        document.getElementById("homeDay");

    const homeMonth =
        document.getElementById("homeMonth");

    const homeMoney =
        document.getElementById("homeMoney");

    const homeAnimals =
        document.getElementById(
            "homeAnimalCount"
        );

    const homeEggs =
        document.getElementById(
            "homeEggCount"
        );


    if (homeDay)
        homeDay.textContent = day;

    if (homeMonth)
        homeMonth.textContent = month;

    if (homeMoney)
        homeMoney.textContent = money;

    if (homeAnimals)
        homeAnimals.textContent =
            animalCount;

    if (homeEggs)
        homeEggs.textContent =
            eggCount;

}


// ============================================
// BREEDING PAGE
// ============================================

function renderBreedingPage() {

    const container =
        document.getElementById(
            "breedingAnimals"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const animals =
        game.animals || [];


    if (animals.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                🦎 Je hebt nog geen dieren.

                <br><br>

                Koop eerst een dier.

            </div>

        `;

        return;

    }


    animals.forEach(function(animal) {

        const card =
            document.createElement("div");


        card.className =
            "breeding-animal-card";


        const gender =
            animal.gender ||
            animal.sex ||
            "Unknown";


        const genderIcon =
            gender === "Male"
                ? "♂️"
                : gender === "Female"
                    ? "♀️"
                    : "❓";


        card.innerHTML = `

            <h3>
                ${animal.name || "Reptile"}
            </h3>

            <p>
                ${animal.species}
            </p>

            <p>
                🧬
                ${animal.morph || "Normal"}
            </p>

            <p>
                ${genderIcon}
                ${gender}
            </p>

            <button
                onclick="
                    selectBreedingAnimal(
                        ${animal.id}
                    )
                "
            >
                Selecteren
            </button>

        `;


        container.appendChild(card);

    });

}


// ============================================
// SELECT BREEDING ANIMAL
// ============================================

function selectBreedingAnimal(id) {

    const animal =
        game.animals.find(
            function(a) {
                return a.id === id;
            }
        );


    if (!animal) {
        return;
    }


    const gender =
        animal.gender ||
        animal.sex;


    if (gender === "Male") {

        selectedMale =
            animal;

        updateMaleSelection();

    }


    else if (gender === "Female") {

        selectedFemale =
            animal;

        updateFemaleSelection();

    }


    else {

        alert(
            "Dit dier heeft geen geslacht ingesteld."
        );

        return;

    }


    updateBreedButton();

}


// ============================================
// MALE SELECTION
// ============================================

function updateMaleSelection() {

    const box =
        document.getElementById(
            "maleSelection"
        );


    if (!box) {
        return;
    }


    if (!selectedMale) {

        box.innerHTML =
            "<p>Kies een mannetje.</p>";

        return;

    }


    box.innerHTML = `

        <h3>
            🐍 ${selectedMale.name}
        </h3>

        <p>
            ${selectedMale.species}
        </p>

        <p>
            🧬
            ${selectedMale.morph || "Normal"}
        </p>

        <button
            onclick="
                selectedMale = null;
                updateMaleSelection();
                updateBreedButton();
            "
        >
            Verwijderen
        </button>

    `;

}


// ============================================
// FEMALE SELECTION
// ============================================

function updateFemaleSelection() {

    const box =
        document.getElementById(
            "femaleSelection"
        );


    if (!box) {
        return;
    }


    if (!selectedFemale) {

        box.innerHTML =
            "<p>Kies een vrouwtje.</p>";

        return;

    }


    box.innerHTML = `

        <h3>
            🐍 ${selectedFemale.name}
        </h3>

        <p>
            ${selectedFemale.species}
        </p>

        <p>
            🧬
            ${selectedFemale.morph || "Normal"}
        </p>

        <button
            onclick="
                selectedFemale = null;
                updateFemaleSelection();
                updateBreedButton();
            "
        >
            Verwijderen
        </button>

    `;

}


// ============================================
// BREED BUTTON
// ============================================

function updateBreedButton() {

    const button =
        document.getElementById(
            "breedButton"
        );


    if (!button) {
        return;
    }


    if (
        selectedMale &&
        selectedFemale
    ) {

        button.disabled = false;

        button.textContent =
            "🧬 Start Breeding";

    }

    else {

        button.disabled = true;

        button.textContent =
            "🧬 Kies beide ouders";

    }

}


// ============================================
// SHOP PAGE
// ============================================

function renderShopPage() {

    const container =
        document.getElementById(
            "shopList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="card">

            <h3>🏠 Upgrades</h3>

            <p>
                Verbeter je reptielenbedrijf.
            </p>

            <div id="upgradeList"></div>

        </div>

    `;


    renderUpgrades();

}


// ============================================
// INITIALIZE NAVIGATION
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        showPage("home");

        updateHomePage();

    }
);


// ============================================
// INITIAL LOAD
// ============================================

showPage("home");

updateHomePage();

console.log(
    "🧭 Part 16 - Navigation loaded!"
);




// ============================================
// PART 17 - ANIMAL SHOP
// ============================================


// ============================================
// SHOP ANIMALS
// ============================================

const shopAnimals = [

    {
        species: "Ball Python",
        price: 150,
        morphs: [
            "Normal",
            "Pastel",
            "Mojave",
            "Albino"
        ]
    },

    {
        species: "Leopard Gecko",
        price: 100,
        morphs: [
            "Normal",
            "Albino",
            "Tangerine",
            "Mack Snow"
        ]
    },

    {
        species: "Corn Snake",
        price: 120,
        morphs: [
            "Normal",
            "Amelanistic",
            "Anery",
            "Snow"
        ]
    },

    {
        species: "Bearded Dragon",
        price: 200,
        morphs: [
            "Normal",
            "Hypo",
            "Citrus",
            "Leatherback"
        ]
    },

    {
        species: "Crested Gecko",
        price: 180,
        morphs: [
            "Normal",
            "Flame",
            "Harlequin",
            "Dalmatian"
        ]
    },

    {
        species: "Gargoyle Gecko",
        price: 220,
        morphs: [
            "Normal",
            "Orange Stripe",
            "Red Stripe"
        ]
    },

    {
        species: "African Fat-Tailed Gecko",
        price: 170,
        morphs: [
            "Normal",
            "Albino",
            "Whiteout"
        ]
    },

    {
        species: "Red-Eared Slider",
        price: 150,
        morphs: [
            "Normal",
            "Hypo"
        ]
    },

    {
        species: "Panther Chameleon",
        price: 350,
        morphs: [
            "Normal",
            "Blue",
            "Red"
        ]
    },

    {
        species: "Veiled Chameleon",
        price: 250,
        morphs: [
            "Normal",
            "Turquoise",
            "Yellow"
        ]
    },

    {
        species: "Jackson's Chameleon",
        price: 300,
        morphs: [
            "Normal",
            "Green"
        ]
    },

    {
        species: "Reticulated Python",
        price: 600,
        morphs: [
            "Normal",
            "Albino",
            "Tiger"
        ]
    },

    {
        species: "Green Anaconda",
        price: 700,
        morphs: [
            "Normal"
        ]
    }

];


// ============================================
// RANDOM CHOICE
// ============================================

function randomShopItem(array) {

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];

}


// ============================================
// CREATE SHOP
// ============================================

function renderAnimalShop() {

    const shop =
        document.getElementById(
            "shopList"
        );

    if (!shop) {
        return;
    }

    shop.innerHTML = "";


    shopAnimals.forEach(
        function(item, index) {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "shop-animal-card";


            card.innerHTML = `

                <h3>
                    🦎 ${item.species}
                </h3>

                <p>
                    Beschikbare morphs:
                </p>

                <p>
                    🧬
                    ${item.morphs.join(", ")}
                </p>

                <div class="shop-price">
                    💰 €${item.price}
                </div>

                <button
                    class="buy-animal-button"
                    onclick="buyShopAnimal(${index})"
                >
                    🛒 Koop ${item.species}
                </button>

            `;


            shop.appendChild(card);

        }
    );


    updateShopMoney();

}


// ============================================
// BUY ANIMAL
// ============================================

function buyShopAnimal(index) {

    const item =
        shopAnimals[index];


    if (!item) {
        return;
    }


    // Check money

    if (
        game.money <
        item.price
    ) {

        alert(
            "❌ Je hebt niet genoeg geld!"
        );

        return;

    }


    // Random gender

    const gender =
        Math.random() < 0.5
            ? "Male"
            : "Female";


    // Random morph

    const morph =
        randomShopItem(
            item.morphs
        );


    // Create animal

    const animal = {

        id:
            Date.now() +
            Math.floor(
                Math.random() * 100000
            ),

        name:
            `${morph} ${item.species}`,

        species:
            item.species,

        morph:
            morph,

        gender:
            gender,

        ageMonths:
            0,

        ageDays:
            0,

        health:
            "Healthy",

        foodLevel:
            100,

        waterLevel:
            100,

        isAdult:
            false,

        breedingCooldown:
            0,

        purchasePrice:
            item.price,

        birthMonth:
            game.month || 1

    };


    // Pay

    game.money -=
        item.price;


    // Add animal

    game.animals.push(
        animal
    );


    // Save

    if (
        typeof saveGameFinal ===
        "function"
    ) {

        saveGameFinal();

    }


    // Update UI

    updateShopMoney();

    updateAnimalCounters();


    if (
        typeof renderFinalAnimals ===
        "function"
    ) {

        renderFinalAnimals();

    }


    if (
        typeof updateFinalUI ===
        "function"
    ) {

        updateFinalUI();

    }


    // Message

    const genderText =
        gender === "Male"
            ? "♂️ Mannetje"
            : "♀️ Vrouwtje";


    alert(

        `🦎 Nieuw dier gekocht!\n\n` +

        `${item.species}\n` +

        `🧬 Morph: ${morph}\n` +

        `${genderText}\n\n` +

        `💰 Betaald: €${item.price}`

    );

}


// ============================================
// MONEY
// ============================================

function updateShopMoney() {

    const element =
        document.getElementById(
            "shopMoney"
        );


    if (!element) {
        return;
    }


    element.textContent =
        game.money || 0;

}


// ============================================
// COUNTERS
// ============================================

function updateAnimalCounters() {

    const animals =
        game.animals
            ? game.animals.length
            : 0;


    const eggs =
        game.eggs
            ? game.eggs.length
            : 0;


    const animalCount =
        document.getElementById(
            "animalCount"
        );


    const eggCount =
        document.getElementById(
            "eggCount"
        );


    const homeAnimals =
        document.getElementById(
            "homeAnimalCount"
        );


    const homeEggs =
        document.getElementById(
            "homeEggCount"
        );


    if (animalCount) {

        animalCount.textContent =
            animals;

    }


    if (eggCount) {

        eggCount.textContent =
            eggs;

    }


    if (homeAnimals) {

        homeAnimals.textContent =
            animals;

    }


    if (homeEggs) {

        homeEggs.textContent =
            eggs;

    }

}


// ============================================
// SHOP OPEN
// ============================================

function openAnimalShop() {

    renderAnimalShop();

    updateShopMoney();

}


// ============================================
// LOAD SHOP
// ============================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderAnimalShop();

        updateShopMoney();

        updateAnimalCounters();

    }
);


// ============================================
// PART 17 LOADED
// ============================================

console.log(
    "🛒 Part 17 - Animal Shop loaded!"
);
