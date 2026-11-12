/* =========================================================
   FisioVida • script.js
   ========================================================= */

/* ---------- Utilidades ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* Acesso seguro ao localStorage (pode falhar em modo privado) */
const store = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); }
    catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignora */ }
  }
};

/* ---------- Ano do rodapé ---------- */
$("#year").textContent = new Date().getFullYear();

/* =========================================================
   1. TEMA CLARO / ESCURO
   ========================================================= */
const themeBtn = $("#themeToggle");

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  store.set("fisio-theme", theme);
}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(store.get("fisio-theme", prefersDark ? "dark" : "light"));

themeBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

/* =========================================================
   2. MENU MOBILE + LINK ATIVO + CABEÇALHO
   ========================================================= */
const nav = $("#nav");
const menuBtn = $("#menuBtn");
const header = $("#header");

menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuBtn.textContent = open ? "✕" : "☰";
});

$$("#nav a").forEach(link =>
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuBtn.textContent = "☰";
  })
);

/* Destaca o link da seção visível */
const sections = $$("main section[id]");
const navLinks = $$("#nav a");

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a =>
        a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`)
      );
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });

sections.forEach(s => sectionObserver.observe(s));

/* =========================================================
   3. SCROLL: PROGRESSO, SOMBRA DO CABEÇALHO, VOLTAR AO TOPO
   ========================================================= */
const progressBar = $("#progressBar");
const toTop = $("#toTop");

function onScroll() {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (height > 0 ? (scrollTop / height) * 100 : 0) + "%";
  header.classList.toggle("is-scrolled", scrollTop > 10);
  toTop.classList.toggle("is-visible", scrollTop > 500);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* =========================================================
   4. ANIMAÇÃO DE ENTRADA (REVEAL)
   ========================================================= */
const revealTargets = $$(".card, .pillar, .mini, .info, .signal, .timeline-mini__row > div, .checklist-box, .section__head");
revealTargets.forEach(el => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealTargets.forEach(el => revealObserver.observe(el));

/* =========================================================
   5. CONTADORES ANIMADOS DO HERO
   ========================================================= */
function animateCount(el) {
  const target = Number(el.dataset.count);
  const duration = 1200;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(progress * target);
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
$$("[data-count]").forEach(animateCount);

/* =========================================================
   6. FILTRO DAS ÁREAS DE ATUAÇÃO
   ========================================================= */
const areaFilters = $("#areaFilters");

areaFilters.addEventListener("click", e => {
  const btn = e.target.closest(".chip");
  if (!btn) return;

  $$(".chip", areaFilters).forEach(c => c.classList.remove("is-active"));
  btn.classList.add("is-active");

  const filter = btn.dataset.filter;
  $$("#areaGrid .card").forEach(card => {
    const show = filter === "todas" || card.dataset.cat === filter;
    card.classList.toggle("is-hidden", !show);
  });
});

/* =========================================================
   7. PASSO A PASSO DO TRATAMENTO
   ========================================================= */
const stepsData = [
  {
    title: "1. Avaliação inicial",
    lead: "É o primeiro contato: o fisioterapeuta conhece você, sua história e seus objetivos.",
    items: [
      "Conversa (anamnese): queixa principal, quando começou, o que piora ou alivia a dor",
      "Histórico de saúde, cirurgias, medicamentos, exames e rotina de trabalho/esportes",
      "Inspeção da postura, da marcha e da região afetada",
      "Testes de amplitude de movimento, força muscular, sensibilidade e testes especiais",
      "Aplicação de escalas, como a de dor de 0 a 10, para acompanhar a evolução"
    ],
    tip: "Leve exames, laudos médicos e a lista de remédios que você usa. Quanto mais informação, melhor a avaliação."
  },
  {
    title: "2. Diagnóstico fisioterapêutico",
    lead: "Com os dados em mãos, o profissional identifica quais funções estão alteradas e por quê.",
    items: [
      "Reúne os achados da avaliação para entender a origem do problema",
      "Define limitações de movimento e atividades afetadas no dia a dia",
      "Identifica sinais de alerta que exijam encaminhamento médico",
      "Estabelece o prognóstico: o que é possível melhorar e em quanto tempo, aproximadamente"
    ],
    tip: "O diagnóstico fisioterapêutico foca na função e no movimento, e complementa o diagnóstico médico."
  },
  {
    title: "3. Plano de tratamento",
    lead: "Juntos, você e o fisioterapeuta definem metas realistas e o caminho para alcançá-las.",
    items: [
      "Objetivos de curto prazo (reduzir a dor, ganhar movimento) e de longo prazo (voltar ao esporte, ao trabalho)",
      "Escolha das técnicas, recursos e exercícios mais adequados ao seu caso",
      "Definição da frequência e da duração prevista das sessões",
      "Orientações sobre cuidados e exercícios para fazer em casa"
    ],
    tip: "Metas claras e mensuráveis, como \"subir um lance de escada sem dor\", ajudam a manter a motivação."
  },
  {
    title: "4. Sessões de tratamento",
    lead: "É a fase de execução, em que as técnicas e os exercícios são aplicados e ajustados.",
    items: [
      "Aquecimento e preparação do corpo, muitas vezes com recursos de calor ou terapia manual",
      "Técnicas para dor e inflamação, como terapia manual, eletroterapia ou laser",
      "Exercícios de alongamento, fortalecimento, equilíbrio e coordenação",
      "Treino funcional que simula atividades reais do seu cotidiano",
      "Progressão gradual: aumento da carga e da dificuldade conforme sua resposta"
    ],
    tip: "Diga sempre como se sentiu após a sessão anterior. Esse retorno permite ajustar o tratamento."
  },
  {
    title: "5. Reavaliação e alta",
    lead: "O progresso é medido periodicamente, e o tratamento é ajustado até o objetivo ser atingido.",
    items: [
      "Reavaliações repetem testes e escalas do início para comparar resultados",
      "O plano é modificado se a evolução estiver abaixo ou acima do esperado",
      "Na alta, você recebe um programa de manutenção e prevenção de recaídas",
      "Pode haver consultas de acompanhamento espaçadas para garantir a estabilidade dos resultados"
    ],
    tip: "A alta não é o fim do cuidado: manter os exercícios aprendidos protege você de novos problemas."
  }
];

const stepsPanel = $("#stepsPanel");
const stepButtons = $$(".step-btn");
let currentStep = 0;

function renderStep(index) {
  currentStep = index;
  const step = stepsData[index];

  stepButtons.forEach((btn, i) => btn.classList.toggle("is-active", i === index));

  stepsPanel.innerHTML = `
    <h3>${step.title}</h3>
    <p class="lead">${step.lead}</p>
    <ul>${step.items.map(item => `<li>${item}</li>`).join("")}</ul>
    <div class="steps__tip">💡 <strong>Dica:</strong> ${step.tip}</div>
    <div class="steps__controls">
      <button class="btn btn--ghost btn--small" data-nav="prev" ${index === 0 ? "disabled" : ""}>← Anterior</button>
      <button class="btn btn--primary btn--small" data-nav="next" ${index === stepsData.length - 1 ? "disabled" : ""}>Próxima →</button>
    </div>
  `;
  /* reinicia a animação */
  stepsPanel.style.animation = "none";
  void stepsPanel.offsetWidth;
  stepsPanel.style.animation = "";
}

stepButtons.forEach((btn, i) => btn.addEventListener("click", () => renderStep(i)));

stepsPanel.addEventListener("click", e => {
  const nav = e.target.closest("[data-nav]");
  if (!nav || nav.disabled) return;
  renderStep(currentStep + (nav.dataset.nav === "next" ? 1 : -1));
});

renderStep(0);

/* =========================================================
   8. ABAS DE TÉCNICAS
   ========================================================= */
$$(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    $$(".tab").forEach(t => t.classList.remove("is-active"));
    $$(".tabs__content").forEach(c => c.classList.remove("is-active"));
    tab.classList.add("is-active");
    $(`#tab-${tab.dataset.tab}`).classList.add("is-active");
  });
});

