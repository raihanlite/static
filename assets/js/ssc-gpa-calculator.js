const core = {
    science: ["Bangla", "English", "Math", "Religion", "ICT", "BGS", "Physics", "Chemistry"],
    commerce: ["Bangla", "English", "Math", "Religion", "ICT", "General Science", "Accounting", "Business Ent.", "Finance"],
    arts: ["Bangla", "English", "Math", "Religion", "ICT", "General Science", "History", "Geography", "Civics"]
};
const grades = { "A+": 5, "A": 4, "A-": 3.5, "B": 3, "C": 2, "D": 1, "F": 0 };

// Initialize the app
function initApp() {
    const group = document.getElementById('group').value;
    const mode = document.getElementById('mode').value;
    const grid = document.getElementById('mainGrid');

    // Load Core Subjects
    grid.innerHTML = '';
    core[group].forEach((sub, i) => {
        grid.innerHTML += `<div class="subject-item"><label>${sub}</label>${renderInput('main' + i, mode)}</div>`;
    });

    // Show/Hide specific group UI
    if (group === 'science') {
        document.getElementById('scienceOptions').style.display = 'grid';
        document.getElementById('otherOptions').style.display = 'none';
        document.getElementById('sub3_input_container').innerHTML = renderInput('sci3', mode);
        document.getElementById('sub4_input_container').innerHTML = renderInput('sci4', mode);
    } else {
        document.getElementById('scienceOptions').style.display = 'none';
        document.getElementById('otherOptions').style.display = 'grid';

        const sub3Div = document.getElementById('otherSub3Input');
        const sub4Div = document.getElementById('otherSub4Input');

        // Define selectable subjects for the group
        let subjects = group === 'commerce'
            ? ["Accounting", "Business Ent.", "Finance"]
            : ["History", "Geography", "Civics"];

        // 3rd Subject
        sub3Div.innerHTML = `<select id="otherSub3_name" onchange="otherAutoSwap(true)">
            ${subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
        <div id="other3_container" style="margin-top:5px">${renderInput('other3', mode)}</div>`;

        // 4th Subject
        sub4Div.innerHTML = `<select id="otherSub4_name" onchange="otherAutoSwap(false)">
            ${subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
        <div id="other4_container" style="margin-top:5px">${renderInput('other4', mode)}</div>`;
    }
}

// Render grade or point input
function renderInput(id, mode) {
    if (mode === 'grade') {
        return `<select id="${id}" class="g-input">${Object.keys(grades).map(k => `<option value="${grades[k]}">${k}</option>`).join('')}</select>`;
    }
    return `<input type="number" id="${id}" class="g-input" placeholder="0.00" step="0.01" min="0" max="5">`;
}

// Prevent duplicate subjects for science
function autoSwap(isSub3) {
    const s3 = document.getElementById('sub3_name');
    const s4 = document.getElementById('sub4_name');
    if (s3.value === s4.value) {
        if (isSub3) s4.value = (s3.value === "Biology") ? "Higher Math" : "Biology";
        else s3.value = (s4.value === "Biology") ? "Higher Math" : "Biology";
    }
}

// Prevent duplicate subjects for other groups
function otherAutoSwap(isSub3) {
    const s3 = document.getElementById('otherSub3_name');
    const s4 = document.getElementById('otherSub4_name');
    if (s3.value === s4.value) {
        const group = document.getElementById('group').value;
        const subjects = group === 'commerce'
            ? ["Accounting", "Business Ent.", "Finance"]
            : ["History", "Geography", "Civics"];
        // Pick the first subject that isn't selected
        const newVal = subjects.find(s => s !== s3.value && s !== s4.value);
        if (isSub3) s4.value = newVal;
        else s3.value = newVal;
    }
}

// Update input field when subject changes
function updateOtherInput(inputId) {
    const mode = document.getElementById('mode').value;
    document.getElementById(inputId + '_container').innerHTML = renderInput(inputId, mode);
}

// Calculate GPA
function calculateGPA() {
    const inputs = document.querySelectorAll('.g-input');
    let total = 0;
    let fail = false;
    let count = inputs.length - 1; // Exclude 4th subject
    const fourthVal = parseFloat(inputs[inputs.length - 1].value || 0);

    for (let i = 0; i < inputs.length - 1; i++) {
        let v = parseFloat(inputs[i].value || 0);
        if (v === 0) fail = true;
        total += v;
    }

    let bonus = fourthVal > 2 ? (fourthVal - 2) : 0;
    let final = (total + bonus) / count;
    if (final > 5) final = 5;

    const res = document.getElementById('result');
    res.style.display = 'block';
    document.getElementById('gpaDisplay').innerText = fail ? "0.00" : final.toFixed(2);
    document.getElementById('status').innerText = fail ? "FAILED" : (final >= 5 ? "GOLDEN A+" : "PASSED");
    document.getElementById('status').style.color = fail ? "red" : "green";
}

initApp();