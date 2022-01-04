<template>
  <section>
    <h1>New test</h1>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
        >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
              @keydown.enter="addCurrency"
              v-bind:="getInpuFromParent"
              @input="updtInput"
              type="text"
              name="wallet"
              id="wallet"
              class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
              placeholder="Например DOGE"
          />
        </div>
        <div class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap">
            <span
                @click="addCurrency(tag)"
                :key="tag"
                v-for="tag in tags"
                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer">
              {{ tag }}
            </span>
        </div>
        <div v-show="flagDouble" class="text-sm text-red-600">Такой тикер уже добавлен</div>
      </div>
    </div>

    <plus-single-icon
        v-on:click = "$emit('inputFromAddCur', addOnlyValue())"/>
  </section>
</template>
<script>
import PlusSingleIcon from './PlusSignIcon.vue'

export default {
  name: 'AddCurrency',
  props: ['newInput'],

  components: {
    PlusSingleIcon
  },

  computed:{
    getInpuFromParent(){
      console.log(this.newInput, 'input in computed')
      return this.newInput
    }
  },


  methods: {
    addOnlyValue() {
      // let k = {price: '-', name: this.inputVal.toUpperCase(), empty: false}
      // console.log(k, '1 send to App Obj')
      return  {price: '-', name: this.getInpuFromParent.toUpperCase(), empty: false}

      // if (this.currencies.filter(currency => currency.name === newCurrency.name).length === 0) {
      //   this.currencies = [...this.currencies, newCurrency]
      //   subscriberCurrecyes(
      //       newCurrency.name,
      //       (newPrice) => {
      //         this.updateCurrecyes(newCurrency.name, newPrice)
      //       }
      //   )
      //   this.inputVal = ''
      //   this.flagDouble = false
      //   this.tags = []
      // } else {
      //   this.flagDouble = true
      //   this.inputVal = nameTag
      // }
    },
  }
}


</script>
<style></style>