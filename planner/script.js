// File paths
const COURSES_PATH = "data/courses.json";
const PROGRAMS_PATH = "data/programs.json";
const ARTICULATIONS_PATH = "data/articulation-map.json";

// Global variables
let allCourseData = {};
let activePlanId = "miramar";
let userPlans = {
  activePlan: "miramar",
  plans: {
    miramar: { institution: "San Diego Miramar College", programs: [], terms: {} },
    ucb: { institution: "UC Berkeley", programs: [], terms: {} }
  },
  completedCourses: []
};

// Load data and initialize
window.onload = async function () {
  await loadAllCourseData();
  loadUserPlans();
  document.getElementById("planSelect").value = userPlans.activePlan;
  renderPlanView(userPlans.plans[userPlans.activePlan]);
};

// Load all data files
async function loadAllCourseData() {
  const [courseRes] = await Promise.all([
    fetch(COURSES_PATH).then(res => res.json())
    // In future: add programs and articulation loading here
  ]);
  allCourseData = courseRes;
}

// Load saved plans from localStorage
function loadUserPlans() {
  const saved = localStorage.getItem("transferPlans");
  if (saved) userPlans = JSON.parse(saved);
}

// Save plans to localStorage
function saveUserPlans() {
  localStorage.setItem("transferPlans", JSON.stringify(userPlans));
}

// Switch between plans
function switchPlan(planId) {
  userPlans.activePlan = planId;
  saveUserPlans();
  renderPlanView(userPlans.plans[planId]);
}

// Add a new term to current plan
function addTerm() {
  const plan = userPlans.plans[userPlans.activePlan];
  const termNames = Object.keys(plan.terms);
  const newTermName = `Term ${termNames.length + 1}`;
  plan.terms[newTermName] = [];
  saveUserPlans();
  renderPlanView(plan);
}

// Render the entire plan
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
    };

    header.appendChild(title);
    header.appendChild(removeBtn);

    const courseList = document.createElement("div");
    courseList.className = "term-courses";

    // Populate courses
    courseIds.forEach(courseId => {
      const course = allCourseData[courseId];
      if (!course) return;

      const pill = document.createElement("div");
      pill.className = "course-pill";
      pill.innerText = `${course.code}: ${course.title}`;
      courseList.appendChild(pill);
    });

    // Optional: calculate total difficulty
    const totalDifficulty = courseIds.reduce((sum, id) => sum + (allCourseData[id]?.difficulty || 0), 0);
    const diffBadge = document.createElement("div");
    diffBadge.className = "difficulty-badge";
    diffBadge.innerText = `Difficulty: ${totalDifficulty}`;
    header.appendChild(diffBadge);

    termCard.appendChild(header);
    termCard.appendChild(courseList);
    container.appendChild(termCard);
  });
}
