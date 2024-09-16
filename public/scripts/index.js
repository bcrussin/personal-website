const FADE_TIMER = 250;
const FADE_DELAY = 300;

const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const socialButtons = document.getElementById("social-buttons");
const learnMore = document.getElementById("learn-more");

const BACKGROUND = document.getElementById("background-canvas");
const BG = BACKGROUND.getContext("2d");

const LIGHT_TEXT = "#e0e0e0";
const DARK_TEXT = "#131313";

let mouseX = 0;
let mouseY = 0;

document.addEventListener("pointermove", (e) => {
	mouseX = e.clientX;
	mouseY = e.clientY;
});

let fadeQueue;
let tagsData;

startFaded();
window.onload = () => {
	fadeIn();
	fetch("storage/tags.json")
		.then((res) => res.json())
		.then((data) => {
			tagsData = data;
			populatePortfolio();
		});
};

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
			t.style.backgroundColor = tagsData[tag].color;
			t.style.color = !!tagsData[tag].isTextLight ? LIGHT_TEXT : DARK_TEXT;
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

/* _____ DYNAMIC BACKGROUND _____ */

let gap = 20;

const HOVER_EFFECT_DURATION = 14;
const HOVER_EFFECT_STRENGTH = 1;
let hoverEffectTimer = 0;
let useHoverEffect = false;

// Expand radius when hovering over links
document.addEventListener("pointerover", (e) => handleHoverEffects(e));
document.addEventListener("pointerdown", (e) => handleHoverEffects(e));
document.addEventListener("pointerup", (e) => (useHoverEffect = false));

function handleHoverEffects(e) {
	if (e.target.closest("a") !== null) {
		useHoverEffect = true;
	} else {
		useHoverEffect = false;
	}
}

// Auto-resize canvas with browser window
addEventListener("resize", () => {
	BACKGROUND.width = BACKGROUND.clientWidth;
	BACKGROUND.height = BACKGROUND.clientHeight;
});

BACKGROUND.width = BACKGROUND.clientWidth;
BACKGROUND.height = BACKGROUND.clientHeight;
updateBackground();

function updateBackground() {
	let canvasWidth = BACKGROUND.width;
	let canvasHeight = BACKGROUND.height;
	BG.font = "18px serif";

	BG.clearRect(0, 0, canvasWidth, canvasHeight);

	for (let i = 0; i < canvasWidth / gap; i++) {
		for (let j = 0; j < canvasHeight / gap; j++) {
			let circleSize = 400; // The radius at which the bulge effect is applied
			let bulgeEffect = 0.24; // The intensity of the bulge effect
			let fadeDist = 0.3;  // The radius at which dots reach full darkness
			let brightnessUpperBound = 0.2; // The upper bound of the range mapped to normal brightness levels (basically max brightness ish)

			let x = i * gap;
			let y = j * gap;

			let dx = x - mouseX;
			let dy = y - mouseY;

			let angle = Math.atan2(dx, dy);

			let distance = Math.hypot(dx, dy) / circleSize;

			bulgeEffect += (bulgeEffect * scale(hoverEffectTimer, 0, HOVER_EFFECT_DURATION, 0, HOVER_EFFECT_STRENGTH)) / 8;
			fadeDist += (fadeDist * scale(hoverEffectTimer, 0, HOVER_EFFECT_DURATION, 0, HOVER_EFFECT_STRENGTH)) / 2;

			let clampedDistance = Math.min(distance, bulgeEffect);
			clampedDistance = bulgeEffect - clampedDistance;

			let alpha = Math.max(scale(fadeDist - distance, 0, brightnessUpperBound, 0, 1), 0.1);

			let finalDistance =
				clampedDistance + clampedDistance * scale(hoverEffectTimer, 0, HOVER_EFFECT_DURATION, 0, HOVER_EFFECT_STRENGTH);

			let finalX = x + dx * finalDistance;
			let finalY = y + dy * finalDistance;

			// let currDistance = scale(HOVER_ANIM_TIME - hoverAnimTimer, 0, HOVER_ANIM_TIME, 0, bulgeEffect);
			// if (distance < currDistance) {
			//     BG.fillStyle = `rgba(240, 107, 97, ${alpha})`;
			// } else {
			//     BG.fillStyle = `rgba(255, 255, 255, ${alpha})`;
			// }

			BG.fillStyle = `rgba(255, 255, 255, ${alpha})`;
			BG.fillText("•", finalX, finalY);
		}
	}

    // Transition between hover and non-hover states
	if (useHoverEffect && hoverEffectTimer < HOVER_EFFECT_DURATION) {
		hoverEffectTimer += (HOVER_EFFECT_DURATION - hoverEffectTimer) / HOVER_EFFECT_DURATION;
	} else if (!useHoverEffect && hoverEffectTimer > 0) {
		hoverEffectTimer += (0 - hoverEffectTimer) / HOVER_EFFECT_DURATION;
	}

	requestAnimationFrame(updateBackground);
}

// Map one range of numbers to another
function scale(number, inMin, inMax, outMin, outMax) {
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
