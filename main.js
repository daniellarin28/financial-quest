
const months = ['Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
let completed = 0;
let extraTotal = 0;

const monthList = document.getElementById('month-list');
const progressFill = document.getElementById('progress-fill');
const progressPercent = document.getElementById('progress-percent');
const achievementPopup = document.getElementById('achievement-popup');

function applyExtra() {
    const extra = parseFloat(document.getElementById('extra-input').value);
    if (!isNaN(extra)) {
        extraTotal += extra;
        showAchievement(`Добавлен +${extra}€!`);
        document.getElementById('extra-input').value = '';
    }
}

function showAchievement(text) {
    achievementPopup.textContent = text;
    setTimeout(() => achievementPopup.textContent = '', 3000);
}

months.forEach((month, i) => {
  const container = document.createElement('div');
  container.className = 'month';

  const header = document.createElement('h2');
  header.textContent = month;
  container.appendChild(header);

  const info = document.createElement('p');
  info.textContent = `Доход: 1400€, Расходы: 630€, Кредиты + Досрочные: рассчитываются...`;
  container.appendChild(info);

  const btn = document.createElement('button');
  btn.textContent = "Подтвердить месяц";
  btn.onclick = () => {
    if (!btn.classList.contains('done')) {
      btn.classList.add('done');
      btn.style.backgroundColor = '#888';
      completed++;
      updateProgress();
      showAchievement(`Месяц "${month}" завершён!`);
    }
  };
  container.appendChild(btn);
  monthList.appendChild(container);
});

function updateProgress() {
  const percent = Math.round((completed / months.length) * 100);
  progressFill.style.width = percent + '%';
  progressPercent.textContent = percent + '%';
}
