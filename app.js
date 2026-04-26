const STORAGE_KEY = "memory-of-unsaid-things";
const PREVIEW_MEMORIES = [
  {
    id: "preview-1",
    text: "I wish I had said thank you when I had the chance.",
    createdAt: "2026-04-20T17:18:00.000Z",
  },
  {
    id: "preview-2",
    text: "I am proud of how far I have come.",
    createdAt: "2026-04-22T08:05:00.000Z",
  },
];

const params = new URLSearchParams(window.location.search);
const isPreview = params.get("preview") === "1";

const form = document.getElementById("memory-form");
const input = document.getElementById("memory-input");
const list = document.getElementById("memory-list");
const emptyState = document.getElementById("empty-state");
const clearAllBtn = document.getElementById("clear-all");
const previewBadge = document.getElementById("preview-badge");

function loadMemories() {
  if (isPreview) {
    return PREVIEW_MEMORIES;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMemories(memories) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleString();
}

function render() {
  const memories = loadMemories();
  list.innerHTML = "";

  if (memories.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  memories.forEach((memory) => {
    const li = document.createElement("li");

    const block = document.createElement("div");
    const text = document.createElement("p");
    text.textContent = memory.text;

    const time = document.createElement("time");
    time.dateTime = memory.createdAt;
    time.textContent = formatDate(memory.createdAt);

    block.append(text, time);

    if (!isPreview) {
      const removeBtn = document.createElement("button");
      removeBtn.className = "delete";
      removeBtn.type = "button";
      removeBtn.textContent = "Delete";
      removeBtn.addEventListener("click", () => {
        const updated = loadMemories().filter((item) => item.id !== memory.id);
        saveMemories(updated);
        render();
      });
      li.append(block, removeBtn);
    } else {
      li.append(block);
    }

    list.append(li);
  });
}

function initializePreviewMode() {
  if (!isPreview) {
    return;
  }

  previewBadge.hidden = false;
  input.disabled = true;
  input.placeholder = "Preview mode is read-only.";
  clearAllBtn.disabled = true;
  form.querySelector("button[type='submit']").disabled = true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (isPreview) {
    return;
  }

  const text = input.value.trim();
  if (!text) {
    return;
  }

  const memories = loadMemories();
  memories.unshift({
    id: crypto.randomUUID(),
    text,
    createdAt: new Date().toISOString(),
  });

  saveMemories(memories);
  input.value = "";
  input.focus();
  render();
});

clearAllBtn.addEventListener("click", () => {
  if (isPreview) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
  render();
});

initializePreviewMode();
render();
