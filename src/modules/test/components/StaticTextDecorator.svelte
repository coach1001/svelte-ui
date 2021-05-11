<script>
  export let element;
  export let data;
  export let rules;
</script>

<div style={`${element.layout.gridStyle} ${element.layout.elementStyle}`}>
  <div class="static-decorator-text">{element.metadata.text}</div>
</div>

<style>
  .static-decorator-text {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>