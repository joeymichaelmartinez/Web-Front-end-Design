describe("pokeApi Call", () => {
    beforeEach(() => {
        fixture.setBase("test");
        fixture.load("search.fixture.html");
        window.RandomPokemonSearchController.init();
        window.PokemonDescriptionSearchController.init();
        window.PokemonEvolutionSearchController.init();
    });

    afterEach(() => {
        fixture.cleanup();
    });

    it("should start with a disabled search button", () => {
        expect($("#random-pokemon-button").prop("disabled")).toBe(true);
    });

    it("should start with an empty search field", () => {
        expect($("#pokemon-description-term").val()).toBe("");
    });

    it("should start with a disabled search button", () => {
        expect($("#pokemon-description-button").prop("disabled")).toBe(true);
    });

    describe("Pokemon Description Button", () => {
        var pokemonDescriptionTerm;
        var pokemonDescriptionButton;

        beforeEach(() => {
            pokemonDescriptionTerm = $("#pokemon-description-term");
            pokemonDescriptionButton = $("#pokemon-description-button");
        });

        it("should be enabled when the search field is not blank", () => {
            pokemonDescriptionTerm.val("pikachu").trigger("input");
            expect(pokemonDescriptionButton.prop("disabled")).toBe(false);
        });

        it("should be disabled when the search field is blank", () => {
            pokemonDescriptionTerm.val("").trigger("input");
            expect(pokemonDescriptionButton.prop("disabled")).toBe(true);
        });
    });

    it("should start with an empty search field", () => {
        expect($("#pokemon-evolution-term").val()).toBe("");
    });

    it("should start with a disabled search button", () => {
        expect($("#pokemon-evolution-button").prop("disabled")).toBe(true);
    });

    describe("Pokemon Evolution Button", () => {
        var pokemonEvolutionTerm;
        var pokemonEvolutionButton;

        beforeEach(() => {
            pokemonEvolutionTerm = $("#pokemon-evolution-term");
            pokemonEvolutionButton = $("#pokemon-evolution-button");
        });

        it("should be enabled when the search field is not blank", () => {
            // Programmatic changes to elements do not trigger events on their own, so in unit tests
            // we need to trigger those programmatically as well.
            pokemonEvolutionTerm.val("Pikachu").trigger("input");
            expect(pokemonEvolutionButton.prop("disabled")).toBe(false);
        });

        it("should be disabled when the search field is blank", () => {
            pokemonEvolutionTerm.val("").trigger("input");
            expect(pokemonEvolutionButton.prop("disabled")).toBe(true);
        });
    });

    describe("Pokemon Search Button api call", () => {
        var request;

        beforeEach(() => {
            jasmine.Ajax.install();

            $("#pokemon-description-term").val("piplup");
            $("#pokemon-description-button").click();

            request = jasmine.Ajax.requests.mostRecent();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it("should trigger a pokeApi call for a pokemon and its description when clicked", () => {
            expect(request.url).toBe("http://pokeapi.co/api/v2/pokemon/piplup");
        });

        it("should populate the pokemon description when the pokemon description button is clicked", () => {
            

            // To manage size, we supply a mock response that contains _only_ what the app will need. This does mean
            // that we need to revise the mock response if our app starts using more (or different) data.
            request.respondWith({
                status: 200,
                data: {
                    sprites: {
                        front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/393.png"
                    },
                    id: "393"
                }
            });


            beforeEach(() => {
                request = jasmine.Ajax.requests.mostRecent();    
            });

            it("should populate the pokemon description when the pokemon description button is clicked", () => {
                
                expect($("#pokemon-description-image").prop('src')).toBe("");

                request.respondWith({
                    status: 200,
                    data: {
                        flavor_text_entries: [{
                            flavor_text: null 
                        }, 
                        { flavor_text: 
                            "Because it is very proud, it hates accepting food\nfrom people." + 
                            "Its thick down guards it from cold." 
                        }]
                    }
                });
                expect($("#pokemon-description").text()).toBe(
                    "Because it is very proud, it hates accepting food\nfrom people." + 
                    "Its thick down guards it from cold."
                );
                expect($("#pokemon-description-image").prop('src')).toBe(
                    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/393.png'
                );
            });
        });

        it("should throw an error to the screen when the user inputs an incorrect pokemon name or number", () => {
            request.respondWith({
                data: {
                    status: 404
                }
            });

            beforeEach(() => {
                request = jasmine.Ajax.requests.mostRecent();    
            });

            it("should not throw an error on the second getJSON call", () => {
                request.respondWith({
                   
                });
                expect($("#pokemon-description-error-message").text()).toBe(
                    "Incorrect usage. Please enter the name or number of a Pokemon." + 
                    "Be sure the name is spelled correctly or the number you entered is below 802"
                );
            });
        });

        it("should not throw an error to the screen when the user inputs a correct pokemon name or number", () => {
            request.respondWith({
                data: {
                    status: 404
                }
            });

            beforeEach(() => {
                request = jasmine.Ajax.requests.mostRecent();    
            });

            it("should throw an error on the second getJSON call when the pokemon was not found", () => {
                request.respondWith({
                   
                });
                expect($("#pokemon-description-error-message").text()).toBe(
                    "It seems there was an error looking for your pokemon. Please try again."
                );
            });
        });
    });
});