/* =========================================================
   9. EXERCÍCIOS + CRONÔMETRO
   ========================================================= */
const exercisesByRegion = {
  "Pescoço": [
    {
      name: "Alongamento lateral do pescoço",
      level: "Iniciante",
      goal: "Aliviar a tensão do trapézio superior e da lateral do pescoço.",
      steps: [
        "Sente-se com a coluna ereta e os ombros relaxados.",
        "Incline suavemente a cabeça para um lado, levando a orelha em direção ao ombro.",
        "Mantenha o ombro oposto baixo. Pare ao sentir um alongamento leve.",
        "Respire normalmente e depois repita para o outro lado."
      ],
      seconds: 30, dose: "30 s por lado • 2 a 3 vezes",
      caution: "Não force com a mão e não sinta dor aguda nem formigamento no braço."
    },
    {
      name: "Retração cervical (queixo para dentro)",
      level: "Iniciante",
      goal: "Melhorar o alinhamento da cabeça e ativar músculos profundos do pescoço.",
      steps: [
        "Sente-se ou fique em pé olhando para frente.",
        "Leve o queixo suavemente para trás, como se fizesse \"papada\", sem inclinar a cabeça.",
        "Segure por alguns segundos e relaxe.",
        "Repita de forma lenta e controlada."
      ],
      seconds: 10, dose: "10 s • 8 a 10 repetições",
      caution: "O movimento deve ser leve. Interrompa se houver tontura ou dor irradiada."
    }
  ],
  "Ombro": [
    {
      name: "Pêndulo de Codman",
      level: "Iniciante",
      goal: "Mobilizar o ombro com baixo esforço, comum em fases iniciais de reabilitação.",
      steps: [
        "Apoie uma mão em uma mesa, incline o tronco e deixe o outro braço solto.",
        "Faça pequenos círculos com o braço relaxado, usando o balanço do corpo.",
        "Alterne o sentido do círculo (horário e anti-horário).",
        "Troque de lado."
      ],
      seconds: 30, dose: "30 s por sentido • 2 séries",
      caution: "Se houver cirurgia recente, faça apenas com autorização do seu profissional."
    },
    {
      name: "Rotação externa com faixa elástica",
      level: "Intermediário",
      goal: "Fortalecer o manguito rotador, que estabiliza o ombro.",
      steps: [
        "Prenda a faixa na altura da cintura e fique de lado para o ponto de fixação.",
        "Mantenha o cotovelo a 90°, colado ao corpo.",
        "Gire o antebraço para fora, afastando-o do abdômen.",
        "Retorne devagar, controlando a volta."
      ],
      seconds: 45, dose: "3 séries de 10 a 12 repetições",
      caution: "Não eleve o ombro nem compense com o tronco. Use resistência leve."
    }
  ],
  "Coluna lombar": [
    {
      name: "Gato-camelo",
      level: "Iniciante",
      goal: "Mobilizar a coluna de forma suave e reduzir a rigidez.",
      steps: [
        "Fique em quatro apoios, com mãos sob os ombros e joelhos sob o quadril.",
        "Ao expirar, arredonde as costas e aproxime o queixo do peito.",
        "Ao inspirar, afunde levemente a coluna e olhe para frente.",
        "Alterne os movimentos de forma lenta."
      ],
      seconds: 60, dose: "1 minuto • 2 séries",
      caution: "Mantenha o movimento dentro do conforto, sem dor."
    },
    {
      name: "Ponte (elevação do quadril)",
      level: "Iniciante",
      goal: "Fortalecer glúteos e músculos que sustentam a região lombar.",
      steps: [
        "Deite-se de barriga para cima, joelhos dobrados e pés apoiados no chão.",
        "Contraia o abdômen e os glúteos e eleve o quadril até alinhar joelhos, quadril e ombros.",
        "Segure alguns segundos sem arquear demais a lombar.",
        "Desça devagar, vértebra por vértebra."
      ],
      seconds: 20, dose: "3 séries de 10 repetições (isometria de 5 s)",
      caution: "Se sentir dor na lombar durante o movimento, diminua a altura ou interrompa."
    },
    {
      name: "Joelhos ao peito",
      level: "Iniciante",
      goal: "Alongar suavemente a região lombar e os glúteos.",
      steps: [
        "Deite-se de costas com as pernas dobradas.",
        "Abrace um joelho de cada vez, ou os dois, trazendo-os em direção ao peito.",
        "Mantenha a cabeça apoiada e respire fundo.",
        "Solte lentamente."
      ],
      seconds: 30, dose: "30 s • 2 a 3 vezes",
      caution: "Evite se houver dor aguda ou formigamento nas pernas."
    }
  ],
  "Joelho": [
    {
      name: "Extensão de joelho sentado",
      level: "Iniciante",
      goal: "Ativar o quadríceps, importante para a estabilidade do joelho.",
      steps: [
        "Sente-se em uma cadeira com as costas apoiadas.",
        "Estenda uma perna até deixá-la reta, contraindo a coxa.",
        "Segure por 3 a 5 segundos.",
        "Desça devagar e troque de perna."
      ],
      seconds: 30, dose: "3 séries de 10 repetições por perna",
      caution: "Não trave o joelho com força e evite dor na frente do joelho."
    },
    {
      name: "Mini agachamento na parede",
      level: "Intermediário",
      goal: "Fortalecer coxas e glúteos com baixo impacto.",
      steps: [
        "Encoste as costas na parede, com os pés um passo à frente.",
        "Deslize flexionando os joelhos até cerca de 45°, sem ultrapassar a ponta dos pés.",
        "Mantenha a posição respirando normalmente.",
        "Suba devagar."
      ],
      seconds: 20, dose: "3 séries de 20 a 30 s",
      caution: "Pare se houver dor no joelho ou sensação de falseio."
    }
  ],
  "Tornozelo e pé": [
    {
      name: "Alfabeto com o pé",
      level: "Iniciante",
      goal: "Recuperar a mobilidade do tornozelo em todas as direções.",
      steps: [
        "Sente-se com a perna estendida ou o pé suspenso.",
        "Com o pé, desenhe no ar as letras do alfabeto, de A a Z.",
        "Mova principalmente o tornozelo, mantendo a perna parada.",
        "Repita no outro pé."
      ],
      seconds: 60, dose: "1 alfabeto por pé • 2 vezes",
      caution: "Movimentos suaves, sem dor. Útil em recuperações após entorses, com liberação do profissional."
    },
    {
      name: "Elevação de calcanhares",
      level: "Intermediário",
      goal: "Fortalecer a panturrilha e melhorar o equilíbrio.",
      steps: [
        "Fique em pé, apoiando as mãos em uma parede ou bancada.",
        "Suba na ponta dos pés de forma lenta.",
        "Segure 2 segundos no alto.",
        "Desça controlando o movimento."
      ],
      seconds: 40, dose: "3 séries de 12 a 15 repetições",
      caution: "Mantenha o apoio para segurança. Reduza a amplitude se houver dor no tendão."
    }
  ]
};

