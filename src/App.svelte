<script>
  import { MaterialApp, AppBar, Card, Button } from "svelte-materialify";
  import Router from "svelte-spa-router";
  import { push } from "svelte-spa-router";
  import { onDestroy, onMount } from "svelte";
  import Api from "./core/api";

  export let routes;
  let user;
  let unsubscribe;

  onMount(() => {
    unsubscribe = Api.currentUser.subscribe((cu) => {
      user = cu;
    });
    Api.readAndSetUser();
  });

  onDestroy(unsubscribe);

  const appLogin = () => {
    // push(
    //  "/sans/create-edit-sans-sample/create-edit/4489d8c0-1996-450f-9a99-c3cb55b6b1ca"
    // );
    push("/account/login/enter-credentials");
  };

  const appLogout = () => {
    Api.logout();
    push("/account/login/enter-credentials");
  };

  const sansSamples = () => {
    push("/sans/view-sans-samples/view/all");
  };

  const clients = () => {
    push("/clients/view-clients/view/all");
  };

</script>

<MaterialApp theme="dark">
  <AppBar>
    <div style="flex-grow:1" />
    {#if user == null}
      <Button depressed tile on:click={appLogin}>Login</Button>
    {:else}
      <Button depressed tile on:click={clients}>Clients</Button>
      <Button depressed tile on:click={sansSamples}>Sans Samples</Button>
      <Button depressed tile>Equipment</Button>
      <Button depressed tile>Tenant</Button>
      <Button depressed tile on:click={appLogout}>Logout</Button>
    {/if}
    <div style="margin-right: 20px;"></div>
  </AppBar>
  <Router {routes} />
</MaterialApp>

<style type="scss">
  :global(.s-input.disabled .s-text-field__wrapper:before) {
    border-style: dashed;
  }
  :global(.s-menu > .s-list) {
    padding: 0;
  }
  :global(.s-menu:not(.tile)) {
    border-radius: 0 !important;
  }
  :global(.s-list-item) {
    &.active {
      color: var(--theme-text-primary) !important;
    }
  }
  :global(*) {
    --theme-surface: #313131 !important;
    --theme-cards: #272727 !important;
  }
  :global(.s-text-field__input > label) {
    color: var(--theme-text-secondary) !important;
  }
  :global(input::-webkit-outer-spin-button, input::-webkit-inner-spin-button) {
    -webkit-appearance: none;
    margin: 0;
  }
  :global(.s-input__details) {
    height: 18px;
    color: #f44336 !important;
  }
  :global(input[type="number"]) {
    -moz-appearance: textfield;
  }
  :global(.s-input__control) {
    margin-top: 12px;
    padding-right: 20px;
  }
  :global(.suffix) {
    color: var(--theme-text-primary);
    &.disabled {
      color: var(--theme-text-disabled);
    }
  }
  :global(.no-label) {
    margin-top: -25px;
  }
  :global(.s-tab) {
    justify-content: left !important;
  }
  :global(.clickable) {
    cursor: pointer;
  }
  :global(.underline) {
    text-decoration: underline;
  }
  :global(*) {
    font-family: "Montserrat", sans-serif !important;
  }
  :global(.alert-text > .s-alert) {
    font-size: 12px !important;
  }
  :global(.virtual-list > *) {
    overflow-y: overlay !important;
  }
  :global(::-webkit-scrollbar) {
    width: 12px;
  }
  :global(::-webkit-scrollbar-thumb) {
    background: #666;
    border-radius: 4px;
    height: 40px;
  }
  :global(::-webkit-scrollbar-track) {
    background: #ddd;
    border-radius: 4px;
  }
  :global(.filter-input .s-input__control) {
    margin-top: 0px;
  }
  :global(.filter-input .s-input__details) {
    display: none;
  }
</style>
