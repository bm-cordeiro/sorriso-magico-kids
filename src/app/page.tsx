"use client";

import { useEffect, useState } from "react";
import BrushingGame from "@/components/BrushingGame";
import FlossingGame from "@/components/FlossingGame";
import BracesGame from "@/components/BracesGame";

type GameId = "brush" | "floss" | "braces" | "food" | "teeth";

type Food = {
  name: string;
  emoji: string;
  good: boolean;
  explanation: string;
};

const STORAGE_KEY = "sorriso-magico-progress";

const foods: Food[] = [
  { name: "Água", emoji: "💧", good: true, explanation: "A água ajuda a manter a boca hidratada." },
  { name: "Maçã", emoji: "🍎", good: true, explanation: "A maçã pode fazer parte de uma alimentação variada." },
  { name: "Cenoura", emoji: "🥕", good: true, explanation: "A cenoura é uma opção nutritiva." },
  { name: "Queijo", emoji: "🧀", good: true, explanation: "O queijo contém cálcio." },
  { name: "Leite", emoji: "🥛", good: true, explanation: "O leite contém cálcio, importante para os dentes." },
  { name: "Pera", emoji: "🍐", good: true, explanation: "A pera pode fazer parte de uma alimentação equilibrada." },
  { name: "Pepino", emoji: "🥒", good: true, explanation: "O pepino é uma opção de vegetal." },
  { name: "Ovo", emoji: "🥚", good: true, explanation: "O ovo fornece nutrientes importantes." },
  { name: "Iogurte natural sem açúcar", emoji: "🥣", good: true, explanation: "É uma opção que geralmente contém cálcio e pouco açúcar adicionado." },
  { name: "Brócolis", emoji: "🥦", good: true, explanation: "O brócolis é um vegetal nutritivo." },
  { name: "Banana", emoji: "🍌", good: true, explanation: "A banana pode fazer parte de uma alimentação variada." },
  { name: "Morango", emoji: "🍓", good: true, explanation: "O morango é uma fruta que pode integrar uma alimentação equilibrada." },
  { name: "Arroz e feijão", emoji: "🍛", good: true, explanation: "Uma refeição variada ajuda a fornecer nutrientes." },
  { name: "Frango", emoji: "🍗", good: true, explanation: "O frango fornece proteínas." },
  { name: "Castanhas", emoji: "🥜", good: true, explanation: "Castanhas podem fazer parte de uma alimentação variada, respeitando a idade e o risco de engasgo." },
  { name: "Chocolate", emoji: "🍫", good: false, explanation: "Pode conter bastante açúcar. A frequência de consumo importa." },
  { name: "Refrigerante", emoji: "🥤", good: false, explanation: "Pode conter açúcar e ácidos que prejudicam os dentes." },
  { name: "Bala", emoji: "🍬", good: false, explanation: "Balas açucaradas podem aumentar o risco de cárie." },
  { name: "Pirulito", emoji: "🍭", good: false, explanation: "O contato prolongado com açúcar favorece o risco de cárie." },
  { name: "Biscoito recheado", emoji: "🍪", good: false, explanation: "Geralmente contém açúcar e pode deixar resíduos nos dentes." },
  { name: "Bolo com cobertura", emoji: "🍰", good: false, explanation: "Pode conter bastante açúcar; é importante moderar a frequência." },
  { name: "Sorvete", emoji: "🍨", good: false, explanation: "Muitos sorvetes contêm açúcar adicionado." },
  { name: "Bebida açucarada", emoji: "🧃", good: false, explanation: "Bebidas com açúcar aumentam a exposição dos dentes ao açúcar." },
  { name: "Donut", emoji: "🍩", good: false, explanation: "É um doce que frequentemente contém açúcar." },
  { name: "Cereal açucarado", emoji: "🥣", good: false, explanation: "Alguns cereais têm bastante açúcar adicionado." },
  { name: "Caramelo", emoji: "🍬", good: false, explanation: "Doces pegajosos podem permanecer nos dentes por mais tempo." },
  { name: "Achocolatado açucarado", emoji: "🥛", good: false, explanation: "Pode conter açúcar adicionado; confira a composição." },
  { name: "Bala de goma", emoji: "🟠", good: false, explanation: "Doces pegajosos e açucarados favorecem o risco de cárie." },
  { name: "Algodão-doce", emoji: "🍭", good: false, explanation: "É composto principalmente por açúcar." },
  { name: "Biscoito doce", emoji: "🍪", good: false, explanation: "Pode conter açúcar e amido que ficam nos dentes." },
];

