export function rootCommand(doc) {
  const command = doc?.command ?? {}
  return {
    ...command,
    name: command.name ?? doc?.info?.title ?? 'cli',
    description: command.description ?? doc?.info?.description ?? doc?.info?.summary,
  }
}

export function resolveChain(doc, path) {
  const chain = [rootCommand(doc)]
  for (const name of path) {
    const parent = chain[chain.length - 1]
    const next = (parent.commands ?? []).find((c) => c.name === name)
    if (!next) return null
    chain.push(next)
  }
  return chain
}

export function isVisible(item, showHidden) {
  return showHidden || !item.hidden
}

export function visible(items, showHidden) {
  return (items ?? []).filter((i) => isVisible(i, showHidden))
}

export function resolveOptions(chain) {
  const own = chain[chain.length - 1].options ?? []
  const seen = new Set(own.map((o) => o.name))
  const inherited = []

  for (let i = 0; i < chain.length - 1; i++) {
    for (const option of chain[i].options ?? []) {
      if (!option.recursive || seen.has(option.name)) continue
      seen.add(option.name)
      inherited.push({ option, from: chain.slice(0, i + 1).map((c) => c.name).join(' ') })
    }
  }

  return { own, inherited }
}

export function isVariadic(argument) {
  return Boolean(argument.arity) && argument.arity.maximum === undefined
}

export function isRequired(argument) {
  if (argument.required) return true
  return (argument.arity?.minimum ?? 1) > 0
}

export function argumentToken(argument) {
  const token = `<${argument.name}>${isVariadic(argument) ? '...' : ''}`
  return isRequired(argument) ? token : `[${token}]`
}

export function optionSignature(option, conventions) {
  const separator = conventions?.optionSeparator ?? ' '
  const names = [...(option.aliases ?? []), option.name].join(', ')
  const args = (option.arguments ?? []).map(argumentToken).join(' ')
  return args ? `${names}${separator}${args}` : names
}

export function usageLine(chain, showHidden) {
  const command = chain[chain.length - 1]
  const parts = chain.map((c) => c.name)

  for (const argument of visible(command.arguments, showHidden)) {
    parts.push(argumentToken(argument))
  }

  const { own, inherited } = resolveOptions(chain)
  if ([...own, ...inherited.map((e) => e.option)].some((o) => isVisible(o, showHidden))) {
    parts.push('[options]')
  }
  if (visible(command.commands, showHidden).length > 0) {
    parts.push('[command]')
  }

  return parts.join(' ')
}

export function groupOptions(options) {
  const groups = new Map()
  for (const option of options) {
    const key = option.group ?? ''
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(option)
  }
  return [...groups.entries()].map(([name, items]) => ({ name, options: items }))
}

export function flatten(doc) {
  const out = []
  const walk = (commands, path, parent) => {
    for (const command of commands ?? []) {
      const next = [...path, command.name]
      const key = next.join(' ')
      const haystack = [key, ...(command.aliases ?? []), command.description ?? '']
        .join(' ')
        .toLowerCase()
      out.push({ path: next, key, parent, command, haystack })
      walk(command.commands, next, key)
    }
  }
  walk(doc?.command?.commands, [], null)
  return out
}

export function matchPaths(entries, query) {
  const q = query.trim().toLowerCase()
  if (!q) return null
  const subtree = new Set()
  const shown = new Set()
  for (const entry of entries) {
    if (!subtree.has(entry.parent) && !entry.haystack.includes(q)) continue
    subtree.add(entry.key)
    for (let i = 1; i <= entry.path.length; i++) shown.add(entry.path.slice(0, i).join(' '))
  }
  return shown
}
