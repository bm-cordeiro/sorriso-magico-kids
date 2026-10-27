
"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

type FlossingGameProps = {
  onComplete: () => void;
  onHome: () => void;
  alreadyEarned: boolean;
};

const W = 1536;
const H = 1024;

// Posições aproximadas dos espaços entre os dentes.
// Ajustaremos conforme a ilustração exibida no jogo.
const SPACES = [
  { x: 250, y: 430 },
  { x: 340, y: 420 },
  { x: 440, y: 415 },
  { x: 540, y: 415 },
  { x: 640, y: 420 },
  { x: 740, y: 425 },
  { x: 840, y: 425 },
  { x: 940, y: 420 },
  { x: 1040, y: 415 },
  { x: 1140, y: 420 },
  { x: 1240, y: 430 },
  { x: 240, y: 635 },
  { x: 330, y: 650 },
  { x: 430, y: 665 },
  { x: 530, y: 685 },
  { x: 630, y: 700 },
  { x: 740, y: 710 },
  { x: 850, y: 705 },
  { x: 960, y: 690 },
  { x: 1060, y: 670 },
  { x: 1160, y: 650 },
  { x: 1260, y: 625 },
];

export default function FlossingGame({
  onComplete,
  onHome,
  alreadyEarned,
}: FlossingGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dirtyImageRef = useRef<HTMLImageElement | null>(null);
  const drawingRef = useRef(false);
  const cleanedRef = useRef<number[]>([]);
  const finishedRef = useRef(false);
  const lastPositionRef = useRef<{ x: number; y: number } | null>(null);

  const [cleaned, setCleaned] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [flossPosition, setFlossPosition] = useState({ x: 50, y: 50 });
  const [showFloss, setShowFloss] = useState(false);

  const progress = Math.round((cleaned.length / SPACES.length) * 100);

  useEffect(() => {
    const image = new Image();

    image.onload = () => {
      dirtyImageRef.current = image;
      restoreDirtyImage();
    };

    image.onerror = () => setImageError(true);
    image.src = "/sorriso-escovacao.png";
  }, []);

  function restoreDirtyImage() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const image = dirtyImageRef.current;

    if (!canvas || !ctx || !image) return;

    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(image, 0, 0, W, H);
  }

  function floss(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx || finishedRef.current) return;

    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = ((event.clientX - rect.left) / rect.width) * W;
    const y = ((event.clientY - rect.top) / rect.height) * H;

    setFlossPosition({
      x: (x / W) * 100,
      y: (y / H) * 100,
    });
    setShowFloss(true);

    // Remove a sujeira ao longo do caminho do fio dental.
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();

    const last = lastPositionRef.current;

    if (last) {
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
    } else {
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0.1, y + 0.1);
    }

    ctx.stroke();
    ctx.globalCompositeOperation = "source-over";

    lastPositionRef.current = { x, y };

    // Registra os espaços interdentais alcançados.
    const newlyCleaned: number[] = [];

    SPACES.forEach((space, index) => {
      const distance = Math.hypot(x - space.x, y - space.y);

      if (
        distance < 45 &&
        !cleanedRef.current.includes(index)
      ) {
        newlyCleaned.push(index);
      }
    });

    if (newlyCleaned.length > 0) {
      const next = [...cleanedRef.current, ...newlyCleaned];
      cleanedRef.current = next;
      setCleaned(next);
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    if (finishedRef.current) return;

    event.preventDefault();
    drawingRef.current = true;
    lastPositionRef.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
    floss(event);
  }

  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current || finishedRef.current) return;

    event.preventDefault();
    floss(event);
  }

  function stopFlossing() {
    drawingRef.current = false;
    lastPositionRef.current = null;
    setShowFloss(false);
  }

  function completeGame() {
    if (
      cleanedRef.current.length < SPACES.length ||
      finishedRef.current
    ) {
      return;
    }

    finishedRef.current = true;
    setFinished(true);

    if (!alreadyEarned) onComplete();
  }

  function restartGame() {
    cleanedRef.current = [];
    finishedRef.current = false;
    drawingRef.current = false;
    lastPositionRef.current = null;

    setCleaned([]);
    setFinished(false);
    setShowFloss(false);

    restoreDirtyImage();
  }

  return (
    <main className="mx-auto max-w-5xl rounded-3xl bg-white p-4 shadow-xl sm:p-8">
      <button
        type="button"
        onClick={onHome}
        className="mb-5 rounded-xl px-3 py-2 font-bold text-sky-700 hover:bg-sky-50"
      >
        ← Voltar ao início
      </button>

      <header className="text-center">
        <span className="inline-block rounded-full bg-cyan-100 px-4 py-2 text-sm font-black text-cyan-800">
          🧵 MISSÃO DO FIO DENTAL
        </span>

        <h1 className="mt-4 text-3xl font-black text-sky-950 sm:text-4xl">
          Vamos limpar entre os dentinhos!
        </h1>

        <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
          Pressione o fio dental e deslize entre os dentes
          para remover a sujeira dos espaços!
        </p>
      </header>

      <section className="my-6 rounded-3xl bg-gradient-to-b from-sky-100 to-cyan-100 p-3 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="font-black text-sky-950">
            🦷 Espaços limpos
          </span>

          <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-sky-800 shadow-sm">
            {cleaned.length} / {SPACES.length}
          </span>
        </div>

        <div
          className="relative w-full overflow-hidden rounded-2xl bg-white shadow-md"
          style={{ aspectRatio: `${W} / ${H}` }}
        >
          {!imageError ? (
            <>
              <img
                src="/sorriso-escovacao-limpa.png"
                alt="Boca com dentes limpos"
                draggable={false}
                className="pointer-events-none absolute inset-0 h-full w-full select-none"
              />

              <canvas
                ref={canvasRef}
                width={W}
                height={H}
                aria-label="Deslize o fio dental entre os dentes"
                className="absolute inset-0 h-full w-full touch-none select-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={stopFlossing}
                onPointerCancel={stopFlossing}
                onLostPointerCapture={stopFlossing}
              />

              {showFloss && (
                <div
                  className="pointer-events-none absolute z-10"
                  style={{
                    left: `${flossPosition.x}%`,
                    top: `${flossPosition.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <svg
                    width="95"
                    height="75"
                    viewBox="0 0 95 75"
                    aria-hidden="true"
                  >
                    <path
                      d="M 8 10 Q 47 65 87 10"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 8 10 Q 47 65 87 10"
                      fill="none"
                      stroke="#06B6D4"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 8 10 L 4 4 M 87 10 L 91 4"
                      stroke="#0891B2"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center font-bold text-red-700">
              Não foi possível carregar a imagem. Confira os arquivos na pasta public.
            </div>
          )}
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4">
          <p className="text-center text-sm font-bold text-sky-950">
            {progress === 100
              ? "Parabéns! Você limpou todos os espaços! 🏆"
              : showFloss
                ? "Muito bem! Continue passando o fio dental!"
                : "👆 Segure e deslize o fio entre os dentes."}
          </p>

          <div className="mt-4 h-4 overflow-hidden rounded-full bg-sky-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-sm font-black text-sky-950">
            <span>⭐ Progresso da missão</span>
            <span>{progress}%</span>
          </div>
        </div>
      </section>

      {finished ? (
        <section className="rounded-3xl bg-emerald-50 p-6 text-center">
          <div className="text-6xl">🏆😁</div>

          <h2 className="mt-4 text-2xl font-black text-emerald-900">
            Missão concluída!
          </h2>

          <p className="mt-3 text-emerald-800">
            Você aprendeu a limpar entre os dentinhos!
          </p>

          {alreadyEarned && (
            <p className="mt-3 font-bold text-emerald-800">
              Você já conquistou as estrelas desta missão. ⭐
            </p>
          )}

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={restartGame}
              className="rounded-xl bg-white px-5 py-3 font-bold text-sky-800 shadow-sm"
            >
              Jogar novamente
            </button>

            <button
              type="button"
              onClick={onHome}
              className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700"
            >
              Voltar ao menu ⭐
            </button>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={completeGame}
          disabled={cleaned.length < SPACES.length}
          className="w-full rounded-2xl bg-cyan-600 px-5 py-4 font-black text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {alreadyEarned
            ? "Concluir missão"
            : "Concluir missão e ganhar 10 estrelas ⭐"}
        </button>
      )}

      <p className="mt-5 text-center text-xs leading-5 text-slate-500">
        Jogo educativo ilustrativo. O uso real do fio dental
        deve ser orientado por um adulto.
      </p>
    </main>
  );
}
