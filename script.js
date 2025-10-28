const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");
const gameOverScreen = document.getElementById("gameover-screen");

const playerInput = document.getElementById("player-name");
const startBtn = document.getElementById("start-btn");
const playerDisplay = document.getElementById("player-display");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options-list");
const nextBtn = document.getElementById("next-btn");
const timeLeftEl = document.getElementById("time-left");
const scoreText = document.getElementById("score-text");
const leaderboardBody = document.getElementById("leaderboard-body");
const restartBtn = document.getElementById("restart-btn");
const restartGameover = document.getElementById("restart-gameover");

const LB_KEY = "physics_quiz_leaderboard_v3";
const LAST_Q_KEY = "physics_quiz_last_questions_v3";

let playerName = "", questions = [], currentIndex = 0, score = 0, timeLeft = 30, timerInterval = null;

// 🧠 Banco de perguntas
const questionPool = [
  {q:"O que é força?",opts:["Energia","Interação que altera o movimento","Temperatura","Cor"],a:1},
  {q:"O som não se propaga em:",opts:["Sólido","Líquido","Gás","Vácuo"],a:3},
  {q:"Qual dessas é energia renovável?",opts:["Petróleo","Carvão","Vento","Gás natural"],a:2},
  {q:"O que é pressão?",opts:["Força por área","Massa por volume","Velocidade do som","Energia por tempo"],a:0},
  {q:"O que é densidade?",opts:["Massa por volume","Força por área","Energia por massa","Temperatura por volume"],a:0},
  {q:"Força de atrito atua para?",opts:["Aumentar velocidade","Diminuir movimento","Gerar vácuo","Transformar massa"],a:1},
  {q:"O que é reflexão da luz?",opts:["Luz atravessa material","Luz muda de direção","Luz absorvida","Luz gera calor"],a:1},
  {q:"Qual a unidade de energia?",opts:["Joule","Newton","Watt","Pascal"],a:0},
  {q:"O que é velocidade média?",opts:["Distância / Tempo","Força / Massa","Energia / Calor","Trabalho / Potência"],a:0},
  {q:"Quando um corpo está em repouso?",opts:["Está acelerando","Tem velocidade constante","Não tem movimento","Está girando"],a:2},
  {q:"A energia potencial está associada a:",opts:["Movimento","Altura","Calor","Som"],a:1},
  {q:"A luz é uma:",opts:["Onda mecânica","Onda eletromagnética","Partícula sólida","Vibração térmica"],a:1},
  {q:"O som é:",opts:["Uma onda transversal","Uma onda longitudinal","Luz refletida","Energia elétrica"],a:1},
  {q:"Qual a unidade de potência?",opts:["Watt","Pascal","Joule","Volt"],a:0},
  {q:"O que é trabalho?",opts:["Força x distância","Energia x tempo","Pressão x área","Massa x aceleração"],a:0},
  {q:"Quem formulou as Leis do Movimento?",opts:["Newton","Einstein","Galileu","Tesla"],a:0},
  {q:"A terceira lei de Newton fala sobre:",opts:["Ação e reação","Inércia","Gravidade","Energia"],a:0},
  {q:"O que acontece com a energia em uma transformação?",opts:["É destruída","É criada","É convertida","Desaparece"],a:2},
  {q:"A unidade de temperatura no SI é:",opts:["Celsius","Kelvin","Fahrenheit","Joule"],a:1},
  {q:"Qual partícula tem carga negativa?",opts:["Próton","Elétron","Nêutron","Fóton"],a:1},
  {q:"O que é corrente elétrica?",opts:["Fluxo de elétrons","Fluxo de fótons","Fluxo de prótons","Movimento de nêutrons"],a:0},
  {q:"O que é campo magnético?",opts:["Região com força elétrica","Região de influência magnética","Área com som","Espaço com luz"],a:1},
  {q:"A resistência elétrica é medida em:",opts:["Watt","Ohm","Joule","Ampère"],a:1},
  {q:"A gravidade na Terra é cerca de:",opts:["9,8 m/s²","8,9 m/s²","10 m/s²","7,5 m/s²"],a:0},
  {q:"A luz branca é formada por:",opts:["Uma cor","Três cores","Todas as cores do espectro","Som e cor"],a:2},
  {q:"A unidade de carga elétrica é:",opts:["Volt","Ampère","Coulomb","Ohm"],a:2},
  {q:"O que é uma onda?",opts:["Vibração que se propaga","Partícula imóvel","Corrente elétrica","Energia térmica"],a:0},
  {q:"O que é refração da luz?",opts:["Reflexo","Mudança de direção ao mudar de meio","Absorção","Queima"],a:1},
  {q:"Qual cientista desenvolveu a Relatividade?",opts:["Einstein","Newton","Faraday","Bohr"],a:0},
  {q:"O que é o vácuo?",opts:["Espaço sem matéria","Espaço com gases","Espaço com luz","Espaço com som"],a:0}
];

