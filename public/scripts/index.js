const FADE_TIMER = 250;
const FADE_DELAY = 300;

const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const socialButtons = document.getElementById("social-buttons");
const learnMore = document.getElementById("learn-more");

const LIGHT_TEXT = '#e0e0e0';
const DARK_TEXT = '#131313';

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
    let descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('portfolio-description');
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
        a.target = '_blank';
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
