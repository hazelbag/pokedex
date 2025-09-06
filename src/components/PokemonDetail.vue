<template>
  <div class="max-w-4xl mx-auto">
    <button
      class="mb-6 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors flex items-center space-x-2"
      @click="$router.back()"
    >
      <span>←</span>
      <span>Back to Pokédex</span>
    </button>

    <div
      v-if="loading"
      class="text-center"
    >
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      <p class="text-white mt-4">
        Loading Pokémon details...
      </p>
    </div>

    <div
      v-else-if="error"
      class="text-center"
    >
      <div class="bg-red-500 text-white p-4 rounded-lg max-w-md mx-auto">
        <p class="font-semibold">
          Error loading Pokémon details
        </p>
        <p class="text-sm mt-2">
          {{ error }}
        </p>
      </div>
    </div>

    <div
      v-else-if="pokemon"
      class="bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      <div class="bg-gradient-to-r from-purple-400 to-pink-400 p-8 text-center text-white relative">
        <div class="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
          <span class="font-bold text-lg">#{{ pokemon.id.toString().padStart(3, '0') }}</span>
        </div>
        
        <img
          :src="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default"
          :alt="pokemon.name"
          class="w-48 h-48 mx-auto object-contain drop-shadow-2xl"
        >
        
        <h1 class="text-4xl font-bold capitalize mt-6 mb-4">
          {{ pokemon.name }}
        </h1>
        
        <div class="flex justify-center space-x-3">
          <span
            v-for="type in pokemon.types"
            :key="type.type.name"
            class="pokemon-type text-lg px-4 py-2"
            :style="{ backgroundColor: pokemonService.getTypeColor(type.type.name) }"
          >
            {{ type.type.name }}
          </span>
        </div>
      </div>

      <div class="p-8">
        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div>
              <h3 class="text-xl font-bold text-gray-800 mb-4">
                Physical Characteristics
              </h3>
              <div class="bg-gray-50 rounded-lg p-4 space-y-3">
                <div class="flex justify-between">
                  <span class="font-semibold text-gray-600">Height:</span>
                  <span class="text-gray-800">{{ (pokemon.height / 10).toFixed(1) }}m</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-semibold text-gray-600">Weight:</span>
                  <span class="text-gray-800">{{ (pokemon.weight / 10).toFixed(1) }}kg</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-xl font-bold text-gray-800 mb-4">
                Abilities
              </h3>
              <div class="space-y-2">
                <div
                  v-for="ability in pokemon.abilities"
                  :key="ability.ability.name"
                  class="bg-blue-50 rounded-lg p-3 flex justify-between items-center"
                >
                  <span class="capitalize font-semibold text-blue-800">
                    {{ ability.ability.name.replace('-', ' ') }}
                  </span>
                  <span
                    v-if="ability.is_hidden"
                    class="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded"
                  >
                    Hidden
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-4">
              Base Stats
            </h3>
            <div class="space-y-4">
              <div
                v-for="stat in pokemon.stats"
                :key="stat.stat.name"
                class="space-y-2"
              >
                <div class="flex justify-between text-sm">
                  <span class="font-semibold text-gray-600 capitalize">
                    {{ formatStatName(stat.stat.name) }}
                  </span>
                  <span class="font-bold text-gray-800">{{ stat.base_stat }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }"
                  />
                </div>
              </div>
            </div>
            
            <div class="mt-6 bg-gray-50 rounded-lg p-4">
              <div class="text-center">
                <span class="text-sm text-gray-600 font-semibold">Total Base Stats</span>
                <div class="text-2xl font-bold text-gray-800 mt-1">
                  {{ totalStats }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Pokemon } from '@/types/pokemon'
import { PokemonService } from '@/services/pokemonService'

const route = useRoute()
const pokemonService = PokemonService.getInstance()

const pokemon = ref<Pokemon | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const totalStats = computed(() => {
  if (!pokemon.value) return 0
  return pokemon.value.stats.reduce((total, stat) => total + stat.base_stat, 0)
})

const formatStatName = (statName: string): string => {
  const nameMap: Record<string, string> = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Attack',
    'special-defense': 'Sp. Defense',
    'speed': 'Speed'
  }
  return nameMap[statName] || statName
}

const loadPokemon = async () => {
  loading.value = true
  error.value = null
  
  try {
    const pokemonId = route.params.id as string
    pokemon.value = await pokemonService.getPokemon(pokemonId)
  } catch (err) {
    error.value = 'Failed to load Pokémon details. Please try again.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPokemon()
})
</script>