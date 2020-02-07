var expect = require("chai").expect;
var mockery = require("mockery");

beforeEach(function() {
    mockery.enable({
        warnOnReplace: true,
        warnOnUnregistered: true,
        useCleanCache: true
    });

    // Allow source under test
    mockery.registerAllowable('../../src/genetic-algorithm/crossover');
});

afterEach(function() {
    mockery.disable();
});

describe("Crossover module", function() {
    it("Creates two new children from two given chromosomes", function() {

        // Dummy chromosome data
        var chromosomeA = {seq: [1,1,2,2,3,3,4,4]};
        var chromosomeB = {seq: [4,4,3,3,2,2,1,1]};

        // Source under test
        var crossover = require("../../src/genetic-algorithm/crossover");

        // Use crossover function
        var crossed = crossover(chromosomeA, chromosomeB);

        // CExpect both chrildren are not equal to their parents
        expect(crossed[0]).to.not.deep.equal(chromosomeA);
        expect(crossed[1]).to.not.deep.equal(chromosomeA);
        expect(crossed[0]).to.not.deep.equal(chromosomeB);
        expect(crossed[1]).to.not.deep.equal(chromosomeB);
    });
});