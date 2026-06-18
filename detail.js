const fadeItems = Array.from(document.querySelectorAll("[data-fade]"));
const nav = document.querySelector(".nav");
const navLinksContainer = document.querySelector(".nav-links");
const currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
const searchablePages = !["reservation.html"].includes(currentPage);
const fullMobileMenu = [
  ["doctors.html", "의료진"],
  ["checkup.html", "건강검진센터"],
  ["endoscopy.html", "소화기내시경"],
  ["programs.html", "검진프로그램"],
  ["ultrasound.html", "초음파"],
  ["chronic.html", "만성질환"],
  ["wellness.html", "웰빙수액"],
  ["vaccination.html", "예방접종"],
  ["guide.html", "검사안내"],
  ["equipment.html", "장비"],
  ["tour.html", "둘러보기"],
  ["faq.html", "FAQ"],
  ["notice.html", "공지"],
  ["location.html", "길찾기"],
];

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.13 },
);

fadeItems.forEach((item) => observer.observe(item));

function setupMobileMenu() {
  if (!nav || !navLinksContainer || document.querySelector(".menu-toggle")) return;

  const existing = new Set(
    Array.from(navLinksContainer.querySelectorAll("a")).map((link) => {
      return (link.getAttribute("href") || "").split("/").pop().toLowerCase();
    }),
  );

  fullMobileMenu.forEach(([href, label]) => {
    if (existing.has(href)) return;
    const link = document.createElement("a");
    link.className = "mobile-only-nav";
    link.href = href;
    link.textContent = label;
    navLinksContainer.appendChild(link);
  });

  const toggle = document.createElement("button");
  toggle.className = "menu-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-controls", "site-menu");
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = `
    메뉴
    <span class="menu-toggle-lines" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
    </span>
  `;
  navLinksContainer.id = "site-menu";
  nav.querySelector(".brand")?.insertAdjacentElement("afterend", toggle);

  function setMobileMenu(open) {
    nav.classList.toggle("is-menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  }

  toggle.addEventListener("click", () => {
    setMobileMenu(!nav.classList.contains("is-menu-open"));
  });

  navLinksContainer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMobileMenu(false));
  });

  window.matchMedia("(max-width: 960px)").addEventListener("change", (event) => {
    if (!event.matches) setMobileMenu(false);
  });
}

setupMobileMenu();

Array.from(document.querySelectorAll(".nav-links a")).forEach((link) => {
  const linkPage = (link.getAttribute("href") || "").split("/").pop().toLowerCase();
  const isActive = linkPage === currentPage;
  link.classList.toggle("active", isActive);
  if (isActive) link.setAttribute("aria-current", "page");
});

function buildPageSearch() {
  const hero = document.querySelector(".page-hero");
  const main = document.querySelector("main");
  if (!hero || !main || !searchablePages || document.querySelector(".page-tools")) return;

  const tools = document.createElement("div");
  tools.className = "page-tools";
  tools.innerHTML = `
    <label class="page-search">
      <span>PAGE SEARCH</span>
      <input type="search" placeholder="현재 안내에서 검색" autocomplete="off" aria-label="현재 안내 검색" />
    </label>
    <strong class="tool-count"></strong>
  `;
  hero.insertAdjacentElement("afterend", tools);

  const input = tools.querySelector("input");
  const count = tools.querySelector(".tool-count");
  const targets = Array.from(
    main.querySelectorAll(
      [
        ".section .card",
        ".section .step",
        ".section .list li",
        ".section details",
        ".section .highlight",
        ".section .tour-card",
        ".section .guide-card",
        ".section .aftercare-card",
        ".section .program-row",
        ".section .care-package",
        ".section .doctor-profile",
        ".section .matcher-card",
        ".section .visual-card",
        ".section .detail-row",
        ".section .faq-brief",
        ".section .location-brief",
      ].join(", "),
    ),
  );

  function applySearch() {
    const query = input.value.trim().toLowerCase();
    let visible = 0;

    targets.forEach((target) => {
      const matches = !query || target.textContent.toLowerCase().includes(query);
      target.classList.toggle("content-hidden", !matches);
      if (matches) visible += 1;
    });

    document.querySelectorAll(".section").forEach((section) => {
      const localTargets = targets.filter((target) => section.contains(target));
      if (!localTargets.length) return;
      const hasVisibleTarget = localTargets.some((target) => !target.classList.contains("content-hidden"));
      section.classList.toggle("content-hidden", !hasVisibleTarget && Boolean(query));
    });

    count.textContent = query ? `${visible}개 표시` : `${visible}개 항목`;
  }

  input.addEventListener("input", applySearch);
  applySearch();
}

const bookingTabs = Array.from(document.querySelectorAll(".booking-tabs button[data-service]"));
const reservationForm = document.getElementById("reservation-form");
const reservationService = document.getElementById("reservation-service");
const reservationChannel = document.getElementById("reservation-channel");
const reservationResponse = document.getElementById("reservation-response");
const reservationStatus = document.getElementById("reservation-status");
const reservationSelect = document.getElementById("reservation-select");
const reservationMessage = document.getElementById("reservation-message");

