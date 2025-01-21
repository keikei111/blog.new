<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">Create New Page</h1>
  
  <form on:submit|preventDefault={handleSubmit} class="max-w-2xl">
    <div class="mb-4">
      <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
      <input
        type="text"
        id="title"
        bind:value={title}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      />
    </div>
    
    <div class="mb-4">
      <label for="content" class="block text-sm font-medium text-gray-700">Content (Markdown)</label>
      <textarea
        id="content"
        bind:value={content}
        rows="10"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      ></textarea>
    </div>
    
    <div class="flex justify-between">
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Page
      </button>
      <a
        href="/"
        class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Cancel
      </a>
    </div>
  </form>
</div>

<script lang="ts">
  import { goto } from '$app/navigation'
  
  let title = ''
  let content = ''
  
  async function handleSubmit() {
    const response = await fetch('http://localhost:3000/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create page')
    }
    
    const page = await response.json()
    goto(`/pages/${page.id}`)
  }
</script>