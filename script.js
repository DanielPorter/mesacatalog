document.addEventListener('DOMContentLoaded', function () {
  const courseCards = document.querySelectorAll('.course');

  courseCards.forEach(courseCard => {
    const description = courseCard.querySelector('.description');
    const toggleButton = courseCard.querySelector('.toggle-description');

    courseCard.addEventListener('click', () => {
      courseCards.forEach(card => {
        if (card !== courseCard) {
          card.querySelector('.description').classList.add('hidden');
        }
      });
      description.classList.toggle('hidden');
    });

    toggleButton.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevents the click event from bubbling up to the parent course card
      description.classList.toggle('hidden');
    });
  });
});