const regionFilters = $("#regionFilters");
const exerciseList = $("#exerciseList");

function renderRegions() {
  regionFilters.innerHTML = Object.keys(exercisesByRegion)
    .map((region, i) => `<button class="chip ${i === 0 ? "is-active" : ""}" data-region="${region}">${region}</button>`)
    .join("");
}

function renderExercises(region) {
  const list = exercisesByRegion[region];
  exerciseList.innerHTML = list.map((ex, i) => `
    <article class="exercise">
      <div class="exercise__top">
        <h3>${ex.name}</h3>
        <span class="tag">${ex.level}</span>
      </div>
      <p class="exercise__goal">${ex.goal}</p>
      <ol>${ex.steps.map(s => `<li>${s}</li>`).join("")}</ol>
      <div class="exercise__meta">
        <span>⏱️ ${ex.dose}</span>
      </div>
      <div class="exercise__caution">⚠️ ${ex.caution}</div>
      <button class="btn btn--primary btn--small" data-practice="${i}">▶ Praticar (${ex.seconds}s)</button>
    </article>
  `).join("");
}

regionFilters.addEventListener("click", e => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  $$(".chip", regionFilters).forEach(c => c.classList.remove("is-active"));
  btn.classList.add("is-active");
  currentRegion = btn.dataset.region;
  renderExercises(currentRegion);
});

