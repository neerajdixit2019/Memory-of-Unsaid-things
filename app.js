const STORAGE_KEY = "memory-of-unsaid-things";

const form = document.getElementById("memory-form");
const input = document.getElementById("memory-input");
const list = document.getElementById("memory-list");
const emptyState = document.getElementById("empty-state");
const clearAllBtn = document.getElementById("clear-all");

function loadMemories() {
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
    list.append(li);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
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
  localStorage.removeItem(STORAGE_KEY);
  render();
});

render();
