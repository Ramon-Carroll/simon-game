document.addEventListener("DOMContentLoaded", function() {
    var lightSeq = []; //To keep track of Simon's light sequence
    var playerSelections = []; //To keep track of each light that the player clicked while trying to complete a sequence. Used to compare agains lightSeq
    var aLightIsOn = false; //To keep player from being able to click a light while another one is on
    var seqIsPlaying = false; //To keep player from being able to click a light while simon's sequence is playing.
    var strictIsOn = false; // If strict is on, a single error causes game to start over.

    function updateSteps() {
        document.getElementById("steps").innerHTML = "Steps: " + lightSeq.length;
    }

    updateSteps();

    function addLight() {
        var randomChoice = Math.floor((Math.random() * 4) + 1);
        switch (randomChoice) {
            case 1:
                randomChoice = "green-button";
                break;
            case 2:
                randomChoice = "red-button";
                break;
            case 3:
                randomChoice = "yellow-button";
                break;
            case 4:
                randomChoice = "blue-button";
        }
        lightSeq.push(randomChoice);
        updateSteps();
    }

    function demoLight(id) {
        var lightButton = document.getElementById(id);
        lightButton.classList.add(lightButton.dataset.glowclass);
        lightButton.childNodes[1].play();
        aLightIsOn = true;
        setTimeout(function() {
            lightButton.classList.remove(lightButton.dataset.glowclass);
            aLightIsOn = false;
        }, 500);
    }

    function playSeq() {
        var lightIndex = 0;

        function continueSeq() {
            if (lightIndex < lightSeq.length) {
                seqIsPlaying = true;
                setTimeout(function() {
                    demoLight(lightSeq[lightIndex]);
                    lightIndex += 1;
                }, 1000);
                setTimeout(function() {
                    continueSeq();
                }, 1000);

            }
            else {
                seqIsPlaying = false;
                return;
            }
        }
        continueSeq();
    }

    function checkForMatch() {
        var playerColors = playerSelections.toString();
        var simonColorsToCompare = lightSeq.slice(0, playerSelections.length).toString();
        if (playerColors === simonColorsToCompare) {
            if (playerSelections.length === lightSeq.length) {
                if (lightSeq.length === 20) {
                    document.getElementById("steps").innerHTML = "20 steps! You win! Restarting...";
                    setTimeout(function() {
                        document.location = document.location.href;
                    }, 3000);
                }
                else {
                    var simon = document.getElementById("simon");
                    seqIsPlaying = true;
                    simon.classList.add("simon-says-right");
                    setTimeout(function() {
                        simon.classList.remove("simon-says-right");
                    }, 500);
                    setTimeout(function() {
                        playerSelections = [];
                        addLight();
                        playSeq();
                    }, 2000);
                }
            }
        }
        else if (strictIsOn) {
            var simon = document.getElementById("simon");
            document.body.classList.add("animated", "shake");
            simon.classList.add("simon-says-wrong");
            setTimeout(function() {
                document.getElementById("steps").innerHTML = "Failed. Restarting...";
                document.body.classList.remove("animated", "shake");
                simon.classList.remove("simon-says-wrong");
            }, 500);
            setTimeout(function() {
                playerSelections = [];
                lightSeq = [];
                addLight();
                playSeq();
            }, 2000);

        }
        else {
            seqIsPlaying = true;
            var simon = document.getElementById("simon");
            document.body.classList.add("animated", "shake");
            simon.classList.add("simon-says-wrong");
            setTimeout(function() {
                document.body.classList.remove("animated", "shake");
                simon.classList.remove("simon-says-wrong");
            }, 500);
            setTimeout(function() {
                playerSelections = [];
                playSeq();
            }, 1000);
        }
    }

    document.getElementById("start-button").addEventListener("click", function() {
        (function() {
            var colorButtons = document.getElementsByClassName("color-button");
            for (var i = 0; i < colorButtons.length; i++) {
                colorButtons[i].addEventListener("click", function() {
                    if (!aLightIsOn && !seqIsPlaying) {
                        demoLight(this.id);
                        playerSelections.push(this.id);
                        checkForMatch();
                    }
                });
            }
        }());
        this.innerHTML = "Restart";
        lightSeq = [];
        addLight();
        playSeq();
    });

    document.getElementById("strict-button").addEventListener("click", function() {
        this.classList.toggle("strict-on");
        if (strictIsOn) {
            strictIsOn = false;
        }
        else {
            strictIsOn = true;
        }
    });

    document.addEventListener("keyup", function(event) { //A little cheat. Press 'a' in order to reveal, in the console, the complete sequence that Simon is currently working with in memory.
        if (event.keyCode === 65) {
            console.log(lightSeq);
        }
    });

});