const toothQuestions = [
  {
    question: "Quantas vezes por dia devemos escovar os dentes?",
    options: ["Só uma vez", "Pelo menos duas vezes", "Nunca"],
    answer: 1,
    explanation: "Escovar pelo menos duas vezes ao dia, especialmente antes de dormir, é uma orientação importante.",
  },
  {
    question: "Qual produto ajuda a prevenir a cárie?",
    options: ["Creme dental com flúor", "Refrigerante", "Bala"],
    answer: 0,
    explanation: "O flúor ajuda a proteger os dentes contra a cárie. Use a quantidade indicada para a idade, com orientação de um adulto.",
  },
  {
    question: "Quem deve ajudar crianças pequenas na escovação?",
    options: ["Ninguém", "Um adulto responsável", "Somente um amigo"],
    answer: 1,
    explanation: "Crianças pequenas precisam de ajuda e supervisão de um adulto para escovar os dentes corretamente.",
  },
  {
    question: "O que devemos fazer depois de consumir doces?",
    options: [
      "Nunca mais beber água",
      "Cuidar da higiene bucal e manter uma rotina de escovação",
      "Comer mais doces imediatamente",
    ],
    answer: 1,
    explanation: "A frequência de consumo de açúcar importa. Manter uma boa rotina de higiene bucal ajuda a proteger os dentes.",
  },
  {
    question: "Com que frequência devemos visitar o dentista?",
    options: [
      "Somente quando todos os dentes caírem",
      "Conforme a orientação do profissional",
      "Nunca",
    ],
    answer: 1,
    explanation: "O dentista orienta a frequência ideal de acompanhamento para cada criança.",
  },
];

const games = [
  {
    id: "brush" as const,
    title: "Missão da Escovação",
    description: "Ajude o Dentino a completar sua missão.",
    emoji: "😁",
    color: "from-sky-400 to-cyan-300",
  },
  {
    id: "braces" as const,
    title: "Aventura do Aparelho",
    description: "Monte o aparelho do Dentino e escolha a cor dos elásticos.",
    emoji: "😁🦷",
    color: "from-violet-400 to-pink-300",
  },
  {
    id: "floss" as const,
    title: "Missão do Fio Dental",
    description: "Passe o fio dental entre os dentes e cuide de cada cantinho do sorriso.",
    emoji: "🦷🧵",
    color: "from-cyan-400 to-teal-300",
  },
  {
    id: "food" as const,
    title: "Detetives dos Alimentos",
    description: "Descubra quais escolhas ajudam a cuidar do sorriso.",
    emoji: "🍎",
    color: "from-emerald-400 to-lime-300",
  },
  {
    id: "teeth" as const,
    title: "Quiz do Sorriso",
    description: "Responda perguntas e aprenda brincando.",
    emoji: "🦷",
    color: "from-violet-400 to-fuchsia-300",
  },
];

