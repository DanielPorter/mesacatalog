let termCount = 1;

function addTerm() {
    const container = document.getElementById("termsContainer");

    const termCard = document.createElement("div");
    termCard.className = "term-card";

    const header = document.createElement("div");
    header.className = "term-header";

    const title = document.createElement("div");
    title.className = "term-title";
    title.innerText = `Term ${termCount++}`;

    const removeBtn = document.createElement("button");
    removeBtn.innerText = "Remove";
    removeBtn.onclick = () => container.removeChild(termCard);

    header.appendChild(title);
    header.appendChild(removeBtn);

    const courseList = document.createElement("div");
    courseList.className = "term-courses";

    termCard.appendChild(header);
    termCard.appendChild(courseList);
    container.appendChild(termCard);
}
