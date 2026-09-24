<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import CommandTree from './components/CommandTree.vue'
import CommandDetail from './components/CommandDetail.vue'
import { flatten, matchPaths, resolveChain } from './lib/opencli.js'

const props = defineProps({
  // URL of the OpenCLI Description to render.
  src: { type: String, default: '' },
})

const doc = shallowRef(null)
const error = ref('')
const loading = ref(true)
const query = ref('')
const showHidden = ref(false)
const dark = ref(false)

let observer = null

async function load(url) {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
    doc.value = await response.json()
  } catch (e) {
    error.value = `Could not load the description from ${url} (${e.message}).`
    doc.value = null
  } finally {
    loading.value = false
  }
}

watch(() => props.src, (url) => { if (url) load(url) }, { immediate: true })

const PARAM = 'command'

function readLocation() {
  const value = new URLSearchParams(window.location.search).get(PARAM)
  return value ? value.split('.') : []
}

const selected = ref(readLocation())

function writeLocation(path) {
  const url = new URL(window.location.href)
  if (path.length) url.searchParams.set(PARAM, path.join('.'))
  else url.searchParams.delete(PARAM)
  window.history.replaceState(null, '', url)
}

function select(path) {
  selected.value = path
  writeLocation(path)
}

function syncTheme() {
  const root = document.documentElement
  const theme = root.dataset.theme
  if (theme) dark.value = theme === 'dark'
  else dark.value = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

onMounted(() => {
  syncTheme()
  observer = new MutationObserver(syncTheme)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
})

onBeforeUnmount(() => observer?.disconnect())

watch(doc, (value) => {
  if (value && selected.value.length && !resolveChain(value, selected.value)) {
    select([])
  }
})

const chain = computed(() => doc.value && resolveChain(doc.value, selected.value))

const entries = computed(() => (doc.value ? flatten(doc.value) : []))
const matchedPaths = computed(() => matchPaths(entries.value, query.value))
const hiddenCount = computed(() => entries.value.filter((e) => e.command.hidden).length)
</script>

<template>
  <div class="root" :class="{ dark }">
    <p v-if="loading" class="state">Loading description…</p>
    <p v-else-if="error" class="state state-error">{{ error }}</p>

    <template v-else-if="doc">
      <header class="head">
        <div class="head-main">
          <h1 class="head-title">{{ doc.info.title }}</h1>
          <span class="badge badge-version">{{ doc.info.version }}</span>
          <span v-if="doc.info.license" class="badge">
            {{ doc.info.license.identifier ?? doc.info.license.name }}
          </span>
          <span class="badge dim-badge">OpenCLI {{ doc.opencli }}</span>
        </div>
        <p v-if="doc.info.summary" class="head-summary">{{ doc.info.summary }}</p>
      </header>

      <div class="body">
        <aside class="sidebar">
          <label class="search">
            <span class="visually-hidden">Filter commands</span>
            <input
              v-model="query"
              type="search"
              placeholder="Filter commands…"
              autocomplete="off"
              spellcheck="false"
            />
          </label>

          <button
            type="button"
            class="rootlink"
            :class="{ 'is-selected': selected.length === 0 }"
            @click="select([])"
          >
            {{ doc.info.title }}
          </button>

          <p v-if="matchedPaths && matchedPaths.size === 0" class="state state-empty">No matching commands.</p>

          <CommandTree
            :commands="doc.command?.commands"
            :path="[]"
            :selected-key="selected.join(' ')"
            :show-hidden="showHidden"
            :matched-paths="matchedPaths"
            @select="select"
          />

          <label v-if="hiddenCount" class="toggle">
            <input v-model="showHidden" type="checkbox" />
            <span>Show hidden ({{ hiddenCount }})</span>
          </label>
        </aside>

        <main class="content">
          <CommandDetail
            v-if="chain"
            :chain="chain"
            :conventions="doc.conventions"
            :show-hidden="showHidden"
            @select="select"
          />
        </main>
      </div>
    </template>
  </div>
</template>

<style>

:host {
  --bg: #ffffff;
  --bg-soft: #f6f7f9;
  --bg-code: #f2f4f7;
  --fg: #1c1e21;
  --fg-dim: #5c6370;
  --border: #dfe3e8;
  --accent: #2f6f4e;
  --accent-soft: #e6f2ec;
  --radius: 8px;
  --mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;

  display: block;
  container-type: inline-size;
}

.root.dark {
  --bg: #1b1b1d;
  --bg-soft: #242526;
  --bg-code: #2b2c2e;
  --fg: #e3e3e3;
  --fg-dim: #9aa0a6;
  --border: #3a3c3f;
  --accent: #7ec8a2;
  --accent-soft: #23372c;
}

.root {
  background: var(--bg);
  color: var(--fg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 15px;
  line-height: 1.55;
  overflow: hidden;
}

.head {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-soft);
}

.head-main {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.head-title {
  margin: 0;
  font-family: var(--mono);
  font-size: 20px;
  font-weight: 600;
}

.head-summary {
  margin: 6px 0 0;
  color: var(--fg-dim);
}

.body {
  display: grid;
  grid-template-columns: minmax(200px, 260px) 1fr;
  align-items: start;
}

@container (max-width: 720px) {
  .body { grid-template-columns: 1fr; }
  .sidebar { border-right: none; border-bottom: 1px solid var(--border); max-height: 260px; }
}

.sidebar {
  padding: 14px;
  border-right: 1px solid var(--border);
  overflow-y: auto;
  max-height: 640px;
  position: sticky;
  top: 0;
}

.content {
  padding: 20px;
  overflow-x: auto;
  max-height: 640px;
  overflow-y: auto;
}

.search input {
  width: 100%;
  box-sizing: border-box;
  padding: 7px 10px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--fg);
  font: inherit;
  font-size: 14px;
}

.search input:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  color: var(--fg-dim);
  font-size: 13px;
  cursor: pointer;
}

