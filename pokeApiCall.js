"use strict";

(() => {
    window.RandomPokemonSearchController = {
        init: () => {
            let randomPokemonButton = $("#random-pokemon-button");
            let randomPokemonDescription = $("#random-pokemon-description");

            let getRandomPokemonIndex = () => {
                return Math.floor(Math.random() * 802);
            };

            let randomPokeIndex = getRandomPokemonIndex();

            randomPokemonButton.click(() =>
                $.getJSON("http://pokeapi.co/api/v2/pokemon/" + randomPokeIndex,
                function(data){
                    randomPokeIndex = getRandomPokemonIndex();
                    randomPokemonDescription.text(
                        "You got " + data.name + "! " + "Enter the Pokemon's name below, " +
                        "or enter the name of a Pokemon you already know to get more information!"
                    );
                }) 
            );
        }
    };

    window.PokemonDescriptionSearchController = {
        init: () => {

            let pokemonDescriptionButton = $("#pokemon-description-button");
            let pokemonDescriptionTerm = $("#pokemon-description-term");
            let pokemonDescriptionImage = $("#pokemon-description-image");
            let pokemonDescription = $("#pokemon-description");
            let pokemonDescriptionErrorMessage = $("#pokemon-description-error-message");

            let flavorText;
            let sprite;

            let populatePokemonDescription = (pokeId, textToChange, sprite) => {
                $.getJSON("https://pokeapi.co/api/v2/pokemon-species/" + pokeId,
                    function(data){
                        let returnedDescription = data.flavor_text_entries;
                        for (let i = 0; i < returnedDescription.length; i++) {
                            // The pokeApi sometimes returns Japanese or Chinese before getting to English, so to ensure 
                            // english is always returned, I have to chech the text for English characters.
                            if (returnedDescription[i].flavor_text.match(/^(?=.*[A-Z0-9])[\w.,!"’'\/$ é][\s\S]+$/ig)) {
                                flavorText = returnedDescription[i].flavor_text;
                                break;
                            }
                        }
                    }).done(() => {
                        pokemonDescriptionImage.attr("src", sprite);
                        $(textToChange).text(flavorText);
                    }).fail(() => {
                        pokemonDescriptionErrorMessage.text(
                            "It seems there was an error looking for your pokemon. Please try again."
                        );
                    });
            };
            
            pokemonDescriptionButton.click(() =>
                $.getJSON("http://pokeapi.co/api/v2/pokemon/" + pokemonDescriptionTerm.val().toLowerCase(),  
                function(data){
                    sprite = data.sprites.front_default;
                    populatePokemonDescription(data.id, pokemonDescription, sprite);
                }).done(() =>{
                    pokemonDescriptionErrorMessage.empty();
                }).fail(() => {
                    pokemonDescriptionErrorMessage.text(
                        "Incorrect usage. Please enter the name or number of a Pokemon. " +
                        "Be sure the name is spelled correctly or " + 
                        "the number you entered is below 802"
                    );
                })
            );
            pokemonDescriptionTerm.bind("input", () => 
                pokemonDescriptionButton.prop("disabled", !pokemonDescriptionTerm.val()));
        }
    };

    window.PokemonEvolutionSearchController = {
        init: () => {

            let pokemonEvolutionButton = $('#pokemon-evolution-button');
            let pokemonEvolutionTerm = $('#pokemon-evolution-term');
            let pokemonEvolutionResultContainer = $(".pokemon-evolution-result-container");
            let pokemonEvolutionErrorMessage = $("#pokemon-evolution-error-message");

            let pokemonNames = [];

            let populatePokemonEvolution = () => {
                for (let i = 0; i < pokemonNames.length; i++) {
                    $.getJSON("http://pokeapi.co/api/v2/pokemon/" + pokemonNames[i],
                        function(data) {
                            pokemonEvolutionResultContainer.append($(' <div> ', {id: data.id}));
                            $("#" + data.id).append($(
                                '<img>', {class: 'pokemon-evolution-image', src: data.sprites.front_default}
                            ));
                            $("#" + data.id).append($(
                                '<p>', {class: 'pokemon-evolution-name text-center', text: data.name}
                            ));
                            pokemonEvolutionResultContainer.children().sort(function(a, b){
                                return a.id - b.id;
                            }).each(function () {
                                var elem = $(this);
                                elem.remove();
                                $(elem).appendTo(".pokemon-evolution-result-container");
                            });   
                        }).fail(() => {
                            pokemonEvolutionErrorMessage.text(
                                "It seems there was an error looking for your pokemon. Please try again."
                            );
                        });
                }
            };

            pokemonEvolutionButton.click(() =>
                $.getJSON("http://pokeapi.co/api/v2/evolution-chain/" + pokemonEvolutionTerm.val(),
                function(data){
                    pokemonEvolutionResultContainer.empty().append();
                    pokemonNames = [];
                    // The pokeApi returns the names in the pokemon evolution chain in a strange way,
                    // where some names are nested further than others, so to handle this nesting, I
                    // use the following code.
                    pokemonNames.push(data.chain.species.name);
                    if (data.chain.evolves_to){
                        for (let i = 0; i < data.chain.evolves_to.length; i++){
                            pokemonNames.push(data.chain.evolves_to[i].species.name);
                            if (data.chain.evolves_to[i].evolves_to) {
                                for (let j = 0; j < data.chain.evolves_to[i].evolves_to.length; j++) {
                                    pokemonNames.push(data.chain.evolves_to[i].evolves_to[j].species.name);
                                }
                            }
                        }
                    }
                }).done(() => {
                    pokemonEvolutionErrorMessage.empty();
                    populatePokemonEvolution();
                }).fail(() => {  
                    pokemonEvolutionErrorMessage.text("Incorrect usage. Please enter a number below 424.");
                })
            );
            
            pokemonEvolutionTerm.bind("input", () => 
                pokemonEvolutionButton.prop("disabled", !pokemonEvolutionTerm.val()));
        }
    };
})();