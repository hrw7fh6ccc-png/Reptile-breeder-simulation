/* =========================================================
   REPTILE BREEDING SIMULATION
   COMPLETE GAME SCRIPT
   Compatible with the current index.html + style.css
========================================================= */

"use strict";

/* =========================================================
   GAME DATA
========================================================= */

const SAVE_KEY = "reptile_breeding_simulation_v1";

const DAYS_PER_MONTH = 28;


/* =========================================================
   SPECIES
========================================================= */

const SPECIES = {

    "Ball Python": {
        price: 150,
        incubation: [1, 2],
        adultAge: 30,
        morphs: {
            Normal: { type: "normal" },
            Pastel: { type: "incomplete" },
            Mojave: { type: "incomplete" },
            Banana: { type: "incomplete" },
            Enchi: { type: "incomplete" },
            Spider: { type: "incomplete" },
            Albino: { type: "recessive" },
            Pied: { type: "recessive" },
            Clown: { type: "recessive" },
            Axanthic: { type: "recessive" },
            "Albino Pied": { type: "recessive" },
            "Pastel Pied": { type: "incomplete" }
        }
    },

    "Leopard Gecko": {
        price: 100,
        incubation: [1, 2],
        adultAge: 12,
        morphs: {
            Normal: { type: "normal" },
            Tangerine: { type: "incomplete" },
            "Mack Snow": { type: "incomplete" },
            Eclipse: { type: "recessive" },
            Blizzard: { type: "recessive" },
            "Patternless": { type: "recessive" },
            Albino: { type: "recessive" },
            "Mack Snow Albino": { type: "recessive" },
            "Tangerine Eclipse": { type: "recessive" }
        }
    },

    "Corn Snake": {
        price: 120,
        incubation: [1, 3],
        adultAge: 24,
        morphs: {
            Normal: { type: "normal" },
            Amelanistic: { type: "recessive" },
            Anery: { type: "recessive" },
            Snow: { type: "recessive" },
            Hypo: { type: "recessive" },
            Motley: { type: "recessive" },
            Stripe: { type: "recessive" },
            Tessera: { type: "incomplete" }
        }
    },

    "Bearded Dragon": {
        price: 200,
        incubation: [2, 3],
        adultAge: 18,
        morphs: {
            Normal: { type: "normal" },
            Hypo: { type: "recessive" },
            Translucent: { type: "recessive" },
            Leatherback: { type: "incomplete" },
            Dunner: { type: "incomplete" },
            Witblits: { type: "recessive" },
            "Hypo Translucent": { type: "recessive" },
            "Leatherback Hypo": { type: "incomplete" }
        }
    },

    "Crested Gecko": {
        price: 180,
        incubation: [1, 3],
        adultAge: 12,
        morphs: {
            Normal: { type: "normal" },
            Flame: { type: "incomplete" },
            Harlequin: { type: "incomplete" },
            Dalmatian: { type: "incomplete" },
            Pinstripe: { type: "incomplete" },
            "Lilly White": { type: "dominant" },
            "Lilly White Flame": { type: "dominant" },
            "Dalmatian Harlequin": { type: "incomplete" }
        }
    },

    "Gargoyle Gecko": {
        price: 220,
        incubation: [1, 3],
        adultAge: 15,
        morphs: {
            Normal: { type: "normal" },
            "Orange Stripe": { type: "incomplete" },
            "Red Stripe": { type: "incomplete" },
            Reticulated: { type: "incomplete" },
            "Orange Reticulated": { type: "incomplete" }
        }
    },

    "African Fat-Tailed Gecko": {
        price: 170,
        incubation: [1, 2],
        adultAge: 12,
        morphs: {
            Normal: { type: "normal" },
            Albino: { type: "recessive" },
            Oreo: { type: "recessive" },
            Patternless: { type: "recessive" },
            Whiteout: { type: "dominant" },
            "Whiteout Oreo": { type: "dominant" }
        }
    },

    "Reticulated Python": {
        price: 600,
        incubation: [2, 4],
        adultAge: 36,
        morphs: {
            Normal: { type: "normal" },
            Albino: { type: "recessive" },
            Tiger: { type: "incomplete" },
            Lavender: { type: "recessive" },
            Motley: { type: "incomplete" },
            "Albino Tiger": { type: "recessive" },
            "Lavender Albino": { type: "recessive" }
        }
    },

    "Green Anaconda": {
        price: 700,
        incubation: [2, 4],
        adultAge: 36,
        morphs: {
            Normal: { type: "normal" },
            "High Yellow": { type: "incomplete" },
            "Blue Line": { type: "incomplete" }
        }
    },

    "Red-Eared Slider": {
        price: 150,
        incubation: [2, 4],
        adultAge: 24,
        morphs: {
            Normal: { type: "normal" },
            Hypo: { type: "recessive" },
            "Pastel Green": { type: "incomplete" }
        }
    },

    "Panther Chameleon": {
        price: 350,
        incubation: [2, 4],
        adultAge: 12,
        morphs: {
            Normal: { type: "normal" },
            Blue: { type: "incomplete" },
            Red: { type: "incomplete" },
            Green: { type: "incomplete" },
            Yellow: { type: "incomplete" },
            "Blue Bar": { type: "incomplete" },
            "Red Bar": { type: "incomplete" }
        }
    },

    "Veiled Chameleon": {
        price: 250,
        incubation: [1, 3],
        adultAge: 12,
        morphs: {
            Normal: { type: "normal" },
            Turquoise: { type: "incomplete" },
            Yellow: { type: "incomplete" },
            Blue: { type: "incomplete" },
            "High Yellow": { type: "incomplete" }
        }
    },

    "Jackson's Chameleon": {
        price: 300,
        incubation: [2, 4],
        adultAge: 12,
        morphs: {
            Normal: { type: "normal" },
            Green: { type: "incomplete" },
            Blue: { type: "incomplete" },
            Yellow: { type: "incomplete" }
        }
    }

};


