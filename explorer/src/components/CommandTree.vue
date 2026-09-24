<script setup>
import { computed } from 'vue'
import { visible } from '../lib/opencli.js'

const props = defineProps({
  commands: { type: Array, default: () => [] },
  path: { type: Array, default: () => [] },
  selectedKey: { type: String, default: '' },
  showHidden: { type: Boolean, default: false },
  matchedPaths: { type: Set, default: null },
})

defineEmits(['select'])

const items = computed(() => visible(props.commands, props.showHidden)
  .map((command) => {
    const path = [...props.path, command.name]
    return { command, path, key: path.join(' ') }
  })
  .filter((item) => !props.matchedPaths || props.matchedPaths.has(item.key)))
</script>

<template>
  <ul v-if="items.length" class="tree">
    <li v-for="{ command, path, key } in items" :key="command.name">
      <button
        type="button"
        class="tree-item"
        :class="{ 'is-selected': key === selectedKey }"
        :aria-current="key === selectedKey ? 'true' : undefined"
        @click="$emit('select', path)"
      >
        <span class="tree-name">{{ command.name }}</span>
        <span v-if="command.hidden" class="badge badge-hidden" title="Hidden command">hidden</span>
      </button>

      <CommandTree
        v-if="command.commands?.length"
        :commands="command.commands"
        :path="path"
        :selected-key="selectedKey"
        :show-hidden="showHidden"
        :matched-paths="matchedPaths"
        @select="$emit('select', $event)"
      />
    </li>
  </ul>
</template>
