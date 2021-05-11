<script>
  import VirtualList from "@sveltejs/svelte-virtual-list";
  import {
    mdiChevronDownCircle,
    mdiChevronDownCircleOutline,
    mdiChevronUpCircle,
    mdiChevronUpCircleOutline,
    mdiFilter,
  } from "@mdi/js";
  import { Icon, TextField, Divider, Button } from "svelte-materialify";
  import { sort } from "fast-sort";
  import { onMount } from "svelte";

  export let element;
  export let data;
  export let rules;

  const metadata = element.metadata;
  const columns = metadata.columns;
  const customActions = metadata.customActions;
  const onAddServerTask = metadata.onAddServerTask;
  const onDeleteServerTask = metadata.onDeleteServerTask;
  const onEditClientTask = metadata.onEditClientTask;

  let formattedData = [];
  let sorted = [];
  let sortedAndFiltered = [];
  let sortColumns = [];
  let filter;

  columns.forEach((col) => {
    col.sort = null;
    col.filter = "";
  });

  onMount(() => {
    const now = new Date();
    if (data != null && data.length > 0) {
      formattedData = formatRows();
      sorted = formattedData;
      sortedAndFiltered = formattedData;
    }
    console.log(element);
  });

  const formatRows = () => {
    const formattedRows = [];
    data.forEach((row) => {
      const formattedRow = row;
      columns.forEach((column) => {
        Object.keys(row).forEach((key) => {
          if (column.field === key) {
            formattedRow[key] = formatCell(row[key], column);
          }
        });
      });
      formattedRows.push(formattedRow);
    });
    return formattedRows;
  };

  const formatCell = (dataF, columnConfig) => {
    switch (columnConfig.columnType) {
      case "dateTime":
        return toLocalISOString(new Date(dataF), true);
      case "text":
      case "number":
      default:
        return dataF;
    }
  };

  const toLocalISOString = (d, format = false) => {
    var off = d.getTimezoneOffset();
    if (!format) {
      return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours(),
        d.getMinutes() - off,
        d.getSeconds(),
        d.getMilliseconds()
      ).toISOString();
    } else {
      return new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        d.getHours(),
        d.getMinutes() - off,
        d.getSeconds(),
        d.getMilliseconds()
      )
        .toISOString()
        .substr(0, 16)
        .replace("T", " ");
    }
  };

  const colSort = (col, sort) => {
    if (col.sort == null) col.sort = sort;
    else col.sort = sort;
    columns = columns;
    const sortColumnIdx = sortColumns.findIndex((sc) => sc.field === col.field);
    if (sortColumnIdx > -1) {
      sortColumns.splice(sortColumnIdx, 1);
    }
    sortColumns.push({
      field: col.field,
      sort,
    });
    sortAndFilter();
  };

  const sortAndFilter = () => {
    sortColumns.forEach((sc) => {
      if (sc.sort) sorted = sort(sorted).asc((u) => u[sc.field]);
      else sorted = sort(sorted).desc((u) => u[sc.field]);
    });
    sortedAndFiltered = sorted.filter((s) => {
      if (filter == null || filter === "") return true;
      let stringToFilter = null;
      Object.keys(s).forEach((k) => {
        stringToFilter += `${String(s[k])} `;
      });
      if (stringToFilter == null) return true;
      stringToFilter = stringToFilter.toLowerCase();
      return stringToFilter.includes(filter.toLowerCase());
    });
  };

  const editAction = (item) => {
    const state = get(currentState);
    const context = state.context;
    console.log(metadata);
  }

  const handleInput = () => {
    sortAndFilter();
  };
</script>

<div class="virtual-list">
  <div class="filter-input">
    <TextField bind:value={filter} on:input={handleInput} placeholder="Filter">
      <div slot="prepend">
        <Icon path={mdiFilter} />
      </div>
    </TextField>
  </div>
  <div class="column-header">
    {#each columns as col}
      <div>
        {col.header}
        {#if col.sort != null}
          <span>
            {#if col.sort}
              <span
                on:click={() => colSort(col, true)}
                style="cursor: pointer;"
              >
                <Icon path={mdiChevronUpCircle} style="cursor: pointer;" />
              </span>
              <span
                on:click={() => colSort(col, false)}
                style="cursor: pointer;"
              >
                <Icon
                  path={mdiChevronDownCircleOutline}
                  style="cursor: pointer;"
                />
              </span>
            {:else}
              <span
                on:click={() => colSort(col, true)}
                style="cursor: pointer;"
              >
                <Icon
                  path={mdiChevronUpCircleOutline}
                  style="cursor: pointer;"
                />
              </span>
              <span
                on:click={() => colSort(col, false)}
                style="cursor: pointer;"
              >
                <Icon path={mdiChevronDownCircle} style="cursor: pointer;" />
              </span>
            {/if}
          </span>
        {:else}
          <span on:click={() => colSort(col, true)} style="cursor: pointer;">
            <Icon path={mdiChevronUpCircleOutline} />
          </span>
          <span on:click={() => colSort(col, false)} style="cursor: pointer;">
            <Icon path={mdiChevronDownCircleOutline} />
          </span>
        {/if}
      </div>
    {/each}
    <div>
      <div>Actions</div>
    </div>
  </div>
  <Divider style="margin-top: 10px;" />
  <VirtualList height="90%" items={sortedAndFiltered} let:item>
    <div class="data-row">
      {#each columns as col}
        <div>
          <div>{item[col.field]}</div>
          
        </div>
      {/each}
      <div>
        {#if onEditClientTask != null}
          <span on:click={() => editAction(item)} class="blue-text clickable underline">Edit</span>
        {/if}
        {#if onDeleteServerTask != null}
          <span class="blue-text clickable underline">Delete</span>
        {/if}
      </div>
    </div>
    <Divider/>
  </VirtualList>
</div>

<style>
  .virtual-list {
    height: calc(100vh - 220px);
    padding-bottom: 20px;
  }
  .column-header {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  }
  .data-row {
    padding-top: 5px;
    padding-bottom: 5px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  }
</style>
