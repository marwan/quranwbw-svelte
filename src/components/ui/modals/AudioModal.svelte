<script>
  import { quranMetaData } from "$data/quranMeta";
  import { chapterNumberStore, audioSettingsStore } from "$utils/stores";
  import { initializeAudio } from "$utils/audioController";
  import { toggleModal } from "$utils/toggleModal";
  import { disabledElement } from "$utils/commonStyles";
  import Play from "$svgs/Play.svelte";

  let endVerseStartingIndex = 0;

  $: console.table($audioSettingsStore);

  function updateRange(event) {
    $audioSettingsStore.audioRange = event.target.id;

    switch (event.target.id) {
      case "playThisVerse":
        $audioSettingsStore.startVerse = $audioSettingsStore.playingVerse;
        $audioSettingsStore.endVerse = $audioSettingsStore.playingVerse;
        break;

      case "playFromHere":
        $audioSettingsStore.startVerse = $audioSettingsStore.playingVerse;
        $audioSettingsStore.endVerse = quranMetaData[$audioSettingsStore.playingChapter].verses;
        break;
    }
  }

  function updateStartVerse(event) {
    $audioSettingsStore.startVerse = +event.target.value;
    endVerseStartingIndex = $audioSettingsStore.startVerse - 1;
    fixEndVerse();
  }

  function updateEndVerse(event) {
    $audioSettingsStore.endVerse = +event.target.value;
    fixEndVerse();
  }

  function fixEndVerse() {
    if ($audioSettingsStore.endVerse < $audioSettingsStore.startVerse) {
      $audioSettingsStore.endVerse = $audioSettingsStore.startVerse;
    }
  }
</script>

