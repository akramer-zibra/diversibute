var expect = require("chai").expect;
var mockery = require("mockery");

beforeEach(function() {
    mockery.enable({
        warnOnReplace: true,
        warnOnUnregistered: true,
        useCleanCache: true
    });

    mockery.registerAllowable('../../src/genetic-algorithm/fitness');
    mockery.registerAllowables(['../helpers/difference', 
                                '../helpers/counter', 
                                'js-combinatorics', 
                                'euclidean-distance', 
                                './squared', 
                                '../constraints/chromosome']);
});

afterEach(function() {
    mockery.disable();
});

describe("Fitness function", function() {
  describe("Essential calculation", function() {
    it("works with medium size example data", function() {

        // Example input data
        mockery.registerAllowable("../../examples/data/3features/input-m.json");
        var input = require("../../examples/data/3features/input-m.json");

        // Source under test
        var fitness = require("../../src/genetic-algorithm/fitness");

        // Set context for testing
        fitness.context(input, 5);

        // Use score function
        var score = fitness.calc({seq: [4, 2, 5, 3, 4, 1, 3, 1, 4, 2, 1, 4, 5, 5, 5, 1, 1, 5, 3, 2, 2, 2, 1, 3, 3, 4]});

        expect(score).to.be.an('number');
    });
  }); 

  describe("Check necessary prerequesites", function() {
    it("Throws Error if context is missing", function() {
        
        // Source under test
        var fitness = require("../../src/genetic-algorithm/fitness");

        // Fitness function should throw error in case of missing context
        expect(function() {
            fitness.calc({seq: []});
        }).to.throw('Error');
    });

    it("Returns NEGATIVE_INFINITY in case of undefined argument", function() {

        // Source under test
        var fitness = require("../../src/genetic-algorithm/fitness");

        // Configure dummy context
        fitness.context([], []);

        expect(fitness.calc(undefined)).to.equal(Number.NEGATIVE_INFINITY);
    });

    it("Returns NEGATIVE_INFINITY if constraints fail", function() {

        // Register mocks for required modules
        mockery.registerMock('../constraints/chromosome', () => {
            return false;
        });

        // Source under test
        var fitness = require("../../src/genetic-algorithm/fitness");

        // Configure dummy context
        fitness.context([], []);

        expect(fitness.calc({seq: []})).to.equal(Number.NEGATIVE_INFINITY);
    });    
  });
});