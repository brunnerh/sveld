<script>
  /**
   * @typedef {string} DropdownItemId
   * @typedef {string} DropdownItemText
   * @typedef {{ id: DropdownItemId; text: DropdownItemText; }} DropdownItem
   * @event {{ selectedId: DropdownItemId, selectedIndex: number, selectedItem: DropdownItem }} select
   */

  /**
   * Set the dropdown items
   * @type {DropdownItem[]}
   */
  export let items = [];

  /**
   * Override the display of a dropdown item
   * @type {(item: DropdownItem) => string}
   */
  export let itemToString = (item) => item.text || item.id;

  /** Specify the selected item index */
  export let selectedIndex = -1;

  /**
   * Specify the type of dropdown
   * @type {"default" | "inline"}
   */
  export let type = "default";

  /**
   * Specify the size of the dropdown field
   * @type {"sm" | "lg" | "xl"}
   */
  export let size = undefined;

  /** Set to `true` to open the dropdown */
  export let open = false;

  /** Set to `true` to use the inline variant */
  export let inline = false;

  /** Set to `true` to enable the light variant */
  export let light = false;

  /** Set to `true` to disable the dropdown */
  export let disabled = false;

  /** Specify the title text */
  export let titleText = "";

  /** Set to `true` to indicate an invalid state */
  export let invalid = false;

  /** Specify the invalid state text */
  export let invalidText = "";

  /** Set to `true` to indicate an warning state */
  export let warn = false;

  /** Specify the warning state text */
  export let warnText = "";

  /** Specify the helper text */
  export let helperText = "";

  /**
   * Specify the list box label
   * @type {string}
   */
  export let label = undefined;

  /**
   * Override the default translation ids
   * @type {(id: any) => string}
   */
  export let translateWithId = undefined;

  /** Set an id for the list box component */
  export let id = "ccs-" + Math.random().toString(36);

  /**
   * Specify a name attribute for the list box
   * @type {string}
   */
  export let name = undefined;

  /** Obtain a reference to the button HTML element */
  export let ref = null;

  import { createEventDispatcher } from "svelte";
  import WarningFilled16 from "carbon-icons-svelte/lib/WarningFilled16/WarningFilled16.svelte";
  import WarningAltFilled16 from "carbon-icons-svelte/lib/WarningAltFilled16/WarningAltFilled16.svelte";
  import { ListBox, ListBoxMenu, ListBoxMenuIcon, ListBoxMenuItem } from "../ListBox";

  const dispatch = createEventDispatcher();

  let selectedId = undefined;
  let highlightedIndex = -1;

  function change(direction) {
    let index = highlightedIndex + direction;

    if (index < 0) {
      index = items.length - 1;
    } else if (index >= items.length) {
      index = 0;
    }

    highlightedIndex = index;
  }

  $: if (selectedIndex > -1) {
    dispatch("select", { selectedId, selectedIndex, selectedItem });
  }
  $: inline = type === "inline";
  $: selectedItem = items[selectedIndex];
  $: if (!open) {
    highlightedIndex = -1;
  }
</script>

<svelte:window
  on:click={({ target }) => {
    if (open && ref && !ref.contains(target)) {
      open = false;
    }
  }}
/>

<div
  class:bx--dropdown__wrapper={true}
  class:bx--list-box__wrapper={true}
  class:bx--dropdown__wrapper--inline={inline}
  class:bx--list-box__wrapper--inline={inline}
  class:bx--dropdown__wrapper--inline--invalid={inline && invalid}
  {...$$restProps}
>
  {#if titleText}
    <label for={id} class:bx--label={true} class:bx--label--disabled={disabled}>
      {titleText}
    </label>
  {/if}
  <ListBox
    {type}
    {size}
    {id}
    {name}
    aria-label={$$props["aria-label"]}
    class="bx--dropdown {invalid && 'bx--dropdown--invalid'} {!invalid && warn && 'bx--dropdown--warning'} {open &&
      'bx--dropdown--open'}
      {size === 'sm' && 'bx--dropdown--sm'}
      {size === 'xl' && 'bx--dropdown--xl'}
      {inline && 'bx--dropdown--inline'}
      {disabled && 'bx--dropdown--disabled'}
      {light && 'bx--dropdown--light'}"
    on:click={({ target }) => {
      open = ref.contains(target) ? !open : false;
    }}
    {disabled}
    {open}
    {invalid}
    {invalidText}
    {light}
    {warn}
    {warnText}
  >
    {#if invalid}
      <WarningFilled16 class="bx--list-box__invalid-icon" />
    {/if}
    {#if !invalid && warn}
      <WarningAltFilled16 class="bx--list-box__invalid-icon bx--list-box__invalid-icon--warning" />
    {/if}
    <button
      bind:this={ref}
      class:bx--list-box__field={true}
      tabindex="0"
      role="button"
      aria-expanded={open}
      on:keydown={({ key }) => {
        if (key === "Enter") {
          open = !open;
          if (highlightedIndex > -1 && highlightedIndex !== selectedIndex) {
            selectedIndex = highlightedIndex;
            open = false;
          }
        } else if (key === "Tab") {
          open = false;
          ref.blur();
        } else if (key === "ArrowDown") {
          change(1);
        } else if (key === "ArrowUp") {
          change(-1);
        }
      }}
      {disabled}
      {translateWithId}
      {id}
    >
      <span class="bx--list-box__label">
        {#if selectedItem}{itemToString(selectedItem)}{:else}{label}{/if}
      </span>
      <ListBoxMenuIcon {open} {translateWithId} />
    </button>
    {#if open}
      <ListBoxMenu aria-labelledby={id} {id}>
        {#each items as item, i (item.id)}
          <ListBoxMenuItem
            id={item.id}
            active={selectedIndex === i || selectedId === item.id}
            highlighted={highlightedIndex === i || selectedIndex === i}
            on:click={() => {
              selectedId = item.id;
              selectedIndex = i;
              ref.focus();
            }}
            on:mouseenter={() => {
              highlightedIndex = i;
            }}
          >
            {itemToString(item)}
          </ListBoxMenuItem>
        {/each}
      </ListBoxMenu>
    {/if}
  </ListBox>
  {#if !inline && !invalid && !warn && helperText}
    <div class:bx--form__helper-text={true} class:bx--form__helper-text--disabled={disabled}>
      {helperText}
    </div>
  {/if}
</div>
