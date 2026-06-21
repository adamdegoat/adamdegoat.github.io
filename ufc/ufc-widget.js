// ── UFC Fight Week — iOS home-screen widget (Scriptable) ──────────────────
// HOW TO USE:
//   1. Install "Scriptable" (free) from the App Store.
//   2. Open Scriptable → + → paste this whole file → name it "UFC".
//   3. Long-press your home screen → + → Scriptable → choose Medium size.
//   4. Long-press the widget → Edit Widget → Script: UFC.
// It pulls the live feed the engine publishes and shows the next event + countdown.

const FEED = "https://adamdegoat.github.io/ufc/widget.json";
const STREAM = "https://istreameast.app/mmastreams3";
const RED = new Color("#d20a0a"), GOLD = new Color("#f5b301"), MUT = new Color("#9a9aa6");

let data;
try { data = await new Request(FEED).loadJSON(); }
catch (e) { data = { event: "Offline", main: "", date_sgt: "", when_sgt: "" }; }

const w = new ListWidget();
w.backgroundColor = new Color("#0a0a0c");
w.url = STREAM; // tap widget → open the stream

const head = w.addStack();
const tag = head.addText("UFC");
tag.font = Font.heavySystemFont(15); tag.textColor = RED;
head.addSpacer(6);
const fw = head.addText("FIGHT WEEK");
fw.font = Font.semiboldSystemFont(12); fw.textColor = MUT;
w.addSpacer(6);

const ev = w.addText(data.event || "No event scheduled");
ev.font = Font.boldSystemFont(16); ev.textColor = Color.white(); ev.lineLimit = 2;

if (data.main) {
  const m = w.addText(data.main);
  m.font = Font.mediumSystemFont(13); m.textColor = GOLD; m.lineLimit = 1;
}
w.addSpacer(4);

// countdown
let cd = "";
if (data.date_sgt) {
  const diff = new Date(data.date_sgt) - new Date();
  if (diff > 0) {
    const d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, mn = Math.floor(diff / 6e4) % 60;
    cd = d > 0 ? `${d}d ${h}h ${mn}m` : `${h}h ${mn}m`;
  } else cd = "LIVE / check results";
}
const c = w.addText(cd ? "⏱ " + cd : (data.when_sgt || ""));
c.font = Font.boldSystemFont(22); c.textColor = Color.white();

if (data.when_sgt) {
  const when = w.addText(data.when_sgt);
  when.font = Font.systemFont(11); when.textColor = MUT;
}
w.addSpacer(2);
const tapHint = w.addText("Tap to watch live");
tapHint.font = Font.systemFont(10); tapHint.textColor = RED;

Script.setWidget(w);
w.presentMedium();
Script.complete();
