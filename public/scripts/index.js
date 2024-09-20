const FADE_TIMER = 250;
const FADE_DELAY = 300;

const navbar = document.getElementById("navbar");
const navbarBlurs = document.querySelectorAll(".navbar .hide-background");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const socialButtons = document.getElementById("social-buttons");
const learnMore = document.getElementById("learn-more");

const BACKGROUND = document.getElementById("background-canvas");
const BACKGROUND_NAVBAR = document.getElementById("background-canvas-navbar");
const BG = BACKGROUND.getContext("2d");
const BG_NAV = BACKGROUND_NAVBAR.getContext("2d");

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

	fadeIn();
	fetch("storage/tags.json")
		.then((res) => res.json())
		.then((data) => {
			tagsData = data;
			populatePortfolio();
		});
};

function calculateHeaderSize() {
	if (window.outerHeight == windowHeight) {
		return;
	}
	windowHeight = window.outerHeight;

	let height = Math.min(window.innerHeight - navbar.clientHeight, 1200);
	document.getElementById("home").style.minHeight = height + "px";
}

function startFaded() {
	fadeQueue = [title, subtitle, socialButtons, learnMore];
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

function populatePortfolio() {
	fetch("storage/portfolio.json")
		.then((res) => res.json())
		.then((data) => {
			for (project of data) {
				let portfolioContainer = document.getElementById("portfolio-container");
				portfolioContainer.appendChild(createPortfolioItem(project));
			}
		});

	function createPortfolioItem(data) {
		let container = document.createElement("div");
		container.classList.add("portfolio-item", "orange-border");

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
			a.target = "_blank";
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
}

const SCROLL_Y_MAX = 140;
const START_FADE_OPACITY = 0.4;
const END_FADE_OPACITY = 0;

const START_BG_OPACITY = 0;
const END_BG_OPACITY = 1;

function fadeNavbarBackground() {
	let scroll = Math.min(window.scrollY, SCROLL_Y_MAX);
	let dotsOpacity = mapToRange(scroll, 0, SCROLL_Y_MAX, START_FADE_OPACITY, END_FADE_OPACITY);
	let bgOpacity = mapToRange(scroll, 0, SCROLL_Y_MAX, START_BG_OPACITY, END_BG_OPACITY);

	BACKGROUND_NAVBAR.style.opacity = dotsOpacity;
	// let filter = `brightness(${bgOpacity}) blur(10px)`;
	// navbar.style.backdropFilter = filter;
	navbar.style.setProperty("--backdrop-filter-opacity", bgOpacity);

	// for (let elem of navbarBlurs) {
	// 	elem.style.setProperty('--backdrop-filter', `brightness(${bgOpacity}) blur(20px)`);
	// }

	// navbar.style.backgroundColor = `rgba(0, 0, 0, ${bgOpacity})`;
}

addEventListener("scroll", (e) => {
	fadeNavbarBackground();
});
fadeNavbarBackground();

/* _____ THEMING _____ */
let themesData;
fetch("storage/themes.json")
	.then((res) => res.json())
	.then((data) => {
		themesData = data;
		console.log(themesData)
		applyTheme('dark')
	});


let currentTheme;
function applyTheme(theme) {
	let themeData = themesData[theme];

	Object.entries(themeData).forEach(([property, value]) => {
		console.log(property, value)
		document.documentElement.style.setProperty("--" + property, value);
	});

	currentTheme = theme;
}

function toggleTheme() {
	let newTheme = currentTheme == 'dark' ? 'light' : 'dark';

	applyTheme(newTheme)
}

/* _____ DYNAMIC BACKGROUND _____ */

let gap = 20;

const HOVER_EFFECT_DURATION = 14;
const HOVER_EFFECT_STRENGTH = 1;
let hoverEffectTimer = 0;
let useHoverEffect = false;

// Expand radius when hovering over links
document.addEventListener("mouseover", (e) => handleHoverEffects(e));
document.addEventListener("mousedown", (e) => handleHoverEffects(e));
document.addEventListener("mouseup", (e) => {
	useHoverEffect = false;
});

function handleHoverEffects(e) {
	if (e.target.closest("a") !== null) {
		useHoverEffect = true;
	} else {
		useHoverEffect = false;
	}
}

// Auto-resize canvas with browser window
addEventListener("resize", () => {
	resizeCanvas();

	calculateHeaderSize();
	initBackground();
});

resizeCanvas();

function resizeCanvas() {
	BACKGROUND.width = BACKGROUND.clientWidth;
	BACKGROUND.height = BACKGROUND.clientHeight;
	BACKGROUND_NAVBAR.width = BACKGROUND.clientWidth;
	BACKGROUND_NAVBAR.height = BACKGROUND.clientHeight;
}

let dots = [];

initBackground();
requestAnimationFrame(updateBackground);

function initBackground() {
	dots = [];
	for (let i = 0; i < BACKGROUND.width / gap; i++) {
		dots.push([]);
		for (let j = 0; j < BACKGROUND.height / gap; j++) {
			dots[i].push({});
		}
	}

	mouseX = null;
	mouseY = null;
}

function updateBackground() {
	let canvasWidth = BACKGROUND.width;
	let canvasHeight = BACKGROUND.height;
	BG.font = "18px serif";

	BG.clearRect(0, 0, canvasWidth, canvasHeight);

	for (let i = 0; i < canvasWidth / gap; i++) {
		for (let j = 0; j < canvasHeight / gap; j++) {
			let circleSize = 400; // The radius at which the bulge effect is applied
			let bulgeEffect = 0.24; // The intensity of the bulge effect
			let fadeDist = 0.3; // The radius at which dots reach full darkness
			let brightnessUpperBound = 0.15; // The upper bound of the range mapped to normal brightness levels (basically max brightness ish)
			let minBrightness = 0.2;
			let baseFontSize = 18;
			let fontScaleEffect = 60;
			let mx = 0;
			let my = 0;

			let x = i * gap + mx;
			let y = j * gap + my;

			let yChange = mapToRange(Math.min(Math.max(y, 60), 180), 60, 180, minBrightness, 1);
			brightnessUpperBound = scaleToHover(brightnessUpperBound, 1, HOVER_EFFECT_STRENGTH, 0);

			let dx = x;
			let dy = y;

			let finalDistance = 1;
			let alpha = minBrightness;

			let clampedDistance;

			let finalX = x;
			let finalY = y;

			let fontSize = baseFontSize;

			if (mouseX != undefined && mouseY != undefined) {
				dx = x - mouseX;
				dy = y - mouseY;

				let distance = Math.hypot(dx, dy) / circleSize;

				bulgeEffect += (bulgeEffect * mapToRange(hoverEffectTimer, 0, HOVER_EFFECT_DURATION, 0, HOVER_EFFECT_STRENGTH)) / 8;
				fadeDist += (fadeDist * mapToRange(hoverEffectTimer, 0, HOVER_EFFECT_DURATION, 0, HOVER_EFFECT_STRENGTH)) / 1.4;

				clampedDistance = Math.min(distance, bulgeEffect);
				clampedDistance = bulgeEffect - clampedDistance;

				alpha = Math.max(mapToRange(fadeDist - distance, 0, brightnessUpperBound, 0, 1), minBrightness);
				alpha = Math.min(alpha, yChange);

				finalDistance =
					clampedDistance +
					clampedDistance * mapToRange(hoverEffectTimer, 0, HOVER_EFFECT_DURATION, 0, HOVER_EFFECT_STRENGTH);

				finalX = x + dx * finalDistance - mx;
				finalY = y + dy * finalDistance - my;

				fontSize = baseFontSize + scaleToHover(clampedDistance * fontScaleEffect, 0.8);
			}

			let dot = dots[i][j];

			if (dot.x == undefined || dot.y == undefined) {
				dot.x = finalX;
				dot.y = finalY;
				dot.size = fontSize;
				dot.alpha = alpha;
			} else {
				let shrinkSpeed = 12;
				let growSpeed = 2;
				
				let speed;
				if (fontSize > dot.size) {
					speed = growSpeed;
				} else {
					speed = shrinkSpeed;
				}

				dot.x += (finalX - dot.x) / speed;
				dot.y += (finalY - dot.y) / speed;
				dot.size += (fontSize - dot.size) / speed;
				dot.alpha += (alpha - dot.alpha) / (speed / 2);
			}

			// let currDistance = mapToRange(HOVER_ANIM_TIME - hoverAnimTimer, 0, HOVER_ANIM_TIME, 0, bulgeEffect);
			// if (distance < currDistance) {
			//     BG.fillStyle = `rgba(240, 107, 97, ${alpha})`;
			// } else {
			//     BG.fillStyle = `rgba(255, 255, 255, ${alpha})`;
			// }

			BG.font = `${dot.size}px serif`;
			BG.fillStyle = `rgba(255, 255, 255, ${dot.alpha})`;
			BG.fillText("•", dot.x - fontSize / 6, dot.y + fontSize / 6);
		}
	}

	BG_NAV.clearRect(0, 0, canvasWidth, canvasHeight);
	BG_NAV.drawImage(BACKGROUND, 0, 0);

	// Transition between hover and non-hover states
	if (useHoverEffect && hoverEffectTimer < HOVER_EFFECT_DURATION) {
		hoverEffectTimer += (HOVER_EFFECT_DURATION - hoverEffectTimer) / HOVER_EFFECT_DURATION;
	} else if (!useHoverEffect && hoverEffectTimer > 0) {
		hoverEffectTimer += (0 - hoverEffectTimer) / HOVER_EFFECT_DURATION;
	}

	requestAnimationFrame(updateBackground);
}

function scaleToHover(value, div, min, max) {
	return (
		value + value * mapToRange(hoverEffectTimer, 0, HOVER_EFFECT_DURATION, min ?? 0, max ?? HOVER_EFFECT_STRENGTH * div)
	);
}

// Map one range of numbers to another
function mapToRange(number, inMin, inMax, outMin, outMax) {
	return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/*const NAME = "Barrett Crusse";
const NAME_DELAY = 30;

let titleName = document.getElementById('title-name-container');
let titleNameLetters = [];

loadTitleName();

window.onload = () => {
    animateTitleName();
}

function loadTitleName() {
    titleName.innerHTML = '';
    
    [...NAME].forEach((c, i) => {
        let elem = document.createElement('span');
        elem.innerHTML = c;
        console.log(c)

        if (c === ' ') 
            elem.classList.add('space');

        titleName.appendChild(elem);
        titleNameLetters.push(elem);
    });
}

function animateTitleName() {
    titleNameLetters.forEach((elem, i) => {
        console.log(elem)
        setTimeout(() => {
            elem.classList.add('animated');
        }, i * NAME_DELAY);
    });
}*/
