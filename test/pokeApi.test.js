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
            pokemonEvolutionTerm.val("Pikachu").trigger("input");
            expect(pokemonEvolutionButton.prop("disabled")).toBe(false);
        });

        it("should be disabled when the search field is blank", () => {
            pokemonEvolutionTerm.val("").trigger("input");
            expect(pokemonEvolutionButton.prop("disabled")).toBe(true);
        });
    });

    describe("Pokemon Description Search Button api call", () => {
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

            it("should populate the pokemon description with an image when the pokemon description button is clicked", () => {
                
                it("should trigger a pokeApi call for a pokemon and its description when clicked", () => {
                    expect(request.url).toBe("https://pokeapi.co/api/v2/pokemon-species/393");
                });

                it("should trigger a pokeApi call for a pokemon and its description when clicked", () => {
                    expect(request.url).toBe("http://pokeapi.co/api/v2/evolution-chain/1");
                });

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
    });

    describe("Pokemon Description Button Error Throwing", () => {
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

        it("should throw an error to the screen when the user inputs an incorrect pokemon name or number", () => {
            request.respondWith({
                data: {
                    status: 404
                }
            });

            beforeEach(() => {
                request = jasmine.Ajax.requests.mostRecent();    
            });

            it("should not throw an error on the getJSON call to find the pokemon", () => {
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

    describe("Pokemon Evolution Button api call", () => {
        var request;

        beforeEach(() => {
            jasmine.Ajax.install();

            $("#pokemon-evolution-term").val("67");
            $("#pokemon-evolution-button").click();

            request = jasmine.Ajax.requests.mostRecent();
        });

        afterEach(() => {
            jasmine.Ajax.uninstall();
        });

        it("should trigger a pokeApi call for pokemon evolution chain when clicked", () => {
            expect(request.url).toBe("http://pokeapi.co/api/v2/evolution-chain/67");
        });

        it("return the names of all the pokemon in the evolution", () => {
        
            request.respondWith({
                status: 200,
                data: {
                    chain: {
                        species: {
                            name: "eevee"
                        }
                    }
                },
                chain: {
                    evolves_to: [
                        {
                            species: {
                                name: "vaporeon"
                            }   
                        },
                        {
                            species: {
                                name: "jolteon"
                            }
                        },
                        {
                            species: {
                                name: "flareon"
                            }
                        },
                        {
                            species: {
                                name: "espeon"
                            }
                        },
                        {
                            species: {
                                name: "umbreon"
                            }
                        },
                        {
                            species: {
                                name: "leafeon"
                            }
                        },
                        {
                            species: {
                                name: "glaceon"
                            }
                        },
                        {
                            species: {
                                name: "sylveon"
                            }
                        },
                    ]
                }
            });

            beforeEach(() => {
                request = jasmine.Ajax.requests.mostRecent();    
            });
            it("should trigger a pokeApi call for a pokemon's evolution chain when clicked", () => {

                expect($(".pokemon-evolution-result-container").children().length).toBe(0);

                request.respondWith({
                    status: 200,
                    data: {
                        id: 133,
                        sprites: {
                            front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png"
                        }
                    }
                });
                expect($("#133").prop('src')).toBe(
                    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png"
                );
                expect($(".pokemon-evolution-result-container").children().length).toBe(0);

            });

            it("should trigger a pokeApi call for a pokemon's evolution chain when clicked", () => {

                expect($(".pokemon-evolution-result-container").children()).toBe(0);

                request.respondWith({
                    status: 200,
                    data: {
                        id: 134,
                        sprites: {
                            front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/134.png"
                        }
                    }
                });
            });

            it("should trigger a pokeApi call for a pokemon's evolution chain when clicked", () => {

                request.respondWith({
                    status: 200,
                    data: {
                        id: 135,
                        sprites: {
                            front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/135.png"
                        }
                    }
                });
            });

            it("should trigger a pokeApi call for a pokemon's evolution chain when clicked", () => {

                request.respondWith({
                    status: 200,
                    data: {
                        id: 136,
                        sprites: {
                            front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/136.png"
                        }
                    }
                });
            });

            it("should trigger a pokeApi call for a pokemon's evolution chain when clicked", () => {

                request.respondWith({
                    status: 200,
                    data: {
                        id: 196,
                        sprites: {
                            front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/196.png"
                        }
                    }
                });
            });

            it("should trigger a pokeApi call for a pokemon's evolution chain when clicked", () => {

                request.respondWith({
                    status: 200,
                    data: {
                        id: 197,
                        sprites: {
                            front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/197.png"
                        }
                    }
                });
            });

            it("should trigger a pokeApi call for a pokemon's evolution chain when clicked", () => {

                request.respondWith({
                    status: 200,
                    data: {
                        id: 470,
                        sprites: {
                            front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/470.png"
                        }
                    }
                });
            });

            it("should trigger a pokeApi call for a pokemon's evolution chain when clicked", () => {

                request.respondWith({
                    status: 200,
                    data: {
                        id: 471,
                        sprites: {
                            front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/471.png"
                        }
                    }
                });
            });

            it("should trigger a pokeApi call for a pokemon's evolution chain when clicked", () => {

                request.respondWith({
                    status: 200,
                    data: {
                        id: 700,
                        sprites: {
                            front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/700.png"
                        }
                    }
                });
                expect($(".pokemon-evolution-result-container").children().length).toBe(9);
            });
        });
    });
});
