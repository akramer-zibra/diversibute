var expect = require("chai").expect;
var mockery = require("mockery");

beforeEach(function() {
    mockery.enable({
        warnOnReplace: true,
        warnOnUnregistered: true,
        useCleanCache: true
    });

    mockery.registerAllowable('../index');
    mockery.registerAllowables(['../helpers/difference', '../helpers/counter', 'js-combinatorics', 'euclidean-distance', './squared', '../constraints/chromosome']);
});

afterEach(function() {
    mockery.disable();
});

// module API test
describe("Module API", function() {
    describe("Monte Carlo function", function() {
        it("Works with simple example", function() {
          
            throw new Error('TODO');
        });
    });

    describe("Genetic Algorithm function", function() {
        it("Works with simple example", function() {
            
            throw new Error('TODO');
        });
    });

    describe("kmeans function", function() {
        it("Works with simple example", function() {
            
            // Source under test
            var moduleApi = require("../index");

            // Fitness function should throw error in case of missing context
            expect(moduleApi.kmeans([], 5)).to.throw('error');
        });
    });
  });