function shuffle(arr){ return arr.sort(() => Math.random() - 0.5); }

function pickQuestions(n){
  const lastUsed = JSON.parse(localStorage.getItem(LAST_Q_KEY) || "[]");
  const available = questionPool.filter(q => !lastUsed.includes(q.q));
  const pool = available.length < n ? questionPool : available;
  const selected = shuffle([...pool]).slice(0, n);
  localStorage.setItem(LAST_Q_KEY, JSON.stringify(selected.map(q => q.q)));
  return selected;
}

startBtn.onclick = () => {
  const name = playerInput.value.trim();
  if(!name){ alert("Informe seu nome!"); return; }
  playerName = name;
  questions = pickQuestions(10);
  currentIndex = 0;
  score = 0;
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  playerDisplay.textContent = "Jogador: " + playerName;
  showQuestion();
};

function showQuestion(){
  nextBtn.classList.add("hidden");
  const q = questions[currentIndex];
  questionText.textContent = q.q;
  optionsList.innerHTML = "";
  q.opts.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "option";
    btn.onclick = () => answer(i);
    optionsList.appendChild(btn);
  });
  timeLeft = 30;
  timeLeftEl.textContent = timeLeft;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timeLeftEl.textContent = timeLeft;
    if(timeLeft <= 0){
      clearInterval(timerInterval);
      showGameOver();
    }
  }, 1000);
}

function answer(i){
  clearInterval(timerInterval);
  const correct = questions[currentIndex].a;
  Array.from(optionsList.children).forEach((b, idx)=>{
    b.disabled = true;
    if(idx === correct) b.classList.add("correct");
    if(idx === i && i !== correct) b.classList.add("wrong");
  });
  if(i === correct) score++;
  nextBtn.classList.remove("hidden");
}

nextBtn.onclick = () => {
  currentIndex++;
  if(currentIndex < questions.length) showQuestion();
  else showResult();
};

function showResult(){
  gameScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  if(score === questions.length){
    scoreText.innerHTML = `
      🎉 <strong>Parabéns, ${playerName}!</strong> 🎉<br>
      Você acertou todas as perguntas! 🏆<br>
      Pontuação: ${score}/${questions.length}
    `;
    scoreText.style.color = "gold";
    scoreText.style.textShadow = "0 0 10px gold";
    startConfetti(); // 🎊 inicia o confete
  } else {
    scoreText.innerHTML = `${playerName}, você acertou ${score}/${questions.length} perguntas!`;
    scoreText.style.color = "white";
    scoreText.style.textShadow = "none";
  }

  const arr = JSON.parse(localStorage.getItem(LB_KEY) || "[]");
  arr.push({name: playerName, score: score});
  localStorage.setItem(LB_KEY, JSON.stringify(arr));
  renderLeaderboard(arr);
}

function renderLeaderboard(arr){
  const sorted = arr.sort((a,b)=>b.score - a.score);
  leaderboardBody.innerHTML = "";
  sorted.forEach((r,i)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>${r.name}</td>
      <td style="color:${r.score===10?'gold':'white'}">${r.score}</td>
    `;
    leaderboardBody.appendChild(tr);
  });
}

restartBtn.onclick = restartGameover.onclick = () => {
  stopConfetti();
  resultScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  playerInput.value = "";
};

function showGameOver(){
  gameScreen.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
}

// 🎊 Função de confete simples
let confettiInterval;
function startConfetti(){
  const colors = ["#FFD700","#FF4500","#00FF7F","#1E90FF","#FF69B4"];
  confettiInterval = setInterval(()=>{
    const conf = document.createElement("div");
    conf.className = "confetti";
    conf.style.background = colors[Math.floor(Math.random()*colors.length)];
    conf.style.left = Math.random()*100+"%";
    conf.style.animationDuration = 2+Math.random()*3+"s";
    document.body.appendChild(conf);
    setTimeout(()=>conf.remove(),4000);
  },100);
}
function stopConfetti(){ clearInterval(confettiInterval); }
