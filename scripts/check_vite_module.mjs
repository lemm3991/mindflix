async function checkModule() {
  const res = await fetch('http://localhost:4321/src/components/CourseDetailModal.astro?astro&type=script&index=0&lang.ts');
  console.log('STATUS:', res.status);
  const text = await res.text();
  console.log('CONTENT (first 500 chars):', text.slice(0, 500));
}

checkModule().catch(console.error);