/* =========================================================
   GAME STATE
========================================================= */

let game = {

    money: 1000,

    day: 1,

    month: 1,

    animals: [],

    eggs: [],

    statistics: {

        animalsBorn: 0,

        eggsLaid: 0,

        animalsSold: 0,

        moneyEarned: 0

    }

};


/* =========================================================
   BREEDING SELECTION
========================================================= */

let selectedMale = null;

let selectedFemale = null;


/* =========================================================
   HELPERS
========================================================= */

function randomItem(array) {

    if (!array || array.length === 0) {
        return null;
    }

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];

}


function randomGender() {

    return Math.random() < 0.5
        ? "Male"
        : "Female";

}


function randomNumber(min, max) {

    return Math.floor(
        Math.random() *
        (max - min + 1)
    ) + min;

}


function capitalize(text) {

    if (!text) {
        return "";
    }

    return text.charAt(0).toUpperCase() +
        text.slice(1);

}


/* =========================================================
   SAVE / LOAD
========================================================= */

function saveGame() {

    try {

        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(game)
        );

    } catch (error) {

        console.error(
            "Save error:",
            error
        );

    }

}


function loadGame() {

    try {

        const saved =
            localStorage.getItem(
                SAVE_KEY
            );

        if (!saved) {
            return;
        }

        const data =
            JSON.parse(saved);

        if (!data) {
            return;
        }

        game = {

            money:
                Number(data.money) || 1000,

            day:
                Number(data.day) || 1,

            month:
                Number(data.month) || 1,

            animals:
                Array.isArray(data.animals)
                    ? data.animals
                    : [],

            eggs:
                Array.isArray(data.eggs)
                    ? data.eggs
                    : [],

            statistics: {

                animalsBorn:
                    Number(
                        data.statistics?.animalsBorn
                    ) || 0,

                eggsLaid:
                    Number(
                        data.statistics?.eggsLaid
                    ) || 0,

                animalsSold:
                    Number(
                        data.statistics?.animalsSold
                    ) || 0,

                moneyEarned:
                    Number(
                        data.statistics?.moneyEarned
                    ) || 0

            }

        };

    } catch (error) {

        console.error(
            "Load error:",
            error
        );

    }

}


/* =========================================================
   ANIMAL CREATION
========================================================= */

function createAnimal(
    species,
    morph = "Normal",
    gender = randomGender(),
    ageMonths = 0
) {

    return {

        id:
            Date.now() +
            Math.floor(
                Math.random() * 1000000
            ),

        name:
            `${morph} ${species}`,

        species:
            species,

        morph:
            morph,

        gender:
            gender,

        ageMonths:
            ageMonths,

        ageDays:
            ageMonths * DAYS_PER_MONTH,

        health:
            100,

        foodLevel:
            100,

        waterLevel:
            100,

        isAdult:
            ageMonths >=
            getAdultAge(species),

        breedingCooldown:
            0,

        purchasePrice:
            SPECIES[species]?.price || 100,

        birthMonth:
            game.month

    };

}


