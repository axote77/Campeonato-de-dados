import random
import time

usuario_victorias = 0
cpu_victorias = 0
ronda = 1

CARAS = {
    1: ["┌─────┐",
        "│     │",
        "│  ●  │",
        "│     │",
        "└─────┘"],
    2: ["┌─────┐",
        "│ ●   │",
        "│     │",
        "│   ● │",
        "└─────┘"],
    3: ["┌─────┐",
        "│ ●   │",
        "│  ●  │",
        "│   ● │",
        "└─────┘"],
    4: ["┌─────┐",
        "│ ● ● │",
        "│     │",
        "│ ● ● │",
        "└─────┘"],
    5: ["┌─────┐",
        "│ ● ● │",
        "│  ●  │",
        "│ ● ● │",
        "└─────┘"],
    6: ["┌─────┐",
        "│ ● ● │",
        "│ ● ● │",
        "│ ● ● │",
        "└─────┘"],
}

def mostrar_dos_dados(val1, val2, etiqueta):
    """Imprime dos dados lado a lado con una etiqueta."""
    cara1 = CARAS[val1]
    cara2 = CARAS[val2]
    print(f"\n  {etiqueta}")
    for linea1, linea2 in zip(cara1, cara2):
        print(f"  {linea1}   {linea2}")

def animar_dados():
    """Animación de dados girando antes de revelar el resultado."""
    print("\n  Tirando", end="", flush=True)
    for _ in range(4):
        time.sleep(0.2)
        print(".", end="", flush=True)
    print()
# ─────────────────────────────────────────────────────────

def registrar_ronda(u1, u2, c1, c2):
    total_u = u1 + u2
    total_c = c1 + c2
    
    if total_u > total_c:
        resultado = "Ganaste Tú"
    elif total_c > total_u:
        resultado = "Ganó la CPU"
    else:
        resultado = "Empate"

    datos_ronda = {
        "total_jugador": total_u,
        "total_computadora": total_c,
        "ganador": resultado
    }
    return datos_ronda


print("¡Bienvenido al Campeonato de Dados!")

# ── Selección de dificultad ────────────────────────────────
# Solo cambia el rango de los dados de la CPU.
# Tú (jugador) SIEMPRE lanzas del 1 al 6, sin importar la dificultad.
print("\nElige la dificultad:")
print("1. Fácil   (la CPU lanza del 1 al 6, igual que tú)")
print("2. Medio   (la CPU lanza del 2 al 6)")
print("3. Difícil (la CPU lanza del 3 al 6)")

dificultad = input("Ingresa el número de dificultad (1/2/3): ")

if dificultad == "2":
    cpu_min, cpu_max = 2, 6
elif dificultad == "3":
    cpu_min, cpu_max = 3, 6
else:
    cpu_min, cpu_max = 1, 6
# ─────────────────────────────────────────────────────────

while usuario_victorias < 3 and cpu_victorias < 3:
    print(f"\n--- RONDA {ronda} ---")
    input("Presiona ENTER para lanzar tus dados...")

    # Lanzamiento del jugador (siempre 1-6, sin importar la dificultad)
    dado1, dado2 = random.randint(1, 6), random.randint(1, 6)
    total_usuario = dado1 + dado2
    mostrar_dos_dados(dado1, dado2, "Tú lanzaste:")          # ← dados visuales
    print(f"  {dado1} y {dado2}  (Total: {total_usuario})")

    # Lanzamiento de la CPU (rango según la dificultad elegida)
    print("\nLa computadora está lanzando...")
    animar_dados()                                            # ← animación
    time.sleep(1)
    cpu1, cpu2 = random.randint(cpu_min, cpu_max), random.randint(cpu_min, cpu_max)
    total_cpu = cpu1 + cpu2
    mostrar_dos_dados(cpu1, cpu2, "Computadora lanzó:")      # ← dados visuales
    print(f"  {cpu1} y {cpu2}  (Total: {total_cpu})")

    # Verificación del ganador de la ronda (sin cambios)
    if total_usuario > total_cpu:
        print("¡Ganaste esta ronda!")
        usuario_victorias += 1
    elif total_cpu > total_usuario:
        print("La computadora gana esta ronda.")
        cpu_victorias += 1
    else:
        print("¡Empate en esta ronda!")

    print(f"MARCADOR: Tú {usuario_victorias} - {cpu_victorias} CPU")
    ronda += 1

print("\n" + "="*30)
if usuario_victorias == 3:
    print("¡Felicidades! Ganaste el torneo de dados.")
else:
    print("La computadora ha ganado el torneo. ¡Suerte la próxima!")
print("="*30)