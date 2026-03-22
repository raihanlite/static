let currentModule = 'academic';

// Populate Selects
function init() {
    const selects = ['lBand', 'rBand', 'wBand', 'sBand'];
    selects.forEach(id => {
        const el = document.getElementById(id);
        for (let i = 0; i <= 9; i += 0.5) {
            let opt = document.createElement('option');
            opt.value = i;
            opt.textContent = i === 0 ? "Band " + i : i.toFixed(1);
            el.appendChild(opt);
        }
    });
}

function setModule(m) {
    currentModule = m;
    document.getElementById('btnAcad').classList.toggle('active', m === 'academic');
    document.getElementById('btnGen').classList.toggle('active', m === 'general');
    updateFromRaw();
}

function getBandFromRaw(raw, type) {
    raw = parseInt(raw) || 0;
    if (type === 'listening') {
        if (raw >= 39) return 9; if (raw >= 37) return 8.5; if (raw >= 35) return 8;
        if (raw >= 32) return 7.5; if (raw >= 30) return 7; if (raw >= 26) return 6.5;
        if (raw >= 23) return 6; if (raw >= 18) return 5.5; if (raw >= 16) return 5;
        return Math.max(0, (raw / 4) - 1); // Simple floor for low scores
    }
    if (currentModule === 'academic') {
        if (raw >= 39) return 9; if (raw >= 37) return 8.5; if (raw >= 35) return 8;
        if (raw >= 33) return 7.5; if (raw >= 30) return 7; if (raw >= 27) return 6.5;
        if (raw >= 23) return 6; if (raw >= 19) return 5.5; if (raw >= 15) return 5;
    } else {
        if (raw >= 40) return 9; if (raw >= 39) return 8.5; if (raw >= 37) return 8;
        if (raw >= 36) return 7.5; if (raw >= 34) return 7; if (raw >= 32) return 6.5;
        if (raw >= 30) return 6; if (raw >= 27) return 5.5; if (raw >= 23) return 5;
    }
    return 0;
}

function updateFromRaw() {
    const lVal = getBandFromRaw(document.getElementById('lRaw').value, 'listening');
    const rVal = getBandFromRaw(document.getElementById('rRaw').value, 'reading');

    document.getElementById('lBand').value = Math.floor(lVal * 2) / 2;
    document.getElementById('rBand').value = Math.floor(rVal * 2) / 2;
    calculateOverall();
}

function calculateOverall() {
    const l = parseFloat(document.getElementById('lBand').value);
    const r = parseFloat(document.getElementById('rBand').value);
    const w = parseFloat(document.getElementById('wBand').value);
    const s = parseFloat(document.getElementById('sBand').value);

    const avg = (l + r + w + s) / 4;
    let final = 0;
    const dec = avg % 1;

    if (dec < 0.25) final = Math.floor(avg);
    else if (dec < 0.75) final = Math.floor(avg) + 0.5;
    else final = Math.ceil(avg);

    document.getElementById('overallResult').textContent = final.toFixed(1);

    const feedback = document.getElementById('feedbackText');
    if (final >= 8) feedback.textContent = "Expert User - Amazing!";
    else if (final >= 7) feedback.textContent = "Good User - Well Done!";
    else if (final > 0) feedback.textContent = "Competent User - Keep practicing!";
}

init();