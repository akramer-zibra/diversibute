/**
 * This is a factory Method for functions of the genetic algorithm
 * 
 * @param {Bottle} bottle BottleJS instance
 */
module.exports = {

    /**
     * This function registers necessary function dependencies for genetic algorithm
     */
    register: (bottle) => {

        // Load genetic algorithm functions
        bottle.constant('seed', require('./seed'));
        bottle.constant('fitness', require('./fitness'));
        bottle.constant('mutation', require('./mutation'));
        bottle.constant('crossover', require('./crossover'));
    }
}