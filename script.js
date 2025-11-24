// script.js - parent window controls preview iframe and download
const form = document.getElementById('resumeForm');
const preview = document.getElementById('previewFrame');
const previewBtn = document.getElementById('previewBtn');
const downloadBtn = document.getElementById('downloadBtn');

function splitLines(text) {
  if (!text) return [];
  return text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
}
function splitComma(text) {
  if (!text) return [];
  return text.split(',').map(s => s.trim()).filter(Boolean);
}

function collectData() {
  const fd = new FormData(form);
  const data = {
    type: 'RESUME_DATA',
    name: fd.get('name') || '',
    title: fd.get('title') || '',
    location: fd.get('location') || '',
    mobile: fd.get('mobile') || '',
    email: fd.get('email') || '',
    summary: fd.get('summary') || '',
    education: splitLines(fd.get('education') || ''),
    skills: splitComma(fd.get('skills') || ''),
    techskills: splitComma(fd.get('techskills') || ''),
    projects: splitLines(fd.get('projects') || ''),
    extra: splitLines(fd.get('extra') || ''),
    dob: '', nationality: '', mstatus: '', // optional future fields
    certs: [], languages: []
  };
  // auto-populate some biodata defaults for a fuller resume (you can edit)
  if (data.name && !fd.get('dob')) data.dob = '';
  // Add sample extra certifications when blank to make resume look fuller (you can remove)
  if (!data.extra.length) data.extra = ['Attended webinar: Introduction to Arduino', 'Volunteer: Gyan Foundation Walkathon'];
  if (!data.certs.length) data.certs = ['Introduction to SQL', 'Certified Course: Programming for Everybody'];
  return data;
}

previewBtn.addEventListener('click', () => {
  const data = collectData();
  preview.contentWindow.postMessage(data, '*');
});

downloadBtn.addEventListener('click', () => {
  const data = collectData();
  preview.contentWindow.postMessage(data, '*');
  // Wait briefly to let iframe render
  setTimeout(() => {
    try {
      preview.contentWindow.focus();
      preview.contentWindow.print();
    } catch (err) {
      // fallback: open preview in new tab
      window.open('resume.html', '_blank');
    }
  }, 600);
});

// auto-update preview on form change (small debounce)
let to = null;
form.addEventListener('input', () => {
  clearTimeout(to);
  to = setTimeout(() => {
    preview.contentWindow.postMessage(collectData(), '*');
  }, 500);
});