let currentRegion = Object.keys(exercisesByRegion)[0];
renderRegions();
renderExercises(currentRegion);

/* ----- Cronômetro ----- */
const timerName = $("#timerName");
const timerDisplay = $("#timerDisplay");
const timerFill = $("#timerFill");
const timerStart = $("#timerStart");
const timerReset = $("#timerReset");
const timerHint = $("#timerHint");

let timerTotal = 0;
let timerLeft = 0;
let timerId = null;

const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

function updateTimerUI() {
  timerDisplay.textContent = fmt(timerLeft);
  const done = timerTotal ? ((timerTotal - timerLeft) / timerTotal) * 100 : 0;
  timerFill.style.width = done + "%";
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
  timerStart.textContent = "Iniciar";
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.value = 0.15;
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch { /* sem áudio */ }
}

exerciseList.addEventListener("click", e => {
  const btn = e.target.closest("[data-practice]");
  if (!btn) return;

  const ex = exercisesByRegion[currentRegion][Number(btn.dataset.practice)];
  stopTimer();
  timerTotal = timerLeft = ex.seconds;
  timerName.textContent = ex.name;
  timerHint.textContent = "Pronto! Posicione-se e clique em Iniciar.";
  timerStart.disabled = false;
  timerReset.disabled = false;
  updateTimerUI();

  if (window.innerWidth <= 960) $("#timerBox").scrollIntoView({ behavior: "smooth", block: "center" });
});