.tree {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar > .tree { margin-top: 4px; }

.tree .tree { border-left: 1px solid var(--border); margin-left: 6px; }

.tree-item,
.rootlink {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 3px 8px;
  border: none;
  border-radius: 5px;
  background: none;
  color: var(--fg);
  font-family: var(--mono);
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}

.rootlink { margin-top: 10px; font-weight: 600; }

.tree-item:hover,
.rootlink:hover { background: var(--bg-soft); }

.tree-item.is-selected,
.rootlink.is-selected {
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: 600;
}

.tree-name { overflow-wrap: anywhere; }

.crumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 10px;
  font-size: 13px;
}

.crumb {
  padding: 1px 4px;
  border: none;
  border-radius: 4px;
  background: none;
  color: var(--accent);
  font-family: var(--mono);
  font-size: 13px;
  cursor: pointer;
}

.crumb:disabled { color: var(--fg-dim); cursor: default; }
.crumb:not(:disabled):hover { background: var(--bg-soft); }
.crumb-sep { color: var(--fg-dim); }

.detail-head {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
}

.detail-title {
  margin: 0;
  font-family: var(--mono);
  font-size: 18px;
  font-weight: 600;
}

.chips { display: flex; flex-wrap: wrap; gap: 6px; }

.lede { margin: 8px 0 0; color: var(--fg-dim); max-width: 70ch; }

.block { margin-top: 24px; }

.block h3 {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--fg-dim);
}

.note { margin: -2px 0 8px; color: var(--fg-dim); font-size: 13px; max-width: 70ch; }

.code {
  margin: 0;
  padding: 10px 12px;
  border-radius: 6px;
  background: var(--bg-code);
  font-family: var(--mono);
  font-size: 13px;
  overflow-x: auto;
}

.code code { display: block; white-space: pre; }

.grid {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.grid th {
  padding: 6px 10px 6px 0;
  border-bottom: 1px solid var(--border);
  color: var(--fg-dim);
  font-size: 12px;
  font-weight: 600;
  text-align: left;
  white-space: nowrap;
}

.grid td {
  padding: 8px 10px 8px 0;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}

.grid tr:last-child td { border-bottom: none; }

.grid td:first-child { white-space: nowrap; }

.grid p { margin: 0; max-width: 60ch; }

.tok {
  display: inline-block;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--bg-code);
  font-family: var(--mono);
  font-size: 12.5px;
  white-space: nowrap;
}

.dim { color: var(--fg-dim); font-family: var(--mono); font-size: 12.5px; }

.accepted { margin-top: 5px !important; display: flex; flex-wrap: wrap; gap: 4px; align-items: baseline; }
.accepted-label { color: var(--fg-dim); font-size: 12px; }

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
  height: 100%;
  padding: 9px 11px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.card:hover { border-color: var(--accent); background: var(--bg-soft); }

.card-name { font-family: var(--mono); font-size: 13px; font-weight: 600; color: var(--accent); }

.card-desc {
  color: var(--fg-dim);
  font-size: 12.5px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.badge {
  display: inline-block;
  padding: 1px 7px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg);
  color: var(--fg-dim);
  font-family: var(--mono);
  font-size: 11px;
  line-height: 1.6;
  white-space: nowrap;
}

.badge-version { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
.badge-alias { color: var(--fg); }
.badge-required { border-color: var(--accent); color: var(--accent); }
.badge-hidden,
.badge-interactive { font-style: italic; }
.dim-badge { opacity: 0.75; }

.state { margin: 0; padding: 24px; color: var(--fg-dim); }
.state-error { color: #b3261e; }
.root.dark .state-error { color: #f2b8b5; }
.state-empty { padding: 12px 0; font-size: 13px; }

.visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  margin: -1px; padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>
