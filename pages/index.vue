<script setup>
/**
 * Punkt 6: Korzystamy z globalnego Composable, aby posty 
 * "przeżyły" proces wylogowania i ponownego logowania.
 */
const { allPosts, addGlobalPost } = usePosts()

// Pobieranie danych startowych z API (Punkt 13)
const { data: serverPosts } = await useFetch('/api/posts')

// Punkt 10: Reaktywne zmienne stanu lokalnego
const isLoggedIn = ref(false)
const username = ref('')
const newPostText = ref('')

// Inicjalizacja postów z API tylko, gdy globalna lista jest pusta
onMounted(() => {
  if (allPosts.value.length <= 1 && serverPosts.value) {
    // Łączymy dane z serwera z listą globalną
    allPosts.value = [...allPosts.value, ...serverPosts.value]
  }
})

const login = () => {
  if (username.value.trim().length >= 3) {
    isLoggedIn.value = true
  }
}

const publishPost = () => {
  if (newPostText.value.trim()) {
    // Dodajemy post do globalnego magazynu (Punkt 6)
    addGlobalPost(newPostText.value)
    newPostText.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen bg-pink-50 p-4 md:p-8 font-sans">
    <div class="max-w-xl mx-auto">
      
      <div class="text-center mb-10 mt-4 animate-bounce-slow">
        <div class="inline-block relative">
          <h1 class="text-5xl md:text-6xl font-black italic tracking-tighter text-pink-600 drop-shadow-sm">
            pink<span class="text-white bg-pink-500 px-2 rounded-lg ml-1 shadow-lg">facebook</span>
          </h1>
          <div class="absolute -top-4 -right-8 text-4xl rotate-12">🔬</div>
        </div>
        <p class="text-pink-400 font-bold uppercase tracking-widest text-xs mt-2">
          Społeczność Naukowa
        </p>
      </div>

      <div v-if="!isLoggedIn" class="bg-white p-8 rounded-3xl shadow-xl border-2 border-pink-100 text-center animate-in fade-in zoom-in duration-500">
        <h2 class="text-2xl font-bold text-gray-700 mb-6 font-serif italic">Witaj w laboratorium wiedzy!</h2>
        <input 
          v-model="username" 
          type="text" 
          placeholder="Podaj swój nick naukowca..." 
          @keyup.enter="login"
          class="w-full p-4 border-2 border-pink-50 rounded-2xl mb-4 focus:border-pink-300 outline-none transition-all placeholder-pink-200"
        />
        <button 
          @click="login" 
          class="w-full bg-pink-500 text-white p-4 rounded-2xl font-bold text-lg hover:bg-pink-600 shadow-lg transition-all active:scale-95 shadow-pink-200"
        >
          Rozpocznij badania
        </button>
      </div>

      <div v-else class="animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div class="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-pink-100">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-inner uppercase">
              {{ username.charAt(0) }}
            </div>
            <div>
              <span class="text-gray-400 text-xs block uppercase tracking-tighter font-bold">Badacz</span>
              <h2 class="text-lg font-bold text-pink-600 leading-tight">{{ username }} 🧬</h2>
            </div>
          </div>
          <button @click="isLoggedIn = false" class="bg-gray-50 text-gray-400 px-4 py-2 rounded-xl text-xs font-bold hover:bg-pink-100 hover:text-pink-600 transition-colors uppercase tracking-widest">
            Wyloguj
          </button>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-md mb-10 border-2 border-pink-200 ring-4 ring-pink-50">
          <textarea 
            v-model="newPostText" 
            placeholder="Jakie naukowe odkrycie dziś poczyniłeś?" 
            class="w-full p-2 outline-none resize-none h-24 text-gray-700 placeholder-pink-200 text-lg font-light"
          ></textarea>
          <div class="flex justify-end mt-2 border-t border-pink-50 pt-4">
            <button 
              @click="publishPost" 
              class="bg-pink-500 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-600 shadow-md transition-all active:scale-90 flex items-center gap-2"
            >
              <span>Publikuj post</span>
              <span class="text-xl">🚀</span>
            </button>
          </div>
        </div>

        <div class="space-y-6">
          <ScienceCard v-for="post in allPosts" :key="post.id" :post="post" />
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-bounce-slow {
  animation: bounceSlow 3s infinite ease-in-out;
}

@keyframes bounceSlow {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-8px) rotate(1deg); }
}

:global(body) {
  background-color: #fdf2f8;
  margin: 0;
}
</style>