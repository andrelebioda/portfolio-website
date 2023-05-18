// import scss file
import "../scss/style.scss";

//define elements
const btnToggleNav = document.querySelector(".toggle");
const showMoreProjects = document.getElementById("show-more");
const navLayer = document.querySelector(".layer");
const navList = document.querySelector(".navigation");
const navListItems = Array.from(
  document.querySelectorAll(".navigation li > a")
);
const anchorLinks = Array.from(document.querySelectorAll(".anchor"));
const projectGrid = document.querySelector(".projects__wrapper");
const filter = document.querySelector(".filter-tags");

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

/***** get all repo data and generate content *****/

async function getAllRepos() {
  try {
    const data = await fetch("https://api.github.com/users/andrelebioda/repos");
    const res = await data.json();

    const repoData = res
      .sort((a, z) => Date.parse(z.updated_at) - Date.parse(a.updated_at))
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
    generateFilter(repoData);
    hideProjects();
  } catch (error) {
    console.log(error.message);
  }
}
getAllRepos();

/***** generate repo element and show on website *****/

function generateRepoElement(repo) {
  //template
  const temp = document
    .getElementById("project-item-template")
    .content.cloneNode(true);

  //content
  temp
    .querySelector(".project__item")
    .setAttribute("data-tags", repo.topics.join(",") + ",All");
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

/***** Generate filter function ****/

let filterTags = ["All"];

function generateFilter(repoData) {
  repoData.forEach((repo) => {
    repo.topics.forEach((topic) => {
      if (filterTags.includes(topic)) return;
      filterTags.push(topic);
    });
  });

  filterTags
    .sort((a, b) => a.length - b.length)
    .forEach((tag) => {
      let tagElement = document.createElement("span");
      tagElement.setAttribute("data-tag", tag);
      tagElement.innerHTML = tag;

      if (tag == "All") {
        tagElement.classList.add("active");
        tagElement.setAttribute("id", "all");
        tagElement.innerText = "Alle Projekte";
      }

      filter.append(tagElement);
    });

  filterProjects();
}

function filterProjects() {
  const tags = Array.from(document.querySelectorAll(".filter-tags > span"));
  const projectItems = Array.from(document.querySelectorAll(".project__item"));
  const allTag = document.getElementById("all");
  let selectedTags = [];

  tags.forEach((tag) => {
    tag.addEventListener("click", () => {
      let topic = tag.dataset.tag;

      if (topic != "All") allTag.classList.remove("active");
      if (topic == "All") tags.forEach((tag) => tag.classList.remove("active"));

      tag.classList.toggle("active");

      if (tag.classList.contains("active")) {
        selectedTags.push(topic);

        if (topic == "All") {
          selectedTags = [];
        }
      } else {
        selectedTags = selectedTags.filter((sTags) => !sTags.includes(topic));
      }

      projectItems.forEach((project) => {
        let projectTags = Array.from(project.dataset.tags.split(","));

        let hasTag = projectTags.some((pTag) => selectedTags.includes(pTag));

        if (hasTag) {
          project.classList.remove("hide");
        } else {
          project.classList.add("hide");
        }

        if (selectedTags.length == 0) {
          if (topic != "All") allTag.classList.add("active");
          project.classList.remove("hide");
        }
      });

      if (selectedTags.length > 0) {
        showMoreProjects.style.display = "none";
      }
    });
  });
}

/***** Hide projects and generate 'show more'-button *****/

let status = "show";

function hideProjects() {
  const projectItems = Array.from(document.querySelectorAll(".project__item"));

  let active = window.innerWidth > 991 ? 6 : 4;
  projectItems
    .slice(active)
    .forEach((project) => project.classList.add("hide"));

  showMoreProjects.addEventListener("click", () => {
    active += 6;
    projectItems
      .slice(0, active)
      .forEach((project) => project.classList.remove("hide"));
    if (active >= projectItems.length) showMoreProjects.style.display = "none";
  });
}

/***** check scrollposition and set active nav *****/

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
