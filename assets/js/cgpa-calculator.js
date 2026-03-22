
const UGC_SCALE = { "A+": 4.0, "A": 3.75, "A-": 3.5, "B+": 3.25, "B": 3.0, "B-": 2.75, "C+": 2.5, "C": 2.25, "D": 2.0, "F": 0.0 };

let currentSubjects = [];
let semesterRecords = [];

function updateGradeDropdown() {
    const select = document.getElementById("subjGrade");
    select.innerHTML = Object.keys(UGC_SCALE).map(g => `<option value="${g}">${g} (${UGC_SCALE[g].toFixed(2)})</option>`).join('');
}

function calculateStats() {
    // Semester calculation
    let sPoints = 0, sCredits = 0;
    currentSubjects.forEach(s => { sPoints += s.gpa * s.credit; sCredits += s.credit; });
    const semGPA = sCredits > 0 ? sPoints / sCredits : 0;
    document.getElementById("semesterGpaDisplay").textContent = semGPA.toFixed(2);

    // Cumulative calculation
    let totalPoints = sPoints, totalCredits = sCredits;
    semesterRecords.forEach(r => { totalPoints += r.gpa * r.credits; totalCredits += r.credits; });
    const cumGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;
    document.getElementById("cumulativeCgpa").textContent = cumGPA.toFixed(2);

    return { totalPoints, totalCredits, cumGPA };
}

function renderLists() {
    const subCont = document.getElementById("subjectsContainer");
    subCont.innerHTML = currentSubjects.map((s, i) => `
            <div class="entry-item">
                <span>${s.name} (${s.credit}cr)</span>
                <span>${s.grade} <button class="remove-btn" onclick="removeSub(${i})">✕</button></span>
            </div>`).join('') || '<p style="text-align:center">No subjects.</p>';

    const semCont = document.getElementById("semestersContainer");
    semCont.innerHTML = semesterRecords.map((r, i) => `
            <div class="entry-item">
                <span>${r.name} (${r.credits}cr)</span>
                <span>${r.gpa.toFixed(2)} <button class="remove-btn" onclick="removeSem(${i})">✕</button></span>
            </div>`).join('') || '<p style="text-align:center">No records.</p>';

    calculateStats();
}

window.removeSub = (i) => { currentSubjects.splice(i, 1); renderLists(); };
window.removeSem = (i) => { semesterRecords.splice(i, 1); renderLists(); };

document.getElementById("subjectForm").onsubmit = (e) => {
    e.preventDefault();
    currentSubjects.push({
        name: document.getElementById("subjName").value,
        credit: parseFloat(document.getElementById("subjCredit").value),
        grade: document.getElementById("subjGrade").value,
        gpa: UGC_SCALE[document.getElementById("subjGrade").value]
    });
    document.getElementById("subjName").value = '';
    renderLists();
};

document.getElementById("overallForm").onsubmit = (e) => {
    e.preventDefault();
    semesterRecords.push({
        name: document.getElementById("semesterDropdown").value,
        gpa: parseFloat(document.getElementById("overallGpa").value),
        credits: parseFloat(document.getElementById("overallCredits").value)
    });
    document.getElementById("overallGpa").value = '';
    document.getElementById("overallCredits").value = '';
    renderLists();
};

document.getElementById("calculateGoalBtn").onclick = () => {
    const target = parseFloat(document.getElementById("targetCgpaGoal").value);
    const future = parseFloat(document.getElementById("futureCredits").value);
    const current = calculateStats();

    const neededPoints = (target * (current.totalCredits + future)) - current.totalPoints;
    const requiredGPA = neededPoints / future;

    const res = document.getElementById("goalResult");
    if (requiredGPA > 4) {
        res.innerHTML = `<strong>Impossible:</strong> Requires ${requiredGPA.toFixed(2)} GPA. Try lowering your target.`;
    } else if (requiredGPA <= 0) {
        res.innerHTML = `<strong>Goal Achieved:</strong> Your current standing is already above ${target.toFixed(2)}.`;
    } else {
        res.innerHTML = `To reach ${target.toFixed(2)}, you need a <strong>${requiredGPA.toFixed(2)} average</strong> in your next ${future} credits.`;
    }
};

updateGradeDropdown();
renderLists();