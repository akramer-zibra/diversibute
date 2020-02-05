var expect = require("chai").expect;
var mockery = require("mockery");

beforeEach(function() {
    mockery.enable({
        warnOnReplace: true,
        warnOnUnregistered: true,
        useCleanCache: true
    });

    mockery.registerAllowable('../index');
    mockery.registerAllowables(['@petsinho/geneticjs', 
                                'lodash', 
                                'util', 
                                './src/genetic-algorithm/seed', 
                                '../helpers/shuffle', 
                                './src/genetic-algorithm/fitness', 
                                './src/genetic-algorithm/mutation', 
                                './src/genetic-algorithm/crossover']);

});

afterEach(function() {
    mockery.disable();
});

// module API test
describe("Module API", function() {
    describe("Monte Carlo function", function() {
        it("Works with medium sized example", function(done) {
          
            // Load input data
            mockery.registerAllowable('../examples/data/3features/input-m.json');
            var input = require('../examples/data/3features/input-m.json');

            // Source under test
            var api = require("../index");

            // Run api
            api.monteCarlo(input, 5).then(result => {

                // Check response object
                expect(result).to.be.an('object').has.all.keys('combination', 'score');
                done();
            });
        });
    });

    describe("Genetic Algorithm function", function() {
        it("Works with medium sized example", function(done) {
            
            // Load input data
            mockery.registerAllowable('../examples/data/3features/input-m.json');
            var input = require('../examples/data/3features/input-m.json');

            // Source under test
            var api = require("../index");

            // Run api
            api.genetic(input, 5).then(result => {

                // Check response object
                expect(result).to.be.an('object').has.all.keys('combination', 'score', 'options');
                done();
            });
        });
        
        it("Works with custom options", function(done) {
            
            // Load input data
            mockery.registerAllowable('../examples/data/3features/input-m.json');
            var input = require('../examples/data/3features/input-m.json');

            // Source under test
            var api = require("../index");

            // Define some custom options 
            var options = {
                populationStartSize: 40, 
                populationMaxSize: 200, 
                evolutions: 300
            };

            // Run api
            api.genetic(input, 5, options).then(result => {

                // Check response object and returned options
                expect(result.options).to.deep.equal(options);
                done();
            });
        });
    });

    describe("kmeans function", function() {
        it("Throws error because it is not implemented yet", function() {
            
            // Source under test
            var moduleApi = require("../index");

            // Fitness function should throw error in case of missing context
            expect(function() { moduleApi.kmeans([], 5)}).to.throw('This is not running well yet');
        });
    });
  });