export default function HomePage() {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [stars, setStars] = useState(0);
  const [earned, setEarned] = useState<GameId[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [picked, setPicked] = useState<string[]>([]);
  const [foodChecked, setFoodChecked] = useState(false);
  const [foodCorrect, setFoodCorrect] = useState(false);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answerChecked, setAnswerChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const data = JSON.parse(saved);

        if (typeof data.stars === "number") {
          setStars(data.stars);
        }

        if (Array.isArray(data.earned)) {
          setEarned(
            data.earned.filter(
              (item: unknown): item is GameId =>
                item === "brush" ||
                item === "floss" ||
                item === "braces" ||
                item === "food" ||
                item === "teeth"
            )
          );
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ stars, earned }));
  }, [stars, earned, loaded]);

  function reward(id: GameId) {
    if (earned.includes(id)) return;

    setEarned((current) =>
      current.includes(id) ? current : [...current, id]
    );
    setStars((current) => current + 10);
  }

  function home() {
    setActiveGame(null);
  }

  function openGame(id: GameId) {
    setActiveGame(id);

    setPicked([]);
    setFoodChecked(false);
    setFoodCorrect(false);

    setQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswerChecked(false);
    setQuizScore(0);
    setQuizFinished(false);
  }

  function toggleFood(name: string) {
    if (foodChecked) return;

    setPicked((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  }

  function checkFoodChoices() {
    setFoodChecked(true);

    const correct =
      foods.filter((food) => food.good).every((food) => picked.includes(food.name)) &&
      foods.filter((food) => !food.good).every((food) => !picked.includes(food.name));

    setFoodCorrect(correct);

    if (correct) {
      reward("food");
    }
  }

  function checkQuizAnswer() {
    if (selectedAnswer === null || answerChecked) return;

    setAnswerChecked(true);

    if (selectedAnswer === toothQuestions[questionIndex].answer) {
      setQuizScore((current) => current + 1);
    }
  }

  function nextQuestion() {
    if (questionIndex < toothQuestions.length - 1) {
      setQuestionIndex((current) => current + 1);
      setSelectedAnswer(null);
      setAnswerChecked(false);
    } else {
      setQuizFinished(true);

      if (
        quizScore +
          (selectedAnswer === toothQuestions[questionIndex].answer ? 1 : 0) >=
        4
      ) {
        reward("teeth");
      }
    }
  }

  const currentQuestion = toothQuestions[questionIndex];

  if (!loaded) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-sky-50 p-6">
        <p className="text-xl font-bold text-sky-900">
          Preparando uma aventura cheia de sorrisos... 🦷
        </p>
      </main>
    );
  }

  if (activeGame === "brush") {
    return (
      <main className="min-h-screen bg-sky-50 px-4 py-8">
        <BrushingGame
          onHome={home}
          alreadyEarned={earned.includes("brush")}
          onComplete={() => reward("brush")}
        />
      </main>
    );
  }

  if (activeGame === "floss") {
    return (
      <main className="min-h-screen bg-cyan-50 px-4 py-8">
        <FlossingGame
          onHome={home}
          alreadyEarned={earned.includes("floss")}
          onComplete={() => reward("floss")}
        />
      </main>
    );
  }

  // CORREÇÃO: esta condição abre a missão Aventura do Aparelho.
  if (activeGame === "braces") {
    return (
      <main className="min-h-screen bg-violet-50 px-4 py-8">
        <BracesGame
          onHome={home}
          alreadyEarned={earned.includes("braces")}
          onComplete={() => reward("braces")}
        />
      </main>
    );
  }

  if (activeGame === "food") {
    return (
      <main className="min-h-screen bg-emerald-50 px-4 py-8">
        <section className="mx-auto max-w-5xl rounded-3xl bg-white p-5 shadow-lg sm:p-8">
          <button
            type="button"
            onClick={home}
            className="mb-5 font-bold text-sky-700 hover:text-sky-900"
          >
            ← Voltar ao início
          </button>

          <header className="text-center">
            <div className="text-6xl">🕵️🍎</div>
            <h1 className="mt-3 text-3xl font-black text-emerald-950">
              Detetives dos Alimentos
            </h1>
            <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
              Selecione as opções que ajudam a compor uma rotina alimentar
              saudável. Depois, confira as explicações! Lembre-se: não
              precisamos proibir alimentos, mas aprender a fazer escolhas
              variadas e cuidar dos dentes.
            </p>
          </header>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {foods.map((food) => {
              const isPicked = picked.includes(food.name);
              const showResult = foodChecked;

              return (
                <button
                  type="button"
                  key={food.name}
                  onClick={() => toggleFood(food.name)}
                  disabled={foodChecked}
                  aria-pressed={isPicked}
                  className={`rounded-2xl border-2 p-4 text-center transition ${
                    showResult
                      ? food.good
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-amber-200 bg-amber-50"
                      : isPicked
                        ? "border-sky-400 bg-sky-50 ring-2 ring-sky-100"
                        : "border-slate-100 bg-white hover:border-sky-200 hover:bg-sky-50"
                  }`}
                >
                  <span className="block text-4xl">{food.emoji}</span>
                  <span className="mt-2 block text-sm font-bold text-slate-800">
                    {food.name}
                  </span>

                  {showResult && (
                    <span
                      className={`mt-2 block text-xs font-bold ${
                        food.good ? "text-emerald-700" : "text-amber-800"
                      }`}
                    >
                      {food.good ? "Boa opção para variar" : "Atenção à frequência"}
                    </span>
                  )}

                  {!showResult && isPicked && (
                    <span className="mt-2 block text-xs font-bold text-sky-700">
                      Selecionado ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {!foodChecked ? (
            <button
              type="button"
              onClick={checkFoodChoices}
              className="mt-7 w-full rounded-2xl bg-emerald-600 px-5 py-4 font-black text-white hover:bg-emerald-700"
            >
              Conferir minhas escolhas
            </button>
          ) : (
            <div className="mt-7 rounded-3xl bg-sky-50 p-5">
              <h2 className="text-xl font-black text-sky-950">
                {foodCorrect
                  ? "Parabéns, detetive! 🌟"
                  : "Vamos aprender juntos! 🔎"}
              </h2>

              <p className="mt-2 leading-7 text-slate-700">
                {foodCorrect
                  ? "Você identificou corretamente as opções desta atividade e ganhou 10 estrelas!"
                  : "Confira as explicações abaixo. Algumas opções podem fazer parte da alimentação, mas alimentos e bebidas açucarados merecem atenção à frequência."}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {foods.map((food) => (
                  <div key={food.name} className="rounded-xl bg-white p-3">
                    <p className="font-bold text-slate-800">
                      {food.emoji} {food.name}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {food.explanation}
                    </p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setPicked([]);
                  setFoodChecked(false);
                  setFoodCorrect(false);
                }}
                className="mt-5 w-full rounded-2xl bg-white px-5 py-3 font-bold text-sky-800 shadow-sm hover:bg-sky-100"
              >
                Jogar novamente
              </button>
            </div>
          )}
        </section>
      </main>
    );
  }

  if (activeGame === "teeth") {
    return (
      <main className="min-h-screen bg-violet-50 px-4 py-8">
        <section className="mx-auto max-w-2xl rounded-3xl bg-white p-5 shadow-lg sm:p-8">
          <button
            type="button"
            onClick={home}
            className="mb-5 font-bold text-sky-700 hover:text-sky-900"
          >
            ← Voltar ao início
          </button>

          {!quizFinished ? (
            <>
              <header className="text-center">
                <div className="text-6xl">🦷❓</div>
                <h1 className="mt-3 text-3xl font-black text-violet-950">
                  Quiz do Sorriso
                </h1>
                <p className="mt-2 font-bold text-slate-500">
                  Pergunta {questionIndex + 1} de {toothQuestions.length}
                </p>
              </header>

              <div className="mt-6 h-3 overflow-hidden rounded-full bg-violet-100">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all"
                  style={{
                    width: `${((questionIndex + 1) / toothQuestions.length) * 100}%`,
                  }}
                />
              </div>

              <h2 className="mt-7 text-xl font-black leading-8 text-slate-800">
                {currentQuestion.question}
              </h2>

              <div className="mt-5 grid gap-3">
                {currentQuestion.options.map((option, index) => {
                  const selected = selectedAnswer === index;
                  const correct = answerChecked && index === currentQuestion.answer;
                  const incorrect =
                    answerChecked && selected && index !== currentQuestion.answer;

                  return (
                    <button
                      type="button"
                      key={option}
                      onClick={() => {
                        if (!answerChecked) setSelectedAnswer(index);
                      }}
                      disabled={answerChecked}
                      className={`rounded-2xl border-2 p-4 text-left font-bold transition ${
                        correct
                          ? "border-emerald-400 bg-emerald-50 text-emerald-900"
                          : incorrect
                            ? "border-rose-300 bg-rose-50 text-rose-900"
                            : selected
                              ? "border-violet-400 bg-violet-50 text-violet-950"
                              : "border-slate-200 hover:border-violet-300 hover:bg-violet-50"
                      }`}
                    >
                      {correct ? "✅ " : incorrect ? "❌ " : ""}
                      {option}
                    </button>
                  );
                })}
              </div>

              {answerChecked && (
                <div className="mt-5 rounded-2xl bg-sky-50 p-4">
                  <p className="font-bold text-sky-950">
                    {selectedAnswer === currentQuestion.answer
                      ? "Muito bem! Você acertou! 🎉"
                      : "Não tem problema! Vamos aprender. 💙"}
                  </p>
                  <p className="mt-2 leading-6 text-slate-700">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {!answerChecked ? (
                <button
                  type="button"
                  onClick={checkQuizAnswer}
                  disabled={selectedAnswer === null}
                  className="mt-6 w-full rounded-2xl bg-violet-600 px-5 py-4 font-black text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Conferir resposta
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextQuestion}
                  className="mt-6 w-full rounded-2xl bg-violet-600 px-5 py-4 font-black text-white hover:bg-violet-700"
                >
                  {questionIndex === toothQuestions.length - 1
                    ? "Ver resultado"
                    : "Próxima pergunta →"}
                </button>
              )}
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="text-7xl">
                {quizScore >= 4 ? "🏆" : "🌟"}
              </div>

              <h1 className="mt-4 text-3xl font-black text-violet-950">
                Quiz concluído!
              </h1>

              <p className="mt-3 text-xl font-bold text-slate-700">
                Você acertou {quizScore} de {toothQuestions.length} perguntas.
              </p>

              <p className="mt-3 leading-7 text-slate-600">
                {quizScore >= 4
                  ? "Excelente! Você conquistou 10 estrelas. Continue aprendendo a cuidar do sorriso!"
                  : "Muito bem por participar! Revise as explicações e tente novamente para conquistar as estrelas."}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => openGame("teeth")}
                  className="rounded-2xl bg-violet-600 px-5 py-3 font-bold text-white hover:bg-violet-700"
                >
                  Jogar novamente
                </button>

                <button
                  type="button"
                  onClick={home}
                  className="rounded-2xl bg-sky-100 px-5 py-3 font-bold text-sky-900 hover:bg-sky-200"
                >
                  Voltar ao menu
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-sky-100 via-white to-violet-100">
      <header className="bg-white/90 px-4 py-5 shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-3xl">
              🦷
            </div>
            <div>
              <h1 className="text-2xl font-black text-sky-950">
                Sorriso Mágico Kids
              </h1>
              <p className="text-sm font-medium text-slate-500">
                Aprender a cuidar do sorriso pode ser divertido!
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-amber-100 px-5 py-3 text-center">
            <p className="text-sm font-bold text-amber-900">Minhas estrelas</p>
            <p className="text-2xl font-black text-amber-950">⭐ {stars}</p>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-16">
        <div>
          <span className="inline-flex rounded-full bg-violet-100 px-4 py-2 text-sm font-black text-violet-800">
            🌈 UM MUNDO DE DESCOBERTAS
          </span>

          <h2 className="mt-5 text-4xl font-black leading-tight text-sky-950 sm:text-5xl">
            Seu sorriso é
            <span className="text-violet-600"> superpoderoso!</span>
          </h2>

          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            Entre nessa aventura, descubra como cuidar dos dentes, responda
            desafios e conquiste estrelas. Vamos aprender brincando?
          </p>

          <button
            type="button"
            onClick={() =>
              document.getElementById("jogos")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="mt-7 rounded-2xl bg-sky-600 px-7 py-4 font-black text-white shadow-lg shadow-sky-200 transition hover:-translate-y-1 hover:bg-sky-700"
          >
            Começar a aventura 🚀
          </button>
        </div>

        <div className="relative flex min-h-64 items-center justify-center">
          <div className="absolute h-64 w-64 rounded-full bg-yellow-100 sm:h-80 sm:w-80" />
          <div className="relative text-center">
            <div className="animate-bounce text-9xl sm:text-[11rem]">🦷</div>
            <div className="mt-2 inline-block rounded-2xl bg-white px-5 py-3 font-black text-sky-950 shadow-md">
              Olá! Eu sou o Dentino! 👋
            </div>
          </div>
          <span className="absolute right-8 top-4 text-4xl">✨</span>
          <span className="absolute bottom-5 left-6 text-4xl">🌟</span>
          <span className="absolute left-8 top-8 text-3xl">💜</span>
        </div>
      </section>

      <section id="jogos" className="px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="font-black uppercase tracking-widest text-violet-600">
              Escolha sua missão
            </span>
            <h2 className="mt-3 text-3xl font-black text-sky-950 sm:text-4xl">
              Vamos brincar e aprender?
            </h2>
            <p className="mt-3 text-slate-600">
              Complete os desafios para ganhar estrelas.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {games.map((game) => {
              const completed = earned.includes(game.id);

              return (
                <article
                  key={game.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`flex h-40 items-center justify-center bg-gradient-to-br ${game.color}`}
                  >
                    <span className="text-7xl">{game.emoji}</span>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-black text-slate-900">
                        {game.title}
                      </h3>
                      {completed && (
                        <span className="text-xl" title="Missão concluída">
                          🏆
                        </span>
                      )}
                    </div>

                    <p className="mt-3 min-h-12 leading-6 text-slate-600">
                      {game.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => openGame(game.id)}
                      className="mt-5 w-full rounded-2xl bg-sky-600 px-5 py-3 font-black text-white transition hover:bg-sky-700"
                    >
                      {completed ? "Jogar novamente" : "Jogar agora"} →
                    </button>

                    {completed && (
                      <p className="mt-3 text-center text-sm font-bold text-emerald-700">
                        Missão concluída!
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto max-w-6xl rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <div className="text-5xl">🏅</div>
            <h2 className="mt-3 text-2xl font-black text-sky-950">
              Minha coleção de conquistas
            </h2>
            <p className="mt-2 text-slate-600">
              Cada missão concluída desbloqueia uma conquista!
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {games.map((game) => {
              const completed = earned.includes(game.id);

              return (
                <div
                  key={game.id}
                  className={`rounded-2xl border-2 p-5 text-center ${
                    completed
                      ? "border-amber-300 bg-amber-50"
                      : "border-slate-100 bg-slate-50"
                  }`}
                >
                  <div className="text-4xl">{completed ? "🏆" : "🔒"}</div>
                  <p className="mt-3 font-black text-slate-800">{game.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {completed ? "Conquista desbloqueada" : "Continue jogando"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="mt-8 bg-sky-950 px-4 py-8 text-center text-white">
        <div className="text-3xl">🦷 💙 ✨</div>
        <p className="mt-3 font-black">Sorriso Mágico Kids</p>
        <p className="mt-2 text-sm leading-6 text-sky-100">
          Conteúdo educativo. As atividades não substituem a avaliação e a
          orientação de um cirurgião-dentista.
        </p>
      </footer>
    </main>
  );
}