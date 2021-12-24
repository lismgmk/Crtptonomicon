<template>
  <div class="container" style="margin: 30px">
    <section>
      <div class="flex">
        <div class="max-w-xs">
          <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
          >
          <div class="mt-1 relative rounded-md shadow-md">
            <input
                @keydown.enter="addCurrency(inputVal)"
                v-model="inputVal"
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
      <button
          @click="addCurrency(inputVal)"
          type="button"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <svg
            class="-ml-0.5 mr-2 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#ffffff"
        >
          <path
              d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
          ></path>
        </svg>
        Добавить
      </button>
    </section>


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
    </template>


    <section class="relative" v-if="sel">
      <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
        {{ sel.name }} - USD
      </h3>
      <div class="flex items-end border-gray-600 border-b border-l h-64">
        <div
            :key="index"
            v-for="(gr, index) in roundGraph"
            :style="{ height: `${gr}%`}"
            class="bg-purple-800 border w-10"
        ></div>
      </div>
      <button
          type="button"
          class="absolute top-0 right-0"
          @click="closeGraph"
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            version="1.1"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 511.76 511.76"
            style="enable-background:new 0 0 512 512"
            xml:space="preserve"
        >
          <g>
            <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
            ></path>
          </g>
        </svg>
      </button>
    </section>
  </div>
</template>

<script>
import {subscriberCurrecyes, unSubscriberCurrecyes} from "@/api";

export default {
  data() {
    return {
      // emptyPrise: true,

      inputVal: '',
      currencies: [],
      sel: null,
      interval: null,
      graph: [],
      allCrypto: {},
      mainArrayCrypto: [],
      tags: [],
      flagDouble: false,

      filter: '',
      currentPage: 1,

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
    }

  },

  methods: {

    addCurrency(nameTag) {
      let newCurrency = {price: '-', name: nameTag.toUpperCase(), empty: false}
      if (this.currencies.filter(currency => currency.name === newCurrency.name).length === 0) {
        this.currencies = [...this.currencies, newCurrency]
        subscriberCurrecyes(
            newCurrency.name,
            (newPrice) => {
              this.updateCurrecyes(newCurrency.name, newPrice)
            }
        )
        this.inputVal = ''
        this.flagDouble = false
        this.tags = []
      } else {
        this.flagDouble = true
        this.inputVal = nameTag
      }
    },

    formatedCurrecy(price) {
      if (price === '-') {
        return '-'
      } else {
        return price < 1 ? price.toPrecision(2) : price.toFixed(2)
      }
    },

    updtInput() {
      this.filter = ''
      this.tags = []
      this.flagDouble = false
      this.mainArrayCrypto.forEach(elem => {
        if (this.inputVal === '') {
          this.tags = []
        } else {
          if (elem.toLowerCase().includes(this.inputVal.toLowerCase())) {
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
      this.graph = []
    },

    closeGraph() {
      this.sel = null
    },

    async fetchCrypto() {
      let response = await fetch('https://min-api.cryptocompare.com/data/all/coinlist?summary=true')
      const data = await response.json()
      this.allCrypto = data.Data
      this.createMainArr()
    },

    createMainArr() {
      for (let key in this.allCrypto) {
        this.mainArrayCrypto.push(this.allCrypto[key]['Symbol'])
      }
    },
    updateCurrecyes(currencyName, price) {
      // console.log(currencyName, price)
      this.currencies.filter(c => currencyName === c.name).forEach(c => {
        if (price !== undefined) {
          // this.emptyPrise = false
          c.empty = false
          c.price = price
        }
        if (price === 'invalid') {
          // this.emptyPrise = true
          c.empty = true
          c.price = '-'
        }
        if (this.sel !== null && this.sel.name === c.name) {
          this.graph.push(price)
        }
      })
    },
  },


  watch: {
    emptyPrise() {
      return this.emptyPrise
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
