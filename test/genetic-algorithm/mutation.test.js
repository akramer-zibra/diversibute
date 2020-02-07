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
    it("mutates with default settings", function() {

        // Dummy chromosome data
        var chromosome = {seq: [1,1,2,2,3,3,4,4]};

        // Source under test
        var mutation = require("../../src/genetic-algorithm/mutation");

        // Use mutation function
        var mutated = mutation(chromosome);

        expect(chromosome).to.not.deep.equal(mutated);
    });

    it("mutates with 100percent shuffle probability", function() {

        // Dummy chromosome data
        var chromosome = {seq: [1,1,2,2,3,3,4,4]};

        // Source under test
        var mutation = require("../../src/genetic-algorithm/mutation");

        // Use mutation function
        var mutated = mutation(chromosome, {shuffleQuota: 1.0, twistQuota: 0});

        expect(chromosome).to.not.deep.equal(mutated);
    });

    it("mutates with 100percent twist probability", function() {

        // Dummy chromosome data
        var chromosome = {seq: [1,1,2,2,3,3,4,4]};

        // Source under test
        var mutation = require("../../src/genetic-algorithm/mutation");

        // Use mutation function
        var mutated = mutation(chromosome, {shuffleQuota: 0, twistQuota: 1.0});

        expect(chromosome).to.not.deep.equal(mutated);
    });
});