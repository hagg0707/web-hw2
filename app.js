
// ===== Part A =====

// A1 : 영화 배열 ⇒ 평균 평점
let sumA = 0;

for (let i = 0; i < ratings.length; i++) {
    sumA += ratings[i];
}

console.log("A1 평균 평점:", sumA / ratings.length);


// A2 : 영화 배열 ⇒ 최고 평점 영화
let maxA = 0;

for (let i = 1; i < ratings.length; i++) {
    if (ratings[i] > ratings[maxA]) {
        maxA = i;
    }
}

console.log("A2 최고 평점:", titles[maxA], ratings[maxA]);


// A3 : 영화 배열 ⇒ 8점 이상 영화 수
let countA = 0;

for (let i = 0; i < ratings.length; i++) {
    if (ratings[i] >= 8) {
        countA++;
    }
}

console.log("A3 8점 이상:", countA + "편");


// A4 : 영화 배열 ⇒ 연도대별 영화 수
let count2020A = 0;
let count2010A = 0;
let count2000A = 0;
let countBeforeA = 0;

for (let i = 0; i < years.length; i++) {

    const decade = years[i] - (years[i] % 10);

    switch (decade) {
        case 2020:
            count2020A++;
            break;

        case 2010:
            count2010A++;
            break;

        case 2000:
            count2000A++;
            break;

        default:
            countBeforeA++;
    }
}

console.log(
    "A4",
    "2020년대", count2020A + "편,",
    "2010년대", count2010A + "편,",
    "2000년대", count2000A + "편,",
    "그 이전", countBeforeA + "편"
);


// A5 : 영화 배열 ⇒ 누적 관객 100만 이상 영화 제목
let bigA = "";

for (let i = 0; i < audiences.length; i++) {
    if (audiences[i] >= 1000000) {
        bigA += titles[i] + " ";
    }
}

if (bigA === "") {
    bigA = "없음";
}

console.log("A5 관객 100만 이상:", bigA);


// ===== Part B =====


// average : 배열 ⇒ 평균 평점
function average(list) {
    return averageBy(list, "rating");
}


// best : 배열 ⇒ 최고 평점 영화 객체
function best(list) {

    let topMovie = list[0];

    for (const m of list) {
        if (m.rating > topMovie.rating) {
            topMovie = m;
        }
    }

    return topMovie;
}


// filterByRating : 배열, 숫자 ⇒ 새 배열
function filterByRating(list, min) {
    return list.filter(m => m.rating >= min);
}


// sortBy : 배열, 키 이름, 내림차순 여부 ⇒ 새 배열
function sortBy(list, key, desc) {

    const sign = desc ? -1 : 1;

    return [...list].sort((a, b) => {

        if (typeof a[key] === "string") {
            return sign * a[key].localeCompare(b[key]);
        }

        return sign * (a[key] - b[key]);

    });
}


// search : 배열, 검색어 ⇒ 새 배열
function search(list, keyword) {

    const word = keyword.trim().toLowerCase();

    return list.filter(m =>
        m.title.toLowerCase().includes(word)
    );
}


// formatNumber : 숫자 ⇒ 천 단위 쉼표 문자열
function formatNumber(n) {
    return Number(n).toLocaleString("ko-KR");
}


// yearsSince : 개봉일 ⇒ 현재까지 경과 연도
function yearsSince(dateStr) {
    return new Date().getFullYear() -
        new Date(dateStr).getFullYear();
}


// ===== Part B 추가 기능 =====


// 포스터 주소 만들기
function posterUrl(path, size) {

    if (!path) {
        return "";
    }

    if (path.startsWith("http")) {
        return path;
    }

    return "https://image.tmdb.org/t/p/" + size + path;
}


