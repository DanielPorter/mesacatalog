document.addEventListener('DOMContentLoaded', function () {
  const courseCards = document.querySelectorAll('.course');

  courseCards.forEach(courseCard => {
    const toggleButton = courseCard.querySelector('.toggle-description');
    const description = courseCard.querySelector('.description');
    const courseDescription = courseCard.querySelector('.course-description');
    const courseUnits = courseCard.querySelector('.course-units');

    toggleButton.addEventListener('click', () => {
      description.classList.toggle('hidden');
      if (description.classList.contains('hidden')) {
        toggleButton.textContent = 'Show Details';
      } else {
        toggleButton.textContent = 'Hide Details';
      }
    });

    courseCard.addEventListener('click', () => {
      courseDescription.textContent = courseCard.getAttribute('data-description');
      courseUnits.textContent = courseCard.getAttribute('data-units');
    });
  });
});
