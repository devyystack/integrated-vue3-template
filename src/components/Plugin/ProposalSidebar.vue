<script setup>
import { usePlugins } from '@/composables/usePlugins';

const props = defineProps({
  id: String,
  proposal: Object,
  space: Object,
  results: Object,
  loadedResults: Boolean,
  votes: Object,
  strategies: Object
});

const { getPluginComponents } = usePlugins();
const components = getPluginComponents(
  'ProposalSidebar',
  Object.keys(props.space.plugins)
);
</script>

<template>
  <component
    v-for="(component, key) in components"
    :key="key"
    :is="component"
    v-bind="props"
  />
</template>
