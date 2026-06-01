AOS.init({ duration: 800, once: true, offset: 100 });

const filmsData = [
    { id:1, title:"Лёд", year:"2018", poster:"https://images.iptv.rt.ru/images/ctg4rurir4sqiatdb17g.jpg", kpRating:7.8, description:"Роль хоккеиста Саши Горина. Пронзительная история любви.", fullDesc:"Талантливая фигуристка Надя теряет всё после травмы, но встреча хоккеиста Саши меняет её жизнь.", duration:"113 минут", director:"Олег Трофим", likes:12456, dislikes:2341 },
    { id:2, title:"Текст", year:"2019", poster:"https://web.archive.org/web/20211008114323im_/https://s26037.cdn.ngenix.net/sdp/nc-snapshot1579876089608.jpg", kpRating:7.09, description:"Психологический триллер, где Александр сыграл жертву системы.", fullDesc:"Илья семь лет провёл в тюрьме по ложному обвинению. Выйдя на свободу, он решает отомстить.", duration:"132 минуты", director:"Клим Шипенко", likes:9876, dislikes:1234 },
    { id:3, title:"Притяжение", year:"2017", poster:"https://klin-klub.ru/wp-content/uploads/2018/06/7ca7c6ccfdcfaf512cf18504a7df2aab0ed8f829.jpg", kpRating:6.8, description:"Фантастический блокбастер с харизматичным Артёмом.", fullDesc:"Инопланетный корабль терпит крушение в Москве. Артём — лидер уличной группировки.", duration:"132 минуты", director:"Фёдор Бондарчук", likes:7456, dislikes:3421 },
    { id:4, title:"Лёд 2", year:"2020", poster:"https://is1-ssl.mzstatic.com/image/thumb/Video113/v4/57/c5/b8/57c5b85f-4a8a-4d74-d83d-4829e741d504/SPE_LYOD_2_FINAL_WW_ARTWORK_RU_3840x2160_292FTX000000J8.lsr/1200x675.jpg", kpRating:7.6, description:"Продолжение истории о любви и преданности.", fullDesc:"Спустя годы после событий первой части, Саша и Надя сталкиваются с новыми испытаниями.", duration:"126 минут", director:"Жора Крыжовников", likes:8765, dislikes:1876 },
    { id:5, title:"Стрельцов", year:"2020", poster:"https://www.film.ru/sites/default/files/styles/thumb_og_800x420/public/filefield_paths/maxresdefault_270.jpg", kpRating:6.8, description:"Биографическая драма о легендарном футболисте.", fullDesc:"Александр Петров перевоплотился в легендарного советского футболиста Эдуарда Стрельцова.", duration:"102 минуты", director:"Илья Учитель", likes:5432, dislikes:2345 },
    { id:6, title:"Метод", year:"2015", poster:"https://static.kino.1tv.ru/cdn/141/web/promo.jpg", kpRating:8.2, description:"Культовый сериал, старт популярности.", fullDesc:"Сериал, который принёс Александру Петрову первую волну популярности.", duration:"~50 мин (16 серий)", director:"Юрий Быков", likes:12345, dislikes:3456 }
];

let userVotes = JSON.parse(localStorage.getItem('filmVotes')) || {};

function renderFilms() {
    const container = document.getElementById('films-container');
    container.innerHTML = filmsData.map((film, idx) => `
        <div class="film-card" data-aos="flip-left" data-aos-delay="${idx * 80}">
            <div class="film-poster">
                <img src="${film.poster}" alt="${film.title}" onerror="this.src='https://via.placeholder.com/300x450?text=${film.title}'">
                <div class="film-poster-overlay"><i class="fas fa-play-circle"></i></div>
            </div>
            <div class="film-info">
                <h3>${film.title}</h3>
                <div class="film-year">${film.year}</div>
                <div class="kp-rating"><i class="fas fa-star"></i> <span>${film.kpRating}</span> / 10</div>
                <div class="film-desc">${film.description}</div>
                <div class="likes-system">
                    <button class="like-btn" data-id="${film.id}"><i class="fas fa-thumbs-up"></i> <span id="like-${film.id}">${film.likes.toLocaleString()}</span></button>
                    <button class="dislike-btn" data-id="${film.id}"><i class="fas fa-thumbs-down"></i> <span id="dislike-${film.id}">${film.dislikes.toLocaleString()}</span></button>
                </div>
                <button class="film-btn" data-modal="modal${film.id}"><i class="fas fa-info-circle"></i> Подробнее</button>
            </div>
        </div>
    `).join('');

    filmsData.forEach(film => {
        if(!document.getElementById(`modal${film.id}`)) {
            const modal = document.createElement('div');
            modal.id = `modal${film.id}`;
            modal.className = 'modal';
            modal.innerHTML = `<div class="modal-content"><span class="modal-close">&times;</span><h2>${film.title}</h2><div class="modal-year">${film.year} · Рейтинг КП: ${film.kpRating}</div><div class="modal-detail"><p><i class="fas fa-clock"></i> <strong>${film.duration}</strong></p><p><i class="fas fa-tag"></i> <strong>${film.director}</strong></p></div><div class="modal-desc">${film.fullDesc}</div></div>`;
            document.body.appendChild(modal);
        }
    });
    
    attachEvents();
    updateButtonsState();
}

function attachEvents() {
    document.querySelectorAll('.like-btn').forEach(btn => btn.addEventListener('click', () => handleVote(parseInt(btn.dataset.id), 'like')));
    document.querySelectorAll('.dislike-btn').forEach(btn => btn.addEventListener('click', () => handleVote(parseInt(btn.dataset.id), 'dislike')));
    document.querySelectorAll('.film-btn').forEach(btn => btn.addEventListener('click', () => {
        const modal = document.getElementById(btn.dataset.modal);
        if(modal) { document.querySelectorAll('.modal').forEach(m => m.classList.remove('active')); modal.classList.add('active'); }
    }));
    document.querySelectorAll('.modal-close').forEach(close => close.addEventListener('click', () => document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'))));
    window.addEventListener('click', (e) => { if(e.target.classList.contains('modal')) e.target.classList.remove('active'); });
}

function handleVote(id, type) {
    const film = filmsData.find(f => f.id === id);
    if(userVotes[id] === type) {
        if(type === 'like') film.likes--;
        else film.dislikes--;
        delete userVotes[id];
    } else {
        if(userVotes[id] === 'like') film.likes--;
        if(userVotes[id] === 'dislike') film.dislikes--;
        if(type === 'like') film.likes++;
        else film.dislikes++;
        userVotes[id] = type;
    }
    document.getElementById(`like-${id}`).textContent = film.likes.toLocaleString();
    document.getElementById(`dislike-${id}`).textContent = film.dislikes.toLocaleString();
    localStorage.setItem('filmVotes', JSON.stringify(userVotes));
    updateButtonsState();
}

function updateButtonsState() {
    document.querySelectorAll('.like-btn').forEach(btn => {
        const id = parseInt(btn.dataset.id);
        if(userVotes[id] === 'like') btn.classList.add('active');
        else btn.classList.remove('active');
    });
    document.querySelectorAll('.dislike-btn').forEach(btn => {
        const id = parseInt(btn.dataset.id);
        if(userVotes[id] === 'dislike') btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

renderFilms();
