"use strict";

/* =========================================================
   REPTILE BREEDING SIMULATION
========================================================= */

const SAVE_KEY = "reptile_breeding_simulation_v2";
const DAYS_PER_MONTH = 28;


/* =========================================================
   SPECIES
========================================================= */

const SPECIES = {

    "Ball Python": {
        basePrice: 150,
        incubation: [1, 2],
        adultAge: 30,
        morphs: {
            Normal: 1,
            Pastel: 1.5,
            Mojave: 1.7,
            Banana: 2,
            Enchi: 1.5,
            Spider: 1.8,
            Albino: 2.5,
            Pied: 3,
            Clown: 3.5,
            Axanthic: 3,
            "Albino Pied": 5,
            "Pastel Pied": 4
        }
    },

    "Leopard Gecko": {
        basePrice: 100,
        incubation: [1, 2],
        adultAge: 12,
        morphs: {
            Normal: 1,
            Tangerine: 1.5,
            "Mack Snow": 1.7,
            Eclipse: 2,
            Blizzard: 2,
            Patternless: 2,
            Albino: 2,
            "Mack Snow Albino": 3,
            "Tangerine Eclipse": 3
        }
    },

    "Corn Snake": {
        basePrice: 120,
        incubation: [1, 3],
        adultAge: 24,
        morphs: {
            Normal: 1,
            Amelanistic: 1.5,
            Anery: 1.5,
            Snow: 2,
            Hypo: 1.7,
            Motley: 1.5,
            Stripe: 1.5,
            Tessera: 2
        }
    },

    "Bearded Dragon": {
        basePrice: 200,
        incubation: [2, 3],
        adultAge: 18,
        morphs: {
            Normal: 1,
            Hypo: 1.5,
            Translucent: 2,
            Leatherback: 2,
            Dunner: 2,
            Witblits: 3,
            "Hypo Translucent": 3,
            "Leatherback Hypo": 3
        }
    },

    "Crested Gecko": {
        basePrice: 180,
        incubation: [1, 3],
        adultAge: 12,
        morphs: {
            Normal: 1,
            Flame: 1.4,
            Harlequin: 1.6,
            Dalmatian: 1.8,
            Pinstripe: 2,
            "Lilly White": 3,
            "Lilly White Flame": 4,
            "Dalmatian Harlequin": 3
        }
    },

    "Gargoyle Gecko": {
        basePrice: 220,
        incubation: [1, 3],
        adultAge: 15,
        morphs: {
            Normal: 1,
            "Orange Stripe": 1.8,
            "Red Stripe": 2,
            Reticulated: 1.8,
            "Orange Reticulated": 2.5
        }
    },

    "African Fat-Tailed Gecko": {
        basePrice: 170,
        incubation: [1, 2],
        adultAge: 12,
        morphs: {
            Normal: 1,
            Albino: 2,
            Oreo: 2.5,
            Patternless: 2,
            Whiteout: 3,
            "Whiteout Oreo": 4
        }
    },

    "Reticulated Python": {
        basePrice: 600,
        incubation: [2, 4],
        adultAge: 36,
        morphs: {
            Normal: 1,
            Albino: 2.5,
            Tiger: 1.8,
            Lavender: 3,
            Motley: 1.8,
            "Albino Tiger": 4,
            "Lavender Albino": 5
        }
    },

    "Green Anaconda": {
        basePrice: 700,
        incubation: [2, 4],
        adultAge: 36,
        morphs: {
            Normal: 1,
            "High Yellow": 1.8,
            "Blue Line": 2.5
        }
    },

    "Red-Eared Slider": {
        basePrice: 150,
        incubation: [2, 4],
        adultAge: 24,
        morphs: {
            Normal: 1,
            Hypo: 2,
            "Pastel Green": 2
        }
    },

    "Panther Chameleon": {
        basePrice: 350,
        incubation: [2, 4],
        adultAge: 12,
        morphs: {
            Normal: 1,
            Blue: 1.7,
            Red: 1.8,
            Green: 1.4,
            Yellow: 1.5,
            "Blue Bar": 2,
            "Red Bar": 2
        }
    },

    "Veiled Chameleon": {
        basePrice: 250,
        incubation: [1, 3],
        adultAge: 12,
        morphs: {
            Normal: 1,
            Turquoise: 1.7,
            Yellow: 1.5,
            Blue: 2,
            "High Yellow": 1.8
        }
    },

    "Jackson's Chameleon": {
        basePrice: 300,
        incubation: [2, 4],
        adultAge: 12,
        morphs: {
            Normal: 1,
            Green: 1.3,
            Blue: 2,
            Yellow: 1.7
        }
    }

};


