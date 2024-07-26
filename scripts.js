const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const hourHand = document.getElementById("hour-hand");
const minuteHand = document.getElementById("minute-hand");
const secondHand = document.getElementById("second-hand");
const timeDisplay = document.getElementById("time-display");

let timerInterval;
let totalSeconds = 1500; // 25 minutes

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(updateClock, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  totalSeconds = 1500;
  updateClock();
}

function updateClock() {
  if (totalSeconds <= 0) {
    clearInterval(timerInterval);
    return;
  }

  totalSeconds--;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hourDegrees = (hours % 12) * 30 + (minutes / 60) * 30;
  const minuteDegrees = minutes * 6 + (seconds / 60) * 6;
  const secondDegrees = seconds * 6;

  hourHand.style.transform = `rotate(${hourDegrees}deg)`;
  minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
  secondHand.style.transform = `rotate(${secondDegrees}deg)`;

  // Update the numeric time display
  timeDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

startButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetTimer);

updateClock(); // Initialize clock position




// Poll Form

document.addEventListener("DOMContentLoaded", function () {
  const pollForm = document.getElementById("poll-form");
  const pollOptionsDiv = document.getElementById("poll-options");
  const pollVotingDiv = document.getElementById("poll-voting");
  const pollChartCtx = document.getElementById("poll-chart").getContext("2d");
  let pollChart;
  let pollData = [];

  document.getElementById("add-option").addEventListener("click", function () {
    const newOption = document.createElement("input");
    newOption.type = "text";
    newOption.className = "poll-option";
    newOption.required = true;
    pollOptionsDiv.appendChild(newOption);
  });

  pollForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const question = document.getElementById("poll-question").value;
    const options = Array.from(
      document.getElementsByClassName("poll-option")
    ).map((input) => input.value);

    pollData = new Array(options.length).fill(0);

    const data = {
      labels: options,
      datasets: [
        {
          label: question,
          data: pollData,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    if (pollChart) {
      pollChart.destroy();
    }

    const colors = [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
    ];

    const borderColors = [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];

    pollChart = new Chart(pollChartCtx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            data: data.datasets[0].data,
            backgroundColor: colors.slice(0, data.labels.length),
            borderColor: borderColors.slice(0, data.labels.length),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });





    // Create voting buttons
    pollVotingDiv.innerHTML = "";
    options.forEach((option, index) => {
      const button = document.createElement("button");
      button.textContent = `Vote for ${option}`;
      button.addEventListener("click", function () {
        pollData[index]++;
        pollChart.update();
      });
      pollVotingDiv.appendChild(button);
    });
  });
});




// Daily Quote
const quoteElement = document.getElementById("quote");
fetch("https://api.quotable.io/random")
  .then((response) => response.json())
  .then((data) => {
    quoteElement.textContent = `"${data.content}" - ${data.author}`;
  })
  .catch((error) => {
    console.error("Error fetching quote:", error);
  });



// Issue Tracker
document.addEventListener("DOMContentLoaded", function () {
  const issueInput = document.getElementById("issue-input");
  const addIssueButton = document.getElementById("add-issue");
  const allIssuesList = document.getElementById("all-issues");
  const solvedIssuesList = document.getElementById("solved-issues-list");
  const progressBar = document.getElementById("progress-bar");

  addIssueButton.addEventListener("click", function () {
    const issueText = issueInput.value.trim();
    if (issueText !== "") {
      addIssue(issueText);
      issueInput.value = "";
    }
  });

  function addIssue(text) {
    const li = document.createElement("li");
    li.innerHTML = `
            <span class="issue-text">${text}</span>
            <div class="issue-actions">
                <button class="solve-issue">Solve</button>
            </div>
        `;
    allIssuesList.appendChild(li);

    const solveButton = li.querySelector(".solve-issue");
    solveButton.addEventListener("click", function () {
      solveIssue(li);
    });

    updateProgressBar();
  }

  function solveIssue(issueElement) {
    const issueText = issueElement.querySelector(".issue-text").textContent;
    issueElement.remove();
    const solvedLi = document.createElement("li");
    solvedLi.innerHTML = `
            <span class="issue-text">${issueText}</span>
            <div class="issue-actions">
                <button class="unsolve-issue">Unsolve</button>
            </div>
        `;
    solvedIssuesList.appendChild(solvedLi);

    const unsolveButton = solvedLi.querySelector(".unsolve-issue");
    unsolveButton.addEventListener("click", function () {
      unsolveIssue(solvedLi);
    });

    updateProgressBar();
  }

  function unsolveIssue(issueElement) {
    const issueText = issueElement.querySelector(".issue-text").textContent;
    issueElement.remove();
    addIssue(issueText);
    updateProgressBar();
  }

  function updateProgressBar() {
    const totalIssues =
      allIssuesList.children.length + solvedIssuesList.children.length;
    const solvedIssues = solvedIssuesList.children.length;
    const progress = totalIssues === 0 ? 0 : (solvedIssues / totalIssues) * 100;
    progressBar.style.width = progress + "%";
    progressBar.textContent = Math.round(progress) + "%";
  }
});
