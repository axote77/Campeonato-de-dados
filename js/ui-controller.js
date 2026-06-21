/**
 * ui-controller.js
 * ------------------------------------------------------------
 * Conecta DiceEngine (la lógica) con el DOM.
 * Reproduce la secuencia del programa original en Python:
 * 1) se muestran tus dados de inmediato,
 * 2) aparece "La computadora está lanzando..." con puntos animados
 *    (equivalente a animar_dados()),
 * 3) se revelan los dados de la CPU y el resultado de la ronda.
 * ------------------------------------------------------------
 */

document.addEventListener("DOMContentLoaded", () => {
  const rollBtn = document.getElementById("roll-btn");
  const resetBtn = document.getElementById("reset-btn");
  const message = document.getElementById("message");
  const roundLabel = document.getElementById("round-label");
  const diffButtons = Array.from(document.querySelectorAll(".diff-btn"));
  const difficultyHint = document.getElementById("difficulty-hint");

  const DIFFICULTY_HINTS = {
    facil: "Fácil: la CPU lanza del 1 al 6, igual que tú.",
    medio: "Medio: la CPU lanza del 2 al 6. Tú sigues lanzando del 1 al 6.",
    dificil: "Difícil: la CPU lanza del 3 al 6. Tú sigues lanzando del 1 al 6.",
  };

  const dice = {
    user: [document.getElementById("die-user-1"), document.getElementById("die-user-2")],
    cpu: [document.getElementById("die-cpu-1"), document.getElementById("die-cpu-2")],
  };
  const totals = {
    user: document.getElementById("total-user"),
    cpu: document.getElementById("total-cpu"),
  };
  const scores = {
    user: document.getElementById("score-user"),
    cpu: document.getElementById("score-cpu"),
  };
  const cards = {
    user: document.getElementById("card-user"),
    cpu: document.getElementById("card-cpu"),
  };

  // Construye los 9 "pips" dentro de cada dado una sola vez.
  Object.values(dice).flat().forEach((die) => {
    die.classList.add("is-empty");
    for (let i = 0; i < 9; i++) {
      const pip = document.createElement("span");
      pip.className = "pip";
      die.appendChild(pip);
    }
  });

  function renderDie(dieEl, value) {
    dieEl.classList.remove("is-empty");
    dieEl.dataset.value = value;
    dieEl.classList.remove("is-rolling");
    // Forzar reinicio de la animación aunque se repita el mismo valor.
    void dieEl.offsetWidth;
    dieEl.classList.add("is-rolling");
  }

  function setMessage(text, variant) {
    message.textContent = text;
    message.classList.remove("is-win", "is-lose");
    if (variant) message.classList.add(variant);
  }

  /** Animación de puntos "La computadora está lanzando..." (como animar_dados()). */
  function animateCpuThinking(durationMs, onDone) {
    let dots = 0;
    setMessage("La computadora está lanzando");
    const interval = setInterval(() => {
      dots = (dots % 4) + 1;
      message.textContent = "La computadora está lanzando" + ".".repeat(dots);
    }, durationMs / 4);

    setTimeout(() => {
      clearInterval(interval);
      onDone();
    }, durationMs);
  }

  function updateScoreboard(state) {
    scores.user.textContent = state.userWins;
    scores.cpu.textContent = state.cpuWins;
    roundLabel.textContent = state.winner ? "Torneo terminado" : `Ronda ${state.round}`;
    cards.user.setAttribute("aria-current", String(!state.winner));
    cards.cpu.setAttribute("aria-current", "false");
  }

  function setDifficultyButtonsLocked(locked) {
    diffButtons.forEach((btn) => {
      btn.disabled = locked;
    });
  }

  diffButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const level = btn.dataset.level;
      DiceEngine.setDifficulty(level);

      diffButtons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle("is-active", isActive);
        b.setAttribute("aria-pressed", String(isActive));
      });
      difficultyHint.textContent = DIFFICULTY_HINTS[level];
    });
  });

  rollBtn.addEventListener("click", () => {
    rollBtn.disabled = true;
    setDifficultyButtonsLocked(true); // la dificultad queda fija una vez empieza el torneo

    const result = DiceEngine.playRound();
    if (result.type === "tournament-over") {
      rollBtn.disabled = true;
      return;
    }

    // 1) Mostrar tus dados de inmediato.
    renderDie(dice.user[0], result.userDice[0]);
    renderDie(dice.user[1], result.userDice[1]);
    totals.user.textContent = `Total: ${result.userTotal}`;
    setMessage(`Lanzaste ${result.userDice[0]} y ${result.userDice[1]} (Total: ${result.userTotal}).`);

    // 2) "La computadora está lanzando..." con puntos animados.
    animateCpuThinking(900, () => {
      // 3) Revelar los dados de la CPU y el resultado.
      renderDie(dice.cpu[0], result.cpuDice[0]);
      renderDie(dice.cpu[1], result.cpuDice[1]);
      totals.cpu.textContent = `Total: ${result.cpuTotal}`;

      const state = DiceEngine.getState();
      updateScoreboard(state);

      let roundText;
      if (result.roundWinner === "user") roundText = "¡Ganaste esta ronda!";
      else if (result.roundWinner === "cpu") roundText = "La computadora gana esta ronda.";
      else roundText = "¡Empate en esta ronda!";

      if (result.tournamentWinner === "user") {
        setMessage(`${roundText} 🏆 ¡Felicidades! Ganaste el torneo de dados.`, "is-win");
        rollBtn.disabled = true;
      } else if (result.tournamentWinner === "cpu") {
        setMessage(`${roundText} La computadora ha ganado el torneo. ¡Suerte la próxima!`, "is-lose");
        rollBtn.disabled = true;
      } else {
        setMessage(`${roundText} Marcador: Tú ${state.userWins} - ${state.cpuWins} CPU.`);
        rollBtn.disabled = false;
      }
    });
  });

  resetBtn.addEventListener("click", () => {
    DiceEngine.resetTournament();
    setDifficultyButtonsLocked(false);
    const state = DiceEngine.getState();
    updateScoreboard(state);

    Object.values(dice).flat().forEach((die) => {
      die.classList.add("is-empty");
      die.classList.remove("is-rolling");
      delete die.dataset.value;
    });
    totals.user.textContent = "—";
    totals.cpu.textContent = "—";
    rollBtn.disabled = false;
    setMessage('¡Bienvenido al Campeonato de Dados! Presiona "Lanzar tus dados" para empezar.');
  });

  // Estado inicial
  updateScoreboard(DiceEngine.getState());
});
