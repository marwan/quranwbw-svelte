<script>
  import PageMeta from "$components/PageMeta.svelte";
  import Spinner from "$svgs/Spinner.svelte";
  import { websiteURL } from "$data/websiteSettings";
  import { currentPageStore } from "$utils/stores";
  import { timeAgo } from "$utils/timeAgo";
  import { linkElement } from "$utils/commonStyles";

  let fetchData;

  // fetch the issues from our API
  $: {
    fetchData = (async () => {
      const response = await fetch("https://api.quranwbw.com/v1/repo/issues");
      const data = await response.json();
      return data.data;
    })();
  }

  currentPageStore.set("issues");
</script>

<PageMeta title={"Issues"} />

<div class="">
  <div class="my-6 space-y-4 pb-4 border-b-2 dark:border-slate-700">
    <h1 class="text-2xl">Issues</h1>
    <div class="text-sm">
      This page contains all the active issues raised on the Quranwbw.com's <a href="https://github.com/marwan/quranwbw-svelte" target="_blank" class={linkElement}>GitHub repo</a>.

      <br /><br />
      <a href="https://github.com/marwan/quranwbw-svelte/issues" target="_blank" class={linkElement}>https://github.com/marwan/quranwbw-svelte/issues</a>
    </div>
  </div>

  {#await fetchData}
    <Spinner />
  {:then fetchData}
    <div class="text-sm">
      {#each Object.entries(fetchData) as [key, value]}
        <div class="py-6 space-y-2 border-b dark:border-slate-700">
          <div class="space-y-2">
            <a href={value.html_url} target="_blank" class={linkElement}>Issue #{value.number}: {value.title}</a>

            <!-- labels -->
            <div class="inline-flex ml-2 space-x-2">
              {#each Object.entries(value.labels) as [id, label]}
                <span class="bg-gray-300 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full grayscale">{label.name}</span>
              {/each}
            </div>
            <div>
              <img class="rounded-full inline-flex w-5 h-5" src={value.user.avatar_url} alt={value.user.login} />
              {value.user.login} opened {timeAgo(value.created_at)} (#{value.number})
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:catch error}
    <p>{error}</p>
  {/await}
</div>