/* =========================================================
   GAME
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

let selectedMale = null;
let selectedFemale = null;


/* =========================================================
   BASIC HELPERS
========================================================= */

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function genderText(gender) {
    return gender === "Male" ? "♂️ Male" : "♀️ Female";
}

function adultAge(species) {
    return SPECIES[species].adultAge;
}


/* =========================================================
   SAVE / LOAD
========================================================= */

function saveGame() {
    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(game)
    );
}

function loadGame() {

    const saved =
        localStorage.getItem(SAVE_KEY);

    if (!saved) return;

    try {

        const data = JSON.parse(saved);

        game.money = data.money ?? 1000;
        game.day = data.day ?? 1;
        game.month = data.month ?? 1;
        game.animals = data.animals ?? [];
        game.eggs = data.eggs ?? [];

        game.statistics =
            data.statistics ?? {
                animalsBorn: 0,
                eggsLaid: 0,
                animalsSold: 0,
                moneyEarned: 0
            };

    } catch (error) {

        console.error(error);

    }
}


/* =========================================================
   ANIMAL
========================================================= */

function createAnimal(
    species,
    morph,
    gender,
    age,
    quality
) {

    return {

        id:
            Date.now() +
            Math.random(),

        species,
        morph,
        gender,

        ageMonths: age,

        ageDays:
            age * DAYS_PER_MONTH,

        quality,

        health: quality,

        breedingCooldown: 0,

        isAdult:
            age >= adultAge(species)

    };
}


/* =========================================================
   PRICE
========================================================= */

function calculatePrice(
    species,
    morph,
    age,
    quality
) {

    const data =
        SPECIES[species];

    let price =
        data.basePrice;

    /*
       Morph
    */

    price *=
        data.morphs[morph] || 1;


    /*
       Leeftijd

       Baby = goedkoper
       Volwassen = duurder
    */

    if (age < 3) {

        price *= 0.65;

    } else if (
        age < adultAge(species)
    ) {

        price *= 0.85;

    } else {

        price *= 1.15;

    }


    /*
       Kwaliteit

       50% = goedkoop
       100% = duurder
    */

    price *=
        0.5 +
        quality / 100;


    return Math.max(
        10,
        Math.round(price)
    );
}


/* =========================================================
   SHOP UI
========================================================= */

