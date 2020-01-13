/**
 * This function creates two childs by crossover from given two 
 * chromosomes
 */
module.exports = (a, b) => {

    // Get a random split pointer
    // Math.floor(Math.random() * (max - min + 1)) + min;
    var splitPtr = Math.floor(Math.random() * ((a.length - 1) - 1 + 1)) + 1; // @see https://stackoverflow.com/a/1527820

    // Create crossover children
    var child1 = [].concat(a.slice(0, splitPtr), b.slice(splitPtr, b.length));
    var child2 = [].concat(b.slice(0, splitPtr), a.slice(splitPtr, a.length));
    
    // Return both childs
    return [child1, child2];
}