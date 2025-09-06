<template>
  <div
    class="pokemon-card"
    @click="$emit('click', pokemon)"
  >
    <div class="text-center">
      <div class="relative">
        <img
          :src="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default"
          :alt="pokemon.name"
          class="w-32 h-32 mx-auto object-contain"
          @error="handleImageError"
        >
        <div class="absolute top-0 right-0 bg-gray-200 text-gray-600 px-2 py-1 rounded-bl-lg text-sm font-bold">
          #{{ pokemon.id.toString().padStart(3, '0') }}
        </div>
      </div>
      
      <h3 class="text-xl font-bold capitalize mt-4 mb-3 text-gray-800">
        {{ pokemon.name }}
      </h3>
      
      <div class="flex justify-center space-x-2 mb-4">
        <span
          v-for="type in pokemon.types"
          :key="type.type.name"
          class="pokemon-type"
          :style="{ backgroundColor: pokemonService.getTypeColor(type.type.name) }"
        >
          {{ type.type.name }}
        </span>
      </div>
      
      <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <div>
          <span class="font-semibold">Height:</span>
          <br>
          {{ (pokemon.height / 10).toFixed(1) }}m
        </div>
        <div>
          <span class="font-semibold">Weight:</span>
          <br>
          {{ (pokemon.weight / 10).toFixed(1) }}kg
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pokemon } from '@/types/pokemon'
import { PokemonService } from '@/services/pokemonService'

interface Props {
  pokemon: Pokemon
}

defineProps<Props>()
defineEmits<{
  click: [pokemon: Pokemon]
}>()

const pokemonService = PokemonService.getInstance()

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.src = '/pokemon-placeholder.png'
}
</script>