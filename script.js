/* =========================================================
   Ashik clicks - portfolio script

   HOW PHOTOS WORK
   Put your photos in the "images" folder and name them like this:
     nature-1.jpg, nature-2.jpg, nature-3.jpg
     rural-1.jpg,  rural-2.jpg,  rural-3.jpg
     ...and so on for every subject below.

   To add more photos to a subject, raise "photosPerSubject".
   To add a new subject, add a new line to "subjects".
   The site tries .jpg, .jpeg, .png and .webp automatically.
   ========================================================= */

const SITE = {
  photosPerSubject: 3,
  subjects: [
    { id: "nature",  label: "Nature" },
    { id: "rural",   label: "Rural life" },
    { id: "flower",  label: "Flowers" },
    { id: "street",  label: "Street" },
    { id: "portrait", label: "Portraits" },
    { id: "animals", label: "Animals" },
    { id: "sky",     label: "Moon and sky" },
    { id: "sunset",  label: "Sunrise and sunset" }
  ]
};

const EXTENSIONS = ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG", "WEBP"];
const RATIOS = ["4 / 5", "1 / 1", "3 / 2", "4 / 5", "3 / 4", "1 / 1"];

/* ---------- Build the photo list ---------- */

const photos = [];
SITE.subjects.forEach((subject, s) => {
  for (let n = 1; n <= SITE.photosPerSubject; n++) {
    photos.push({
      subject: subject.id,
      subjectLabel: subject.label,
      name: `${subject.id}-${n}`,
      number: n,
      order: n * SITE.subjects.length + s, // mixes subjects in the "All" view
      ratio: RATIOS[(s + n) % RATIOS.length],
      src: null,      // filled in once the image loads
      missing: false  // true if no file was found
    });
  }
});
photos.sort((a, b) => a.order - b.order);

let activeSubject = "all";

const filtersEl = document.getElementById("filters");
const gridEl = document.getElementById("grid");

/* ---------- Filter buttons ---------- */

function makeChip(id, label) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "chip";
  btn.textContent = label;
  btn.dataset.subject = id;
  btn.setAttribute("aria-pressed", String(id === activeSubject));
  btn.addEventListener("click", () => {
    activeSubject = id;
    filtersEl.querySelectorAll(".chip").forEach((c) =>
      c.setAttribute("aria-pressed", String(c.dataset.subject === id))
    );
    renderGrid();
  });
  return btn;
}

filtersEl.appendChild(makeChip("all", "All"));
SITE.subjects.forEach((s) => filtersEl.appendChild(makeChip(s.id, s.label)));

/* ---------- Grid ---------- */

function visiblePhotos() {
  return photos.filter((p) => activeSubject === "all" || p.subject === activeSubject);
}

function loadImage(photo, img, tile) {
  let attempt = 0;

  const markLoaded = () => {
    photo.src = img.currentSrc || img.src;
    tile.classList.add("is-loaded");
    tile.disabled = false;
  };

  const markMissing = () => {
    photo.missing = true;
    img.remove();
    tile.classList.add("is-empty");
    tile.disabled = true;
  };

  const tryNext = () => {
    if (attempt >= EXTENSIONS.length) {
      markMissing();
      return;
    }
    img.src = `images/${photo.name}.${EXTENSIONS[attempt]}`;
    attempt += 1;
  };

  img.addEventListener("load", markLoaded);
  img.addEventListener("error", tryNext);

  if (photo.src) {
    img.src = photo.src; // already found on an earlier render
  } else if (photo.missing) {
    markMissing();
  } else {
    tryNext();
  }
}

function renderGrid() {
  gridEl.innerHTML = "";
  const list = visiblePhotos();

  list.forEach((photo) => {
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";
    tile.setAttribute("aria-label", `Open ${photo.subjectLabel} photo ${photo.number}`);

    const frame = document.createElement("span");
    frame.className = "frame";
    frame.style.setProperty("--ratio", photo.ratio);

    const hint = document.createElement("span");
    hint.className = "ph";
    hint.innerHTML = `<strong>${photo.subjectLabel} ${photo.number}</strong>Add images/${photo.name}.jpg`;

    const img = document.createElement("img");
    img.alt = `${photo.subjectLabel} photograph ${photo.number} by Ashik clicks`;
    img.loading = "lazy";
    img.decoding = "async";

    frame.append(hint, img);
    tile.appendChild(frame);
    gridEl.appendChild(tile);

    tile.addEventListener("click", () => openViewer(photo));
    loadImage(photo, img, tile);
  });
}

renderGrid();

/* ---------- Photo viewer ---------- */

const viewer = document.getElementById("lightbox");
const viewerImg = document.getElementById("lb-img");
const viewerCap = document.getElementById("lb-cap");
const btnClose = document.getElementById("lb-close");
const btnPrev = document.getElementById("lb-prev");
const btnNext = document.getElementById("lb-next");

let viewerList = [];
let viewerIndex = 0;
let lastFocus = null;

function showPhoto() {
  const photo = viewerList[viewerIndex];
  viewerImg.src = photo.src;
  viewerImg.alt = `${photo.subjectLabel} photograph ${photo.number} by Ashik clicks`;
  viewerCap.textContent = `${photo.subjectLabel}, photo ${viewerIndex + 1} of ${viewerList.length}`;
  const single = viewerList.length < 2;
  btnPrev.hidden = single;
  btnNext.hidden = single;
}

function openViewer(photo) {
  viewerList = visiblePhotos().filter((p) => p.src);
  viewerIndex = viewerList.indexOf(photo);
  if (viewerIndex < 0) return;
  lastFocus = document.activeElement;
  showPhoto();
  viewer.hidden = false;
  document.body.style.overflow = "hidden";
  btnClose.focus();
}

function closeViewer() {
  viewer.hidden = true;
  viewerImg.removeAttribute("src");
  document.body.style.overflow = "";
  if (lastFocus) lastFocus.focus();
}

function step(direction) {
  if (viewerList.length < 2) return;
  viewerIndex = (viewerIndex + direction + viewerList.length) % viewerList.length;
  showPhoto();
}

btnClose.addEventListener("click", closeViewer);
btnPrev.addEventListener("click", () => step(-1));
btnNext.addEventListener("click", () => step(1));

// Click on the dark background closes the viewer
viewer.addEventListener("click", (e) => {
  if (e.target === viewer) closeViewer();
});

document.addEventListener("keydown", (e) => {
  if (viewer.hidden) return;
  if (e.key === "Escape") closeViewer();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);

  // Keep keyboard focus inside the viewer
  if (e.key === "Tab") {
    const buttons = [btnClose, btnPrev, btnNext].filter((b) => !b.hidden);
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// Swipe left or right on a phone
let touchStartX = null;
viewer.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });
viewer.addEventListener("touchend", (e) => {
  if (touchStartX === null) return;
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  touchStartX = null;
}, { passive: true });

/* ---------- Footer year ---------- */

document.getElementById("year").textContent = new Date().getFullYear();
