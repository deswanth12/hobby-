async function test() {
  const res = await fetch("https://kavithaassociates.com/");
  const html = await res.text();
  const m = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
  if (m) {
    const js = await (await fetch("https://kavithaassociates.com" + m[1])).text();
    console.log("Bundle hash:", m[1]);
    console.log("Hero photo in bundle:", js.includes("chamber-consultation.jpeg"));
    console.log("Alive ping in bundle:", js.includes("animate-ping"));
    console.log("Schedule consultation in bundle:", js.includes("SCHEDULE CONSULTATION"));
  }
}
test();
