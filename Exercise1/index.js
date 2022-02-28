const prompts = require('prompts');

// rooms
class Rooms {
    constructor(name, description, doors, enemies) {
        this.name = name;
        this.description = description;
        this.doors = doors;
        this.enemies = enemies;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getDoors() {
        return this.doors;
    }

    getEnemies() {
        return this.enemies;
    }

}

theDangeonEntrance = new Rooms('theDangeonEntrance', 'You are in the Dangeon Entrance', ['hallway'], {});
hallway = new Rooms('hallway', 'You are in the hallway', ['chamber', 'sewer'], {
    name: 'Sewer Rat',
    hitpoints: 2,
    attackDamage: 1,
    chanceOfAttackHits: 50
});
chamber = new Rooms('chamber', 'You are in the chamber', ['portal'], {
    name: 'Giant Dragon',
    hitpoints: 4,
    attackDamage: 8,
    chanceOfAttackHits: 90
});
portal = new Rooms('portal', 'You are at the portal', [], {});

// Player
class Player {
    constructor(name, hitpoints, attackDamage, chanceOfAttackHits) {
        this.name = name;
        this.hitpoints = hitpoints;
        this.attackDamage = attackDamage;
        this.chanceOfAttackHits = chanceOfAttackHits;
    }

    getName() {
        return this.name;
    }

    getHitpoints() {
        return this.hitpoints;
    }


    getAttackDamage() {
        return this.attackDamage;
    }

    getChanceOfAttackHits() {
        return this.chanceOfAttackHits;
    }

    lookAround() {
        console.log('You look around');
    }
    goToRoom(room) {
        console.log(room.getName());
    }
    attack(enemy) {
        console.log('You attack ' + enemy.getName());
        let attackSuccess = Math.random();
        if (attackSuccess <= this.getChanceOfAttackHits()) {
            enemy.hitpoints -= this.getAttackDamage();
            console.log('You hit ' + enemy.getName() + ' for ' + this.getAttackDamage() + ' damage');
        } else {
            console.log('You missed ' + enemy.getName());
        }
        if (enemy.hitpoints <= 0) {
            console.log(enemy.getName() + ' is dead');
        }
    }

}

player1 = new Player('Player1', 10, 2, 75);

async function gameLoop() {
    let continueGame = true;

    // Example set of UI options for the user to select
    const initialActionChoices = [
        { title: 'Look around', value: 'look' },
        { title: 'Go to Room', value: 'goToRoom' },
        { title: 'Attack', value: 'attack' },
        { title: 'Exit game', value: 'exit' }
    ];

    // Show the list of options for the user.
    // The execution does not proceed from here until the user selects an option.
    const response = await prompts({
        type: 'select',
        name: 'value',
        message: 'Choose your action',
        choices: initialActionChoices
    });

    // Deal with the selected value
    console.log('You selected ' + response.value);
    switch (response.value) {
        case 'look':
            console.log('You look around');
            player1.lookAround();
            break;
        case 'goToRoom':
            console.log('You go to a room');
            const roomResponse = await prompts({
                type: 'select',
                name: 'value',
                message: 'Choose a room',
                choices: [
                    { title: 'theDangeonEntrance', value: 'theDangeonEntrance' },
                    { title: 'hallway', value: 'hallway' },
                    { title: 'chamber', value: 'chamber' },
                    { title: 'portal', value: 'portal' }
                ]
            });
            console.log('You selected ' + roomResponse.value);
            switch (roomResponse.value) {
                case 'theDangeonEntrance':
                    console.log('You go to theDangeonEntrance');
                    player1.goToRoom(theDangeonEntrance);
                    break;
                case 'hallway':
                    console.log('You go to hallway');
                    player1.goToRoom(hallway);
                    break;
                case 'chamber':
                    console.log('You go to chamber');
                    player1.goToRoom(chamber);
                    break;
                case 'portal':
                    console.log('You go to portal');
                    player1.goToRoom(portal);
                    break;
            }

            break;
        case 'attack':
            console.log('You attack');
            const enemyResponse = await prompts({
                type: 'select',
                name: 'value',
                message: 'Choose an enemy',
                choices: [
                    { title: 'Sewer Rat', value: 'Sewer Rat' },
                    { title: 'Giant Dragon', value: 'Giant Dragon' }
                ]
            });
            console.log('You selected ' + enemyResponse.value);
            switch (enemyResponse.value) {
                case 'Sewer Rat':
                    console.log('You attack Sewer Rat');
                    player1.attack(hallway.getEnemies());
                    break;
                case 'Giant Dragon':
                    console.log('You attack Giant Dragon');
                    player1.attack(chamber.getEnemies());
                    break;
            }

            break;
        case 'exit':
            console.log('You exit the game');
            continueGame = false;
            break;
        default:
            console.log('You did not select a valid option');
            break;
    }

    // Continue the game loop if the user wants to continue
    if (continueGame) {
        await gameLoop();
    }
}

process.stdout.write('\033c'); // clear screen on windows

console.log('WELCOME TO THE DUNGEONS OF LORD OBJECT ORIENTUS!')
console.log('================================================')
console.log('You walk down the stairs to the dungeons')
gameLoop();