import axios from 'axios'
import type { Pokemon, PokemonListResponse } from '@/types/pokemon'

const BASE_URL = 'https://pokeapi.co/api/v2'

export class PokemonService {
  private static instance: PokemonService
  private cache = new Map<string, any>()

  public static getInstance(): PokemonService {
    if (!PokemonService.instance) {
      PokemonService.instance = new PokemonService()
    }
    return PokemonService.instance
  }

  async getPokemonList(limit = 151, offset = 0): Promise<PokemonListResponse> {
    const cacheKey = `list_${limit}_${offset}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const response = await axios.get<PokemonListResponse>(
        `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
      )
      this.cache.set(cacheKey, response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching Pokemon list:', error)
      throw error
    }
  }

  async getPokemon(id: string | number): Promise<Pokemon> {
    const cacheKey = `pokemon_${id}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    try {
      const response = await axios.get<Pokemon>(`${BASE_URL}/pokemon/${id}`)
      this.cache.set(cacheKey, response.data)
      return response.data
    } catch (error) {
      console.error(`Error fetching Pokemon ${id}:`, error)
      throw error
    }
  }

  async searchPokemon(query: string): Promise<Pokemon[]> {
    try {
      if (query.length < 2) return []
      
      const listResponse = await this.getPokemonList(1000)
      const filteredPokemon = listResponse.results.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      )
      
      const pokemonPromises = filteredPokemon.slice(0, 20).map(pokemon =>
        this.getPokemon(pokemon.name)
      )
      
      return await Promise.all(pokemonPromises)
    } catch (error) {
      console.error('Error searching Pokemon:', error)
      throw error
    }
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    }
    return colors[type] || '#68A090'
  }
}