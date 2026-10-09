async function check() {
  const res = await fetch('http://localhost:4321/courses');
  const text = await res.text();
  console.log('Includes CourseDetailModal?', text.includes('CourseDetailModal'));
  console.log('Includes TrilhaDetailModal?', text.includes('TrilhaDetailModal'));
  
  const matches = text.match(/<script[^>]*src="[^"]*CourseDetailModal[^"]*"[^>]*>/gi);
  console.log('Matches for CourseDetailModal script:', matches);
  
  const allScriptTags = text.match(/<script[^>]*>/gi);
  console.log('All script tags in HTML:', allScriptTags);
}

check().catch(console.error);
