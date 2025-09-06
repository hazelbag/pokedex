<template>
  <div class="max-w-7xl mx-auto">
    <header class="text-center mb-8">
      <h1 class="text-5xl font-bold text-white mb-4 drop-shadow-lg">
        Pokédex
      </h1>
      <p class="text-xl text-white/90 drop-shadow">
        Discover and explore the world of Pokémon
      </p>
    </header>

    <div class="mb-8">
      <div class="max-w-md mx-auto">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search Pokémon..."
          class="search-input"
          @input="handleSearch"
        >
      </div>
    </div>

    <div class="mb-6 flex justify-center">
      <div class="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
        <span class="text-lg font-semibold">
          {{ isSearching ? `Found ${pokemon.length} Pokémon` : `Showing ${pokemon.length} Pokémon` }}
        </span>
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center"
    >
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      <p class="text-white mt-4">
        Loading Pokémon...
      </p>
    </div>

    <div
      v-else-if="error"
      class="text-center"
    >
      <div class="bg-red-500 text-white p-4 rounded-lg max-w-md mx-auto">
        <p class="font-semibold">
          Error loading Pokémon
        </p>
        <p class="text-sm mt-2">
          {{ error }}
        </p>
        <button
          class="mt-4 bg-white text-red-500 px-4 py-2 rounded font-semibold"
          @click="loadInitialPokemon"
        >
          Try Again
        </button>
      </div>
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      <PokemonCard
        v-for="poke in pokemon"
        :key="poke.id"
        :pokemon="poke"
        @click="goToPokemonDetail"
      />
    </div>

    <div
      v-if="!isSearching && !loading && hasMore"
      class="text-center mt-8"
    >
      <button
        :disabled="loadingMore"
        class="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="loadMorePokemon"
      >
        {{ loadingMore ? 'Loading...' : 'Load More Pokémon' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PokemonService } from '@/services/pokemonService'
import type { Pokemon } from '@/types/pokemon'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PokemonCard from './PokemonCard.vue'

const router = useRouter()
const pokemonService = PokemonService.getInstance()

const pokemon = ref<Pokemon[]>([])
const searchQuery = ref('')
const loading = ref(false)
const loadingMore = ref(false)
const error = ref<string | null>(null)
const isSearching = ref(false)
const currentOffset = ref(0)
const hasMore = ref(true)
const limit = 20

let searchTimeout: NodeJS.Timeout

const loadInitialPokemon = async () => {
  loading.value = true
  error.value = null
  
  try {
    const listResponse = await pokemonService.getPokemonList(limit, 0)
    const pokemonPromises = listResponse.results.map(p => pokemonService.getPokemon(p.name))
    pokemon.value = await Promise.all(pokemonPromises)
    currentOffset.value = limit
    hasMore.value = listResponse.next !== null
  } catch (err) {
    error.value = 'Failed to load Pokémon. Please check your internet connection.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const loadMorePokemon = async () => {
  if (loadingMore.value || !hasMore.value || isSearching.value) return
  
  loadingMore.value = true
  
  try {
    const listResponse = await pokemonService.getPokemonList(limit, currentOffset.value)
    const pokemonPromises = listResponse.results.map(p => pokemonService.getPokemon(p.name))
    const newPokemon = await Promise.all(pokemonPromises)
    
    pokemon.value = [...pokemon.value, ...newPokemon]
    currentOffset.value += limit
    hasMore.value = listResponse.next !== null
  } catch (err) {
    error.value = 'Failed to load more Pokémon.'
    console.error(err)
  } finally {
    loadingMore.value = false
  }
}

const handleSearch = () => {
  clearTimeout(searchTimeout)
  
  searchTimeout = setTimeout(async () => {
    if (!searchQuery.value.trim()) {
      isSearching.value = false
      await loadInitialPokemon()
      return
    }
    
    if (searchQuery.value.length < 2) return
    
    isSearching.value = true
    loading.value = true
    error.value = null
    
    try {
      const results = await pokemonService.searchPokemon(searchQuery.value)
      pokemon.value = results
    } catch (err) {
      error.value = 'Search failed. Please try again.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }, 300)
}

const goToPokemonDetail = (selectedPokemon: Pokemon) => {
  router.push(`/pokemon/${selectedPokemon.id}`)
}

onMounted(() => {
  loadInitialPokemon()
})
</script>