function renderShop() {

    const shop =
        document.getElementById(
            "shopList"
        );

    if (!shop) return;

    shop.innerHTML = "";


    Object.keys(SPECIES).forEach(
        species => {

            const data =
                SPECIES[species];

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "shop-card";


            const morphs =
                Object.keys(
                    data.morphs
                );


            card.innerHTML = `

                <h3>🦎 ${species}</h3>

                <label>
                    🧬 Morph:
                    <select
                        id="morph-${safeId(species)}"
                    >
                        ${morphs.map(
                            morph =>
                            `<option value="${escapeHTML(morph)}">
                                ${morph}
                            </option>`
                        ).join("")}
                    </select>
                </label>

                <br>

                <label>
                    ⚧️ Geslacht:
                    <select
                        id="gender-${safeId(species)}"
                    >
                        <option value="Male">
                            ♂️ Male
                        </option>
                        <option value="Female">
                            ♀️ Female
                        </option>
                    </select>
                </label>

                <br>

                <label>
                    📅 Leeftijd:
                    <select
                        id="age-${safeId(species)}"
                    >
                        ${ageOptions(species)}
                    </select>
                </label>

                <br>

                <label>
                    ⭐ Kwaliteit:
                    <input
                        id="quality-${safeId(species)}"
                        type="range"
                        min="50"
                        max="100"
                        value="80"
                        oninput="
                            updateShopPrice('${escapeJS(species)}')
                        "
                    >

                    <b id="quality-value-${safeId(species)}">
                        80%
                    </b>
                </label>

                <div
                    id="price-${safeId(species)}"
                    class="shop-price"
                >
                    💰 Prijs berekenen...
                </div>

                <button
                    type="button"
                    onclick="
                        buyFromShop('${escapeJS(species)}')
                    "
                >
                    🛒 Kopen
                </button>

            `;

            shop.appendChild(card);

            updateShopPrice(species);

        }
    );

}


function ageOptions(species) {

    const max =
        adultAge(species) + 12;

    let html = "";

    for (
        let age = 0;
        age <= max;
        age++
    ) {

        html += `
            <option value="${age}">
                ${age} maand${age === 1 ? "" : "en"}
            </option>
        `;

    }

    return html;
}


/* =========================================================
   SHOP PRICE LIVE UPDATE
========================================================= */

function updateShopPrice(species) {

    const id =
        safeId(species);

    const morph =
        document.getElementById(
            `morph-${id}`
        )?.value || "Normal";

    const age =
        Number(
            document.getElementById(
                `age-${id}`
            )?.value || 0
        );

    const quality =
        Number(
            document.getElementById(
                `quality-${id}`
            )?.value || 80
        );


    const price =
        calculatePrice(
            species,
            morph,
            age,
            quality
        );


    const priceElement =
        document.getElementById(
            `price-${id}`
        );

    if (priceElement) {

        priceElement.innerHTML =
            `💰 <strong>€${price}</strong>`;

    }


    const qualityElement =
        document.getElementById(
            `quality-value-${id}`
        );

    if (qualityElement) {

        qualityElement.textContent =
            `${quality}%`;

    }

}


/* =========================================================
   BUY FROM SHOP
========================================================= */

function buyFromShop(species) {

    const id =
        safeId(species);

    const morph =
        document.getElementById(
            `morph-${id}`
        ).value;

    const gender =
        document.getElementById(
            `gender-${id}`
        ).value;

    const age =
        Number(
            document.getElementById(
                `age-${id}`
            ).value
        );

    const quality =
        Number(
            document.getElementById(
                `quality-${id}`
            ).value
        );


    const price =
        calculatePrice(
            species,
            morph,
            age,
            quality
        );


    if (
        game.money < price
    ) {

        alert(
            `❌ Niet genoeg geld!\n\n` +
            `Prijs: €${price}\n` +
            `Je geld: €${game.money}`
        );

        return;

    }


    const animal =
        createAnimal(
            species,
            morph,
            gender,
            age,
            quality
        );


    game.money -= price;

    game.animals.push(
        animal
    );


    saveGame();

    updateEverything();


    alert(

        `🦎 Dier gekocht!\n\n` +

        `${species}\n` +

        `🧬 ${morph}\n` +

        `${genderText(gender)}\n` +

        `📅 ${age} maanden oud\n` +

        `⭐ Kwaliteit: ${quality}%\n\n` +

        `💰 Betaald: €${price}`

    );

}


/* =========================================================
   ANIMALS
========================================================= */

