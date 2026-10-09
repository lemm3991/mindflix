async function inspect() {
  const r1 = await fetch('http://localhost:4321/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts');
  console.log('INDEX 0 (first 300 chars):', (await r1.text()).slice(0, 300));

  const r2 = await fetch('http://localhost:4321/src/layouts/Layout.astro?astro&type=script&index=1&lang.ts');
  console.log('INDEX 1 (first 300 chars):', (await r2.text()).slice(0, 300));
}

inspect().catch(console.error);
