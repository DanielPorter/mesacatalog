let originalCourses = []; // Store the original course data
let allCourses = [];      // Store the filtered course data
let currentPage = 1;
const coursesPerPage = 30;

// Load JSON data
async function loadCourses() {
    try {
        console.log("Loading courses...");
        const [sdmcResponse, ucbResponse] = await Promise.all([
            fetch('sd-miramar-courses.json'),
            fetch('ucb-courses.json')
        ]);
        const sdmcCourses = await sdmcResponse.json();
        const ucbCourses = await ucbResponse.json();
        originalCourses = [...sdmcCourses, ...ucbCourses]; // Store original data
        allCourses = [...originalCourses]; // Initialize with all courses
        renderCourses();
    } catch (error) {
        console.error('Error loading course data:', error);
    }
}

// Render courses
function renderCourses() {
    const container = document.getElementById('coursesContainer');
    container.innerHTML = '';

    if (allCourses.length === 0) {
        container.innerHTML = '<p>No courses found. Try adjusting your filters.</p>';
        return;
    }

    const start = (currentPage - 1) * coursesPerPage;
    const end = start + coursesPerPage;

    allCourses.slice(start, end).forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <h3>${course.college}</h3>
            <div class="course-basic">
                ${course.title}: <strong>${course.code}</strong>
            </div>
            <div class="course-details">
                <p><strong>Prerequisites:</strong> ${course.prerequisites.join(', ')}</p>
                <p><strong>Description:</strong> ${course.description}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            card.classList.toggle('active');
            card.querySelector('.course-details').style.display = 
                card.classList.contains('active') ? 'block' : 'none';
        });

        container.appendChild(card);
    });
}

// Filter courses based on search and filters
function filterCourses() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const institutionFilter = document.getElementById('institution').value;
    const departmentFilter = document.getElementById('department').value;

    // Reset allCourses to the original data before filtering
    allCourses = [...originalCourses];

    const filteredCourses = allCourses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery) ||
                              course.code.toLowerCase().includes(searchQuery) ||
                              course.description.toLowerCase().includes(searchQuery);

        const matchesInstitution = institutionFilter === 'all' || 
                                   course.college.toLowerCase().includes(institutionFilter.toLowerCase());

        const matchesDepartment = departmentFilter === 'all' || 
                                  course.department.toLowerCase().includes(departmentFilter.toLowerCase());

        return matchesSearch && matchesInstitution && matchesDepartment;
    });

    // Update the displayed courses
    allCourses = filteredCourses;
    currentPage = 1; // Reset to the first page
    renderCourses();
}

// Pagination controls
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        document.getElementById('currentPage').textContent = currentPage;
        renderCourses();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < Math.ceil(allCourses.length / coursesPerPage)) {
        currentPage++;
        document.getElementById('currentPage').textContent = currentPage;
        renderCourses();
    }
});

// Event listeners for search and filters
document.getElementById('search').addEventListener('input', filterCourses);
document.getElementById('institution').addEventListener('change', filterCourses);
document.getElementById('department').addEventListener('change', filterCourses);

// Load courses on page load
loadCourses();
