/* _____ THEMING _____ */
const THEME_ICON = document.getElementById("theme-icon");

const DEFAULT_THEME = "system";
const THEME_ICONS = {
  light: "images/icons/sun.svg",
  dark: "images/icons/moon.svg",
  system: "images/icons/system.svg",
};

let themesData;
let currentTheme;
let systemTheme;

setTimeout(
  () =>
    document.documentElement.style.setProperty(
      "--theme-transition-duration",
      "0.2s"
    ),
  50
);

updateSystemTheme();
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", updateSystemTheme);

let theme = localStorage.getItem("theme") ?? DEFAULT_THEME;
setTheme(theme);

function updateSystemTheme() {
  let isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  systemTheme = isDark ? "dark" : "light";

  if (currentTheme === "system") applyTheme(systemTheme);
}

function setTheme(theme) {
  let lightDark = theme;
  if (theme === "system") {
    lightDark = systemTheme;
  }

  applyTheme(lightDark);

  if (!!THEME_ICON) THEME_ICON.src = THEME_ICONS?.[theme];

  currentTheme = theme;
  localStorage.setItem("theme", currentTheme);
}

function applyTheme(theme) {
  if (theme == "dark") document.body.classList.add("dark");
  else document.body.classList.remove("dark");
}

function toggleTheme() {
  let newTheme = "system";
  switch (currentTheme) {
    case "light":
      newTheme = "dark";
      break;
    case "system":
      newTheme = "light";
      break;
  }

  setTheme(newTheme);
}
