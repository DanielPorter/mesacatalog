const COURSES_PATH = "data/courses.json";
const PROGRAMS_PATH = "data/programs.json";

let allCourseData = {};
let programData = {};
let userPlans = {
  activePlan: "miramar",
  plans: {
    miramar: { institution: "San Diego Miramar College", programs: ["Mathematics Studies AA"], terms: {} },
    ucb: { institution: "UC Berkeley", programs: [], terms: {} }
  },
  completedCourses: []
};

window.onload = async function () {
  await loadAllCourseData();
  loadUserPlans();
  document.getElementById("planSelect").value = userPlans.activePlan;
  const plan = userPlans.plans[userPlans.activePlan];
  renderPlanView(plan);
  renderCoursePool(plan);
};

async function loadAllCourseData() {
  const [coursesRes, programsRes] = await Promise.all([
    fetch(COURSES_PATH).then(res => res.json()),
    fetch(PROGRAMS_PATH).then(res => res.json())
  ]);
  allCourseData = coursesRes;
  programData = programsRes;
}

function loadUserPlans() {
  const saved = localStorage.getItem("transferPlans");
  if (saved) userPlans = JSON.parse(saved);
}

function saveUserPlans() {
  localStorage.setItem("transferPlans", JSON.stringify(userPlans));
}

function switchPlan(planId) {
  userPlans.activePlan = planId;
  const plan = userPlans.plans[planId];
  plan.programs = []; // Reset programs
  saveUserPlans();
  renderPlanView(plan);
  renderCoursePool(plan);
  updateProgramSelect(plan); // New
}

function addTerm() {
  const plan = userPlans.plans[userPlans.activePlan];
  const termNames = Object.keys(plan.terms);
  const newTermName = `Term ${termNames.length + 1}`;
  plan.terms[newTermName] = [];
  saveUserPlans();
  renderPlanView(plan);
  renderCoursePool(plan);
}

function renderPlanView(plan) {
  const container = document.getElementById("termsContainer");
  container.innerHTML = "";

  Object.entries(plan.terms).forEach(([termName, courseIds]) => {
    const termCard = document.createElement("div");
    termCard.className = "term-card";

    const header = document.createElement("div");
    header.className = "term-header";

    const title = document.createElement("div");
    title.className = "term-title";
    title.innerText = termName;

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "Remove";
    removeBtn.onclick = () => {
      delete plan.terms[termName];
      saveUserPlans();
      renderPlanView(plan);
      renderCoursePool(plan);
    };

    header.appendChild(title);
    header.appendChild(removeBtn);

    const courseList = document.createElement("div");
    courseList.className = "term-courses";

    courseList.ondragover = e => e.preventDefault();
    courseList.ondrop = e => {
      e.preventDefault();
      const courseId = e.dataTransfer.getData("text/plain");
      if (!plan.terms[termName].includes(courseId)) {
        plan.terms[termName].push(courseId);
        saveUserPlans();
        renderPlanView(plan);
        renderCoursePool(plan);
      }
    };

    let totalDifficulty = 0;
    courseIds.forEach(courseId => {
      const course = allCourseData[courseId];
      if (!course) return;

      const pill = document.createElement("div");
      pill.className = "course-pill";
      pill.innerText = `${course.code}: ${course.title}`;
      totalDifficulty += course.difficulty || 0;
      courseList.appendChild(pill);
    });

    const diffBadge = document.createElement("div");
    diffBadge.className = "difficulty-badge";
    diffBadge.innerText = `Difficulty: ${totalDifficulty}`;
    header.appendChild(diffBadge);

    termCard.appendChild(header);
    termCard.appendChild(courseList);
    container.appendChild(termCard);
  });
}

function renderCoursePool(plan) {
  const pool = document.getElementById("coursePool");
  pool.innerHTML = "";

  const programs = plan.programs;
  const courseSet = new Set();

  programs.forEach(programName => {
    const prog = programData[programName];
    if (!prog) return;
  prog.requirements.forEach(block => {
    const section = document.createElement("div");
    section.className = "course-section";
  
    const title = document.createElement("h4");
    if (block.type === "required") title.innerText = "Core Courses";
    else if (block.type === "choose-n") title.innerText = `Choose ${block.n}`;
    else if (block.type === "min-units-from-list") title.innerText = `Choose ${block.units} Units`;
  
    section.appendChild(title);
  
    block.courses.forEach(courseId => {
      const course = allCourseData[courseId];
      if (!course) return;
  
      const pill = document.createElement("div");
      pill.className = "course-pill";
      pill.innerText = `${course.code}: ${course.title}`;
      pill.setAttribute("draggable", "true");
      pill.dataset.courseId = courseId;
  
      pill.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", courseId);
      });
  
      section.appendChild(pill);
    });
  
    pool.appendChild(section);
  });

  });

  Array.from(courseSet).forEach(courseId => {
    const course = allCourseData[courseId];
    if (!course) return;

    const pill = document.createElement("div");
    pill.className = "course-pill";
    pill.innerText = `${course.code}: ${course.title}`;
    pill.setAttribute("draggable", "true");
    pill.dataset.courseId = courseId;

    pill.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", courseId);
    });

    pool.appendChild(pill);
  });
}

function addProgramToPlan(programName) {
  if (!programName) return;
  const plan = userPlans.plans[userPlans.activePlan];
  if (!plan.programs.includes(programName)) {
    plan.programs.push(programName);
    saveUserPlans();
    renderCoursePool(plan);
  }
}
