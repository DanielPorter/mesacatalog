document.addEventListener('DOMContentLoaded', function () {
  const courseCards = document.querySelectorAll('.course');

  courseCards.forEach(courseCard => {
    const description = courseCard.querySelector('.description');

    courseCard.addEventListener('click', () => {
      description.classList.toggle('hidden');
    });
  });
});