// 영화 카드 생성
function renderCards(list) {

    const board = document.getElementById("board");

    board.innerHTML = "";

    for (const m of list) {

        const card = document.createElement("article");

        card.className = "card";

        if (m.rating >= 8) {
            card.classList.add("hot");
        }

        if (m.poster) {

            card.innerHTML = `
                <img class="poster"
                     src="${posterUrl(m.poster, "w342")}"
                     alt="${m.title} 포스터">

                <span class="badge">${m.rating.toFixed(1)}</span>

                <div class="info">
                    <h3>${m.title}</h3>
                    <p class="year">개봉 ${m.date}</p>
                </div>
            `;

        } else {

            card.innerHTML = `
                <div class="poster-fallback">
                    영화 포스터 없음
                </div>

                <span class="badge">${m.rating.toFixed(1)}</span>

                <div class="info">
                    <h3>${m.title}</h3>
                    <p class="year">개봉 ${m.date}</p>
                </div>
            `;
        }

        board.appendChild(card);
    }

    document.getElementById("count").textContent =
        list.length + "편";
}


// 박스오피스 카드 생성
function renderBoxoffice() {

    const board = document.getElementById("boxoffice-board");

    board.innerHTML = "";

    const boxoffice = movies.filter(m => m.type === "boxoffice");

    for (const m of boxoffice) {

        const card = document.createElement("article");

        card.className = "card";

        if (m.rating >= 8) {
            card.classList.add("hot");
        }

        card.innerHTML = `
            <img class="poster"
                 src="${posterUrl(m.poster, "w342")}"
                 alt="${m.title} 포스터">

            <span class="rank">${m.rank}</span>
            <span class="badge">${m.rating.toFixed(1)}</span>

            <div class="info">
                <h3>${m.title}</h3>
                <p class="year">개봉 ${m.date}</p>
                <p class="audience">
                    누적 ${formatNumber(m.audience)}명
                </p>
            </div>
        `;

        board.appendChild(card);
    }
}


// 정렬 선택 상자 연결
function applySort() {

    const key = document.getElementById("sort").value;

    renderCards(
        sortBy(
            movies.filter(m => m.type === "mine"),
            key,
            key !== "title"
        )
    );
}


// 처음 화면 출력
renderCards(movies.filter(m => m.type === "mine"));

renderBoxoffice();


// Part B 페이지 요약 3줄
const bestMovie = best(movies);

const topAudience = sortBy(movies, "audience", true)[0];

document.getElementById("out").textContent =
    "전체 영화 " + movies.length + "편, 평균 평점 " +
    average(movies).toFixed(1) + "점\n" +

    "최고 평점 " + bestMovie.title + " (" +
    bestMovie.rating.toFixed(1) + "점, 개봉한 지 " +
    yearsSince(bestMovie.date) + "년)\n" +

    "관객 1위 " + topAudience.title + " (누적 " +
    formatNumber(topAudience.audience) + "명)";


// ===== Part C =====


// getList : TMDB 응답 객체 ⇒ 영화 배열
function getList(data) {
    return data.results;
}


// averageBy : 배열, 키 이름 ⇒ 해당 값의 평균
function averageBy(list, key) {

    if (list.length === 0) {
        return 0;
    }

    let sum = 0;

    for (const m of list) {
        sum += Number(m[key]);
    }

    return sum / list.length;
}


// C1 : TMDB 응답 정보
const tmdbList = getList(TMDB);

console.log(
    "C1 페이지:", TMDB.page,
    "전체 페이지:", TMDB.total_pages,
    "전체 영화:", TMDB.total_results,
    "현재 영화 수:", tmdbList.length
);


// C2 : TMDB 상영작 평균 평점
console.log(
    "C2 상영작 평균 평점:",
    averageBy(tmdbList, "vote_average").toFixed(1)
);


// C3 : 평점 상위 5편 표
console.table(
    sortBy(tmdbList, "vote_average", true).slice(0, 5),
    ["title", "release_date", "vote_average"]
);


// C4 : TMDB 영화 제목 검색
const keywordC = tmdbList.length > 0
    ? tmdbList[0].title.substring(0, 2)
    : "영화";

console.log(
    "C4 검색 결과:",
    search(
        tmdbList.map(m => ({
            title: m.title
        })),
        keywordC
    ).length + "편"
);
