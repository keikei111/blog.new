<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { marked } from 'marked';
  import { pageStore } from '$lib/stores';
  import { navigate } from '$lib/navigation';
  
  let pageData: any = null;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const response = await fetch(`http://localhost:3000/pages/${$page.params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch page');
      }
      pageData = await response.json();
      pageStore.set({ loading: false, error: null, data: pageData });
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
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold">{pageData.title}</h1>
      <div class="space-x-2">
        <button
          on:click={() => navigate.goto(`/pages/${pageData.id}/edit`)}
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          on:click={() => navigate.goto(`/pages/${pageData.id}/history`)}
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          History
        </button>
      </div>
    </div>
    
    <div class="prose max-w-none">
      {@html marked(pageData.content)}
    </div>
  </div>
{/if}
