<script setup>
import { computed } from 'vue'
import {
  argumentToken,
  groupOptions,
  isRequired,
  isVariadic,
  optionSignature,
  resolveOptions,
  isVisible,
  usageLine,
  visible,
} from '../lib/opencli.js'

const props = defineProps({
  chain: { type: Array, required: true },
  conventions: { type: Object, default: () => ({}) },
  showHidden: { type: Boolean, default: false },
})

const emit = defineEmits(['select'])

const command = computed(() => props.chain[props.chain.length - 1])
const path = computed(() => props.chain.slice(1).map((c) => c.name))
const usage = computed(() => usageLine(props.chain, props.showHidden))

const args = computed(() => visible(command.value.arguments, props.showHidden))
const resolved = computed(() => resolveOptions(props.chain))
const ownGroups = computed(() => groupOptions(visible(resolved.value.own, props.showHidden)))
const inherited = computed(() =>
  resolved.value.inherited.filter((e) => isVisible(e.option, props.showHidden)),
)
const children = computed(() => visible(command.value.commands, props.showHidden))

const arity = (argument) => {
  const { minimum = 1, maximum } = argument.arity ?? { maximum: 1 }
  if (maximum === undefined) return `${minimum}..*`
  if (minimum === maximum) return String(minimum)
  return `${minimum}..${maximum}`
}

const sig = (option) => optionSignature(option, props.conventions)
</script>

<template>
  <article class="detail">
    <nav class="crumbs" aria-label="Command path">
      <button type="button" class="crumb" @click="emit('select', [])">
        {{ chain[0].name }}
      </button>
      <template v-for="(name, i) in path" :key="i">
        <span class="crumb-sep" aria-hidden="true">/</span>
        <button
          type="button"
          class="crumb"
          :disabled="i === path.length - 1"
          @click="emit('select', path.slice(0, i + 1))"
        >{{ name }}</button>
      </template>
    </nav>

    <header class="detail-head">
      <h2 class="detail-title">{{ chain.map((c) => c.name).join(' ') }}</h2>
      <div class="chips">
        <span v-for="alias in command.aliases ?? []" :key="alias" class="badge badge-alias">
          {{ alias }}
        </span>
        <span v-if="command.hidden" class="badge badge-hidden">hidden</span>
        <span v-if="command.interactive" class="badge badge-interactive">interactive</span>
      </div>
    </header>

    <p v-if="command.description" class="lede">{{ command.description }}</p>

    <section class="block">
      <h3>Usage</h3>
      <pre class="code"><code>{{ usage }}</code></pre>
    </section>

    <section v-if="(command.examples ?? []).length" class="block">
      <h3>Examples</h3>
      <pre class="code"><code v-for="(ex, i) in command.examples" :key="i">{{ ex }}
</code></pre>
    </section>

    <section v-if="args.length" class="block">
      <h3>Arguments</h3>
      <table class="grid">
        <thead>
          <tr><th>Argument</th><th>Arity</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr v-for="argument in args" :key="argument.name">
            <td>
              <code class="tok">{{ argumentToken(argument) }}</code>
              <span v-if="isRequired(argument)" class="badge badge-required">required</span>
              <span v-if="isVariadic(argument)" class="badge">variadic</span>
              <span v-if="argument.hidden" class="badge badge-hidden">hidden</span>
            </td>
            <td><code v-if="arity(argument)" class="dim">{{ arity(argument) }}</code></td>
            <td>
              <p v-if="argument.description">{{ argument.description }}</p>
              <p v-if="argument.acceptedValues" class="accepted">
                <span class="accepted-label">Accepted:</span>
                <code v-for="v in argument.acceptedValues" :key="v" class="tok">{{ v }}</code>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section v-for="group in ownGroups" :key="group.name || 'ungrouped'" class="block">
      <h3>{{ group.name ? group.name + ' options' : 'Options' }}</h3>
      <table class="grid">
        <thead>
          <tr><th>Option</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr v-for="option in group.options" :key="option.name">
            <td>
              <code class="tok">{{ sig(option) }}</code>
              <span v-if="option.required" class="badge badge-required">required</span>
              <span v-if="option.recursive" class="badge" title="Available on this command and its subcommands">recursive</span>
              <span v-if="option.hidden" class="badge badge-hidden">hidden</span>
            </td>
            <td>
              <p v-if="option.description">{{ option.description }}</p>
              <template v-for="argument in option.arguments ?? []" :key="argument.name">
                <p v-if="argument.acceptedValues" class="accepted">
                  <span class="accepted-label">Accepted:</span>
                  <code v-for="v in argument.acceptedValues" :key="v" class="tok">{{ v }}</code>
                </p>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section v-if="inherited.length" class="block">
      <h3>Inherited options</h3>
      <p class="note">
        Declared as recursive further up the tree, so they are accepted here too.
      </p>
      <table class="grid">
        <thead>
          <tr><th>Option</th><th>From</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr v-for="entry in inherited" :key="entry.option.name">
            <td><code class="tok">{{ sig(entry.option) }}</code></td>
            <td><code class="dim">{{ entry.from }}</code></td>
            <td>{{ entry.option.description }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section v-if="children.length" class="block">
      <h3>Subcommands</h3>
      <ul class="cards">
        <li v-for="child in children" :key="child.name">
          <button type="button" class="card" @click="emit('select', [...path, child.name])">
            <code class="card-name">{{ child.name }}</code>
            <span v-if="child.description" class="card-desc">{{ child.description }}</span>
          </button>
        </li>
      </ul>
    </section>

    <section v-if="(command.exitCodes ?? []).length" class="block">
      <h3>Exit codes</h3>
      <table class="grid">
        <thead>
          <tr><th>Code</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr v-for="exit in command.exitCodes" :key="exit.code">
            <td><code class="tok">{{ exit.code }}</code></td>
            <td>{{ exit.description }}</td>
          </tr>
        </tbody>
      </table>
    </section>

    <section v-if="(command.metadata ?? []).length" class="block">
      <h3>Metadata</h3>
      <table class="grid">
        <thead>
          <tr><th>Name</th><th>Value</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in command.metadata" :key="item.name">
            <td><code class="tok">{{ item.name }}</code></td>
            <td><code class="dim">{{ item.value }}</code></td>
          </tr>
        </tbody>
      </table>
    </section>
  </article>
</template>
