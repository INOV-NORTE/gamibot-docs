---
# Redirection to local default
title: Redirecting...
---

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'

const { go } = useRouter()

onMounted(() => {
  // Redirect to English as default language
  go('/en/')
})
</script>

# Redirecting to documentation...

If you are not redirected automatically, please [click here](/en/).