function renderAnimals() {

    const list =
        document.getElementById(
            "animalList"
        );

    if (!list) return;

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
        animal => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "animal-card";


            card.innerHTML = `

                <h3>
                    🦎 ${animal.species}
                </h3>

                <p>
                    🧬 ${animal.morph}
                </p>

                <p>
                    ${genderText(animal.gender)}
                </p>

                <p>
                    📅 ${animal.ageMonths}
                    maanden
                </p>

                <p>
                    ⭐ Kwaliteit:
                    ${animal.quality}%
                </p>

                <p>
                    ❤️ Gezondheid:
                    ${animal.health}%
                </p>

                <p>
                    ${
                        animal.isAdult
                        ? "🟢 Volwassen"
                        : "🐣 Jong"
                    }
                </p>

                <button
                    type="button"
                    onclick="
                        openAnimalModal(${animal.id})
                    "
                >
                    🔍 Details
                </button>

            `;

            list.appendChild(card);

        }
    );

}


/* =========================================================
   MODAL
========================================================= */

function openAnimalModal(id) {

    const animal =
        game.animals.find(
            a =>
            Number(a.id) ===
            Number(id)
        );

    if (!animal) return;


    const modal =
        document.getElementById(
            "animalModal"
        );

    const details =
        document.getElementById(
            "animalDetails"
        );


    if (!modal || !details)
        return;


    details.innerHTML = `

        <h2>
            🦎 ${animal.species}
        </h2>

        <p>
            🧬 Morph:
            ${animal.morph}
        </p>

        <p>
            ${genderText(animal.gender)}
        </p>

        <p>
            📅 Leeftijd:
            ${animal.ageMonths} maanden
        </p>

        <p>
            ⭐ Kwaliteit:
            ${animal.quality}%
        </p>

        <p>
            ❤️ Gezondheid:
            ${animal.health}%
        </p>

        <p>
            ${
                animal.isAdult
                ? "🟢 Volwassen"
                : "🐣 Jong"
            }
        </p>

    `;


    modal.classList.remove(
        "hidden"
    );

}


function closeAnimalModal() {

    document
        .getElementById(
            "animalModal"
        )
        ?.classList.add(
            "hidden"
        );

}


/* =========================================================
   BREEDING
========================================================= */

function renderBreeding() {

    const list =
        document.getElementById(
            "breedingAnimals"
        );

    if (!list) return;

    list.innerHTML = "";


    const adults =
        game.animals.filter(
            animal =>
                animal.isAdult &&
                animal.health > 0 &&
                animal.breedingCooldown <= 0
        );


    if (
        adults.length === 0
    ) {

        list.innerHTML = `
            <div class="empty-state">
                🧬 Geen volwassen dieren
                beschikbaar voor breeding.
            </div>
        `;

        return;

    }


    adults.forEach(
        animal => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "animal-card";


            card.innerHTML = `

                <h3>
                    ${
                        animal.gender === "Male"
                        ? "♂️"
                        : "♀️"
                    }
                    ${animal.species}
                </h3>

                <p>
                    🧬 ${animal.morph}
                </p>

                <p>
                    📅 ${animal.ageMonths}
                    maanden
                </p>

                <button
                    type="button"
                    onclick="
                        selectParent(${animal.id})
                    "
                >
                    Selecteren
                </button>

            `;

            list.appendChild(card);

        }
    );


    updateParents();

}


function selectParent(id) {

    const animal =
        game.animals.find(
            a =>
            Number(a.id) ===
            Number(id)
        );

    if (!animal) return;


    if (!animal.isAdult) {

        alert(
            "❌ Dit dier is nog niet volwassen."
        );

        return;

    }


    if (
        animal.gender === "Male"
    ) {

        selectedMale =
            animal;

    } else {

        selectedFemale =
            animal;

    }


    updateParents();

}


