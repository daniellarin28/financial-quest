
const months = ['Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
let extraTotal = parseFloat(localStorage.getItem('extraTotal')) || 0;
let completedMonths = JSON.parse(localStorage.getItem('completedMonths')) || {};

function saveProgress() {
  localStorage.setItem('completedMonths', JSON.stringify(completedMonths));
  localStorage.setItem('extraTotal', extraTotal);
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
  const done = Object.keys(completedMonths).length;
  const percent = Math.round((done / months.length) * 100);
  document.getElementById('progress-percent').textContent = percent + '%';
  document.getElementById('progress-fill').style.width = percent + '%';
}

function toggleMonthDetails(id) {
  const content = document.getElementById('details-' + id);
  content.style.display = content.style.display === 'block' ? 'none' : 'block';
}

function toggleTask(month, taskId) {
  if (!completedMonths[month]) completedMonths[month] = {};
  completedMonths[month][taskId] = !completedMonths[month][taskId];
  saveProgress();
  updateProgress();
}

function renderMonths() {
  const container = document.getElementById('months-container');
  months.forEach((month, index) => {
    const div = document.createElement('div');
    div.className = 'month';

    const header = document.createElement('h2');
    header.textContent = month;
    header.onclick = () => toggleMonthDetails(index);
    div.appendChild(header);

    const details = document.createElement('div');
    details.className = 'details';
    details.id = 'details-' + index;

    ['Доход: 1400€', 'Расходы: 630€', 'Кредит 1', 'Кредит 2', 'Досрочная оплата'].forEach((item, i) => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = completedMonths[month]?.[i] || false;
      checkbox.onchange = () => toggleTask(month, i);
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(' ' + item));
      details.appendChild(label);
      details.appendChild(document.createElement('br'));
    });

    div.appendChild(details);
    container.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderMonths();
  updateProgress();
});
