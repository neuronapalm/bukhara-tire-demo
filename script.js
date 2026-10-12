const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  navigation.classList.toggle('is-open', !open);
});

navigation?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    navigation.classList.remove('is-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }
});

const taskContent = {
  change: {
    title: 'Сезонная замена и балансировка',
    copy: 'Назовите марку автомобиля и диаметр колёс. Уточните доступное время и итоговую стоимость полного комплекта.'
  },
  puncture: {
    title: 'Прокол, порез или потеря давления',
    copy: 'Опишите повреждение и сообщите, держит ли колесо давление. Мастер уточнит, доступна ли вулканизация и можно ли безопасно доехать.'
  },
  disc: {
    title: 'Правка, прокатка и работа с дисками',
    copy: 'Сообщите тип диска и симптомы: биение, деформация или повреждение. Возможность ремонта и стоимость нужно подтвердить после оценки.'
  },
  mobile: {
    title: 'Выездной шиномонтаж',
    copy: 'Назовите адрес, автомобиль и проблему. Зона выезда, время прибытия и стоимость публично не указаны — их согласует мастер.'
  }
};

const tabs = [...document.querySelectorAll('[data-task]')];
const panel = document.querySelector('#task-panel');
const taskTitle = document.querySelector('[data-task-title]');
const taskCopy = document.querySelector('[data-task-copy]');

function selectTask(tab) {
  const item = taskContent[tab.dataset.task];
  tabs.forEach((candidate) => candidate.setAttribute('aria-selected', String(candidate === tab)));
  panel?.setAttribute('aria-labelledby', tab.id);
  if (taskTitle) taskTitle.textContent = item.title;
  if (taskCopy) taskCopy.textContent = item.copy;
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTask(tab));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowDown') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    tabs[next].focus();
    selectTask(tabs[next]);
  });
});

const copyButton = document.querySelector('[data-copy-address]');
const copyStatus = document.querySelector('.copy-status');
copyButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('Тюмень, Советская улица, 97/1');
    copyStatus.textContent = 'Адрес скопирован.';
  } catch {
    copyStatus.textContent = 'Не удалось скопировать. Адрес: Тюмень, Советская улица, 97/1.';
  }
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
}
