function playWinSound() {
  const audio = document.getElementById("win");
  audio.play();
}

function playLooseSound() {
  const audio = document.getElementById("loose");
  audio.play();
}
const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const playBtn = document.getElementById("play-btn");
const guessInput = document.getElementById("guess");

//Object that stores values of minimum and maximum angle for a value
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: 2 },
  { minDegree: 31, maxDegree: 90, value: 1 },
  { minDegree: 91, maxDegree: 150, value: 6 },
  { minDegree: 151, maxDegree: 210, value: 5 },
  { minDegree: 211, maxDegree: 270, value: 4 },
  { minDegree: 271, maxDegree: 330, value: 3 },
  { minDegree: 331, maxDegree: 360, value: 2 },
];
//Size of each piece
const data = [16, 16, 16, 16, 16, 16];
//background color for each piece
var pieColors = [
  "#FF595E",
  "#FFCA3A",
  "#8AC926",
  "#1982C4",
  "#6A4C93",
  "#b163da",
];

//Create chart
let myChart = new Chart(wheel, {
  //Plugin for displaying text on pie chart
  plugins: [ChartDataLabels],
  //Chart Type Pie
  type: "pie",
  data: {
    //Labels(values which are to be displayed on chart)
    labels: [1, 2, 3, 4, 5, 6],
    //Settings for dataset/pie
    datasets: [
      {
        backgroundColor: pieColors,
        data: data,
      },
    ],
  },
  options: {
    //Responsive chart
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      //hide tooltip and legend
      tooltip: false,
      legend: {
        display: false,
      },
      //display labels inside pie chart
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});

//display value based on the randomAngle
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    //if the angleValue is between min and max then display it
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p>Value: ${i.value}</p>`;
      spinBtn.disabled = false;
      break;
    }
  }
};

//Spinner count
let count = 0;
//100 rotations for animation and last rotation for result
let resultValue = 101;

spinBtn.addEventListener("click", () => {
  // Afficher l'alerte pour choisir un chiffre entre 1 et 6
  const guessedNumber = parseInt(
    prompt("Choisissez un chiffre entre 1 et 6:"),
    10
  );

  // Vérifier la validité du chiffre choisi
  if (isNaN(guessedNumber) || guessedNumber < 1 || guessedNumber > 6) {
    alert("Veuillez entrer un chiffre valide entre 1 et 6.");
    return;
  }

  // Démarrer la rotation avec le chiffre choisi
  spinBtn.disabled = true;
  // Empty final value
  finalValue.innerHTML = `<p>Good Luck!</p>`;
  // Generate random degrees to stop at
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  // Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    // Set rotation for piechart
    myChart.options.rotation = myChart.options.rotation + resultValue;
    // Update chart with new value
    myChart.update();
    // If rotation > 360 reset it back to 0
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);

      // Vérifier si le chiffre choisi correspond au résultat
      if (
        guessedNumber === parseInt(finalValue.textContent.match(/\d+/)[0], 10)
      ) {
        // Jouer le son de la victoire

        playWinSound();
        alert("Félicitations, vous avez gagné !");
      } else {
        playLooseSound();
        alert("Désolé, vous avez perdu. Essayez encore !");
      }

      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});

// Fonction pour vérifier le résultat
const checkResult = () => {
  const guessedNumber = parseInt(
    prompt("Choisissez un chiffre entre 1 et 6:"),
    10
  );

  if (isNaN(guessedNumber) || guessedNumber < 1 || guessedNumber > 6) {
    alert("Veuillez entrer un chiffre valide entre 1 et 6.");
    return;
  }

  guessInput.value = guessedNumber;

  // Désactiver le champ input pour empêcher la modification ultérieure
  guessInput.setAttribute("readonly", "true");

  // Désactiver le bouton "Jouer" après le choix initial
  playBtn.disabled = true;

  // Lancer la rotation après que l'utilisateur a fait son choix
  startRotation(guessedNumber);
};

// Ajouter un écouteur d'événements pour le bouton "Jouer"
playBtn.addEventListener("click", checkResult);

// Modifier la fonction startRotation pour utiliser le chiffre choisi
const startRotation = (guessedNumber) => {
  spinBtn.disabled = true;
  //   finalValue.innerHTML = `<p>Good Luck!</p>`;

  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  let rotationInterval = window.setInterval(() => {
    myChart.options.rotation = myChart.options.rotation + resultValue;
    myChart.update();

    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);

      // Vérifier si le chiffre choisi correspond au résultat
      if (
        guessedNumber === parseInt(finalValue.textContent.match(/\d+/)[0], 10)
      ) {
        alert("Félicitations, vous avez gagné !");
      } else {
        alert("Désolé, vous avez perdu. Essayez encore !");
      }

      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
};
