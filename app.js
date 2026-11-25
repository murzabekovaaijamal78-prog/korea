(() => {
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const store = { get:k => { try { return localStorage.getItem(k); } catch { return null; } }, set:(k,v) => { try { localStorage.setItem(k,v); } catch {} } };
const W = f => `https://commons.wikimedia.org/wiki/Special:FilePath/${f}?width=800`;
const img = (f, alt) => `<img src="${W(f)}" alt="${alt}" loading="lazy" onerror="this.remove()">`;

const PLACES = [
 {n:'Дворец Кёнбоккун',r:'Сеул',e:'🏯',f:'Gyeongbokgung_Palace_Geunjeongjeon.jpg',d:'Главный дворец династии Чосон, основанный в 1395 году.',t:'Дворец был разрушен в конце XVI века и заново отстроен в 1860-х. Здесь проходит смена караула, а у входа можно взять ханбок напрокат.',w:'Весна и осень',s:'Приходите к открытию, пока нет толпы'},
 {n:'Деревня ханоков Букчон',r:'Сеул',e:'🏘️',f:'Bukchon_Hanok_Village.jpg',d:'Узкие улочки с традиционными домами на фоне современного города.',t:'Жилой квартал, где сохранились сотни ханоков. Здесь живут люди, поэтому ведите себя тихо.',w:'Утро в будни',s:'Поднимитесь выше по склону ради вида на крыши'},
 {n:'Башня N Seoul Tower',r:'Сеул',e:'🗼',f:'N_Seoul_Tower.jpg',d:'Символ ночного Сеула на горе Намсан.',t:'Башня стоит на вершине Намсана, на высоте около 480 метров над уровнем моря. Вид на вечерний город один из лучших в стране.',w:'Закат и вечер',s:'Подняться можно по канатной дороге или пешком'},
 {n:'Остров Чеджу',r:'Чеджу',e:'🌋',f:'Hallasan_Jeju.jpg',d:'Вулканический остров с горой Халласан, пляжами и лавовыми пещерами.',t:'Вулканические ландшафты Чеджу включены в список Всемирного наследия ЮНЕСКО. Высшая точка острова — Халласан (1947 м).',w:'Весна и осень',s:'Для поездок по острову удобнее арендовать машину'},
 {n:'Деревня Гамчхон',r:'Пусан',e:'🎨',f:'Gamcheon_Culture_Village.jpg',d:'Разноцветные домики на склоне, похожие на корейское Санторини.',t:'Бывший район бедняков превратился в арт-деревню с муралами, галереями и кафе.',w:'Круглый год',s:'Возьмите карту с точками арт-объектов у входа'},
 {n:'Пляж Хэундэ',r:'Пусан',e:'🏖️',f:'Haeundae_Beach.jpg',d:'Самый известный городской пляж страны.',t:'В Пусане рядом с пляжем много ресторанов с морепродуктами и рынок Чагальчи.',w:'Лето',s:'Попробуйте свежие морепродукты на рынке Чагальчи'},
 {n:'Национальный парк Сораксан',r:'Природа и храмы',e:'⛰️',f:'Seoraksan_National_Park.jpg',d:'Скалистые пики, водопады и горные храмы на востоке страны.',t:'Парк признан биосферным заповедником ЮНЕСКО. Самая высокая вершина — Тэчхонбон (около 1708 м).',w:'Октябрь — золотая осень',s:'Канатная дорога к крепости Квонгымсон экономит силы'},
 {n:'Храм Пульгукса, Кёнджу',r:'Природа и храмы',e:'🛕',f:'Bulguksa.jpg',d:'Буддийский храм эпохи Силла, объект Всемирного наследия.',t:'Кёнджу называют «музеем без стен»: город был столицей Силла почти тысячу лет. Храм Пульгукса входит в список ЮНЕСКО.',w:'Весна (цветение вишни)',s:'Загляните в парк курганов Тэнымчхон'}
];
const FOODS = [
 {n:'Кимчи',k:'김치',e:'🥬',s:2,d:'Ферментированная острая капуста: подаётся к каждому приёму пищи.'},
 {n:'Бибимбап',k:'비빔밥',e:'🍚',s:1,d:'Рис с овощами, мясом, яйцом и пастой кочуджан. Перемешивайте перед едой.'},
 {n:'Пульгоги',k:'불고기',e:'🥩',s:0,d:'Маринованная в сладком соевом соусе говядина на гриле.'},
 {n:'Токпокки',k:'떡볶이',e:'🍢',s:3,d:'Рисовые клёцки в остром соусе: любимая уличная еда.'},
 {n:'Жареная курица',k:'치킨',e:'🍗',s:1,d:'Хрустящая курица в глазури, которую едят с пивом.'},
 {n:'Самгёпсаль',k:'삼겹살',e:'🥓',s:0,d:'Ломтики свиной грудинки, жарят прямо за столом и заворачивают в салат.'},
 {n:'Нэнмён',k:'냉면',e:'🍜',s:1,d:'Холодная лапша в ледяном бульоне, освежает в жару.'},
 {n:'Хоттоки',k:'호떡',e:'🥞',s:0,d:'Сладкие лепёшки с коричневым сахаром и орехами.'}
];
const hot = n => n ? '🌶'.repeat(n) : 'не острое';
const CULT = {
 'Хангыль':{big:'한글',h:'Алфавит, придуманный королём',p:'Хангыль создан при короле Седжоне Великом в XV веке (1443 год) и придуман так, чтобы его мог выучить любой.',l:['Основа — 24 буквы: 14 согласных и 10 гласных','День хангыля отмечают 9 октября','Формы согласных повторяют положение речевого аппарата']},
 'Ханбок':{big:'한복',h:'Традиционный костюм',p:'Ханбок — это короткая куртка чогори и юбка чхима для женщин или брюки пачжи для мужчин. Яркие цвета и плавные линии отличают его от других костюмов Азии.',l:['Во дворцах Сеула в ханбоке часто пускают бесплатно','Цвета раньше показывали возраст и статус','Сегодня его надевают на праздники и свадьбы']},
 'Ханок':{big:'한옥',h:'Дом с тёплым полом',p:'Ханок строят из дерева, камня и бумаги. Изогнутая черепичная крыша — главная примета, а тепло дому даёт система подогрева пола ондоль.',l:['Ондоль — предок современных тёплых полов','Бумажные двери хансиджи пропускают мягкий свет','Остаться на ночь можно в хансоке-гестхаусах']},
 'Праздники':{big:'추석',h:'Чхусок и Соллаль',p:'Чхусок — осенний праздник урожая, Соллаль — Новый год по лунному календарю. В эти дни семьи собираются вместе и надевают ханбок.',l:['На Соллаль едят суп токкук','На Чхусок готовят рисовые пирожки сонпхён','В эти дни многие заведения закрыты, а транспорт загружен']},
 'Таэквондо':{big:'태권도',h:'Боевое искусство страны',p:'Таэквондо родилось в Корее в XX веке, и сегодня им занимаются во всём мире. Это олимпийский вид спорта с 2000 года.',l:['Название переводится как «путь руки и ноги»','В Сеуле можно попасть на показательные выступления','Есть мастер-классы для туристов']}
};
const TIME = [
 ['1392','Основание династии Чосон: она правила до 1910 года.'],
 ['1443','Король Седжон создаёт корейский алфавит хангыль.'],
 ['1948','Провозглашена Республика Корея.'],
 ['1950–1953','Корейская война: страна разделена на Север и Юг.'],
 ['1988','Сеул принимает летние Олимпийские игры.'],
 ['2012','Песня «Gangnam Style» становится мировым хитом.'],
 ['2020','«Паразиты» получают «Оскар» за лучший фильм, а BTS возглавляют Billboard Hot 100.'],
 ['2021','Сериал «Игра в кальмара» бьёт рекорды Netflix.']
];
const POP = {
 'Группы':[['BTS','2013','HYBE'],['BLACKPINK','2016','YG Entertainment'],['SEVENTEEN','2015','Pledis'],['Stray Kids','2018','JYP Entertainment'],['aespa','2020','SM Entertainment'],['NewJeans','2022','ADOR']],
 'Дорамы':[['Крушение любви: Посадка в Корею','2019','Романтика. Лётчица из Сеула, Север и Юг.'],['Игра в кальмара','2021','Триллер. Игры на выживание.'],['Гоблин','2016','Фэнтези. Бессмертный дух и девушка.'],['Потомки солнца','2016','Мелодрама. Военный и врач.']]
};
const FACTS = [
 ['Женщины-ныряльщицы Чеджу','Хенё ныряют за морепродуктами без акваланга. Их традиция внесена в список ЮНЕСКО.','Хенё, 2016 год'],
 ['Возраст — новый','С июня 2023 года в официальных документах Южной Кореи применяют международный возраст.','Раньше при рождении давали 1 год'],
 ['Тёплый пол','Ондоль греет дом снизу уже сотни лет: в Корее принято сидеть и спать на полу.','Обувь снимают на входе'],
 ['Культура «пали-пали»','«Быстро-быстро»: курьеры, интернет и сервис в стране работают очень оперативно.','Подгоняйте себя!']
];
const PHR = [['안녕하세요','Аннёнхасейо','Здравствуйте'],['감사합니다','Камсахамнида','Спасибо'],['맛있어요','Масисоё','Очень вкусно'],['얼마예요?','Ольмаэё?','Сколько стоит?'],['죄송합니다','Чхвесонхамнида','Извините'],['화이팅!','Хвайтин!','Давай, у тебя получится!']];

// Места
let pr = 'Все';
const placeCard = (p,i) => `<article class="card rv"><div class="thumb">${p.e}${img(p.f,p.n)}</div><div class="card-b"><span class="tag">${p.r}</span><h3>${p.n}</h3><p>${p.d}</p><button class="btn" data-place="${i}">Подробнее</button></div></article>`;
function places(){
  $('#placeChips').innerHTML = ['Все','Сеул','Пусан','Чеджу','Природа и храмы'].map(r => `<button class="chip${r===pr?' on':''}" data-pr="${r}">${r}</button>`).join('');
  $('#placeGrid').innerHTML = PLACES.map((p,i) => (pr==='Все'||p.r===pr) ? placeCard(p,i) : '').join('');
  reveal();
}
// Еда
let fr = 'Все';
function foods(){
  $('#foodChips').innerHTML = ['Все','Острое','Не острое'].map(r => `<button class="chip${r===fr?' on':''}" data-fr="${r}">${r}</button>`).join('');
  $('#foodGrid').innerHTML = FOODS.filter(f => fr==='Все' || (fr==='Острое' ? f.s>1 : f.s<=1)).map(f => `<article class="card rv"><div class="thumb">${f.e}</div><div class="card-b"><h3>${f.n} <span class="ko" lang="ko">${f.k}</span></h3><p>${f.d}</p><span class="tag">${hot(f.s)}</span></div></article>`).join('');
  reveal();
}
// Культура
function cult(k){
  $$('#cultTabs .tab').forEach(t => t.classList.toggle('on', t.dataset.k===k));
  const c = CULT[k];
  $('#cultBox').innerHTML = `<div class="big" lang="ko">${c.big}</div><div><h3>${c.h}</h3><p>${c.p}</p><ul>${c.l.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
}
$('#cultTabs').innerHTML = Object.keys(CULT).map(k => `<button class="tab" data-k="${k}">${k}</button>`).join('');
$('#cultTabs').addEventListener('click', e => e.target.dataset.k && cult(e.target.dataset.k));
$('#timeline').innerHTML = TIME.map(([y,t]) => `<li class="rv"><b>${y}</b><span>${t}</span></li>`).join('');
// K-pop
function pop(k){
  $$('#popTabs .tab').forEach(t => t.classList.toggle('on', t.dataset.k===k));
  $('#popGrid').innerHTML = POP[k].map(([a,b,c]) => `<article class="card rv"><div class="thumb"><b>${a}</b></div><div class="card-b"><span class="tag">${k==='Группы'?'Дебют: ':'Год: '}${b}</span><h3>${k==='Группы'?a:'Сюжет'}</h3><p>${k==='Группы'?'Агентство: '+c:c}</p></div></article>`).join('');
  reveal();
}
$('#popTabs').innerHTML = Object.keys(POP).map(k => `<button class="tab" data-k="${k}">${k}</button>`).join('');
$('#popTabs').addEventListener('click', e => e.target.dataset.k && pop(e.target.dataset.k));
// Интересное
const flip = (f,b) => `<button class="flip rv" aria-pressed="false"><i><span class="f">${f}</span><span class="b">${b}</span></i></button>`;
$('#facts').innerHTML = FACTS.map(([t,d,n]) => flip(`<b>${t}</b><em>Нажмите, чтобы узнать больше</em>`, `<p>${d}</p><b>${n}</b>`)).join('');
$('#phrases').innerHTML = PHR.map(([k,r,ru]) => flip(`<b lang="ko">${k}</b><em>Нажмите, чтобы увидеть перевод</em>`, `<b>${ru}</b><p>Читается: ${r}</p>`)).join('');
document.addEventListener('click', e => {
  const f = e.target.closest('.flip'); if (f) { f.classList.toggle('on'); f.setAttribute('aria-pressed', f.classList.contains('on')); }
  const c = e.target.closest('[data-pr]'); if (c) { pr = c.dataset.pr; places(); }
  const d = e.target.closest('[data-fr]'); if (d) { fr = d.dataset.fr; foods(); }
  const p = e.target.closest('[data-place]'); if (p) openPlace(+p.dataset.place);
  if (e.target.classList.contains('modal')) closeModal();
});
// Модальное окно
function openPlace(i){
  const p = PLACES[i];
  $('#mImg').innerHTML = p.e + img(p.f,p.n);
  $('#mTitle').textContent = p.n; $('#mTag').textContent = p.r; $('#mText').textContent = p.t;
  $('#mInfo').innerHTML = `<dt>Лучшее время</dt><dd>${p.w}</dd><dt>Совет</dt><dd>${p.s}</dd>`;
  $('#modal').hidden = false; document.body.style.overflow = 'hidden'; $('#mClose').focus();
}
const closeModal = () => { $('#modal').hidden = true; document.body.style.overflow = ''; };
$('#mClose').onclick = closeModal;
document.addEventListener('keydown', e => e.key==='Escape' && closeModal());
// Тема
const setTheme = t => { document.documentElement.dataset.theme = t; $('#themeBtn').textContent = t==='dark' ? '☀️' : '🌙'; store.set('theme',t); };
setTheme(store.get('theme') || 'light');
$('#themeBtn').onclick = () => setTheme(document.documentElement.dataset.theme==='dark' ? 'light' : 'dark');
// Меню
const menu = o => { $('#nav').classList.toggle('open', o); $('#burger').textContent = o ? '✕' : '☰'; $('#burger').setAttribute('aria-expanded', o); };
$('#burger').onclick = () => menu(!$('#nav').classList.contains('open'));
$('#nav').addEventListener('click', () => menu(false));
// Скролл: шапка, параллакс, активный пункт
const bg = $('#heroBg'), reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
function onScroll(){
  $('#header').classList.toggle('solid', scrollY > 40);
  if (!reduce && scrollY < innerHeight*1.2) bg.style.transform = `translate3d(0,${scrollY*.3}px,0)`;
}
addEventListener('scroll', onScroll, {passive:true}); onScroll();
const secs = $$('main section[id]');
const spy = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) $$('.nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href')==='#'+en.target.id)); }), {rootMargin:'-45% 0px -50% 0px'});
secs.forEach(s => spy.observe(s));
// Появление
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), {threshold:.12});
function reveal(){ $$('.rv:not(.in)').forEach((el,i) => { el.style.transitionDelay = (i%4)*80+'ms'; io.observe(el); }); }
// Лепестки сакуры
if (!reduce) $('#petals').innerHTML = Array.from({length:14}, () => `<span style="left:${Math.random()*100}%;animation-duration:${9+Math.random()*9}s;animation-delay:${-Math.random()*14}s;transform:scale(${.6+Math.random()*.9})"></span>`).join('');
// Форма
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, m = $('#formMsg'); let ok = true;
  [...f.elements].filter(x => x.name).forEach(x => {
    const bad = !x.value.trim() || (x.type==='email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x.value));
    x.classList.toggle('bad', bad); if (bad) ok = false;
  });
  m.className = 'form-msg ' + (ok ? 'ok' : 'err');
  m.textContent = ok ? `Спасибо, ${f.name.value.trim()}! Сообщение отправлено.` : 'Заполните все поля и проверьте адрес электронной почты.';
  if (ok) f.reset();
});
$('#year').textContent = new Date().getFullYear();
places(); foods(); cult('Хангыль'); pop('Группы'); reveal();
$$('h2.rv,.lead.rv,.chips.rv,.tabs.rv,.tl-title.rv,form.rv').forEach(el => io.observe(el));
})();