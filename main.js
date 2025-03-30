
const months = ['Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
let extraTotal = parseFloat(localStorage.getItem('extraTotal')) || 0;
let completedMonths = JSON.parse(localStorage.getItem('completedMonths')) || {};
let medals = JSON.parse(localStorage.getItem('medals')) || [];

function saveProgress() {
  localStorage.setItem('completedMonths', JSON.stringify(completedMonths));
  localStorage.setItem('extraTotal', extraTotal);
  localStorage.setItem('medals', JSON.stringify(medals));
}

function applyExtra() {
  const input = document.getElementById('extra-input');
  const value = parseFloat(input.value);
  if (!isNaN(value)) {
    extraTotal += value;
    saveProgress();
    showAchievement('Добавлено +€' + value);
    input.value = '';
  }
}

function showAchievement(text) {
  const pop = document.getElementById('achievement-popup');
  pop.textContent = text;
  document.getElementById('success-sound').play();
  setTimeout(() => pop.textContent = '', 3000);
}

function updateProgress() {
  const done = Object.keys(completedMonths).filter(m => Object.values(completedMonths[m] || {}).every(Boolean)).length;
  const percent = Math.round((done / months.length) * 100);
  document.getElementById('progress-percent').textContent = percent + '%';
  document.getElementById('progress-fill').style.width = percent + '%';
}

function toggleMonthDetails(id) {
  const content = document.getElementById('details-' + id);
  content.style.display = content.style.display === 'block' ? 'none' : 'block';
}

function toggleTask(month, taskId, monthDiv) {
  if (!completedMonths[month]) completedMonths[month] = {};
  completedMonths[month][taskId] = !completedMonths[month][taskId];
  saveProgress();
  checkMonthComplete(month, monthDiv);
  updateProgress();
}

function checkMonthComplete(month, monthDiv) {
  const tasks = completedMonths[month];
  if (tasks && Object.values(tasks).every(Boolean)) {
    if (!medals.includes(month)) {
      medals.push(month);
      showMedal(`Медаль за ${month}`);
      launchConfetti();
    }
    monthDiv.classList.add("completed");
  } else {
    monthDiv.classList.remove("completed");
  }
  renderMedals();
}

function showMedal(text) {
  const medalDiv = document.createElement('div');
  medalDiv.className = 'medal';
  medalDiv.textContent = text;
  document.getElementById('medals-container').appendChild(medalDiv);
}

function renderMedals() {
  const container = document.getElementById('medals-container');
  container.innerHTML = '';
  medals.forEach(m => showMedal(`Медаль за ${m}`));
}

function renderMonths() {
  const container = document.getElementById('months-container');
  months.forEach((month, index) => {
    const div = document.createElement('div');
    div.className = 'month';
    if (completedMonths[month] && Object.values(completedMonths[month]).every(Boolean)) {
      div.classList.add('completed');
    }

    const header = document.createElement('h2');
    header.textContent = month;
    header.onclick = () => toggleMonthDetails(index);
    div.appendChild(header);

    const details = document.createElement('div');
    details.className = 'details';
    details.id = 'details-' + index;

    const categories = [
      'Доход: 1400€',
      'Расходы: 630€ (400 — машина, 100 — топливо, 37 — телефон, 24 — интернет, 50 — бабушке, 19 — страховка)',
      'Обязательные платежи: Placet, Ferratum, Credit24 и др.',
      'Досрочная оплата кредита',
      'Итог: подтвердить выполнение месяца'
    ];

    categories.forEach((text, i) => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = completedMonths[month]?.[i] || false;
      checkbox.onchange = () => toggleTask(month, i, div);
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + text));
      details.appendChild(label);
      details.appendChild(document.createElement('br'));
    });

    div.appendChild(details);
    container.appendChild(div);
  });
}

function launchConfetti() {
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  for (let i = 0; i < 150; i++) {
    ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 5, 5);
  }
  setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  renderMonths();
  updateProgress();
  renderMedals();
});
