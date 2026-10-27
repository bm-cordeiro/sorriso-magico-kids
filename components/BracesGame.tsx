
"use client";

import { useState } from "react";

type BracesGameProps = {
  onComplete: () => void;
  onHome: () => void;
  alreadyEarned: boolean;
};

const COLORS = [
  { name: "Azul", value: "#38bdf8" },
  { name: "Rosa", value: "#f472b6" },
  { name: "Lilás", value: "#a78bfa" },
  { name: "Verde", value: "#4ade80" },
  { name: "Vermelho", value: "#fb7185" },
  { name: "Dourado", value: "#fbbf24" },
];

const TEETH = [
  { x: 90, y: 135, rotate: -24 },
  { x: 145, y: 106, rotate: -16 },
  { x: 205, y: 88, rotate: -8 },
  { x: 265, y: 80, rotate: -3 },
  { x: 325, y: 80, rotate: 3 },
  { x: 385, y: 88, rotate: 8 },
  { x: 445, y: 106, rotate: 16 },
  { x: 500, y: 135, rotate: 24 },
];

export default function BracesGame({
  onComplete,
  onHome,
  alreadyEarned,
}: BracesGameProps) {
  const [brackets, setBrackets] = useState<number[]>([]);
  const [color, setColor] = useState(COLORS[0].value);
  const [finished, setFinished] = useState(false);

  function toggleBracket(index: number) {
    if (finished) return;

    if (brackets.includes(index)) {
      setBrackets((current) =>
        current.filter((item) => item !== index)
      );
      return;
    }

    const next = [...brackets, index];
    setBrackets(next);

    if (next.length === TEETH.length) {
      setFinished(true);

      if (!alreadyEarned) {
        onComplete();
      }
    }
  }

  function restart() {
    setBrackets([]);
    setFinished(false);
    setColor(COLORS[0].value);
  }

  return (
    <main className="mx-auto max-w-5xl">
      <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl">
        <div className="bg-gradient-to-r from-violet-500 via-fuchsia-400 to-pink-400 px-5 py-7 text-white sm:px-8">
          <button
            type="button"
            onClick={onHome}
            className="mb-5 rounded-full bg-white/20 px-4 py-2 text-sm font-bold hover:bg-white/30"
          >
            ← Voltar ao menu
          </button>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-white/80">
                Missão especial
              </p>
              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                Meu primeiro aparelho!
              </h1>
              <p className="mt-2 max-w-xl leading-6 text-white/90">
                Ajude o Dentino a montar seu aparelho. Toque nos
                dentes, coloque os bráquetes e escolha sua cor favorita!
              </p>
            </div>

            <div className="text-7xl" aria-hidden="true">
              🦷
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-8">
          <div className="rounded-3xl bg-gradient-to-b from-sky-50 to-violet-50 p-3 sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-sm font-black text-violet-950">
                SORRISO DO DENTINO
              </span>

              <span className="rounded-full bg-white px-3 py-2 text-sm font-black text-violet-800 shadow-sm">
                {brackets.length}/{TEETH.length} dentes
              </span>
            </div>

            <svg
              viewBox="0 0 600 255"
              className="h-auto w-full overflow-visible"
              role="img"
              aria-label="Arcada dentária ilustrada com aparelho ortodôntico interativo"
            >
              <defs>
                <linearGradient
                  id="gumGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#fda4af" />
                  <stop offset="100%" stopColor="#fb7185" />
                </linearGradient>

                <linearGradient
                  id="toothGradient"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
              </defs>

              {/* Gengiva ilustrada */}
              <path
                d="M48 108 Q300 -15 552 108 L540 153 Q300 80 60 153 Z"
                fill="url(#gumGradient)"
                opacity="0.9"
              />

              {/* Dentes e bráquetes */}
              {TEETH.map((tooth, index) => {
                const placed = brackets.includes(index);

                return (
                  <g
                    key={index}
                    transform={`translate(${tooth.x} ${tooth.y}) rotate(${tooth.rotate})`}
                  >
                    <g
                      onClick={() => toggleBracket(index)}
                      className="cursor-pointer"
                      role="button"
                      aria-label={`Dente ${index + 1}: ${
                        placed
                          ? "bráquete colocado"
                          : "tocar para colocar bráquete"
                      }`}
                    >
                      <path
                        d="M-23 -31 Q-25 -43 -12 -43 L12 -43 Q25 -43 23 -31 L19 17 Q18 32 9 26 L0 14 L-9 26 Q-18 32 -19 17 Z"
                        fill="url(#toothGradient)"
                        stroke={placed ? "#94a3b8" : "#cbd5e1"}
                        strokeWidth="2"
                      />

                      <path
                        d="M-13 -34 Q-11 -39 -5 -38"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />

                      {placed && (
                        <g>
                          {/* Base do bráquete */}
                          <rect
                            x="-12"
                            y="-16"
                            width="24"
                            height="21"
                            rx="4"
                            fill="#cbd5e1"
                            stroke="#64748b"
                            strokeWidth="1.5"
                          />

                          {/* Cor do elástico */}
                          <rect
                            x="-9"
                            y="-13"
                            width="18"
                            height="15"
                            rx="3"
                            fill={color}
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />

                          {/* Detalhe metálico */}
                          <path
                            d="M-6 -8 H6 M0 -12 V1"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />

                          <circle
                            cx="0"
                            cy="-5"
                            r="2"
                            fill="#ffffff"
                          />
                        </g>
                      )}
                    </g>

                    {!placed && (
                      <circle
                        cx="0"
                        cy="-5"
                        r="5"
                        fill="#a78bfa"
                        opacity="0.8"
                        pointerEvents="none"
                      />
                    )}
                  </g>
                );
              })}

              {/* Fio ortodôntico contínuo */}
              <path
                d="M67 130 Q110 112 145 101 Q205 82 265 75 Q325 75 385 83 Q445 101 480 112 Q510 122 523 130"
                fill="none"
                stroke="#64748b"
                strokeWidth="5"
                strokeLinecap="round"
              />

              <path
                d="M67 128 Q110 110 145 99 Q205 80 265 73 Q325 73 385 81 Q445 99 480 110 Q510 120 523 128"
                fill="none"
                stroke="#f8fafc"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Reforça os bráquetes na frente do fio */}
              {TEETH.map((tooth, index) => {
                if (!brackets.includes(index)) return null;

                return (
                  <g
                    key={`front-${index}`}
                    transform={`translate(${tooth.x} ${tooth.y}) rotate(${tooth.rotate})`}
                    pointerEvents="none"
                  >
                    <rect
                      x="-12"
                      y="-16"
                      width="24"
                      height="21"
                      rx="4"
                      fill="#cbd5e1"
                      stroke="#64748b"
                      strokeWidth="1.5"
                    />

                    <rect
                      x="-9"
                      y="-13"
                      width="18"
                      height="15"
                      rx="3"
                      fill={color}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />

                    <path
                      d="M-6 -8 H6 M0 -12 V1"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}
            </svg>

            <p className="mt-2 text-center text-xs leading-5 text-slate-500">
              Toque nos dentes para colocar os bráquetes. Os círculos
              lilás indicam onde você ainda pode tocar.
            </p>
          </div>

          <section className="mt-7">
            <h2 className="text-xl font-black text-slate-900">
              🎨 Escolha a cor dos elásticos
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Experimente as cores e personalize seu sorriso!
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {COLORS.map((item) => {
                const selected = color === item.value;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setColor(item.value)}
                    aria-pressed={selected}
                    className={`flex items-center gap-3 rounded-2xl border-2 p-3 font-bold transition hover:-translate-y-0.5 ${
                      selected
                        ? "border-violet-500 bg-violet-50 ring-2 ring-violet-100"
                        : "border-slate-200 bg-white hover:border-violet-200"
                    }`}
                  >
                    <span
                      className="h-8 w-8 shrink-0 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: item.value }}
                    />

                    <span className="text-slate-800">
                      {item.name}
                    </span>

                    {selected && (
                      <span className="ml-auto text-violet-700">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-7 rounded-3xl bg-slate-50 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-black text-slate-900">
                Seu progresso
              </h2>

              <span className="text-sm font-bold text-violet-800">
                {Math.round(
                  (brackets.length / TEETH.length) * 100
                )}%
              </span>
            </div>

            <div
              className="mt-3 h-4 overflow-hidden rounded-full bg-slate-200"
              role="progressbar"
              aria-label="Progresso da montagem do aparelho"
              aria-valuemin={0}
              aria-valuemax={TEETH.length}
              aria-valuenow={brackets.length}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-400 transition-all duration-300"
                style={{
                  width: `${
                    (brackets.length / TEETH.length) * 100
                  }%`,
                }}
              />
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {finished
                ? "Você completou todos os dentes. Parabéns!"
                : "Continue colocando os bráquetes até completar os oito dentes."}
            </p>
          </section>

          {finished && (
            <section className="mt-7 rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-100 p-6 text-center">
              <div className="animate-bounce text-6xl">
                🏆✨😁
              </div>

              <h2 className="mt-3 text-2xl font-black text-amber-950">
                Uau! Que sorriso incrível!
              </h2>

              <p className="mt-3 leading-7 text-amber-900">
                Você concluiu a montagem do aparelho do Dentino!
                {alreadyEarned
                  ? " As estrelas desta missão já foram conquistadas."
                  : " Você ganhou 10 estrelas!"}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Na vida real, o ortodontista é quem avalia e define
                o aparelho e os ajustes adequados para cada pessoa.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={restart}
                  className="rounded-2xl bg-violet-600 px-5 py-3 font-black text-white hover:bg-violet-700"
                >
                  🔄 Montar outro sorriso
                </button>

                <button
                  type="button"
                  onClick={onHome}
                  className="rounded-2xl bg-white px-5 py-3 font-black text-slate-800 shadow-sm hover:bg-slate-100"
                >
                  🏠 Voltar ao menu
                </button>
              </div>
            </section>
          )}

          {!finished && (
            <button
              type="button"
              onClick={restart}
              className="mt-6 w-full rounded-2xl border-2 border-slate-200 px-5 py-3 font-bold text-slate-600 hover:bg-slate-50"
            >
              Recomeçar a montagem
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
