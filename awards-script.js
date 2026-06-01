AOS.init({ duration: 800, once: true });

const awards = [
    { icon: "fas fa-trophy", title: "Золотой Орёл", desc: "Лучшая мужская роль («Текст», 2020)" },
    { icon: "fas fa-star", title: "Премия «Жорж»", desc: "Открытие года 2018" },
    { icon: "fas fa-gem", title: "GQ Man of the Year", desc: "Актёр года (2019)" },
    { icon: "fas fa-tv", title: "ТЭФИ", desc: "Лучший актёр сериала («Метод»)" },
    { icon: "fas fa-heart", title: "Премия OK!", desc: "Самый красивый актёр 2020" },
    { icon: "fas fa-award", title: "Ника", desc: "Номинация за лучшую мужскую роль" }
];

const container = document.getElementById('awards-container');
container.innerHTML = awards.map((award, idx) => `
    <div class="award-item" data-aos="zoom-in" data-aos-delay="${idx * 80}">
        <i class="${award.icon}"></i>
        <h4>${award.title}</h4>
        <p>${award.desc}</p>
    </div>
`).join('');
