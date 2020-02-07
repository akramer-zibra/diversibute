/**
 * This function creates two childs by crossover from given two
 * chromosomes
 * @param {seq: Array<Number>} a First chromosome
 * @param {seq: Array<Number>} b Second chromosome
 * @returns Array<{seq: Array}>
 */
module.exports = (a, b) => {
  // Get a random split pointer
  // Math.floor(Math.random() * (max - min + 1)) + min;
  var splitPtr = Math.floor(Math.random() * ((a.seq.length - 1) - 1 + 1)) + 1 // @see https://stackoverflow.com/a/1527820
  // NOTE: a's sequence length is always same as b's sequence

  // Split both chromosome's sequences
  var a1 = a.seq.slice(0, splitPtr)
  var a2 = a.seq.slice(splitPtr)

  var b1 = b.seq.slice(0, splitPtr)
  var b2 = b.seq.slice(splitPtr)

  // Create crossover children chromosomes
  var child1 = { seq: [].concat(a1, b2) }
  var child2 = { seq: [].concat(b1, a2) }

  // Return both childs
  return [child1, child2]
}
