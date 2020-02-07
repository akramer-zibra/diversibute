var expect = require("chai").expect;
var mockery = require("mockery");

beforeEach(function() {
    mockery.enable({
        warnOnReplace: true,
        warnOnUnregistered: true,
        useCleanCache: true
    });

    // Allow source under test
    mockery.registerAllowable('../../src/genetic-algorithm/mutation');
    
    // Allow the source's dependencies 
    mockery.registerAllowables(['../helpers/shuffle']);
});

afterEach(function() {
    mockery.disable();
});

describe("Mutation module", function() {
    it("Mutates with default settings", function() {

        // Dummy chromosome data
        var chromosome = {seq: [1,1,2,2,3,3,4,4]};

        // Source under test
        var mutation = require("../../src/genetic-algorithm/mutation");

        // Use mutation function
        var mutated = mutation(chromosome);

        expect(chromosome).to.not.deep.equal(mutated);      // mutated choromosome sequence must be different to initial one
    });

    it("Mutates and keeps its structure", function() {

        // Dummy chromosome data
        var chromosome = {seq: [1,1,2,2,3,3,4,4]};

        // Source under test
        var mutation = require("../../src/genetic-algorithm/mutation");

        // Use mutation function
        var mutated = mutation(chromosome);

        expect(mutated).to.have.own.property('seq');     // mutated chromosome needs a sequence
        expect(mutated.seq).to.be.an('array');           // sequence must be an array
    });

    it("Mutates with 100percent shuffle probability", function() {

        // Dummy chromosome data
        var chromosome = {seq: [1,1,2,2,3,3,4,4]};

        // Source under test
        var mutation = require("../../src/genetic-algorithm/mutation");

        // Use mutation function
        var mutated = mutation(chromosome, {shuffleQuota: 1.0, twistQuota: 0});

        expect(chromosome).to.not.deep.equal(mutated);
    });

    it("Mutates with 100percent twist probability", function() {

        // Dummy chromosome data
        var chromosome = {seq: [1,1,2,2,3,3,4,4]};

        // Source under test
        var mutation = require("../../src/genetic-algorithm/mutation");

        // Use mutation function
        var mutated = mutation(chromosome, {shuffleQuota: 0, twistQuota: 1.0});

        expect(chromosome).to.not.deep.equal(mutated);
    });
});