function getAdultAge(species) {

    return (
        SPECIES[species]?.adultAge
        || 12
    );

}


/* =========================================================
   SHOP
========================================================= */

function renderAnimalShop() {

    const shop =
        document.getElementById(
            "shopList"
        );

    if (!shop) {
        return;
    }

    shop.innerHTML = "";


    Object.entries(SPECIES)
        .forEach(
            function([species, data], index) {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "shop-animal-card";


                const morphNames =
                    Object.keys(
                        data.morphs
                    );


                card.innerHTML = `

                    <h3>
                        🦎 ${species}
                    </h3>

                    <p>
                        Beschikbare morphs:
                    </p>

                    <p>
                        🧬
                        ${morphNames.join(", ")}
                    </p>

                    <div class="shop-price">
                        💰 €${data.price}
                    </div>

                    <button
                        class="buy-animal-button"
                        type="button"
                        onclick="buyAnimal('${escapeQuotes(species)}')"
                    >
                        🛒 Koop dier
                    </button>

                `;


                shop.appendChild(card);

            }
        );


    updateShopMoney();

}


function escapeQuotes(text) {

    return text
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


/* =========================================================
   BUY ANIMAL
========================================================= */

function buyAnimal(species) {

    const data =
        SPECIES[species];


    if (!data) {

        alert(
            "Dit dier bestaat niet."
        );

        return;

    }


    if (
        game.money <
        data.price
    ) {

        alert(
            `❌ Niet genoeg geld!\n\n` +
            `Je hebt €${game.money}.\n` +
            `Dit dier kost €${data.price}.`
        );

        return;

    }


    const gender =
        randomGender();


    const morph =
        randomItem(
            Object.keys(
                data.morphs
            )
        );


    const animal =
        createAnimal(
            species,
            morph,
            gender,
            0
        );


    game.money -=
        data.price;


    game.animals.push(
        animal
    );


    saveGame();

    updateUI();

    renderAnimalShop();

    renderFinalAnimals();


    alert(

        `🦎 Dier gekocht!\n\n` +

        `${species}\n` +

        `🧬 ${morph}\n` +

        `${
            gender === "Male"
                ? "♂️ Mannetje"
                : "♀️ Vrouwtje"
        }\n\n` +

        `💰 -€${data.price}`

    );

}


/* =========================================================
   SHOP MONEY
========================================================= */

function updateShopMoney() {

    const element =
        document.getElementById(
            "shopMoney"
        );

    if (element) {

        element.textContent =
            game.money;

    }

}


/* =========================================================
   ANIMALS PAGE
========================================================= */

function renderFinalAnimals() {

    const list =
        document.getElementById(
            "animalList"
        );

    if (!list) {
        return;
    }


    list.innerHTML = "";


    if (
        game.animals.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-state">

                🦎 Je hebt nog geen dieren.

                <br><br>

                Ga naar de Shop!

            </div>

        `;

        return;

    }


    game.animals.forEach(
        function(animal) {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "animal-card";


            const gender =
                animal.gender === "Male"
                    ? "♂️ Mannetje"
                    : "♀️ Vrouwtje";


            const adult =
                animal.isAdult
                    ? "Adult"
                    : "Baby";


            card.innerHTML = `

                <h3>
                    🦎 ${animal.name}
                </h3>

                <p>
                    Species:
                    ${animal.species}
                </p>

                <p>
                    🧬 Morph:
                    ${animal.morph}
                </p>

                <p>
                    ${gender}
                </p>

                <p>
                    📅 Leeftijd:
                    ${animal.ageMonths}
                    maand(en)
                </p>

                <p>
                    ${animal.isAdult ? "🟢" : "🐣"}
                    ${adult}
                </p>

                <p>
                    ❤️ Gezondheid:
                    ${animal.health}%
                </p>

                <button
                    type="button"
                    onclick="openAnimalModal(${animal.id})"
                >
                    🔍 Details
                </button>

            `;


            list.appendChild(card);

        }
    );

}


/* =========================================================
   ANIMAL MODAL
========================================================= */

function openAnimalModal(id) {

    const animal =
        game.animals.find(
            function(a) {

                return (
                    Number(a.id) ===
                    Number(id)
                );

            }
        );


    if (!animal) {
        return;
    }


    const modal =
        document.getElementById(
            "animalModal"
        );


    const details =
        document.getElementById(
            "animalDetails"
        );


    if (!modal || !details) {
        return;
    }


    details.innerHTML = `

        <h2>
            🦎 ${animal.name}
        </h2>

        <p>
            <strong>Soort:</strong>
            ${animal.species}
        </p>

        <p>
            <strong>Morph:</strong>
            ${animal.morph}
        </p>

        <p>
            <strong>Geslacht:</strong>
            ${
                animal.gender === "Male"
                    ? "♂️ Mannetje"
                    : "♀️ Vrouwtje"
            }
        </p>

        <p>
            <strong>Leeftijd:</strong>
            ${animal.ageMonths} maanden
        </p>

        <p>
            <strong>Gezondheid:</strong>
            ${animal.health}%
        </p>

        <p>
            <strong>Voeding:</strong>
            ${animal.foodLevel}%
        </p>

        <p>
            <strong>Water:</strong>
            ${animal.waterLevel}%
        </p>

        <p>
            <strong>Status:</strong>
            ${
                animal.isAdult
                    ? "🟢 Adult"
                    : "🐣 Baby"
            }
        </p>

    `;


    modal.classList.remove(
        "hidden"
    );

}


function closeAnimalModal() {

    const modal =
        document.getElementById(
            "animalModal"
        );


    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

}


/* =========================================================
   BREEDING PAGE
========================================================= */

function renderBreedingPage() {

    const list =
        document.getElementById(
            "breedingAnimals"
        );

    if (!list) {
        return;
    }


    list.innerHTML = "";


    const adults =
        game.animals.filter(
            function(animal) {

                return (
                    animal.isAdult &&
                    animal.health > 0 &&
                    animal.breedingCooldown <= 0
                );

            }
        );


    if (adults.length === 0) {

        list.innerHTML = `

            <div class="empty-state">

                🧬 Je hebt nog geen volwassen
                dieren die kunnen fokken.

                <br><br>

                Koop dieren in de Shop
                en laat ze ouder worden.

            </div>

        `;

        return;

    }


    adults.forEach(
        function(animal) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "breeding-animal-card";


            card.innerHTML = `

                <h3>
                    ${animal.gender === "Male"
                        ? "♂️"
                        : "♀️"
                    }
                    ${animal.name}
                </h3>

                <p>
                    ${animal.species}
                </p>

                <p>
                    🧬 ${animal.morph}
                </p>

                <button
                    type="button"
                    onclick="selectBreedingAnimal(${animal.id})"
                >
                    Selecteren
                </button>

            `;


            list.appendChild(card);

        }
    );


    updateParentBoxes();

    updateBreedButton();

}


/* =========================================================
   SELECT BREEDING ANIMAL
========================================================= */

function selectBreedingAnimal(id) {

    const animal =
        game.animals.find(
            function(a) {

                return (
                    Number(a.id) ===
                    Number(id)
                );

            }
        );


    if (!animal) {
        return;
    }


    if (!animal.isAdult) {

        alert(
            "Dit dier is nog niet volwassen."
        );

        return;

    }


    if (
        animal.breedingCooldown > 0
    ) {

        alert(
            `Dit dier moet nog ` +
            `${animal.breedingCooldown} maand(en) wachten.`
        );

        return;

    }


    if (
        animal.gender === "Male"
    ) {

        selectedMale =
            animal;

    }

    else {

        selectedFemale =
            animal;

    }


    updateParentBoxes();

    updateBreedButton();

}


function updateParentBoxes() {

    const male =
        document.getElementById(
            "maleSelection"
        );


    const female =
        document.getElementById(
            "femaleSelection"
        );


    if (male) {

        if (selectedMale) {

            male.innerHTML = `

                <h3>
                    🐍 ${selectedMale.name}
                </h3>

                <p>
                    ${selectedMale.species}
                </p>

                <p>
                    🧬 ${selectedMale.morph}
                </p>

            `;

        }

        else {

            male.innerHTML =
                "<p>Kies een mannetje.</p>";

        }

    }


    if (female) {

        if (selectedFemale) {

            female.innerHTML = `

                <h3>
                    🐍 ${selectedFemale.name}
                </h3>

                <p>
                    ${selectedFemale.species}
                </p>

                <p>
                    🧬 ${selectedFemale.morph}
                </p>

            `;

        }

        else {

            female.innerHTML =
                "<p>Kies een vrouwtje.</p>";

        }

    }

}


/* =========================================================
   BREED BUTTON
========================================================= */

function updateBreedButton() {

    const button =
        document.getElementById(
            "breedButton"
        );


    if (!button) {
        return;
    }


    button.disabled = !(
        selectedMale &&
        selectedFemale
    );


    button.textContent =
        selectedMale &&
        selectedFemale

            ? "🧬 Start Breeding"

            : "🧬 Kies beide ouders";

}


/* =========================================================
   GENETICS
========================================================= */

function getGeneticResult(
    father,
    mother
) {

    const sameSpecies =
        father.species ===
        mother.species;


    if (!sameSpecies) {

        return {

            success: false,

            reason:
                "De twee dieren zijn verschillende soorten."

        };

    }


    const species =
        father.species;


    const available =
        Object.keys(
            SPECIES[species].morphs
        );


    const fatherMorph =
        father.morph || "Normal";


    const motherMorph =
        mother.morph || "Normal";


    let possible =
        [];


    /*
       Exacte combinatie
    */

    if (
        fatherMorph !== "Normal" &&
        fatherMorph === motherMorph
    ) {

        possible.push(
            fatherMorph
        );

    }


    /*
       Vader morph
    */

    if (
        fatherMorph !== "Normal"
    ) {

        if (
            Math.random() < 0.50
        ) {

            possible.push(
                fatherMorph
            );

        }

    }


    /*
       Moeder morph
    */

    if (
        motherMorph !== "Normal"
    ) {

        if (
            Math.random() < 0.50
        ) {

            possible.push(
                motherMorph
            );

        }

    }


    /*
       Combinaties
    */

    if (
        fatherMorph !== "Normal" &&
        motherMorph !== "Normal" &&
        fatherMorph !== motherMorph
    ) {

        const combined =
            `${fatherMorph} ${motherMorph}`;


        if (
            available.includes(combined)
        ) {

            if (
                Math.random() < 0.35
            ) {

                possible.push(
                    combined
                );

            }

        }

    }


    /*
       Normal fallback
    */

    if (
        possible.length === 0
    ) {

        possible.push(
            "Normal"
        );

    }


    const morph =
        randomItem(
            possible
        );


    return {

        success: true,

        species: species,

        morph: morph

    };

}


/* =========================================================
   BREEDING
========================================================= */

function startBreeding() {

    if (
        !selectedMale ||
        !selectedFemale
    ) {

        alert(
            "Kies eerst een mannetje en vrouwtje."
        );

        return;

    }


    if (
        selectedMale.species !==
        selectedFemale.species
    ) {

        alert(
            "❌ Deze twee dieren zijn verschillende soorten."
        );

        return;

    }


    if (
        !selectedMale.isAdult ||
        !selectedFemale.isAdult
    ) {

        alert(
            "❌ Beide dieren moeten volwassen zijn."
        );

        return;

    }


    if (
        selectedMale.breedingCooldown > 0 ||
        selectedFemale.breedingCooldown > 0
    ) {

        alert(
            "❌ Eén van de dieren moet nog wachten."
        );

        return;

    }


    const result =
        getGeneticResult(
            selectedMale,
            selectedFemale
        );


    if (!result.success) {

        alert(
            "Breeding mislukt."
        );

        return;

    }


    /*
       1 tot 4 eieren
    */

    const eggCount =
        randomNumber(
            1,
            4
        );


    const speciesData =
        SPECIES[
            result.species
        ];


    const incubation =
        randomNumber(
            speciesData.incubation[0],
            speciesData.incubation[1]
        );


    let fertileEggs =
        0;


    for (
        let i = 0;
        i < eggCount;
        i++
    ) {

        /*
           Kleine kans dat een ei infertile is.
        */

        const fertile =
            Math.random() < 0.90;


        const egg = {

            id:
                Date.now() +
                Math.floor(
                    Math.random() *
                    1000000
                ) +
                i,

            species:
                result.species,

            morph:
                result.morph,

            parents: [
                selectedMale.id,
                selectedFemale.id
            ],

            fertile:
                fertile,

            incubationMonths:
                incubation,

            monthsRemaining:
                incubation,

            laidMonth:
                game.month,

            status:
                fertile
                    ? "Incubating"
                    : "Infertile"

        };


        game.eggs.push(
            egg
        );


        game.statistics.eggsLaid++;


        if (fertile) {

            fertileEggs++;

        }

    }


    /*
       Cooldown
    */

    selectedMale.breedingCooldown =
        2;

    selectedFemale.breedingCooldown =
        2;


    saveGame();

    updateUI();

    renderMonthlyEggs();


    const message =
        document.getElementById(
            "breedingMessage"
        );


    if (message) {

        message.innerHTML = `

            🥚 <strong>${eggCount}
            ei(eren) gelegd!</strong>

            <br><br>

            🧬 Mogelijke morph:
            <strong>${result.morph}</strong>

            <br>

            🥚 Fertile:
            <strong>${fertileEggs}</strong>

            <br>

            ❌ Infertile:
            <strong>${eggCount - fertileEggs}</strong>

            <br>

            ⏳ Incubatie:
            <strong>${incubation} maand(en)</strong>

        `;

    }


    selectedMale = null;

    selectedFemale = null;

    updateParentBoxes();

    updateBreedButton();


    alert(

        `🧬 Breeding succesvol!\n\n` +

        `🥚 ${eggCount} ei(eren)\n` +

        `🟢 ${fertileEggs} fertile\n` +

        `🔴 ${eggCount - fertileEggs} infertile\n\n` +

        `🧬 Morph: ${result.morph}\n` +

        `⏳ Incubatie: ${incubation} maand(en)`

    );

}


/* =========================================================
   INCUBATOR
========================================================= */

function renderMonthlyEggs() {

    const list =
        document.getElementById(
            "eggList"
        );


    if (!list) {
        return;
    }


    list.innerHTML = "";


    if (
        game.eggs.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-state">

                🥚 Geen eieren.

                <br><br>

                Ga naar Breeding
                om eieren te krijgen.

            </div>

        `;

        return;

    }


    game.eggs.forEach(
        function(egg) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "egg-card";


            const status =
                egg.fertile
                    ? "🟢 Fertile"
                    : "🔴 Infertile";


            const remaining =
                Math.max(
                    0,
                    egg.monthsRemaining
                );


            card.innerHTML = `

                <h3>
                    🥚 ${egg.species}
                </h3>

                <p>
                    🧬 Morph:
                    ${egg.morph}
                </p>

                <p>
                    ${status}
                </p>

                <p>
                    ⏳ Nog:
                    ${remaining}
                    maand(en)
                </p>

                <p>
                    Totale incubatie:
                    ${egg.incubationMonths}
                    maand(en)
                </p>

            `;


            list.appendChild(card);

        }
    );

}


