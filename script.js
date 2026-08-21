// ============================================
// REPTILE BREEDING SIMULATION
// PART 5 - REAL BREEDING
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
// MORPH DATABASE
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
// LOAD GAME
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

                if (
                    animal.adultAgeMonths === undefined
                ) {

                    animal.adultAgeMonths =
                        getAdultAge(
                            animal.species
                        );

                }

                if (
                    animal.breedingCooldown === undefined
                ) {

                    animal.breedingCooldown = 0;

                }

            }
        );

    }

    catch (error) {

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
// NAVIGATION
// ============================================

function showPage(pageName) {

    document
        .querySelectorAll(".page")
        .forEach(
            page => {
                page.classList.remove(
                    "active"
                );
            }
        );

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
// CREATE GENES
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
                "Healthy" &&
                animal.breedingCooldown <= 0;

            if (
                animal.breedingCooldown > 0
            ) {

                animal.breedingCooldown--;

            }

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
// BUY ANIMAL
// ============================================

function buyAnimal(index) {

    const item =
        shopAnimals[index];

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
        `(${item.morph}) gekocht!`
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
// GENOTYPE
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
// VISIBLE MORPH
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


    return animal.morph;

}


// ============================================
// SELECT MALE
// ============================================

function selectMale(id) {

    const animal =
        game.animals.find(
            a => a.id === id
        );

    if (!animal) {
        return;
    }

    if (
        animal.sex !== "Male"
    ) {

        alert(
            "Dit dier is geen mannetje."
        );

        return;

    }

    if (
        !animal.breedingReady
    ) {

        alert(
            "Dit mannetje is nog niet klaar om te breeden."
        );

        return;

    }

    selectedMale =
        animal;

    updateBreedingUI();

}


// ============================================
// SELECT FEMALE
// ============================================

function selectFemale(id) {

    const animal =
        game.animals.find(
            a => a.id === id
        );

    if (!animal) {
        return;
    }

    if (
        animal.sex !== "Female"
    ) {

        alert(
            "Dit dier is geen vrouwtje."
        );

        return;

    }

    if (
        !animal.breedingReady
    ) {

        alert(
            "Dit vrouwtje is nog niet klaar om te breeden."
        );

        return;

    }

    selectedFemale =
        animal;

    updateBreedingUI();

}


// ============================================
// BREEDING LIST
// ============================================

function renderBreedingAnimals() {

    const container =
        document.getElementById(
            "breedingAnimals"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const readyAnimals =
        game.animals.filter(
            animal =>
                animal.isAdult &&
                animal.health === "Healthy"
        );

    if (
        readyAnimals.length === 0
    ) {

        container.innerHTML = `

            <p>
                Je hebt nog geen volwassen
                dieren die kunnen breeden.
            </p>

        `;

        return;

    }

    readyAnimals.forEach(
        animal => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "breeding-animal";

            const readyText =
                animal.breedingReady
                    ? "Ready"
                    : "Cooldown";

            card.innerHTML = `

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

                <p>
                    ${readyText}
                </p>

                ${
                    animal.sex === "Male"
                    ?

                    `
                    <button
                        class="male-button"
                        onclick="
                            selectMale(${animal.id})
                        "
                    >
                        ♂ Kies als vader
                    </button>
                    `

                    :

                    `
                    <button
                        class="female-button"
                        onclick="
                            selectFemale(${animal.id})
                        "
                    >
                        ♀ Kies als moeder
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
// BREEDING UI
// ============================================

function updateBreedingUI() {

    const maleBox =
        document.getElementById(
            "maleSelection"
        );

    const femaleBox =
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

        maleBox.innerHTML = `

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

        maleBox.innerHTML =
            "<p>Kies een mannetje.</p>";

    }


    if (selectedFemale) {

        femaleBox.innerHTML = `

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

        femaleBox.innerHTML =
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
                    ❌ Deze twee dieren zijn
                    verschillende soorten.
                    Kies dezelfde soort.
                </div>

            `;

            button.disabled = true;

        }

        else {

            message.innerHTML = `

                <div class="success">

                    ✅ ${selectedMale.name}
                    ×
                    ${selectedFemale.name}

                    <br><br>

                    Soort:
                    ${selectedMale.species}

                    <br>

                    Mogelijke nakomelingen
                    worden via genetica bepaald.

                </div>

            `;

        }

    }

    renderBreedingAnimals();

}


// ============================================
// TAKE ALLELE FROM PARENT
// ============================================

function inheritAllele(
    parentAlleles
) {

    if (
        !parentAlleles ||
        parentAlleles.length !== 2
    ) {

        return null;

    }

    return parentAlleles[
        Math.floor(
            Math.random() * 2
        )
    ];

}


// ============================================
// CREATE CHILD GENES
// ============================================

function createChildGenes(
    father,
    mother
) {

    const childGenes = {};

    const geneNames =
        new Set([
            ...Object.keys(
                father.genes || {}
            ),
            ...Object.keys(
                mother.genes || {}
            )
        ]);


    geneNames.forEach(
        geneName => {

            const fatherAlleles =
                father.genes[
                    geneName
                ] || ["A", "A"];

            const motherAlleles =
                mother.genes[
                    geneName
                ] || ["A", "A"];


            const fatherAllele =
                inheritAllele(
                    fatherAlleles
                );

            const motherAllele =
                inheritAllele(
                    motherAlleles
                );


            childGenes[
                geneName
            ] = [

                fatherAllele,

                motherAllele

            ];

        }
    );


    return childGenes;

}


// ============================================
// BREEDING RESULT
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

        morph:
            "Unknown",

        genes:
            genes

    };


    const predictedMorph =
        calculateVisibleMorph(
            fakeAnimal
        );


    const egg = {

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
            game.day + 60,

        status:
            "Incubating"

    };


    return egg;

}


// ============================================
// START BREEDING
// ============================================

function startBreeding() {

    if (
        !selectedMale ||
        !selectedFemale
    ) {

        alert(
            "Selecteer eerst twee ouders."
        );

        return;

    }


    if (
        selectedMale.species !==
        selectedFemale.species
    ) {

        alert(
            "De dieren moeten dezelfde soort zijn."
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


    // kleine kans dat breeding mislukt

    const successChance = 0.90;


    if (
        Math.random() >
        successChance
    ) {

        selectedMale.breedingCooldown =
            14;

        selectedFemale.breedingCooldown =
            14;

        alert(
            "De breeding is helaas mislukt."
        );

        selectedMale = null;

        selectedFemale = null;

        saveGame();

        updateUI();

        return;

    }


    const egg =
        createEgg(
            selectedMale,
            selectedFemale
        );


    game.eggs.push(
        egg
    );


    selectedMale.breedingCooldown =
        14;

    selectedFemale.breedingCooldown =
        28;


    saveGame();

    updateUI();


    alert(
        `🥚 Breeding gelukt!\n\n` +
        `Er is een ei gelegd!\n\n` +
        `Mogelijke morph: ` +
        `${egg.predictedMorph}`
    );


    selectedMale = null;

    selectedFemale = null;

    updateBreedingUI();

}


// ============================================
// EGG SYSTEM
// ============================================

function updateEggs() {

    game.eggs.forEach(
        egg => {

            if (
                game.day >=
                egg.hatchDay
            ) {

                egg.status =
                    "Ready to hatch";

            }

        }
    );

}


// ============================================
// INCUBATOR
// ============================================

function renderEggs() {

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

            <div class="card">

                <h3>
                    Geen eieren
                </h3>

                <p>
                    Breed twee volwassen dieren
                    om een ei te krijgen.
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
                    ${egg.species} Egg
                </h3>

                <p>
                    Mogelijke morph:
                    <b>
                        ${egg.predictedMorph}
                    </b>
                </p>

                <p>
                    Uitkomen:
                    dag ${egg.hatchDay}
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
                        🐣 Ei uitbroeden
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
// HATCH EGG
// ============================================

function hatchEgg(index) {

    const egg =
        game.eggs[index];

    if (!egg) {
        return;
    }


    if (
        game.day <
        egg.hatchDay
    ) {

        alert(
            "Dit ei is nog niet klaar."
        );

        return;

    }


    const father =
        game.animals.find(
            animal =>
                animal.id ===
                egg.fatherId
        );


    const mother =
        game.animals.find(
            animal =>
                animal.id ===
                egg.motherId
        );


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
                    egg.genes
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
            "Healthy",

        purchasePrice: 0,

        genes:
            egg.genes,

        fatherId:
            father
                ? father.id
                : null,

        motherId:
            mother
                ? mother.id
                : null

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


    alert(
        `🐣 Het ei is uitgekomen!\n\n` +
        `${child.species}\n` +
        `Morph: ${child.morph}\n` +
        `Sex: ${child.sex}`
    );

}


// ============================================
// ANIMAL MODAL
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
                        ${genotypeText(
                            animal.genes[gene]
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
                Soort
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
                ${calculateVisibleMorph(
                    animal
                )}
            </span>
        </div>

        <div class="detail-row">
            <span class="detail-title">
                Geslacht
            </span>

            <span>
                ${animal.sex}
            </span>
        </div>

        <div class="detail-row">
            <span class="detail-title">
                Leeftijd
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
                Gezondheid
            </span>

            <span>
                ${animal.health}
            </span>
        </div>

        <div class="detail-row">
            <span class="detail-title">
                Breeding
            </span>

            <span>
                ${
                    animal.breedingReady
                    ? "Ready"
                    : "Niet ready"
                }
            </span>
        </div>

        <div class="gene-box">

            <h3>
                🧬 Genotype
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

    container.innerHTML = "";


    if (
        game.animals.length === 0
    ) {

        container.innerHTML = `

            <div class="card">

                <h3>
                    Geen dieren
                </h3>

                <p>
                    Ga naar de shop.
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
                    ${animal.ageMonths}
                    maanden
                </p>

                <p>
                    ${
                        animal.breedingReady
                        ? "🟢 Breeding ready"
                        : "🟡 Nog niet ready"
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
// START GAME
// ============================================

loadGame();

updateAnimalAges();

updateEggs();

updateUI();
