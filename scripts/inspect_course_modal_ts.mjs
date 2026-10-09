async function inspect() {
  const r = await fetch('http://localhost:4321/src/scripts/course-modal.ts');
  console.log('STATUS:', r.status);
  console.log('CONTENT:', (await r.text()).slice(0, 400));
}

inspect().catch(console.error);