/* =========================================================
   NEXT MONTH
========================================================= */

function nextMonth() {

    /*
       Maand vooruit
    */

    game.month++;


    /*
       Dag wordt eerste dag
       van nieuwe maand.
    */

    game.day = 1;


    /*
       Dieren ouder maken
    */

    game.animals.forEach(
        function(animal) {

            animal.ageMonths++;

            animal.ageDays =
                animal.ageMonths *
                DAYS_PER_MONTH;


            animal.isAdult =
                animal.ageMonths >=
                getAdultAge(
                    animal.species
                );


            /*
               Cooldown
            */

            if (
                animal.breedingCooldown > 0
            ) {

                animal.breedingCooldown--;

            }


            /*
               Kleine verzorgingsverandering
            */

            animal.foodLevel =
                Math.max(
                    0,
                    animal.foodLevel - 5
                );

            animal.waterLevel =
                Math.max(
                    0,
                    animal.waterLevel - 5
                );


            /*
               Gezondheid
            */

            if (
                animal.foodLevel < 30 ||
                animal.waterLevel < 30
            ) {

                animal.health =
                    Math.max(
                        0,
                        animal.health - 5
                    );

            }

        }
    );


    /*
       Eieren verwerken
    */

    processEggs();


    saveGame();

    updateUI();

    renderFinalAnimals();

    renderMonthlyEggs();

    renderAnimalShop();

    renderBreedingPage();


    alert(

        `📅 Maand ${game.month}\n\n` +

        `Alle dieren zijn 1 maand ouder geworden.`

    );

}