const reservationPlans = {
  checkup: {
    label: "건강검진",
    channel: "전화/카카오",
    response: "영업일 1시간 내",
    message: "공단검진, 종합검진, 채용검진 상담을 우선 연결합니다.",
    select: "건강검진",
  },
  endoscopy: {
    label: "소화기내시경",
    channel: "전화 우선",
    response: "당일/익일 안내",
    message: "금식 시간, 수면 여부, 장정결 안내를 먼저 확인합니다.",
    select: "소화기내시경",
  },
  ultrasound: {
    label: "초음파",
    channel: "전화/문자",
    response: "영업일 1시간 내",
    message: "복부, 갑상선, 경동맥, 유방 초음파 예약을 연결합니다.",
    select: "초음파",
  },
  general: {
    label: "일반진료",
    channel: "전화/문자",
    response: "영업일 1시간 내",
    message: "만성질환, 영양상담, 예방접종 문의를 접수합니다.",
    select: "만성질환",
  },
};
const reservationSelectMap = {
  건강검진: "checkup",
  소화기내시경: "endoscopy",
  초음파: "ultrasound",
  만성질환: "general",
  예방접종: "general",
};

function syncReservationPlan(service) {
  const plan = reservationPlans[service] || reservationPlans.checkup;
  if (reservationService) reservationService.textContent = plan.label;
  if (reservationChannel) reservationChannel.textContent = plan.channel;
  if (reservationResponse) reservationResponse.textContent = plan.response;
  if (reservationStatus) reservationStatus.textContent = plan.message;
  if (reservationMessage) reservationMessage.value = plan.message;
  if (reservationSelect) {
    const option = Array.from(reservationSelect.options).find((item) => item.textContent.includes(plan.select));
    reservationSelect.value = option ? option.value : reservationSelect.value;
  }
}

bookingTabs.forEach((button) => {
  button.addEventListener("click", () => {
    bookingTabs.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    syncReservationPlan(button.dataset.service || "checkup");
  });
});

if (reservationForm) {
  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = reservationForm.querySelector('input[placeholder="이름"]')?.value?.trim() || "고객";
    const phone = reservationForm.querySelector('input[placeholder="연락처"]')?.value?.trim() || "연락처 미입력";
    const service = reservationSelect?.selectedOptions?.[0]?.textContent || "건강검진";
    const submitButton = reservationForm.querySelector('button[type="submit"]');

    if (reservationStatus) {
      reservationStatus.textContent = `${name}님 접수 완료. ${service} 상담을 ${phone} 번호로 안내합니다.`;
      reservationStatus.classList.add("is-success");
    }

    reservationForm.classList.add("is-submitted");
    if (submitButton) {
      submitButton.textContent = "예약 문의 접수됨";
      window.setTimeout(() => {
        submitButton.textContent = "예약 문의 보내기";
      }, 1800);
    }
  });
}

if (reservationSelect) {
  reservationSelect.addEventListener("change", () => {
    const current = Array.from(reservationSelect.selectedOptions)[0]?.textContent || "건강검진";
    const mappedService = reservationSelectMap[current] || "general";
    bookingTabs.forEach((item) => item.classList.toggle("active", item.dataset.service === mappedService));
    syncReservationPlan(mappedService);
  });
}

if (currentPage === "reservation.html") {
  syncReservationPlan("checkup");
}

const faqFilters = Array.from(document.querySelectorAll("[data-faq-filter]"));
const faqItems = Array.from(document.querySelectorAll(".faq-list details[data-category]"));
const faqEmpty = document.getElementById("faq-empty");

function applyFaqFilter(category = "all") {
  let visible = 0;
  faqItems.forEach((item) => {
    const matches = category === "all" || item.dataset.category === category;
    item.classList.toggle("content-hidden", !matches);
    if (matches) visible += 1;
  });
  if (faqEmpty) faqEmpty.hidden = visible > 0;
}

faqFilters.forEach((button) => {
  button.addEventListener("click", () => {
    faqFilters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    applyFaqFilter(button.dataset.faqFilter || "all");
  });
});

if (faqItems.length) applyFaqFilter("all");

const routeTabs = Array.from(document.querySelectorAll("[data-route]"));
const routeResult = document.getElementById("route-result");
const mapBox = document.querySelector(".mapbox");
const routeCopy = {
  subway: {
    label: "청량리역 3번 출구 도보 3분",
    body: "지하철 이용 시 청량리역 3번 출구에서 직진 후 횡단보도를 건너면 병원 건물 입구가 보입니다.",
  },
  parking: {
    label: "건물 지하주차장 2시간 지원",
    body: "자가용 이용 시 건물 지하주차장을 이용하고 접수 데스크에서 차량번호를 등록하면 됩니다.",
  },
  bus: {
    label: "청량리역 환승센터 하차",
    body: "버스 이용 시 청량리역 환승센터 또는 인근 정류장 하차 후 도보 이동이 가장 단순합니다.",
  },
};

function applyRoute(route = "subway") {
  const data = routeCopy[route] || routeCopy.subway;
  if (routeResult) routeResult.textContent = data.body;
  if (mapBox) mapBox.dataset.routeLabel = data.label;
}

routeTabs.forEach((button) => {
  button.addEventListener("click", () => {
    routeTabs.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    applyRoute(button.dataset.route || "subway");
  });
});

if (routeTabs.length) applyRoute("subway");

buildPageSearch();
