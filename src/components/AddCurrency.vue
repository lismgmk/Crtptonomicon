<template>
  <section>
    <h1>New test</h1>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
        >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">

        </div>
        <div v-show="warningEntry" class="text-sm text-red-600"> Такой тикер уже добавлен</div>
      </div>
    </div>

    <plus-single-icon
        v-on:click='addOnlyValue'
        :tags="tags"
    />

    <input
        @keydown.enter="addOnlyValue"
        v-model="inputVal"
        @input="enterNewVal($event.currentTarget.value)"
        type="text"
        name="wallet"
        id="wallet"
        class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
        placeholder="Например DOGE"
    />
    <prompt-tags
        @add-currency-by-tag='addOnlyValue'
        :tags="tags"
    />
  </section>
</template>
<script>
import PlusSingleIcon from './PlusSignIcon.vue'
import PromptTags from "@/components/PromptTags";

export default {
  name: 'AddCurrency',
  components:{PlusSingleIcon, PromptTags},
  props: {
    flagDouble: {
      type: Object,
      default: function () {
        return {
          doubleFlag: '',
          warningEntryFlag: false
        }
      }
    },
    tags: {
      type: Array
    }
  },
  data() {
    return {
      inputVal: '',
      warningEntry: false
    }
  },
  emits: {
    'currency-input-value': value => {
      return typeof value === "string"
    },
    'input-value-for-tags': value => {
      return typeof value === "string"
    },

  },
  watch: {

    flagDouble(val) {
      if (val.doubleFlag) {
        this.inputVal = ''
      }
      if (val.warningEntryFlag === true) {
        this.warningEntry = true
      } else {
        this.warningEntry = false
      }
    }
  },
  methods: {
    enterNewVal(val) {
      this.$emit('input-value-for-tags', val)
      this.warningEntry = false
    },
    addOnlyValue(tag) {
      let currentInput = {}
      if(typeof tag === 'string'){
        currentInput = {price: '-', name: tag.toUpperCase(), empty: false}
        this.inputVal = ''
      } else {
        currentInput = {price: '-', name: this.inputVal.toUpperCase(), empty: false}
      }
      this.$emit('currency-input-value', currentInput)
    },

  }
}


</script>
<style></style>