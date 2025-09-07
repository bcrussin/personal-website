const FADE_TIMER = 250;
const FADE_DELAY = 200;

const NAVBAR = document.getElementById("navbar");
const NAVBAR_BLURS = document.querySelectorAll(".navbar .hide-background");
const TITLE = document.getElementById("title");
const SUBTITLE = document.getElementById("subtitle");
const SOCIAL_BUTTONS = document.getElementById("social-buttons");
const LEARN_MORE = document.getElementById("learn-more");

const MAIN_SECTION = document.getElementById("main-content");
const CENTER_SENTINEL = document.getElementById("center-sentinel");

const NAV_MENU = document.getElementById("nav-container");
const NAV_MENU_ICON = document.getElementById("nav-menu-icon");
const THEME_ICON = document.getElementById("theme-icon");

const BUFFER_CANVAS = document.createElement("canvas");
const BUFFER = BUFFER_CANVAS.getContext("2d");

const LIGHT_TEXT = "#e0e0e0";
const DARK_TEXT = "#131313";

let windowHeight;
let mouseX = 0;
let mouseY = 0;
let isTouchDevice = false;

document.addEventListener("pointermove", (e) => {
  if (e.pointerType != "mouse") {
    isTouchDevice = true;
    return;
  }

  mouseX = e.clientX;
  mouseY = e.clientY;
});

let fadeQueue;
let tagsData;

startFaded();
window.onload = () => {
  calculateHeaderSize();
  toggleNavMenu(false);
  setThemeIcon();

  fadeIn();
  fetch("storage/tags.json")
    .then((res) => res.json())
    .then((data) => {
      tagsData = data;
      populatePortfolio();
    });
};

function calculateHeaderSize() {
  let height = Math.min(window.innerHeight, 1200);
  document.getElementById("home").style.minHeight = height + "px";
}

function startFaded() {
  fadeQueue = [TITLE, SUBTITLE, SOCIAL_BUTTONS, LEARN_MORE];
  for (elem of fadeQueue) {
    elem.classList.add("transparent");
  }
}

function fadeIn() {
  fadeQueue.forEach((elem, i) => {
    let timer = FADE_DELAY * i;

    setTimeout(() => {
      elem.classList.remove("transparent");
      elem.classList.add("header-animation");
    }, timer);
  });
}

// Highlight items on scroll
const portfolioItemObserver = new IntersectionObserver(
  (entries) => {
    const widthQuery = window.matchMedia("(max-width: 600px)");
    const heightQuery = window.matchMedia("(max-height: 600px)");

    // Only run observer on small screens
    if (!widthQuery.matches && !heightQuery.matches) {
      return;
    }

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("highlighted");
      } else {
        entry.target.classList.remove("highlighted");
      }
    });
  },
  {
    root: null,
    rootMargin: "-50% 0% -50% 0%",
    threshold: 0,
  }
);

function populatePortfolio() {
  fetch("storage/portfolio.json")
    .then((res) => res.json())
    .then((data) => {
      for (project of data) {
        let portfolioContainer = document.getElementById("portfolio-container");

        const item = createPortfolioItem(project);

        portfolioContainer.appendChild(item);
        portfolioItemObserver.observe(item);
      }
    });
}

function createPortfolioItem(data) {
  let container = document.createElement("div");
  container.classList.add("portfolio-item");

  if (!!data.color) {
    container.style.setProperty("--glow-color", data.color);
  }

  /* _____ IMAGE _____ */
  let image = document.createElement("img");
  image.alt = "";
  image.src = data.image;
  container.appendChild(image);

  /* _____ SUMMARY _____ */
  let summary = document.createElement("div");
  summary.classList.add("portfolio-summary");
  container.appendChild(summary);

  /* __ Title __ */
  let title = document.createElement("h2");
  title.innerHTML = data.title;
  summary.appendChild(title);
  /* ___________ */

  /* __ Tags __ */
  let tagsContainer = document.createElement("div");
  tagsContainer.classList.add("tags-list");
  for (let tag of data.tags) {
    let t = document.createElement("span");
    t.classList.add("tag");
    t.innerHTML = tag;

    t.style.backgroundColor = tagsData?.[tag]?.color ?? "lightgray";
    t.style.color = !!tagsData?.[tag]?.isTextLight ? LIGHT_TEXT : DARK_TEXT;
    tagsContainer.appendChild(t);
  }
  summary.appendChild(tagsContainer);
  /* __________ */

  /* __ Summary __ */
  let descriptionContainer = document.createElement("div");
  descriptionContainer.classList.add("portfolio-description");
  for (let paragraph of data.description) {
    let p = document.createElement("p");
    p.innerHTML = paragraph;
    descriptionContainer.appendChild(p);
  }
  summary.appendChild(descriptionContainer);
  /* _____________ */

  /* __ Links __ */
  let linksContainer = document.createElement("div");
  linksContainer.classList.add("portfolio-links");
  summary.appendChild(linksContainer);

  let linksList = document.createElement("ul");
  linksContainer.appendChild(linksList);

  for (let link of data.links) {
    let li = document.createElement("li");
    let a = document.createElement("a");
    a.innerHTML = link.label;
    a.href = link.href;

    if (!!link?.primary) a.classList.add("primary");

    li.appendChild(a);
    linksList.appendChild(li);
  }
  /* ___________ */

  return container;
}

