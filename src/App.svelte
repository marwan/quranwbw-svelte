<script>
  // Flowbite JS
  import "$lib/flowbite.min.js";

  // default user settings
  import "$utils/userSettings";

  // check and set user settings from URL parameters
  import "$utils/checkURLParameters";

  import { Router, Route } from "svelte-routing";
  import { currentPageStore } from "$utils/stores";
  import { checkOldBookmarks } from "$utils/checkOldBookmarks";

  // views
  import Home from "$views/Home.svelte";
  import Chapter from "$views/Chapter.svelte";
  import Page from "$views/Page.svelte";
  import Supplications from "$views/Supplications.svelte";
  import Bookmarks from "$views/Bookmarks.svelte";
  import Changelogs from "$views/Changelogs.svelte";
  import Issues from "$views/Issues.svelte";
  import About from "$views/About.svelte";
  import Morphology from "$views/Morphology.svelte";
  import Search from "$views/Search.svelte";

  // ui
  import Navbar from "$ui/Navbar.svelte";
  import Drawer from "$ui/Drawer.svelte";
  import BottomNavbar from "$ui/BottomNavbar.svelte";
  import InitialSetupModal from "$modals/InitialSetupModal.svelte";
  import AudioModal from "$modals/AudioModal.svelte";

  // check old bookmarks for v3 update
  checkOldBookmarks();
</script>

<Router>
  <div class="max-w-screen-lg mx-auto py-16 select-none {$currentPageStore === 'page' ? 'px-0 md:px-4' : 'px-4'}">
    <!-- include the UI elements -->
    <Navbar />
    <Drawer />
    <InitialSetupModal />
    <AudioModal />
    <BottomNavbar />
    <!-- <BottomPlayer /> -->

    <!-- components will be rendered in this div -->
    <div>
      <Route path="/" component={Home} />
      <Route path="/supplications" component={Supplications} />
      <Route path="/bookmarks" component={Bookmarks} />
      <Route path="/changelogs" component={Changelogs} />
      <Route path="/issues" component={Issues} />
      <Route path="/about" component={About} />
      <Route path="/search" component={Search} />

      <Route path="/page/:page" let:params>
        <Page page={params.page} />
      </Route>

      <Route path="/morphology/:key" let:params>
        <Morphology key={params.key} />
      </Route>

      <Route path="/:chapter/*" let:params>
        <Chapter chapter={params.chapter} />
      </Route>
    </div>
  </div>
</Router>
