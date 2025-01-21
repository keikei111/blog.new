{#await getVersions()}
  <p>Loading...</p>
{:then versions}
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Page History</h1>
    
    <div class="space-y-4">
      {#each versions as version}
        <div class="border p-4 rounded">
          <p class="text-gray-600">Version from {new Date(version.createdAt).toLocaleString()}</p>
          <div class="prose mt-4">
            {@html marked(version.content)}
          </div>
        </div>
      {/each}
    </div>
    
    <div class="mt-6">
      <a
        href="/pages/{$page.params.id}"
        class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Back to Page
      </a>
    </div>
  </div>
{:catch error}
  <p class="text-red-500">Error: {error.message}</p>
{/await}

<script lang="ts">
  import { page } from '$app/stores'
  import { marked } from 'marked'
  
  async function getVersions() {
    const response = await fetch(`http://localhost:3000/pages/${$page.params.id}/versions`)
    if (!response.ok) {
      throw new Error('Failed to fetch versions')
    }
    return response.json()
  }
</script>