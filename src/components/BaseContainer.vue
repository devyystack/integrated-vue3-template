<script setup lang="ts">
defineProps<{
  slim?: boolean;
}>();
</script>

<template>
  <div class="max-w-[1920px] mx-auto">
    <slot />
  </div>
</template>
