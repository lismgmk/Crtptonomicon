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
    <delete-graph-button @lock-select="lockGraph"/>

  </section>
</template>

<script>
import DeleteGraphButton from "@/components/GraphElem/DeleteGraphButton";
export default {
  name: "GraphElem",
  components: {DeleteGraphButton},
  emits: {
    'lock-select': value => {
      return typeof value === 'boolean'
    }
  },
  data() {
    return {
      graph: [],
      countGraph: 1,
      widthColumnGraph: 40,
    }
  },


  props: {
    select:{
      type: [Object,Boolean]
    },
    price: {
      type: Number
    }
  },
  watch: {
    select(){
      this.graph = []
      this.$nextTick().then(this.countNumberGraph)
    },
    price(val){
      this.graph.push(val)
      if (this.$refs.graphArea === null) {
        this.countGraph = 1
      }
      while (this.graph.length > this.countGraph) {
        this.graph.shift()
      }
    }

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


  },

  methods: {
    lockGraph(val){
      this.$emit('lock-select', val)
    },
    countNumberGraph() {
      if (!this.$refs.graphArea) {
        return
      }
      if (this.$refs.graphColumn) {
        if (+this.widthColumnGraph - 5 > this.$refs.graphColumn.clientWidth) {
          this.graph = this.graph.filter((i, index) => index < 3)
        }
      }

      return this.countGraph = this.$refs.graphArea.clientWidth / this.widthColumnGraph
    },
  },

  mounted() {
    window.addEventListener('resize', this.countNumberGraph)
  },

  beforeMount() {
    window.removeEventListener('resize', this.countNumberGraph)
  },
}
</script>

<style scoped>

</style>