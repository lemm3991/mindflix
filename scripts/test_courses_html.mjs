async function test() {
  const res = await fetch('http://localhost:4321/courses');
  const text = await res.text();
  console.log('STATUS:', res.status);
  console.log('HTML length:', text.length);
  console.log('Has mindflix-courses-json?', text.includes('mindflix-courses-json'));
  console.log('Has course-detail-modal-backdrop?', text.includes('course-detail-modal-backdrop'));
  console.log('Has trilha-detail-modal-backdrop?', text.includes('trilha-detail-modal-backdrop'));
  if (text.includes('mindflix-courses-json')) {
    const idx = text.indexOf('mindflix-courses-json');
    console.log('Snippet around mindflix-courses-json:', text.slice(idx - 50, idx + 150));
  }
}

test().catch(console.error);