/* =========================================================
   EGG PROCESSING
========================================================= */

function processEggs() {

    const babies = [];


    game.eggs.forEach(
        function(egg) {

            if (
                !egg.fertile
            ) {

                return;

            }


            egg.monthsRemaining--;


            if (
                egg.monthsRemaining <= 0
            ) {

                babies.push(
                    egg
                );

            }

        }
    );


    /*
       Verwijder eieren die klaar zijn
    */

    game.eggs =
        game.eggs.filter(
            function(egg) {

                return (
                    !babies.includes(egg)
                );

            }
        );


    /*
       Hatch
    */

    babies.forEach(
        function(egg) {

            hatchEgg(
                egg
            );

        }
    );

}


/* =========================================================
   HATCH EGG
========================================================= */

function hatchEgg(egg) {

    const gender =
        randomGender();


    /*
       Kleine kans op slechte hatch
    */

    const hatchSuccess =
        Math.random() < 0.92;


    if (!hatchSuccess) {

        alert(

            `🥚 Een ${egg.species} ei ` +
            `heeft helaas niet succesvol ` +
            `kunnen uitkomen.`

        );

        return;

    }


    const baby =
        createAnimal(
            egg.species,
            egg.morph,
            gender,
            0
        );


    baby.parents =
        egg.parents || [];


    game.animals.push(
        baby
    );


    game.statistics.animalsBorn++;


    saveGame();

}


