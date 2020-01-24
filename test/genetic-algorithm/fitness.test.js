var expect = require("chai").expect;
var mockery = require("mockery");

beforeEach(function() {
    mockery.enable({
        warnOnReplace: true,
        warnOnUnregistered: true,
        useCleanCache: true
    });

    mockery.registerAllowable('../../src/genetic-algorithm/fitness');
    mockery.registerAllowables(['../helpers/difference', '../helpers/counter', 'js-combinatorics', 'euclidean-distance', './squared', '../constraints/chromosome']);
});

afterEach(function() {
    mockery.disable();
});

describe("Fitness function", function() {
  describe("Check necessary prerequesites", function() {
    it("Throws Error if context is missing", function() {
        
        // Source under test
        var fitness = require("../../src/genetic-algorithm/fitness");

        // Fitness function should throw error in case of missing context
        expect(fitness.func({seq: []})).to.throw('error');
    });

    it("Returns NEGATIVE_INFINITY in case of undefined argument", function() {

        // Source under test
        var fitness = require("../../src/genetic-algorithm/fitness");

        // Configure dummy context
        fitness.context([], []);

        expect(fitness.func(undefined)).to.equal(Number.NEGATIVE_INFINITY);
    });

    it("Returns NEGATIVE_INFINITY if constraints fail", function() {

        // Register mocks for required modules
        mockery.registerMock('../constraints/chromosome', (chromosome, options) => {
            return false;
        });

        // Source under test
        var fitness = require("../../src/genetic-algorithm/fitness");

        // Configure dummy context
        fitness.context([], []);

        expect(fitness.func({seq: []})).to.equal(Number.NEGATIVE_INFINITY);
    });    
  });
  
});