timerStart.addEventListener("click", () => {
  if (timerId) {                      /* pausar */
    stopTimer();
    timerHint.textContent = "Pausado.";
    return;
  }
  if (timerLeft === 0) timerLeft = timerTotal;   /* recomeçar após o fim */

  timerStart.textContent = "Pausar";
  timerHint.textContent = "Respire com calma e mantenha o movimento controlado.";
  timerId = setInterval(() => {
    timerLeft--;
    updateTimerUI();
    if (timerLeft <= 0) {
      stopTimer();
      beep();
      timerHint.textContent = "✅ Tempo concluído! Descanse e, se indicado, repita.";
    }
  }, 1000);
});

timerReset.addEventListener("click", () => {
  stopTimer();
  timerLeft = timerTotal;
  updateTimerUI();
  timerHint.textContent = "Cronômetro reiniciado.";
});

/* =========================================================
   10. CHECKLIST DIÁRIO (salvo por dia no navegador)
   ========================================================= */
const checkboxes = $$("#checklist input");
const meterFill = $("#meterFill");
const meterText = $("#meterText");
const todayKey = "fisio-check-" + new Date().toISOString().slice(0, 10);

const saved = store.get(todayKey, []);
checkboxes.forEach((cb, i) => { cb.checked = Boolean(saved[i]); });

function updateChecklist() {
  const done = checkboxes.filter(cb => cb.checked).length;
  meterFill.style.width = (done / checkboxes.length) * 100 + "%";
  meterText.textContent = `${done} de ${checkboxes.length} concluídos` + (done === checkboxes.length ? " 🎉 Parabéns!" : "");
  store.set(todayKey, checkboxes.map(cb => cb.checked));
}
checkboxes.forEach(cb => cb.addEventListener("change", updateChecklist));
updateChecklist();

/* =========================================================
   11. BUSCA NO FAQ
   ========================================================= */
const faqSearch = $("#faqSearch");
const faqItems = $$(".faq__item");
const faqEmpty = $("#faqEmpty");

const normalize = str => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

faqSearch.addEventListener("input", () => {
  const term = normalize(faqSearch.value.trim());
  let visible = 0;

  faqItems.forEach(item => {
    const match = normalize(item.textContent).includes(term);
    item.hidden = !match;
    if (match) visible++;
  });

  faqEmpty.hidden = visible > 0;
});

/* =========================================================
   12. FAQ: abrir apenas um item por vez
   ========================================================= */
faqItems.forEach(item => {
  item.addEventListener("toggle", () => {
    if (item.open) faqItems.forEach(other => { if (other !== item) other.open = false; });
  });
});