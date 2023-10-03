export function formatingDate(data: string) {
  return data.slice(0, 10).replaceAll('-', '.').split('.').reverse().join('.');
}

export function dateDifference(data1: number, data2: number) {
  // Берем разницу дат в секундах
  let delta = Math.floor((data1 - data2) / 1000);
  // Вычисляем количество ПОЛНЫХ дней
  const days = Math.floor(delta / 86400);
  // А теперь вычитаем из секунд количество дней, выраженных в секундах
  delta -= days * 86400;
  // В оставшихся секунд вычленяем количество полных часов
  const hours = Math.floor(delta / 3600) % 24;
  // Также их потом вычитаем, выразив в секундах
  delta -= hours * 3600;
  // Из оставшихся секунд берем минуты
  const minutes = Math.floor(delta / 60) % 60;
  // Опять вычитаем
  delta -= minutes * 60;
  // И наконец секунды
  // В теории  деление по модулю на 60 не обязателен
  const seconds = delta % 60;
  // Итоговая дата
  if (days > 0) {
    return `${days} д. ${hours} год. ${minutes} хв тому `;
  } else if (hours > 0) {
    return `${hours} год. ${minutes} хв тому`;
  } else {
    return `${minutes} хв тому`;
  }
}

export function formatDate() {
  const d = new Date(Date.now());
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}
