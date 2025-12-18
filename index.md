---
# Redirection to local default
title: Redirecting...
---

<script setup>
import { onMounted } from 'vue'
import { withBase } from 'vitepress'

onMounted(() => {
  // Use withBase to handle the repository base path correctly
  // Use window.location.replace to avoid back-button loops
  window.location.replace(withBase('/en/'))
})
</script>

# Redirecting to documentation...

If you are not redirected automatically, please [click here](/en/).