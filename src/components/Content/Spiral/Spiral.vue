<template>
<div class="px-4 pt-4 pb-3">
  <div id="svg"></div>
</div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "Spiral",
  data: () => ({
    size: {
      width: 400,
      height: 400,
    },
  }),
  mounted () {
    const svg = d3.select('#svg').append('svg')
        .attr('width', this.size.width)
        .attr('height', this.size.height)
        .attr('class', 'svg-container')
  },
}
</script>

<style scoped>

</style>