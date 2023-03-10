// import scss file
import "../scss/style.scss";

//define elements
const btnToggleNav = document.querySelector(".toggle");
const navLayer = document.querySelector(".layer");
const navList = document.querySelector(".navigation");
const navListItems = Array.from(
  document.querySelectorAll(".navigation li > a")
);
const anchorLinks = Array.from(document.querySelectorAll(".anchor"));
const projectGrid = document.querySelector(".projects__wrapper");

//toggle navigation
btnToggleNav.addEventListener("click", () => {
  btnToggleNav.classList.toggle("close");
  navLayer.classList.toggle("show");
  navList.classList.toggle("show");
});

//scroll to element
anchorLinks.forEach((anchor) =>
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToElement(anchor);
  })
);

function scrollToElement(anchor) {
  let link = anchor.dataset.scroll;
  let element = document.getElementById(link);

  if (!element) return;

  element.scrollIntoView({ behavior: "smooth", block: "start" });

  if (window.innerWidth < 992) {
    btnToggleNav.classList.remove("close");
    navLayer.classList.remove("show");
    navList.classList.remove("show");
  }
}

//get all repo data and generate content
async function getAllRepos() {
  try {
    const data = await fetch("https://api.github.com/users/andrelebioda/repos");
    const res = await data.json();

    const repoData = res
      .sort((a, z) => a.id - z.id)
      .map((repo) => {
        return {
          name: repo.full_name,
          desc: repo.description,
          topics: repo.topics,
          stats: {
            watchers: repo.watchers_count,
            forks: repo.forks_count,
            stars: repo.stargazers_count,
          },

          repoURL: repo.html_url,
          websiteURL: repo.homepage,
        };
      });

    repoData.forEach((repo) => generateRepoElement(repo));
  } catch (error) {
    console.log(error.message);
  }
}
getAllRepos();

//generate repo element and show on website
function generateRepoElement(repo) {
  //template
  const temp = document
    .getElementById("project-item-template")
    .content.cloneNode(true);

  //content
  temp.querySelector(".github-link").setAttribute("href", repo.repoURL);
  temp.querySelector(".title").setAttribute("title", repo.name);
  temp.querySelector(".title").innerText = repo.name;
  temp.querySelector(".desc").innerText = repo.desc;

  repo.topics.forEach((topic) => {
    temp.querySelector(
      ".techs"
    ).innerHTML += `<span class="${topic}"><span>#</span>${topic}</span>`;
  });

  Object.keys(repo.stats).forEach((key) => {
    temp.querySelector(
      ".stats"
    ).innerHTML += `<div class="stat ${key}">${repo.stats[key]}</div>`;
  });

  if (repo.websiteURL != "") {
    temp.querySelector(".statistics").innerHTML += `<button>
      <a class="preview-link" href='${repo.websiteURL}' target="_blank">Preview</a>
    </button>`;
  }

  projectGrid.appendChild(temp);
}

function checkScrollPosition() {
  const sections = document.querySelectorAll("section");
  const scrollPos = window.scrollY;

  let active;

  sections.forEach((section) => {
    const pos = section.offsetTop;
    const height = pos + section.clientHeight;

    if (scrollPos >= pos - 500 && scrollPos < height - 500) {
      if (active != section) {
        navListItems.forEach((item) => {
          let data = item.dataset.scroll;

          if (data == section.id) {
            item.classList.add("active");
          } else {
            item.classList.remove("active");
          }
        });
        active = section;
      }
    }
  });
}

checkScrollPosition();

window.addEventListener("scroll", checkScrollPosition);
