// script.js
const courses = [
    { code: "CS101", title: "Introduction to Computer Science", units: 3, description: "An introductory course covering the basics of computer science." },
    { code: "ENG102", title: "English Composition", units: 3, description: "A composition course emphasizing critical thinking and clear expression." },
    // Add more courses as needed
];

const courseList = document.getElementById("courseList");
const searchInput = document.getElementById("searchInput");
const courseDetails = document.getElementById("courseDetails");

// Function to display course details
function displayCourseDetails(course) {
    courseDetails.innerHTML = `
        <h2>${course.title}</h2>
        <p><strong>Code:</strong> ${course.code}</p>
        <p><strong>Description:</strong> ${course.description}</p>
        <p><strong>Units:</strong> ${course.units}</p>
    `;
    courseDetails.style.display = "block";
}

// Function to hide course details
function hideCourseDetails() {
    courseDetails.style.display = "none";
}



// Function to filter courses based on search input
function filterCourses(searchTerm) {
    const filteredCourses = courses.filter(course => {
        return course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.code.toLowerCase().includes(searchTerm.toLowerCase());
    });
    displayCourses(filteredCourses);
}

// Function to display courses as preview cards
function displayCourses(coursesToShow) {
    courseList.innerHTML = "";
    coursesToShow.forEach(course => {
        const courseCard = document.createElement("div");
        courseCard.classList.add("courseCard");
        courseCard.innerHTML = `
            <div class="courseCardContent">
                <h3>${course.code}</h3>
                <h4>${course.title}</h4>
            </div>
            <div class="expandButton">+</div>
        `;
        courseCard.addEventListener("click", () => {
            if (courseDetails.style.display === "block" && courseDetails.dataset.courseCode === course.code) {
                hideCourseDetails();
            } else {
                displayCourseDetails(course);
            }
        });
        courseList.appendChild(courseCard);
    });
}

// Initial display of all courses
displayCourses(courses);

// Event listener for search input
searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
        filterCourses(searchTerm);
    } else {
        displayCourses(courses);
    }
});

// Event listener to hide course details when clicking outside the details section
document.addEventListener("click", event => {
    if (!courseDetails.contains(event.target) && event.target !== searchInput) {
        hideCourseDetails();
    }
});
