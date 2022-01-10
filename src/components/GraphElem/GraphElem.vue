<template>
  <section class="relative" v-if="select">
    <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
      {{ select.name }} - USD
    </h3>
    <div
        ref="graphArea"
        class="flex items-end border-gray-600 border-b border-l h-64">
      <div
          ref="graphColumn"
          :key="index"
          v-for="(gr, index) in roundGraph"
          :style="{
              height: `${gr}%`,
              'width': `${widthColumnGraph}px`
            }"
          class="bg-purple-800 border w-10"

      >
      </div>
    </div>
    <delete-graph-button @click="closeGraph"/>

  </section>
</template>

<script>
import DeleteGraphButton from "@/components/GraphElem/DeleteGraphButton";
export default {
  name: "GraphElem",
  components: {DeleteGraphButton},
  props: {
    select:{
      type: Array
    },
    graph: {
      type: Array
    }
  },
  watch: {
    select(val){
      console.log(val, 'props select')
    },

  },
  computed: {
    roundGraph: function () {
      const maxVal = Math.max(...this.graph)
      const minVal = Math.min(...this.graph)
      if (maxVal === minVal) {
        return this.graph.map(() => 50)
      } else {
        return this.graph.map((gr) => {
          return 5 + ((gr - minVal) * 95) / (maxVal - minVal)
        })
      }

    },
  }
}
</script>

<style scoped>

</style>