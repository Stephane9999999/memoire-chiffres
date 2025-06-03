<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Jeu Mémoire – Chiffres</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * {
      transition: background-color 0.3s ease, color 0.3s ease;
      font-family: 'Poppins', sans-serif;
    }
    body.dark-mode {
      background-color: #121212;
      color: white;
    }
    body:not(.dark-mode) {
      background-color: #ffffff;
      color: #121212;
    }
    body {
      text-align: center;
      padding: 2rem;
    }
    button {
      background-color: #00C897;
      color: white;
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      margin: 0.5rem;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      transition: all 0.2s ease-in-out;
    }
    button:hover {
      transform: scale(1.05);
      background-color: #00e0a2;
    }
    input {
      padding: 0.6rem;
      font-size: 1rem;
      margin: 0.5rem;
      border-radius: 6px;
      border: 1px solid #ccc;
      outline: none;
    }
    label, h1, h2, p {
      font-weight: bold;
    }
    #sequence {
      font-size: 2rem;
      margin: 1rem 0;
    }
    #progressBarContainer {
      width: 100%;
      background-color: #ccc;
      height: 20px;
      margin-top: 1rem;
      display: none;
    }
    #progressBar {
      width: 0%;
      height: 100%;
      background-color: #00C897;
      transition: width 0.2s linear;
    }
    #themeToggleBtn {
      background-color: transparent;
      border: 2px solid #00c897;
      color: #00c897;
      padding: 0.4rem 1rem;
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: bold;
    }
    #themeToggleBtn:hover {
      background-color: #00c897;
      color: white;
    }
    #statsHistorique {
      background-color: rgba(0, 200, 151, 0.1);
      border: 2px solid #00c897;
      padding: 1rem;
      border-radius: 10px;
      margin-bottom: 1rem;
      font-weight: bold;
    }
    #barTaux {
      height: 100%;
      width: 0;
      background-color: #00c897;
      transition: width 0.5s ease, background-color 0.3s ease;
    }
    .historique-entry {
      margin: 0.5rem auto;
      max-width: 300px;
      background-color: #1e1e1e;
      color: white;
      padding: 0.7rem;
      border-radius: 6px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
  <button id="themeToggleBtn" onclick="changerTheme()">🌙 Thème sombre</button>
  <div style="max-width: 500px; margin: auto;">
    <select id="langSelect" onchange="changerLangue()" style="margin-bottom: 1rem;">
      <option value="fr">🇫🇷 Français</option>
      <option value="en">🇬🇧 English</option>
      <option value="uk">🇺🇦 Українська</option>
      <option value="ru">🇷🇺 Русский</option>
    </select>
    <h1>🧠 Jeu de mémoire – Retiens les chiffres</h1>
    <label for="nbChiffres">Nombre de chiffres :</label>
    <input type="number" id="nbChiffres" value="6" min="1" max="50"><br>
    <label for="temps">Temps à mémoriser (en secondes) :</label>
    <input type="number" id="temps" value="10" min="1"><br>
    <button onclick="genererChiffres()">Générer une suite</button>
    <div id="sequence"></div>
    <div id="progressBarContainer"><div id="progressBar"></div></div>
    <div id="zoneInput" style="display:none;">
      <input type="text" id="reponse" placeholder="Tape ta réponse ici">
      <button onclick="verifier()">Vérifier</button>
    </div>
    <button onclick="resetJeu()" style="background-color: #e74c3c;">Réinitialiser</button>
    <p id="resultat"></p>
    <div id="historique">
      <div id="statsHistorique"></div>
      <div id="barTaux"></div>
      <h2>📊 Historique des résultats</h2>
      <div id="listeHistorique"></div>
    </div>
  </div>
  <script>
    const traductions = {
      fr: {
        title: "🧠 Jeu de mémoire – Retiens les chiffres",
        nbLabel: "Nombre de chiffres :",
        timeLabel: "Temps à mémoriser (en secondes) :",
        generateBtn: "Générer une suite",
        resetBtn: "Réinitialiser",
        placeholder: "Tape ta réponse ici",
        verifyBtn: "Vérifier",
        historyTitle: "📊 Historique des résultats"
      },
      en: {
        title: "🧠 Memory Game – Remember the digits",
        nbLabel: "Number of digits:",
        timeLabel: "Time to memorize (in seconds):",
        generateBtn: "Generate a sequence",
        resetBtn: "Reset",
        placeholder: "Type your answer here",
        verifyBtn: "Check",
        historyTitle: "📊 Result history"
      },
      uk: {
        title: "🧠 Гра на памʼять – Запамʼятай числа",
        nbLabel: "Кількість цифр:",
        timeLabel: "Час на запамʼятовування (в секундах):",
        generateBtn: "Згенерувати послідовність",
        resetBtn: "Скинути",
        placeholder: "Введіть відповідь тут",
        verifyBtn: "Перевірити",
        historyTitle: "📊 Історія результатів"
      },
      ru: {
        title: "🧠 Игра на память – Запомни цифры",
        nbLabel: "Количество цифр:",
        timeLabel: "Время для запоминания (в секундах):",
        generateBtn: "Создать последовательность",
        resetBtn: "Сбросить",
        placeholder: "Введи ответ здесь",
        verifyBtn: "Проверить",
        historyTitle: "📊 История результатов"
      }
    };

    let suite = "";
    let timerInterval;

    function changerTheme() {
      const body = document.body;
      const isDark = body.classList.toggle("dark-mode");
      document.getElementById("themeToggleBtn").innerHTML = isDark ? "🌞 Thème clair" : "🌙 Thème sombre";
      localStorage.setItem("themeMemoire", isDark ? "dark" : "light");
    }

    function changerLangue() {
      const lang = document.getElementById("langSelect").value;
      const t = traductions[lang];
      document.querySelector("h1").textContent = t.title;
      document.querySelector("label[for='nbChiffres']").textContent = t.nbLabel;
      document.querySelector("label[for='temps']").textContent = t.timeLabel;
      document.querySelector("button[onclick='genererChiffres()']").textContent = t.generateBtn;
      document.querySelector("button[onclick='resetJeu()']").textContent = t.resetBtn;
      document.querySelector("input#reponse").placeholder = t.placeholder;
      document.querySelector("#historique h2").textContent = t.historyTitle;
      localStorage.setItem("langueMemoire", lang);
    }

    function genererChiffres() {
      const nb = parseInt(document.getElementById("nbChiffres").value);
      const delay = parseInt(document.getElementById("temps").value) * 1000;
      suite = "";
      for (let i = 0; i < nb; i++) suite += Math.floor(Math.random() * 10);

      document.getElementById("sequence").innerText = suite;
      document.getElementById("resultat").innerText = "";
      document.getElementById("zoneInput").style.display = "none";
      document.getElementById("reponse").value = "";

      let progress = 0;
      const steps = delay / 100;
      const progressBar = document.getElementById("progressBar");
      const progressContainer = document.getElementById("progressBarContainer");

      progressContainer.style.display = "block";
      progressBar.style.width = "0%";

      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        progress++;
        progressBar.style.width = (progress / steps) * 100 + "%";
        if (progress >= steps) {
          clearInterval(timerInterval);
          progressContainer.style.display = "none";
          document.getElementById("sequence").innerText = "Souviens-toi maintenant !";
          document.getElementById("zoneInput").style.display = "block";
        }
      }, 100);
    }

    function verifier() {
      const saisie = document.getElementById("reponse").value.trim();
      const aujourdHui = new Date().toISOString().slice(0, 10);
      const reussi = saisie === suite;
      const message = reussi
        ? "✅ Bien joué frérot ! Bonne réponse."
        : "❌ Mauvais ! La bonne suite était : " + suite;
      document.getElementById("resultat").innerText = message;

      let historique = JSON.parse(localStorage.getItem("historiqueMemoire") || "[]");
      historique.push({ date: aujourdHui, reussi, suite });
      localStorage.setItem("historiqueMemoire", JSON.stringify(historique));
      afficherHistorique();
    }

    function resetJeu() {
      document.getElementById("sequence").innerText = "";
      document.getElementById("reponse").value = "";
      document.getElementById("resultat").innerText = "";
      document.getElementById("zoneInput").style.display = "none";
    }

    function afficherHistorique() {
      const liste = document.getElementById("listeHistorique");
      const stats = document.getElementById("statsHistorique");
      const historique = JSON.parse(localStorage.getItem("historiqueMemoire")) || [];

      const total = historique.length;
      const nbReussites = historique.filter(r => r.reussi).length;
      const tauxReussite = total ? Math.round((nbReussites / total) * 100) : 0;
      const totalChiffres = historique.reduce((acc, r) => acc + (r.suite ? r.suite.length : 0), 0);
      const moyenne = total ? (totalChiffres / total).toFixed(1) : 0;

      const bar = document.getElementById("barTaux");
      bar.style.width = `${tauxReussite}%`;
      bar.textContent = `${tauxReussite}%`;
      bar.style.backgroundColor = tauxReussite >= 80 ? "#00c853" : tauxReussite >= 50 ? "#ffca28" : "#e74c3c";
      bar.style.color = "white";
      bar.style.textAlign = "center";
      bar.style.fontWeight = "bold";

      stats.innerHTML = `📊 Moyenne : ${moyenne} chiffres | ✅ Taux de réussite : ${tauxReussite}%`;

      liste.innerHTML = "";
      historique.slice(-10).reverse().forEach(entry => {
        const div = document.createElement("div");
        div.className = "historique-entry";
        div.textContent = `${entry.date} : ${entry.reussi ? "✅" : "❌"}`;
        liste.appendChild(div);
      });
    }

    function chargerDefi() {
      const lang = localStorage.getItem("langueMemoire") || "fr";
      document.getElementById("langSelect").value = lang;
      changerLangue();

      const savedTheme = localStorage.getItem("themeMemoire") || "dark";
      document.body.classList.toggle("dark-mode", savedTheme === "dark");
      document.getElementById("themeToggleBtn").innerHTML = savedTheme === "dark" ? "🌞 Thème clair" : "🌙 Thème sombre";

      afficherHistorique();
    }

    window.onload = chargerDefi;
  </script>
</body>
</html>