function updateParents() {

    const male =
        document.getElementById(
            "maleSelection"
        );

    const female =
        document.getElementById(
            "femaleSelection"
        );


    if (male) {

        male.innerHTML =
            selectedMale

            ? `
                <h3>
                    ♂️ ${selectedMale.species}
                </h3>

                <p>
                    🧬 ${selectedMale.morph}
                </p>

                <p>
                    ${selectedMale.ageMonths}
                    maanden
                </p>
            `

            : "<p>Kies een mannetje.</p>";

    }


    if (female) {

        female.innerHTML =
            selectedFemale

            ? `
                <h3>
                    ♀️ ${selectedFemale.species}
                </h3>

                <p>
                    🧬 ${selectedFemale.morph}
                </p>

                <p>
                    ${selectedFemale.ageMonths}
                    maanden
                </p>
            `

            : "<p>Kies een vrouwtje.</p>";

    }


    const button =
        document.getElementById(
            "breedButton"
        );


    if (button) {

        button.disabled =
            !(
                selectedMale &&
                selectedFemale
            );

    }

}


/* =========================================================
   BREED
========================================================= */

function startBreeding() {

    if (
        !selectedMale ||
        !selectedFemale
    ) {

        alert(
            "❌ Kies een mannetje en vrouwtje."
        );

        return;

    }


    if (
        selectedMale.species !==
        selectedFemale.species
    ) {

        alert(
            "❌ Verschillende soorten kunnen niet samen fokken."
        );

        return;

    }


    const species =
        selectedMale.species;


    const morph =
        breedingMorph(
            selectedMale,
            selectedFemale
        );


    const eggCount =
        random(1, 4);


    const incubation =
        random(
            SPECIES[species].incubation[0],
            SPECIES[species].incubation[1]
        );


    let fertile =
        0;


    for (
        let i = 0;
        i < eggCount;
        i++
    ) {

        const isFertile =
            Math.random() < 0.9;


        if (isFertile)
            fertile++;


        game.eggs.push({

            id:
                Date.now() +
                Math.random(),

            species,

            morph,

            fertile:
                isFertile,

            incubationMonths:
                incubation,

            monthsRemaining:
                incubation,

            ready:
                false,

            laidMonth:
                game.month

        });

    }


    game.statistics.eggsLaid +=
        eggCount;


    selectedMale.breedingCooldown =
        2;

    selectedFemale.breedingCooldown =
        2;


    selectedMale = null;
    selectedFemale = null;


    saveGame();

    updateEverything();


    alert(

        `🥚 Breeding succesvol!\n\n` +

        `🥚 Eieren: ${eggCount}\n` +

        `🟢 Fertile: ${fertile}\n` +

        `🔴 Infertile: ${
            eggCount - fertile
        }\n\n` +

        `🧬 Morph: ${morph}\n` +

        `⏳ Incubatie: ${incubation} maand(en)\n\n` +

        `Je moet de eieren zelf hatchen zodra ze klaar zijn.`

    );

}


/* =========================================================
   SIMPLE GENETICS
========================================================= */

function breedingMorph(
    father,
    mother
) {

    const species =
        SPECIES[
            father.species
        ];

    const fatherMorph =
        father.morph;

    const motherMorph =
        mother.morph;


    if (
        fatherMorph ===
        motherMorph
    ) {

        if (
            Math.random() < 0.75
        ) {

            return fatherMorph;

        }

    }


    if (
        fatherMorph !== "Normal" &&
        Math.random() < 0.5
    ) {

        return fatherMorph;

    }


    if (
        motherMorph !== "Normal" &&
        Math.random() < 0.5
    ) {

        return motherMorph;

    }


    /*
       Soms een combinatie
       als die bestaat.
    */

    const combo =
        `${fatherMorph} ${motherMorph}`;


    if (
        species.morphs[combo] &&
        Math.random() < 0.25
    ) {

        return combo;

    }


    return "Normal";

}


/* =========================================================
   INCUBATOR
========================================================= */

