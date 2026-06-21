/**
 * dice-engine.js
 * ------------------------------------------------------------
 * Lógica pura del "Campeonato de Dados".
 * Es la traducción directa de las reglas del script original en
 * Python (usuario_victorias, cpu_victorias, ronda, random.randint).
 * No toca el DOM: solo calcula y guarda el estado del torneo.
 * ------------------------------------------------------------
 */

const DiceEngine = (function () {
  const VICTORIES_TO_WIN = 3; // igual que "while usuario_victorias < 3 and cpu_victorias < 3"

  // Rangos de la CPU según dificultad. El usuario SIEMPRE lanza 1-6.
  const DIFFICULTIES = {
    facil: { min: 1, max: 6 },
    medio: { min: 2, max: 6 },
    dificil: { min: 3, max: 6 },
  };

  let difficulty = "facil";

  let state = {
    userWins: 0,
    cpuWins: 0,
    round: 1,
    winner: null, // null | "user" | "cpu"
  };

  /** Cambia la dificultad (solo afecta el rango de los dados de la CPU). */
  function setDifficulty(level) {
    if (DIFFICULTIES[level]) {
      difficulty = level;
    }
  }

  function getDifficulty() {
    return difficulty;
  }

  /** Lanza un dado entre min y max. Por defecto, equivalente a random.randint(1, 6). */
  function rollDie(min = 1, max = 6) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /** Lanza un par de dados dentro de un rango y devuelve [dado1, dado2]. */
  function rollPair(min = 1, max = 6) {
    return [rollDie(min, max), rollDie(min, max)];
  }

  /**
   * Juega una ronda completa: lanza 2 dados para el usuario y 2 para
   * la CPU, compara totales y actualiza el marcador del torneo.
   * Devuelve toda la información que la interfaz necesita para
   * mostrar el resultado, sin que este archivo sepa nada de HTML.
   */
  function playRound() {
    if (state.winner) {
      return { type: "tournament-over", winner: state.winner };
    }

    const userDice = rollPair(1, 6); // el usuario siempre lanza del 1 al 6
    const cpuRange = DIFFICULTIES[difficulty];
    const cpuDice = rollPair(cpuRange.min, cpuRange.max);
    const userTotal = userDice[0] + userDice[1];
    const cpuTotal = cpuDice[0] + cpuDice[1];

    let roundWinner; // "user" | "cpu" | "tie"
    if (userTotal > cpuTotal) {
      state.userWins += 1;
      roundWinner = "user";
    } else if (cpuTotal > userTotal) {
      state.cpuWins += 1;
      roundWinner = "cpu";
    } else {
      roundWinner = "tie";
    }

    let tournamentWinner = null;
    if (state.userWins >= VICTORIES_TO_WIN) {
      tournamentWinner = "user";
      state.winner = "user";
    } else if (state.cpuWins >= VICTORIES_TO_WIN) {
      tournamentWinner = "cpu";
      state.winner = "cpu";
    }

    const playedRound = state.round;
    if (!tournamentWinner) {
      state.round += 1;
    }

    return {
      type: "round-result",
      round: playedRound,
      userDice,
      cpuDice,
      userTotal,
      cpuTotal,
      roundWinner,
      tournamentWinner,
    };
  }

  function resetTournament() {
    state = { userWins: 0, cpuWins: 0, round: 1, winner: null };
  }

  function getState() {
    return { ...JSON.parse(JSON.stringify(state)), difficulty };
  }

  return {
    VICTORIES_TO_WIN,
    DIFFICULTIES,
    setDifficulty,
    getDifficulty,
    playRound,
    resetTournament,
    getState,
  };
})();
