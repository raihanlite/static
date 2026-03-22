(function () {
    const groups = {
        science: {
            main: ["Bangla", "English", "ICT", "Physics", "Chemistry", "Biology / Math"],
            optional: ["Biology", "Agriculture", "Higher Math", "Computer Science", "Engineering Drawing", "Fine Arts"]
        },
        business: {
            main: ["Bangla", "English", "ICT", "Accounting", "Business Organization & Management", "Finance, Banking & Insurance"],
            optional: ["Marketing", "Cooperative", "Production Management & Entrepreneurship", "Higher Math", "Computer Science", "Fine Arts"]
        },
        humanities: {
            main: ["Bangla", "English", "ICT", "Civics & Good Governance", "History of Bangladesh & World Civilization", "Geography & Environment"],
            optional: ["Psychology", "Sociology", "Logic", "Higher Math", "Computer Science", "Fine Arts"]
        }
    };

    const grades = [
        { label: "Select Grade", value: "" },
        { label: "A+ (5.00)", value: 5 },
        { label: "A (4.00)", value: 4 },
        { label: "A- (3.50)", value: 3.5 },
        { label: "B (3.00)", value: 3 },
        { label: "C (2.00)", value: 2 },
        { label: "D (1.00)", value: 1 },
        { label: "F (0.00)", value: 0 }
    ];

    const groupSelect = document.getElementById('groupSelect');
    const subjectsForm = document.getElementById('subjectsForm');
    const resultBox = document.getElementById('result');
    const totalMarksBox = document.getElementById('totalMarks');
    const calculateBtn = document.getElementById('calculateBtn');
    const saveImageBtn = document.getElementById('saveImageBtn');

    function marksToGPA(mark) {
        if (mark >= 80) return 5;
        if (mark >= 70) return 4;
        if (mark >= 60) return 3.5;
        if (mark >= 50) return 3;
        if (mark >= 40) return 2;
        if (mark >= 33) return 1;
        return 0;
    }

    function renderSubjects(group) {
        subjectsForm.innerHTML = '';

        groups[group].main.forEach(subject => {
            const id = subject.toLowerCase().replace(/[^a-z0-9]/gi, '');
            const label = document.createElement('label');
            label.textContent = subject;

            const row = document.createElement('div');

            const gradeSelect = document.createElement('select');
            gradeSelect.id = id + '_grade';
            grades.forEach(g => {
                const opt = document.createElement('option');
                opt.value = g.value;
                opt.textContent = g.label;
                gradeSelect.appendChild(opt);
            });

            const markInput = document.createElement('input');
            markInput.type = 'number';
            markInput.min = 0;
            markInput.max = subject.toLowerCase().includes('ict') ? 100 : 200;
            markInput.placeholder = subject.toLowerCase().includes('ict') ? 'Marks (0-100)' : 'Marks (0-200)';
            markInput.id = id + '_marks';

            markInput.addEventListener('input', function () {
                let mark = parseFloat(markInput.value);
                if (!isNaN(mark)) {
                    let avg = subject.toLowerCase().includes('ict') ? mark : mark / 2;
                    gradeSelect.value = marksToGPA(avg);
                } else {
                    gradeSelect.value = '';
                }
            });

            gradeSelect.addEventListener('change', function () {
                if (gradeSelect.value !== '') {
                    markInput.value = '';
                }
            });

            row.appendChild(gradeSelect);
            row.appendChild(markInput);
            subjectsForm.appendChild(label);
            subjectsForm.appendChild(row);
        });

        const optLabel = document.createElement('label');
        optLabel.textContent = 'Optional Subject';
        subjectsForm.appendChild(optLabel);

        const optSelect = document.createElement('select');
        optSelect.id = 'optional_subject';
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = 'Select Optional Subject';
        optSelect.appendChild(defaultOpt);

        groups[group].optional.forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub;
            opt.textContent = sub;
            optSelect.appendChild(opt);
        });
        subjectsForm.appendChild(optSelect);

        const optRow = document.createElement('div');

        const optGrade = document.createElement('select');
        optGrade.id = 'optional_grade';
        optGrade.hidden = true;
        grades.forEach(g => {
            const opt = document.createElement('option');
            opt.value = g.value;
            opt.textContent = g.label;
            optGrade.appendChild(opt);
        });

        const optMarkInput = document.createElement('input');
        optMarkInput.type = 'number';
        optMarkInput.min = 0;
        optMarkInput.max = 200;
        optMarkInput.placeholder = 'Marks (0-200)';
        optMarkInput.id = 'optional_marks';
        optMarkInput.hidden = true;

        optRow.appendChild(optGrade);
        optRow.appendChild(optMarkInput);
        subjectsForm.appendChild(optRow);

        optSelect.addEventListener('change', function () {
            if (optSelect.value === '') {
                optGrade.hidden = true;
                optMarkInput.hidden = true;
                optGrade.value = '';
                optMarkInput.value = '';
            } else {
                optGrade.hidden = false;
                optMarkInput.hidden = false;
            }
        });

        optMarkInput.addEventListener('input', function () {
            let mark = parseFloat(optMarkInput.value);
            if (!isNaN(mark)) {
                let avg = mark / 2;
                optGrade.value = marksToGPA(avg);
            } else {
                optGrade.value = '';
            }
        });

        optGrade.addEventListener('change', function () {
            if (optGrade.value !== '') {
                optMarkInput.value = '';
            }
        });
    }

    function calculateGPA() {
        const group = groupSelect.value;
        const mainSubjects = groups[group].main;

        let totalPoints = 0;
        let count = 0;
        let optionalPoint = 0;
        let totalMarks = 0;
        let valid = true;

        for (let subject of mainSubjects) {
            const id = subject.toLowerCase().replace(/[^a-z0-9]/gi, '');
            let gradeVal = parseFloat(document.getElementById(id + '_grade').value);
            let markVal = parseFloat(document.getElementById(id + '_marks').value);

            if (isNaN(gradeVal)) gradeVal = null;
            if (isNaN(markVal)) markVal = null;

            if (gradeVal === null && markVal === null) {
                alert(`Please enter marks or select grade for ${subject}`);
                valid = false;
                break;
            }

            if (gradeVal === null || gradeVal === '') {
                let avg = subject.toLowerCase().includes('ict') ? markVal : markVal / 2;
                gradeVal = marksToGPA(avg);
            }

            totalPoints += gradeVal;
            count++;

            if (markVal !== null && !isNaN(markVal)) {
                totalMarks += markVal;
            } else {
                totalMarks += gradeVal * 40;
            }
        }

        if (!valid) return;

        const optionalSub = document.getElementById('optional_subject').value;
        if (optionalSub !== '') {
            let gradeValOpt = parseFloat(document.getElementById('optional_grade').value);
            let markValOpt = parseFloat(document.getElementById('optional_marks').value);

            if (isNaN(gradeValOpt)) gradeValOpt = null;
            if (isNaN(markValOpt)) markValOpt = null;

            if (gradeValOpt === null && markValOpt === null) {
                alert(`Please enter marks or select grade for Optional Subject`);
                return;
            }

            if (gradeValOpt === null || gradeValOpt === '') {
                let avgOpt = markValOpt / 2;
                gradeValOpt = marksToGPA(avgOpt);
            }

            optionalPoint = gradeValOpt > 2 ? (gradeValOpt - 2) / 2 : 0;
        }

        const finalGPA = (totalPoints + optionalPoint) / count;
        const roundedGPA = Math.min(finalGPA, 5).toFixed(2);

        resultBox.textContent = `GPA: ${roundedGPA}`;
        totalMarksBox.textContent = `Total marks (approx): ${Math.round(totalMarks)}`;

        saveImageBtn.disabled = false;
    }

    groupSelect.addEventListener('change', function () {
        renderSubjects(groupSelect.value);
        resultBox.textContent = '';
        totalMarksBox.textContent = '';
        saveImageBtn.disabled = true;
    });

    calculateBtn.addEventListener('click', calculateGPA);

    async function saveAsPicture() {
        if (!window.html2canvas) {
            await new Promise(resolve => {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
                script.onload = resolve;
                document.body.appendChild(script);
            });
        }

        const calcBtn = document.getElementById('calculateBtn');
        const saveBtn = document.getElementById('saveImageBtn');
        calcBtn.hidden = true;
        saveBtn.hidden = true;

        await new Promise(r => setTimeout(r, 150));

        const container = document.querySelector('.container');
        try {
            const canvas = await html2canvas(container, { backgroundColor: null, scale: 2 });
            calcBtn.hidden = false;
            saveBtn.hidden = false;

            const link = document.createElement('a');
            link.download = 'gpa_result.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (e) {
            calcBtn.hidden = false;
            saveBtn.hidden = false;
            alert('Could not capture image.');
        }
    }

    saveImageBtn.addEventListener('click', saveAsPicture);

    renderSubjects(groupSelect.value);
    saveImageBtn.disabled = true;
})();