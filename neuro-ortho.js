const careMap = {
  numbness: {
    title: "손발저림·디스크 감별 진료",
    desc: "신경외과 관점에서 목·허리 디스크와 신경 압박을 먼저 확인하고, 필요한 경우 신경과적 평가로 말초신경 상태까지 살핍니다.",
    image: "assets/medical/spine-pain.jpg"
  },
  headache: {
    title: "두통·어지럼 신경과적 평가",
    desc: "반복되는 두통, 어지럼, 균형 불안은 신경과적 문진과 신경학적 진찰을 포함해 위험 신호와 치료 방향을 정리합니다.",
    image: "assets/medical/consultation-doctor.jpg"
  },
  spine: {
    title: "목·허리 디스크·협착 진료",
    desc: "허리디스크, 목디스크, 척추관협착증, 좌골신경통을 신경외과·정형외과 관점에서 확인하고 비수술 치료 계획을 세웁니다.",
    image: "assets/medical/spine-pain.jpg"
  },
  joint: {
    title: "어깨·무릎 관절 통증 클리닉",
    desc: "회전근개, 오십견, 무릎 관절염, 인대·연골 손상을 진찰과 영상검사로 확인하고 단계별 비수술 치료를 안내합니다.",
    image: "assets/medical/joint-shoulder.jpg"
  },
  memory: {
    title: "기억력·인지기능 상담",
    desc: "건망증과 치매 초기 신호를 구분하고 혈관 위험요인, 수면, 약물 요인을 함께 점검합니다.",
    image: "assets/medical/doctor-tablet.jpg"
  },
  gait: {
    title: "보행 불안·낙상 위험 평가",
    desc: "신경계 균형 문제와 관절·근력 저하를 함께 확인해 낙상 위험을 줄이는 치료 계획을 세웁니다.",
    image: "assets/medical/doctor-hall.jpg"
  }
};

document.querySelectorAll("[data-care]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.care;
    const data = careMap[key];
    if (!data) return;

    document.querySelectorAll("[data-care]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    const title = document.querySelector("[data-care-title]");
    const desc = document.querySelector("[data-care-desc]");
    const image = document.querySelector("[data-care-image]");

    if (title) title.textContent = data.title;
    if (desc) desc.textContent = data.desc;
    if (image) {
      image.src = data.image;
      image.alt = data.title;
    }
  });
});

document.querySelectorAll("[data-program-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.programTab;
    document.querySelectorAll("[data-program-tab]").forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
    document.querySelectorAll("[data-program-panel]").forEach((panel) => {
      panel.hidden = panel.dataset.programPanel !== target;
    });
  });
});

document.querySelectorAll("[data-doctor-panel]").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = document.getElementById(button.dataset.doctorPanel);
    if (!panel) return;

    document.querySelectorAll("[data-doctor-panel]").forEach((item) => item.classList.remove("is-active"));
    document.querySelectorAll(".doctor-detail-panel").forEach((item) => {
      item.hidden = item !== panel;
      item.classList.toggle("is-active", item === panel);
    });
    button.classList.add("is-active");
  });
});

document.querySelectorAll("[data-floating-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const root = button.closest("[data-floating-contact]");
    if (!root) return;
    const isOpen = root.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.textContent = isOpen ? "×" : "+";
  });
});

document.querySelectorAll("[data-scroll-top]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

const progress = document.querySelector(".scroll-progress") || (() => {
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.prepend(bar);
  return bar;
})();

const updateProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.max(0, Math.min(100, ratio * 100))}%`;
};

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

document.querySelectorAll(".section, .hero, .clinic-card, .detail-card, .doctor-card, .equipment-card, .flow-step").forEach((element) => {
  element.classList.add("reveal");
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll(".clinic-card, .doctor-card, .recommend-card").forEach((card) => {
  card.classList.add("magnetic");
  card.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(max-width: 900px)").matches) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) rotateX(${y * -3}deg) rotateY(${x * 3}deg)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

const navLinks = [...document.querySelectorAll(".nav a[href^='#']")];
if (navLinks.length) {
  const sectionMap = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { threshold: 0.28 });

  sectionMap.forEach((section) => navObserver.observe(section));
}
