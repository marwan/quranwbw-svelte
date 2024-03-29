<script>
  export let key, value, line;

  import { navigate } from "svelte-routing";

  import { displayOptions, selectableThemes } from "$data/options";
  import { supplicationsFromQuran } from "$data/quranMeta";
  import { currentPageStore, wordTypeStore, displayTypeStore, websiteThemeStore, userSettingsStore, audioSettingsStore, wordTranslationEnabledStore, wordTransliterationEnabledStore, morphologyKey } from "$utils/stores";
  import { wordAudioController } from "$utils/audioController";

  const chapter = key.split(":")[0];
  const verse = key.split(":")[1];

  const fontSizes = JSON.parse($userSettingsStore).displaySettings.fontSizes;

  const arabicSplit = value.words.arabic.split("|");
  const transliterationSplit = value.words.transliteration.split("|");
  const translationSplit = value.words.translation.split("|");
  const timestampSplit = value.words.timestamp.split("|");

  // handle what happens when a word is clicked depending on page type
  function wordClickController(chapter, verse, word) {
    if ($currentPageStore === "morphology") {
      const wordKey = `${chapter}:${verse}:${word + 1}`;
      morphologyKey.set(wordKey);
      navigate(`/morphology/${wordKey}`, { replace: true });
    } else {
      wordAudioController({ chapter, verse, word });
    }
  }

  $: wordClasses = `rounded-lg hover:cursor-pointer hover:bg-[#ebebeb] dark:hover:bg-slate-800 ${displayOptions[`${$displayTypeStore}`].layout === "wbw" ? "p-3" : "p-1"}`;

  $: displayIsContinuous = displayOptions[`${$displayTypeStore}`].continuous;
</script>

<!-- words -->
{#each { length: value.meta.words } as _, word}
  {#if $currentPageStore != "page" || ($currentPageStore === "page" && +value.words.line.split("|")[word] === line)}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div id={`${chapter}:${verse}:${word + 1}`} on:click={() => wordClickController(chapter, verse, word)} class="word {$displayTypeStore === 1 ? 'text-center flex flex-col' : 'inline-flex flex-col'} {wordClasses} {$audioSettingsStore.playingWordKey === `${chapter}:${verse}:${word + 1}` || $morphologyKey === `${chapter}:${verse}:${word + 1}` ? 'bg-[#ebebeb] dark:bg-slate-800' : ''}" style={$currentPageStore === "supplications" && word + 1 < supplicationsFromQuran[key] && "opacity: 30%;"} data-timestamp={timestampSplit[word]}>
      <span class="{`arabicText leading-normal arabic-font-${$wordTypeStore} ${fontSizes.arabicText}`} {displayIsContinuous === true && 'inline-block group-hover:text-gray-500 dark:group-hover:text-slate-300'}" data-fontSize={fontSizes.arabicText}>
        <!-- 1: Uthmanic Hafs Digital, 3: Indopak Madinah -->
        {#if $wordTypeStore === 1 || $wordTypeStore === 3}
          {arabicSplit[word]}
          <!-- 2: Uthmanic Hafs Mushaf -->
        {:else if $wordTypeStore === 2}
          <span class="p{value.meta.page} {selectableThemes[$websiteThemeStore].palette === 1 && 'v4dark'} font-filter">{arabicSplit[word]}</span>
        {/if}
      </span>

      <!-- word translation and transliteration -->
      {#if $displayTypeStore === 1 || $displayTypeStore === 3}
        <div class="wordTranslationText flex flex-col {fontSizes.wordTranslationText}" data-fontSize={fontSizes.wordTranslationText}>
          <span class="leading-normal {$wordTransliterationEnabledStore === true ? 'block' : 'hidden'}">{transliterationSplit[word]}</span>
          <span class="leading-normal {$wordTranslationEnabledStore === true ? 'block' : 'hidden'}">{translationSplit[word]}</span>
        </div>
      {/if}
    </div>
  {/if}
{/each}

<!-- end icon -->
{#if $currentPageStore != "page" || ($currentPageStore === "page" && value.words.end_line === line)}
  <div class="{$displayTypeStore === 1 ? 'text-center flex flex-col' : 'inline-flex flex-col'} {wordClasses}">
    <span class="{`arabicText leading-normal arabic-font-${$wordTypeStore} ${fontSizes.arabicText}`} {displayIsContinuous === true && 'inline-block group-hover:text-gray-500 dark:group-hover:text-slate-300'}" data-fontSize={fontSizes.arabicText}>
      {#if $wordTypeStore === 1 || $wordTypeStore === 3}
        {value.words.end}
      {:else if $wordTypeStore === 2}
        <span class="p{value.meta.page} {$websiteThemeStore === 2 && 'v4dark'}">{value.words.end}</span>
      {/if}
    </span>
  </div>
{/if}
