<template>
  <div class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
                <span
                    @click="addCurrencyByTag(tag)"
                    :key="index"
                    v-for="(tag, index) in tags"
                    class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
                  {{ tag }}
                </span>
  </div>
</template>

<script>
export default {
  name: "PromptTags",

  props: {
    tags: {
      default: function () {
        return []
      },
      type: Array
    }
  },
  emits: {
    'add-currency-by-tag': curTag => {
      if(typeof curTag === "string" ){
        return true
      }
    },
  },
  methods: {
    addCurrencyByTag(tag) {
      this.$emit('add-currency-by-tag', tag)
    }
  },


}
</script>

<style scoped>

</style>