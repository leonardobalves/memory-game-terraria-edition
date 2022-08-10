(() => {
    const cards = document.querySelectorAll('.card');
    let primeiraCarta, segundaCarta, tempoInicial, tempoFinal, tempoTotal;
    let existeCartaVirada = false;
    let tabuleiroTravado = false;
    let gameRunning = false;
    let pontuacao = 0;
    let melhorTempo = localStorage.getItem('melhorTempo');

    function inicioJogo() {
        if(gameRunning) {
            return;
        } else {
            gameResetGeral();
            embaralhar();
            setTimeout(() => {
                flipAnimation();
            }, 300);
            setTimeout(() => {
                addClickFlip();
            }, 3000);
            gameRunning = true;
            tempoInicial = new Date().getTime();
        }
    }

    function restartJogo() {
        if(!gameRunning) {
            return;
        } else {
            gameRunning = false;
            gameResetGeral();
            setTimeout(() => {
                inicioJogo();
            }, 1000);
        }
    }

    function flipper() {
        if(tabuleiroTravado) {
            return;
        } else if(this === primeiraCarta) {
            return;
        } else {
            this.classList.add('flipped');
            if (!existeCartaVirada) {
                existeCartaVirada = true;
                primeiraCarta = this;
                return;
            } else {
                segundaCarta = this;
                existeCartaVirada = false;
                cartasIguais();
            }
        }
    }

    function floppler() {
        tabuleiroTravado = true;
        setTimeout(() => {
            primeiraCarta.classList.remove('flipped');
            segundaCarta.classList.remove('flipped');
            destravarTabuleiro();
        }, 1200);
    }

    function destravarTabuleiro() {
        [existeCartaVirada, tabuleiroTravado, primeiraCarta, segundaCarta] = [false, false, null, null];
    }

    function travarCartas() {
        primeiraCarta.removeEventListener('click', flipper);
        segundaCarta.removeEventListener('click', flipper);
        pontuacao += 20;
        setTimeout(() => {
            win();
        }, 500);
    }

    function cartasIguais() {
        if(primeiraCarta.dataset.card === segundaCarta.dataset.card) {
            travarCartas();
        } else {
            floppler();
        }
    }

    function addClickFlip() {
        cards.forEach((card) => {
            card.addEventListener('click', flipper);
        });
    }

    function embaralhar() {
        cards.forEach((card) => {
            let posicaoRandomica = Math.floor(Math.random() * 16);
            card.style.order = posicaoRandomica;
        });
    }

    function flipAnimation() {
        cards.forEach((card) => {
            card.classList.add('flipped');
            setTimeout(() => {
                card.classList.remove('flipped');
            }, 3000);
        });
    }

    function gameResetGeral(){
        cards.forEach((card) => {
            card.removeEventListener('click', flipper);
            card.classList.remove('flipped');
            destravarTabuleiro();
            pontuacao = 0;
        });
    }

    function displayRecorde() {
        if(melhorTempo === null) {
            document.getElementById('div-tempo-recorde').innerHTML = "Melhor tempo: ";
        } else {
            document.getElementById('div-tempo-recorde').innerHTML = "Melhor tempo: " + melhorTempo + " segundos";
        }
    }

    function calcMelhorTempo () {
        if(melhorTempo === null) {
            melhorTempo = 100;
        }
        melhorTempo = parseInt(melhorTempo);
        if(melhorTempo > tempoTotal) {
            melhorTempo = tempoTotal;
            localStorage.setItem('melhorTempo', JSON.stringify(melhorTempo));
        }
    }

    function win() {
        if(pontuacao >= 160) {
            tempoFinal = new Date().getTime();
            tempoTotal = Math.round((tempoFinal - tempoInicial) / 1000);
            alert("VITÓRIA - Conseguiu em: " + tempoTotal + " segundos.");
            calcMelhorTempo();
            tabuleiroTravado = true;
            displayRecorde();
        }
    }

    displayRecorde();

    let playBtn = document.getElementById('btn-start');
    playBtn.addEventListener("click", inicioJogo);

    let restartBtn = document.getElementById('btn-restart');
    restartBtn.addEventListener("click", restartJogo);

})();