function renderIncubator() {

    const list =
        document.getElementById(
            "eggList"
        );

    if (!list) return;

    list.innerHTML = "";


    if (
        game.eggs.length === 0
    ) {

        list.innerHTML = `
            <div class="empty-state">
                🥚 Geen eieren in de incubator.
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


            if (
                !egg.fertile
            ) {

                card.innerHTML = `

                    <h3>
                        🥚 ${egg.species}
                    </h3>

                    <p>
                        🧬 ${egg.morph}
                    </p>

                    <p>
                        🔴 Infertile
                    </p>

                    <p>
                        Dit ei zal niet uitkomen.
                    </p>

                `;

                list.appendChild(card);

                return;

            }


            if (
                egg.monthsRemaining <= 0
            ) {

                egg.ready = true;


                card.innerHTML = `

                    <h3>
                        🥚 ${egg.species}
                    </h3>

                    <p>
                        🧬 ${egg.morph}
                    </p>

                    <p>
                        🟢 Klaar om uit te komen!
                    </p>

                    <button
                        type="button"
                        onclick="
                            hatchEgg(${egg.id})
                        "
                    >
                        🐣 HATCH EGG
                    </button>

                `;

            } else {

                card.innerHTML = `

                    <h3>
                        🥚 ${egg.species}
                    </h3>

                    <p>
                        🧬 ${egg.morph}
                    </p>

                    <p>
                        🟢 Fertile
                    </p>

                    <p>
                        ⏳ Nog
                        <strong>
                            ${egg.monthsRemaining}
                        </strong>
                        maand(en)
                    </p>

                `;

            }


            list.appendChild(card);

        }
    );

}


/* =========================================================
   HATCH EGG MANUALLY
========================================================= */

function hatchEgg(id) {

    const index =
        game.eggs.findIndex(
            egg =>
            Number(egg.id) ===
            Number(id)
        );


    if (index === -1) return;


    const egg =
        game.eggs[index];


    if (!egg.fertile) {

        alert(
            "❌ Dit ei is infertile."
        );

        return;

    }


    if (
        egg.monthsRemaining > 0
    ) {

        alert(
            `⏳ Dit ei moet nog ` +
            `${egg.monthsRemaining} maand(en) incuberen.`
        );

        return;

    }


    /*
       Kleine kans op hatch failure
    */

    const survived =
        Math.random() < 0.92;


    game.eggs.splice(
        index,
        1
    );


    if (!survived) {

        saveGame();

        updateEverything();


        alert(
            "🥚 Het ei is klaar, maar het jong heeft het helaas niet gehaald."
        );

        return;

    }


    const baby =
        createAnimal(
            egg.species,
            egg.morph,
            Math.random() < 0.5
                ? "Male"
                : "Female",
            0,
            random(70, 100)
        );


    game.animals.push(
        baby
    );


    game.statistics.animalsBorn++;


    saveGame();

    updateEverything();


    alert(

        `🐣 HATCHED!\n\n` +

        `${egg.species}\n` +

        `🧬 ${egg.morph}\n` +

        `${genderText(baby.gender)}\n` +

        `📅 0 maanden oud\n` +

        `⭐ Kwaliteit: ${baby.quality}%`

    );

}


/* =========================================================
   NEXT MONTH
========================================================= */

function nextMonth() {

    game.month++;

    game.day = 1;


    /*
       Animals age
    */

    game.animals.forEach(
        animal => {

            animal.ageMonths++;

            animal.ageDays =
                animal.ageMonths *
                DAYS_PER_MONTH;


            animal.isAdult =
                animal.ageMonths >=
                adultAge(
                    animal.species
                );


            if (
                animal.breedingCooldown > 0
            ) {

                animal.breedingCooldown--;

            }

        }
    );


    /*
       Eggs progress
    */

    game.eggs.forEach(
        egg => {

            if (
                !egg.fertile
            ) return;


            if (
                egg.monthsRemaining > 0
            ) {

                egg.monthsRemaining--;

            }


            if (
                egg.monthsRemaining <= 0
            ) {

                egg.monthsRemaining = 0;

                egg.ready = true;

            }

        }
    );


    saveGame();

    updateEverything();


    alert(
        `📅 Maand ${game.month}\n\n` +
        `Je dieren zijn 1 maand ouder.\n` +
        `Kijk bij de Incubator of eieren klaar zijn.`
    );

}


/* =========================================================
   MARKET / SELL
========================================================= */

function sellAnimal(id) {

    const index =
        game.animals.findIndex(
            animal =>
            Number(animal.id) ===
            Number(id)
        );


    if (index === -1)
        return;


    const animal =
        game.animals[index];


    const price =
        Math.round(
            calculatePrice(
                animal.species,
                animal.morph,
                animal.ageMonths,
                animal.quality
            ) * 0.6
        );


    game.animals.splice(
        index,
        1
    );


    game.money += price;

    game.statistics.animalsSold++;

    game.statistics.moneyEarned +=
        price;


    saveGame();

    updateEverything();


    alert(
        `💰 ${animal.species} verkocht!\n\n` +
        `+€${price}`
    );

}


/* =========================================================
   OPTIONAL MARKET PAGE
========================================================= */

function renderMarket() {

    const list =
        document.getElementById(
            "marketList"
        );

    if (!list) return;

    list.innerHTML = "";


    game.animals.forEach(
        animal => {

            const value =
                Math.round(
                    calculatePrice(
                        animal.species,
                        animal.morph,
                        animal.ageMonths,
                        animal.quality
                    ) * 0.6
                );


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "animal-card";


            card.innerHTML = `

                <h3>
                    🦎 ${animal.species}
                </h3>

                <p>
                    🧬 ${animal.morph}
                </p>

                <p>
                    ${genderText(animal.gender)}
                </p>

                <p>
                    ⭐ ${animal.quality}%
                </p>

                <p>
                    💰 €${value}
                </p>

                <button
                    type="button"
                    onclick="
                        sellAnimal(${animal.id})
                    "
                >
                    💰 Verkopen
                </button>

            `;


            list.appendChild(card);

        }
    );

}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function showPage(page) {

    const pages =
        document.querySelectorAll(
            ".page"
        );


    pages.forEach(
        p => {

            p.classList.remove(
                "active"
            );

            p.style.display =
                "none";

        }
    );


    const target =
        document.getElementById(
            page
        );


    if (!target) {

        console.error(
            "Page bestaat niet:",
            page
        );

        return;

    }


    target.classList.add(
        "active"
    );

    target.style.display =
        "block";


    if (
        page === "home"
    )
        updateUI();


    if (
        page === "animals"
    )
        renderAnimals();


    if (
        page === "shop"
    )
        renderShop();


    if (
        page === "breeding"
    )
        renderBreeding();


    if (
        page === "incubator"
    )
        renderIncubator();

}


/* =========================================================
   UI
========================================================= */

function updateUI() {

    const values = {

        day: game.day,

        month: game.month,

        money: game.money,

        animalCount:
            game.animals.length,

        eggCount:
            game.eggs.length,

        homeDay:
            game.day,

        homeMonth:
            game.month,

        homeMoney:
            game.money,

        homeAnimalCount:
            game.animals.length,

        homeEggCount:
            game.eggs.length

    };


    Object.entries(values)
        .forEach(
            ([id, value]) => {

                const element =
                    document.getElementById(
                        id
                    );

                if (element)
                    element.textContent =
                        value;

            }
        );

}


/* =========================================================
   UPDATE EVERYTHING
========================================================= */

function updateEverything() {

    updateUI();

    renderAnimals();

    renderShop();

    renderBreeding();

    renderIncubator();

    renderMarket();

}


/* =========================================================
   UTILS
========================================================= */

function safeId(text) {

    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");

}

function escapeHTML(text) {

    return String(text)
        .replace(
            /[&<>"']/g,
            char => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            })[char]
        );

}

function escapeJS(text) {

    return String(text)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


/* =========================================================
   COMPATIBILITY
========================================================= */

function nextDay() {

    nextMonth();

}


/* =========================================================
   START GAME
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadGame();

        updateEverything();

        showPage("home");

        console.log(
            "🦎 Reptile Breeding Simulation loaded!"
        );

    }
);