<!-- Audio modal -->
<div id="audioModal" data-chapter data-verse tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
  <div class="relative w-full max-w-md max-h-full">
    <!-- Modal content -->
    <div class="relative bg-white rounded-lg shadow daaark:bg-gray-700">
      <button type="button" on:click={() => toggleModal("audioModal", "hide")} class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-[#ebebeb] hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center daaark:hover:bg-gray-600 daaark:hover:text-white" data-modal-hide="audioModal">
        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
        </svg>
        <span class="sr-only">Close modal</span>
      </button>
      <div class="px-6 py-6 lg:px-8">
        <h3 id="audioModal-title" class="mb-8 text-xl font-medium text-gray-900 daaark:text-white">{quranMetaData[$audioSettingsStore.playingChapter || 1].transliteration}, {$audioSettingsStore.playingKey}</h3>
        <div class="flex flex-col">
          <!-- verse or words -->
          <div class="flex flex-col space-y-4 py-4">
            <span class="text-xs text-gray-500 daaark:text-gray-400">Select whether you would like to play audio for a verse or a word.</span>
            <div class="flex flex-row space-x-4">
              <!-- play verse -->
              <div class="flex items-center">
                <input checked id="playVerse" type="radio" value="" onclick="audio_settings_change(this)" name="radio-audio-type" class="radio-play-type w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-gray-500 daaark:focus:ring-blue-600 daaark:ring-offset-gray-800 focus:ring-2 daaark:bg-gray-700 daaark:border-gray-600" />
                <label for="playVerse" class="ml-2 text-sm font-medium text-gray-900 daaark:text-gray-300">Play Verse</label>
              </div>
              <!-- play word -->
              <div class="flex items-center {disabledElement}">
                <input id="playWord-radio" type="radio" value="" onclick="audio_settings_change(this)" name="radio-audio-type" class="radio-play-type w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-gray-500 daaark:focus:ring-blue-600 daaark:ring-offset-gray-800 focus:ring-2 daaark:bg-gray-700 daaark:border-gray-600" />
                <label for="playWord-radio" class="ml-2 text-sm font-medium text-gray-900 daaark:text-gray-300">Play Word</label>
              </div>
            </div>
          </div>

          <!-- single or range -->
          <div id="single-or-range-block" class="flex flex-col space-y-4 py-4 border-t">
            <span class="text-xs text-gray-500 daaark:text-gray-400">Select whether you would like to play single verse or word or multiple.</span>
            <div class="flex flex-row space-x-4">
              <!-- play this verse -->
              <div class="flex items-center">
                <input id="playThisVerse" type="radio" value="" on:click={updateRange} name="audioRange-radios" class=" w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-gray-500 daaark:focus:ring-blue-600 daaark:ring-offset-gray-800 focus:ring-2 daaark:bg-gray-700 daaark:border-gray-600" />
                <label for="playThisVerse" class="ml-2 text-sm font-medium text-gray-900 daaark:text-gray-300">This Verse</label>
              </div>
              <!-- play from here -->
              <div class="flex items-center">
                <input id="playFromHere" type="radio" value="" on:click={updateRange} name="audioRange-radios" class=" w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-gray-500 daaark:focus:ring-blue-600 daaark:ring-offset-gray-800 focus:ring-2 daaark:bg-gray-700 daaark:border-gray-600" />
                <label for="playFromHere" class="ml-2 text-sm font-medium text-gray-900 daaark:text-gray-300">From Here</label>
              </div>
              <!-- play range -->
              <div class="flex items-center {disabledElement}">
                <input id="playRange" type="radio" value="" on:click={updateRange} name="audioRange-radios" class=" w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-gray-500 daaark:focus:ring-blue-600 daaark:ring-offset-gray-800 focus:ring-2 daaark:bg-gray-700 daaark:border-gray-600" />
                <label for="playRange" class="ml-2 text-sm font-medium text-gray-900 daaark:text-gray-300">Verses Range</label>
              </div>
            </div>
          </div>

          <!-- audio range options -->
          <div id="audio-range-options" class={$audioSettingsStore.audioRange === "playRange" ? "block" : "hidden"}>
            <!-- from / till -->
            <div class="flex flex-col space-y-4 py-4 border-t">
              <span class="text-xs text-gray-500 daaark:text-gray-400">Select the range of verses or words to be played.</span>
              <div class="flex flex-row space-x-4">
                <div class="flex flex-row space-x-2">
                  <!-- <label class="m-auto text-sm font-medium text-gray-900 daaark:text-gray-300">Start <span class="audio-type-text">Verse</span></label> -->
                  <select id="startVerse-list" bind:value={$audioSettingsStore.startVerse} on:change={updateStartVerse} class="w-18 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 daaark:bg-gray-700 daaark:border-gray-600 daaark:placeholder-gray-400 daaark:text-white daaark:focus:ring-blue-500 daaark:focus:border-blue-500">
                    {#each Array.from(Array(quranMetaData[$chapterNumberStore].verses).keys()).slice(0) as verse}
                      <option value={verse + 1}>{verse + 1}</option>
                    {/each}
                  </select>
                </div>
                <div class="flex flex-row space-x-2">
                  <!-- <label class="m-auto text-sm font-medium text-gray-900 daaark:text-gray-300">End <span class="audio-type-text">Verse</span></label> -->
                  <!-- <select id="endVerse-list" on:change={updateEndVerse} class="w-18 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 daaark:bg-gray-700 daaark:border-gray-600 daaark:placeholder-gray-400 daaark:text-white daaark:focus:ring-blue-500 daaark:focus:border-blue-500">
                    {#each Array.from(Array(quranMetaData[$chapterNumberStore].verses).keys()).slice($audioSettingsStore.startVerse) as verse}
                      <option value={verse}>{verse}</option>
                    {/each}
                  </select> -->

                  <select id="endVerse-list" on:change={updateEndVerse} class="w-18 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 daaark:bg-gray-700 daaark:border-gray-600 daaark:placeholder-gray-400 daaark:text-white daaark:focus:ring-blue-500 daaark:focus:border-blue-500">
                    {#each Array.from(Array(quranMetaData[$chapterNumberStore].verses).keys()).slice(endVerseStartingIndex) as verse}
                      <option value={verse + 1}>{verse + 1}</option>
                    {/each}
                  </select>
                </div>
              </div>
            </div>

            <!-- repeat times -->
            <div class="flex flex-col space-y-4 py-4 border-t hidden">
              <span class="text-xs text-gray-500 daaark:text-gray-400">Select the number of times a verse or word has to be repeated.</span>
              <div class="flex flex-row space-x-4">
                <div class="flex flex-row space-x-2">
                  <span class="m-auto text-sm font-medium text-gray-900 daaark:text-gray-300">Repeat for </span>
                  <input id="input-audio-repeat" type="number" value="1" min="1" onchange="audio_settings_change(this)" class="w-16 text-xs border border-gray-300 text-gray-900 rounded-lg focus:ring-gray-500 focus:border-blue-500 block p-2.5 daaark:bg-gray-700 daaark:border-gray-600 daaark:placeholder-gray-400 daaark:text-white daaark:focus:ring-gray-500 daaark:focus:border-blue-500" />
                  <span class="m-auto text-sm font-medium text-gray-900 daaark:text-gray-300">time(s)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class={$audioSettingsStore.audioRange === undefined && disabledElement}>
          <button on:click={initializeAudio} class="w-full inline-flex items-center justify-center mr-2 border mt-6 py-2 px-4 border-gray-200 bg-gray-50 text-gray-700 space-x-2 transition-colors duration-150 rounded-lg focus:shadow-outline">
            <Play />

            <span>Play Verse</span>
            <div class="hidden">
              {#if $audioSettingsStore.startVerse !== null}
                {$audioSettingsStore.startVerse}
              {/if}
              {#if $audioSettingsStore.endVerse !== $audioSettingsStore.startVerse}
                to {$audioSettingsStore.endVerse}
              {/if}
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