/*
<div class="portfolio-item orange-border">
    <img alt="" src="images/portfolio/js-markdown-editor.png">
    <div class="portfolio-summary">
        <h2>JS Markdown Editor</h2>
        <p>This is a web-based Markdown notes editor that uses <a href="https://showdownjs.com/" target="_blank">ShowdownJS</a> to render markdown as HTML.</p>
        <p>Notes are saved to the browser's <code>localStorage</code> and can be searched by keyword. Statistics provide a summary of all notes, including total notes/characters/lines.</p>

        <div class="portfolio-links">
            <ul>
                <li><a href="https://bcrussin.github.io/js-markdown-editor/" target="_blank">Website</a></li>
                <li><a href="https://github.com/bcrussin/js-markdown-editor" target="_blank">Github</a></li>
            </ul>
        </div>
    </div>
</div>
*/

const SCROLL_Y_MAX = 140;
const START_FADE_OPACITY = 0.4;
const END_FADE_OPACITY = 0;

const START_BG_OPACITY = 0;
const END_BG_OPACITY = 1;

const START_HEADER_SIZE = 1;
const END_HEADER_SIZE = 0.8;

function scrollToElem(query) {
  this.toggleNavMenu(false);

  let elem = document.querySelector(query);
  window.scrollTo({
    top:
      elem.getBoundingClientRect().top + window.scrollY - NAVBAR.clientHeight,
    behavior: "smooth",
  });
}

function fadeNavbarBackground() {
  let scroll = window.scrollY;
  let bgOpacity = END_BG_OPACITY;

  if (window.scrollY < SCROLL_Y_MAX) {
    bgOpacity = mapToRange(
      scroll,
      0,
      SCROLL_Y_MAX,
      START_BG_OPACITY,
      END_BG_OPACITY
    );
  }

  let borderOpacity = END_BG_OPACITY;
  let headerSize = END_HEADER_SIZE;
  let logoHeight = 100;

  if (window.scrollY < SCROLL_Y_MAX * 4) {
    borderOpacity = mapToRange(
      scroll,
      0,
      SCROLL_Y_MAX * 4,
      START_BG_OPACITY,
      END_BG_OPACITY
    );

    headerSize = mapToRange(
      scroll,
      0,
      SCROLL_Y_MAX * 4,
      START_HEADER_SIZE,
      END_HEADER_SIZE
    );

    logoHeight = mapToRange(scroll, 0, SCROLL_Y_MAX * 4, 140, 100);
  }

  NAVBAR.style.setProperty("--backdrop-filter-opacity", bgOpacity);
  NAVBAR.style.setProperty(
    "--navbar-opacity-percent",
    borderOpacity * 100 + "%"
  );
  NAVBAR.style.setProperty("--navbar-header-size", headerSize);
  NAVBAR.style.setProperty("--navbar-logo-height", logoHeight + "%");
}

window.addEventListener("scroll", (e) => {
  fadeNavbarBackground();
});
fadeNavbarBackground();

const NAV_MENU_ICONS = {
  open: "images/icons/close.svg",
  closed: "images/icons/menu.svg",
};

function toggleNavMenu(state) {
  const duration = 200;
  let icon;

  switch (state) {
    case true:
      NAV_MENU.classList.add("open");
      icon = NAV_MENU_ICONS.open;
      break;
    case false:
      NAV_MENU.classList.remove("open");
      icon = NAV_MENU_ICONS.closed;
      break;
    default:
      NAV_MENU.classList.toggle("open");
      let iconName = NAV_MENU.classList.contains("open") ? "open" : "closed";
      icon = NAV_MENU_ICONS[iconName];
  }

  NAV_MENU_ICON.animate(
    [{ transform: "rotateX(0)" }, { transform: "rotateX(180deg)" }],
    {
      duration: duration,
      iterations: 1,
    }
  );

  setTimeout(() => (NAV_MENU_ICON.src = icon), duration / 2);
}

function setThemeIcon() {
  THEME_ICON.src = THEME_ICONS?.[currentTheme];
}

// Map one range of numbers to another
function mapToRange(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
