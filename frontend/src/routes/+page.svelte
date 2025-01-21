<script lang="ts">
  import { onMount } from 'svelte';
  import { pageStore } from '$lib/stores';
  import { navigate } from '$lib/navigation';

  let pages: any[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const response = await fetch('http://localhost:3000/pages');
      if (!response.ok) {
        throw new Error('Failed to fetch pages');
      }
      pages = await response.json();
      pageStore.set({ loading: false, error: null, data: pages });
    } catch (err) {
      error = err.message;
      pageStore.set({ loading: false, error: err.message, data: null });
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <p>Loading...</p>
{:else if error}
  <p class="text-red-500">Error: {error}</p>
{:else}
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Blog Pages</h1>
    <a href="/new" class="inline-block bg-blue-500 text-white px-4 py-2 rounded mb-6">Create New Page</a>
    
    <div class="grid gap-4">
      {#each pages as page}
        <div class="border p-4 rounded">
          <h2 class="text-xl font-semibold">
            <a href="/pages/{page.id}" class="text-blue-600 hover:underline">{page.title}</a>
          </h2>
          <p class="text-gray-600 text-sm">Last updated: {new Date(page.updatedAt).toLocaleString()}</p>
        </div>
      {/each}
    </div>
  </div>
{/if}
