
"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

type BrushingGameProps = {
  onComplete: () => void;
  onHome: () => void;
  alreadyEarned: boolean;
};

const W = 1536;
const H = 1024;
const BRUSH_RADIUS = 38;

const TEETH = [
  // Arcada superior
  { x: 210, y: 410 }, { x: 290, y: 405 },
  { x: 390, y: 400 }, { x: 490, y: 400 },
  { x: 590, y: 405 }, { x: 690, y: 410 },
  { x: 790, y: 410 }, { x: 890, y: 410 },
  { x: 990, y: 405 }, { x: 1090, y: 405 },
  { x: 1190, y: 405 }, { x: 1290, y: 410 },

  // Arcada inferior
  { x: 195, y: 620 }, { x: 285, y: 640 },
  { x: 380, y: 655 }, { x: 475, y: 675 },
  { x: 575, y: 695 }, { x: 680, y: 705 },
  { x: 800, y: 705 }, { x: 920, y: 690 },
  { x: 1030, y: 665 }, { x: 1140, y: 645 },
  { x: 1240, y: 620 }, { x: 1330, y: 600 },
];

export default function BrushingGame({
  onComplete,
  onHome,
  alreadyEarned,
}: BrushingGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dirtyImageRef = useRef<HTMLImageElement | null>(null);
  const drawingRef = useRef(false);
  const cleanedRef = useRef<number[]>([]);
  const finishedRef = useRef(false);

  const [cleaned, setCleaned] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [brushPosition, setBrushPosition] = useState({ x: 50, y: 50 });
  const [showBrush, setShowBrush] = useState(false);

  const progress = Math.round((cleaned.length / TEETH.length) * 100);

  useEffect(() => {
    const image = new Image();

    image.onload = () => {
      dirtyImageRef.current = image;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (canvas && ctx) {
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, W, H);
        ctx.drawImage(image, 0, 0, W, H);
      }
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

  function brush(event: PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx || finishedRef.current) return;

    const rect = canvas.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width) * W;
    const y = ((event.clientY - rect.top) / rect.height) * H;

    setBrushPosition({
      x: (x / W) * 100,
      y: (y / H) * 100,
    });
    setShowBrush(true);

    // Apaga a camada suja e revela a imagem limpa por baixo.
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    // Conta os dentes alcançados pela escova.
    const newlyCleaned: number[] = [];

    TEETH.forEach((tooth, index) => {
      const distance = Math.hypot(x - tooth.x, y - tooth.y);

      if (
        distance < 48 &&
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
    event.currentTarget.setPointerCapture(event.pointerId);
    brush(event);
  }

  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current || finishedRef.current) return;

    event.preventDefault();
    brush(event);
  }

  function stopBrushing() {
    drawingRef.current = false;
    setShowBrush(false);
  }

  function completeGame() {
    if (
      cleanedRef.current.length < TEETH.length ||
      finishedRef.current
    ) {
      return;
    }

    finishedRef.current = true;
    setFinished(true);

    if (!alreadyEarned) {
      onComplete();
    }
  }

  function restartGame() {
    cleanedRef.current = [];
    finishedRef.current = false;
    drawingRef.current = false;

    setCleaned([]);
    setFinished(false);
    setShowBrush(false);

    restoreDirtyImage();
  }

  return (
    <main className="mx-auto max-w-5xl rounded-3xl bg-white p-4 shadow-xl sm:p-8">
      <button
        type="button"
        onClick={onHome}
        className="mb-5 rounded-xl px-3 py-2 font-bold text-sky-700 transition hover:bg-sky-50"
      >
        ← Voltar ao início
      </button>

      <header className="text-center">
        <span className="inline-block rounded-full bg-pink-100 px-4 py-2 text-sm font-black text-pink-800">
          🪥 MISSÃO DA ESCOVAÇÃO
        </span>

        <h1 className="mt-4 text-3xl font-black text-sky-950 sm:text-4xl">
          Vamos limpar os dentinhos!
        </h1>

        <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
          Segure a escova com o mouse ou o dedo e esfregue
          sobre os dentes para remover a sujeira!
        </p>
      </header>

      <section className="my-6 rounded-3xl bg-gradient-to-b from-sky-100 to-pink-100 p-3 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="font-black text-sky-950">
            🦷 Dentinhos limpos
          </span>

          <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-sky-800 shadow-sm">
            {cleaned.length} / {TEETH.length}
          </span>
        </div>

        <div className="relative w-full overflow-hidden rounded-2xl bg-white shadow-md">
          {!imageError ? (
            <>
             <img
  src="/sorriso-escovacao-limpa.png"
  alt="Ilustração da boca com os dentes limpos"
  draggable={false}
  className="block h-auto w-full select-none"
/>

              <canvas
  ref={canvasRef}
  width={1536}
  height={1024}
  aria-label="Arraste a escova para limpar os dentes"
  className="absolute inset-0 block h-full w-full touch-none select-none"
  style={{ aspectRatio: "1536 / 1024" }}
  onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  onPointerUp={stopBrushing}
  onPointerCancel={stopBrushing}
  onLostPointerCapture={stopBrushing}
/>

              {showBrush && (
                <div
                  className="pointer-events-none absolute z-10"
                  style={{
                    left: `${brushPosition.x}%`,
                    top: `${brushPosition.y}%`,
                    transform: "translate(-25%, -75%) rotate(-35deg)",
                  }}
                >
                  <svg
                    width="72"
                    height="110"
                    viewBox="0 0 90 130"
                    aria-hidden="true"
                  >
                    <rect
                      x="32"
                      y="30"
                      width="25"
                      height="92"
                      rx="12"
                      fill="#0284C7"
                      stroke="#FFFFFF"
                      strokeWidth="4"
                    />

                    <rect
                      x="17"
                      y="8"
                      width="55"
                      height="36"
                      rx="12"
                      fill="#38BDF8"
                      stroke="#FFFFFF"
                      strokeWidth="4"
                    />

                    {[27, 36, 45, 54, 63].map((x) => (
                      <path
                        key={x}
                        d={`M ${x} 15 V 32`}
                        stroke="#FFFFFF"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    ))}
                  </svg>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center font-bold text-red-700">
              Não foi possível carregar a imagem suja.
              Confira se os arquivos estão na pasta public.
            </div>
          )}
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4">
          <p className="text-center text-sm font-bold leading-6 text-sky-950">
            {progress === 100
              ? "Uau! Todos os dentinhos estão limpinhos! 🏆"
              : showBrush
                ? "Muito bem! Continue esfregando! 🪥"
                : "🪥 Pressione e arraste a escova sobre as manchas."}
          </p>

          <div className="mt-4 h-4 overflow-hidden rounded-full bg-sky-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 text-sm font-black text-sky-950">
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

          <p className="mt-3 leading-7 text-emerald-800">
            Você deixou os dentinhos brilhando! O Dentino está
            muito feliz com seu sorriso.
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
              className="rounded-xl bg-white px-5 py-3 font-bold text-sky-800 shadow-sm hover:bg-sky-50"
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
          disabled={cleaned.length < TEETH.length}
          className="w-full rounded-2xl bg-emerald-600 px-5 py-4 font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {alreadyEarned
            ? "Concluir missão"
            : "Concluir missão e ganhar 10 estrelas ⭐"}
        </button>
      )}

      <p className="mt-5 text-center text-xs leading-5 text-slate-500">
        Jogo educativo ilustrativo. A escovação real deve ser
        realizada com creme dental fluoretado e orientação de
        um adulto.
      </p>
    </main>
  );
}
