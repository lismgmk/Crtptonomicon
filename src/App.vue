<template>
  <div class="container" style="margin: 30px">

    <add-currency
        :flagDouble='flagDouble'
        @currency-input-value="addCurrency"
        @input-value-for-tags="creteTags"
        :tags="tags"
    />

    <template v-if="currencies.length">
      <div>
        <hr class="w-full border-t border-gray-600 my-4"/>
        Фильтр
        <input
            v-model="filter"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"

        />
        <button
            v-show="currentPage > 1"
            @click='currentPage = currentPage - 1'
            type="button"
            class="mr-4 my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >

          Назад
        </button>

        <button
            v-show="nextBtn"
            @click='currentPage = currentPage + 1'
            type="button"
            class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Вперед
        </button>

      </div>

      <hr class="w-full border-t border-gray-600 my-4"/>

      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div
            @click="selected(currency)"
            :key="index"
            v-for="(currency, index) in paginationCurrencies"
            :class="{
            'border-4': sel === currency,
            'bg-red-100': currency.empty === true,
            'bg-white': currency.empty === false
        }"
            class="overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
        >
          <div class="px-4 py-5 sm:p-6 text-center">
            <dt class="text-sm font-medium text-gray-500 truncate">
              {{ currency.name }} - USD
            </dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {{ formatedCurrecy(currency.price) }}
            </dd>
          </div>
          <div class="w-full border-t border-gray-200"></div>
          <button
              @click.stop="deleteCurrency(currency)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
          >
            <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
            >
              <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
              ></path>
            </svg>
            Удалить
          </button>
        </div>

      </dl>
      <hr class="w-full border-t border-gray-600 my-4"/>
      <GraphElem
          :select="sel"
          :price="currentPrice"
          @lock-select="sel = false"
      />
    </template>


  </div>


</template>

<script>
import {getCurrensyTags, subscriberCurrecyes, unSubscriberCurrecyes} from "@/api";
import AddCurrency from '@/components/AddCurrencyElem/AddCurrency.vue';
import {nanoid} from "nanoid";
import GraphElem from "@/components/GraphElem/GraphElem";

export default {
  name: 'App',
  components: {
    AddCurrency,
    GraphElem
  },

  data() {
    return {

      inputVal: '',
      currencies: [],
      sel: false,
      interval: null,

      currentPrice: 0,

      allCrypto: {},
      mainArrayCrypto: [],
      tags: [],
      flagDouble: {
        doubleFlag: '', warningEntryFlag: false
      },

      filter: '',
      currentPage: 1,
    }
  },
  computed: {

    startCurrency: function () {
      return 6 * (this.currentPage - 1)
    },
    endCurrency: function () {
      return this.startCurrency + 6
    },
    filterCurrencies: function () {
      return this.currencies
          .filter(currency => {
            return currency.name.toLowerCase().includes(this.filter.toLowerCase())
          })
    },

    nextBtn: function () {
      return this.currencies.length > this.endCurrency
    },

    paginationCurrencies: function () {
      return this.filterCurrencies.slice(this.startCurrency, this.endCurrency)
    },
    filterUrlParams: function () {
      return {
        filter: this.filter,
        currentPage: this.currentPage
      }
    },

  },

  methods: {

    addCurrency(newCurrency) {
      if (this.currencies.filter(currency => currency.name === newCurrency.name).length === 0) {
        this.currencies = [...this.currencies, newCurrency]
        subscriberCurrecyes(
            newCurrency.name,
            (newPrice) => {
              this.updateCurrecyes(newCurrency.name, newPrice)
            }
        )
        this.flagDouble = {doubleFlag: nanoid(), warningEntryFlag: false}
        this.tags = []
      } else {
        this.flagDouble = {doubleFlag: null, warningEntryFlag: true}
      }
    },

    formatedCurrecy(price) {
      if (price === '-') {
        return '-'
      } else {
        return price < 1 ? price.toPrecision(2) : price.toFixed(2)
      }
    },

    creteTags(inputValue) {
      this.tags = []
      this.mainArrayCrypto.forEach(elem => {
        if (inputValue === '') {
          this.tags = []
        } else {
          if (elem.toLowerCase().includes(inputValue.toLowerCase())) {
            if (this.tags.length < 4) {
              this.tags.push(elem)
            }
          }
        }
      })
    },

    deleteCurrency(cur) {
      this.currencies = this.currencies.filter(currency => currency !== cur)
      localStorage.setItem('currencies', JSON.stringify(this.currencies))
      if (this.sel === cur) {
        this.sel = null
      }
      unSubscriberCurrecyes(cur.name)
    },

    selected(currency) {
      this.sel = currency
    },

    closeGraph() {
      this.sel = null
    },

    async fetchCrypto() {
      let data = await getCurrensyTags()
      this.allCrypto = data
      this.createMainArr()
    },

    createMainArr() {
      for (let key in this.allCrypto) {
        this.mainArrayCrypto.push(this.allCrypto[key]['Symbol'])
      }
    },

    updateCurrecyes(currencyName, price) {

      this.currencies.filter(c => currencyName === c.name).forEach(c => {
        if (price !== undefined) {
          c.empty = false
          c.price = price
        }
        if (price === 'invalid') {
          c.empty = true
          c.price = '-'
        }
        if (this.sel !== null && this.sel.name === c.name) {
          this.currentPrice = price
        }
      })


    },
  },


  watch: {
    currentPrice() {
      return this.currentPrice
    },
    graph() {
      return this.graph
    },

    tags() {
      return this.tags
    },

    flagDouble() {
      return this.flagDouble
    },


    paginationCurrencies() {
      if (this.paginationCurrencies.length === 0 && this.currentPage > 1) {
        this.currentPage -= 1
      }
    },

    filter() {
      this.currentPage = 1
    },

    filterUrlParams(value) {
      window.history.pushState(null, document.title, `${window.location.pathname}?filter=${value.filter}&page=${value.currentPage}`);
    },

    currencies() {
      localStorage.setItem('currencies', JSON.stringify(this.currencies))
    },

  },

  created() {
    this.sel = null
    const windowData = Object.fromEntries(
        new URL(window.location).searchParams.entries()
    );
    if (windowData.filter) {
      this.filter = windowData.filter;
    }

    if (windowData.page) {
      this.currentPage = windowData.page;
    }

    this.fetchCrypto()
    let localCurrencyes = localStorage.getItem('currencies')
    if (localCurrencyes) {
      this.currencies = JSON.parse(localCurrencyes)
      this.currencies.forEach((currency) => {
            subscriberCurrecyes(
                currency.name,
                newPrice => this.updateCurrecyes(currency.name, newPrice)
            )
          }
      )
    }
  }
}
</script>

<style scoped>

</style>