/* =========================================================
   MARKET
========================================================= */

function renderMarket() {

    const list =
        document.getElementById(
            "marketList"
        );


    if (!list) {
        return;
    }


    list.innerHTML = "";


    if (
        game.animals.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-state">

                🦎 Je hebt geen dieren om te verkopen.

            </div>

        `;

        return;

    }


    game.animals.forEach(
        function(animal) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "animal-card";


            const basePrice =
                SPECIES[
                    animal.species
                ]?.price || 100;


            let value =
                Math.round(
                    basePrice * 0.60
                );


            /*
               Zeldzame morphs
               zijn meer waard.
            */

            if (
                animal.morph !== "Normal"
            ) {

                value *= 2;

            }


            if (
                animal.isAdult
            ) {

                value *= 1.25;

            }


            value =
                Math.round(value);


            card.innerHTML = `

                <h3>
                    🦎 ${animal.name}
                </h3>

                <p>
                    ${animal.species}
                </p>

                <p>
                    🧬 ${animal.morph}
                </p>

                <p>
                    💰 Waarde:
                    €${value}
                </p>

                <button
                    type="button"
                    onclick="sellAnimal(${animal.id})"
                >
                    💰 Verkopen
                </button>

            `;


            list.appendChild(card);

        }
    );

}


/* =========================================================
   SELL ANIMAL
========================================================= */

function sellAnimal(id) {

    const index =
        game.animals.findIndex(
            function(animal) {

                return (
                    Number(animal.id) ===
                    Number(id)
                );

            }
        );


    if (index === -1) {
        return;
    }


    const animal =
        game.animals[index];


    const basePrice =
        SPECIES[
            animal.species
        ]?.price || 100;


    let value =
        Math.round(
            basePrice * 0.60
        );


    if (
        animal.morph !== "Normal"
    ) {

        value *= 2;

    }


    if (
        animal.isAdult
    ) {

        value *= 1.25;

    }


    value =
        Math.round(value);


    game.money +=
        value;


    game.statistics.animalsSold++;

    game.statistics.moneyEarned +=
        value;


    game.animals.splice(
        index,
        1
    );


    saveGame();

    updateUI();

    renderFinalAnimals();

    renderMarket();


    alert(

        `💰 Dier verkocht!\n\n` +

        `${animal.name}\n\n` +

        `+€${value}`

    );

}


/* =========================================================
   STATISTICS
========================================================= */

function renderStatistics() {

    const born =
        document.getElementById(
            "animalsBorn"
        );


    const eggs =
        document.getElementById(
            "eggsLaid"
        );


    const sold =
        document.getElementById(
            "animalsSold"
        );


    const earned =
        document.getElementById(
            "moneyEarned"
        );


    if (born) {

        born.textContent =
            game.statistics.animalsBorn;

    }


    if (eggs) {

        eggs.textContent =
            game.statistics.eggsLaid;

    }


    if (sold) {

        sold.textContent =
            game.statistics.animalsSold;

    }


    if (earned) {

        earned.textContent =
            game.statistics.moneyEarned;

    }

}


/* =========================================================
   UPDATE ALL UI
========================================================= */

function updateUI() {

    const animalCount =
        game.animals.length;


    const eggCount =
        game.eggs.length;


    const elements = {

        day:
            document.getElementById(
                "day"
            ),

        month:
            document.getElementById(
                "month"
            ),

        money:
            document.getElementById(
                "money"
            ),

        animalCount:
            document.getElementById(
                "animalCount"
            ),

        eggCount:
            document.getElementById(
                "eggCount"
            ),

        homeDay:
            document.getElementById(
                "homeDay"
            ),

        homeMonth:
            document.getElementById(
                "homeMonth"
            ),

        homeMoney:
            document.getElementById(
                "homeMoney"
            ),

        homeAnimalCount:
            document.getElementById(
                "homeAnimalCount"
            ),

        homeEggCount:
            document.getElementById(
                "homeEggCount"
            ),

        shopMoney:
            document.getElementById(
                "shopMoney"
            )

    };


    if (elements.day)
        elements.day.textContent =
            game.day;


    if (elements.month)
        elements.month.textContent =
            game.month;


    if (elements.money)
        elements.money.textContent =
            game.money;


    if (elements.animalCount)
        elements.animalCount.textContent =
            animalCount;


    if (elements.eggCount)
        elements.eggCount.textContent =
            eggCount;


    if (elements.homeDay)
        elements.homeDay.textContent =
            game.day;


    if (elements.homeMonth)
        elements.homeMonth.textContent =
            game.month;


    if (elements.homeMoney)
        elements.homeMoney.textContent =
            game.money;


    if (elements.homeAnimalCount)
        elements.homeAnimalCount.textContent =
            animalCount;


    if (elements.homeEggCount)
        elements.homeEggCount.textContent =
            eggCount;


    if (elements.shopMoney)
        elements.shopMoney.textContent =
            game.money;


    renderStatistics();

}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function openPage(pageName) {

    const pages =
        document.querySelectorAll(
            ".page"
        );


    pages.forEach(
        function(page) {

            page.classList.remove(
                "active"
            );

            page.style.display =
                "none";

        }
    );


    const selected =
        document.getElementById(
            pageName
        );


    if (!selected) {

        console.error(
            "Page not found:",
            pageName
        );

        return;

    }


    selected.classList.add(
        "active"
    );


    selected.style.display =
        "block";


    if (
        pageName === "home"
    ) {

        updateUI();

    }


    if (
        pageName === "animals"
    ) {

        renderFinalAnimals();

    }


    if (
        pageName === "shop"
    ) {

        renderAnimalShop();

    }


    if (
        pageName === "breeding"
    ) {

        renderBreedingPage();

    }


    if (
        pageName === "incubator"
    ) {

        renderMonthlyEggs();

    }


    if (
        pageName === "market"
    ) {

        renderMarket();

    }


    if (
        pageName === "statistics"
    ) {

        renderStatistics();

    }

}


/* =========================================================
   HOME NEXT MONTH BUTTON
========================================================= */

function goNextMonth() {

    nextMonth();

}


/* =========================================================
   BACKWARDS COMPATIBILITY
========================================================= */

function nextDay() {

    nextMonth();

}


function updateFinalUI() {

    updateUI();

}


function saveGameFinal() {

    saveGame();

}


function renderIncubators() {

    renderMonthlyEggs();

}


function renderMarket() {

    const list =
        document.getElementById(
            "marketList"
        );

    if (!list) {
        return;
    }


    list.innerHTML = "";


    if (
        game.animals.length === 0
    ) {

        list.innerHTML = `

            <div class="empty-state">

                🦎 Geen dieren beschikbaar.

            </div>

        `;

        return;

    }


    game.animals.forEach(
        function(animal) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "animal-card";


            const base =
                SPECIES[
                    animal.species
                ]?.price || 100;


            let price =
                Math.round(
                    base * 0.6
                );


            if (
                animal.morph !== "Normal"
            ) {

                price *= 2;

            }


            price =
                Math.round(price);


            card.innerHTML = `

                <h3>
                    🦎 ${animal.name}
                </h3>

                <p>
                    ${animal.species}
                </p>

                <p>
                    🧬 ${animal.morph}
                </p>

                <p>
                    💰 €${price}
                </p>

                <button
                    type="button"
                    onclick="sellAnimal(${animal.id})"
                >
                    💰 Verkopen
                </button>

            `;


            list.appendChild(card);

        }
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadGame();

        updateUI();

        renderAnimalShop();

        renderFinalAnimals();

        renderMonthlyEggs();

        renderStatistics();

        openPage("home");


        console.log(
            "🦎 Reptile Breeding Simulation loaded!"
        );

        console.log(
            "Animals:",
            game.animals.length
        );

        console.log(
            "Money:",
            game.money
        );

    }
);
