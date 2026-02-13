<script setup>
/**
 * Punkt 5: Komponenty
 * Punkt 11: Script Setup
 */
const props = defineProps(['post'])

// Pobieramy funkcję do aktualizacji globalnego stanu (Punkt 6)
const { updateReaction } = usePosts()

// --- Reaktywność lokalna ---
const newComment = ref('')
const replyingTo = ref(null)
const replyText = ref('')
const isLiked = ref(false)

// Dane Komentarzy (zostawiamy lokalnie, chyba że chcesz je też współdzielić globalnie)
const comments = ref([
  { 
    id: 1, 
    text: "Nauka potwierdza: ten system reakcji jest teraz odporny na wylogowanie! 🌐", 
    replies: [
      { id: 101, text: "Wspaniała wiadomość dla badaczy!" }
    ] 
  }
])

// --- Metody obsługujące globalny stan ---
const handleLike = () => {
  if (!isLiked.value) {
    updateReaction(props.post.id, 'like')
    isLiked.value = true
  }
}

const handleReaction = (type) => {
  updateReaction(props.post.id, type)
}

// --- Metody dla komentarzy ---
const addComment = () => {
  if (newComment.value.trim()) {
    comments.value.push({
      id: Date.now(),
      text: newComment.value,
      replies: []
    })
    newComment.value = ''
  }
}

const addReply = (commentId) => {
  if (replyText.value.trim()) {
    const comment = comments.value.find(c => c.id === commentId)
    if (comment) {
      comment.replies.push({
        id: Date.now(),
        text: replyText.value
      })
      replyText.value = ''
      replyingTo.value = null
    }
  }
}
</script>

<template>
  <div class="bg-white p-6 rounded-3xl shadow-md border-b-4 border-pink-300 mb-8 transition-all hover:shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-500">
    
    <p class="text-gray-800 text-xl font-medium leading-relaxed mb-6">{{ post.text }}</p>
    
    <div class="flex flex-wrap items-center gap-4 border-b border-pink-50 pb-6 mb-4">
      
      <div class="flex items-center gap-2 bg-pink-50/50 px-3 py-1 rounded-full">
        <button @click="handleLike" 
                class="transition-transform active:scale-150 text-2xl outline-none focus:ring-0"
                :class="isLiked ? 'text-pink-500' : 'text-gray-300'">
          {{ isLiked ? '💖' : '🤍' }}
        </button>
        <span class="font-black text-pink-600 text-sm">{{ post.likes }}</span>
      </div>

      <button @click="handleReaction('sad')" 
              class="flex items-center gap-2 hover:bg-pink-100/50 p-2 px-3 rounded-2xl transition-all group active:scale-90">
        <span class="text-2xl group-hover:filter group-hover:drop-shadow-sm">😢</span>
        <span class="text-gray-500 text-sm font-bold">{{ post.reactions?.sad || 0 }}</span>
      </button>

      <button @click="handleReaction('dislike')" 
              class="flex items-center gap-2 hover:bg-pink-100/50 p-2 px-3 rounded-2xl transition-all group active:scale-90">
        <span class="text-2xl group-hover:filter group-hover:drop-shadow-sm">👎</span>
        <span class="text-gray-500 text-sm font-bold">{{ post.reactions?.dislike || 0 }}</span>
      </button>

      <button @click="handleReaction('laugh')" 
              class="flex items-center gap-2 hover:bg-pink-100/50 p-2 px-3 rounded-2xl transition-all group active:scale-90">
        <span class="text-2xl group-hover:filter group-hover:drop-shadow-sm">😂</span>
        <span class="text-gray-500 text-sm font-bold">{{ post.reactions?.laugh || 0 }}</span>
      </button>
    </div>

    <div class="mt-2">
      <h4 class="text-xs font-black text-pink-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <span>Przegląd opinii</span>
        <div class="h-[1px] flex-1 bg-pink-100"></div>
      </h4>
      
      <div class="space-y-5 mb-6">
        <div v-for="comment in comments" :key="comment.id" class="group/comment">
          
          <div class="bg-gray-50 p-4 rounded-2xl text-sm text-gray-700 relative border border-transparent group-hover/comment:border-pink-100 transition-colors shadow-sm">
            <p class="leading-relaxed">{{ comment.text }}</p>
            <button @click="replyingTo = comment.id" 
                    class="inline-block mt-2 text-[10px] text-pink-400 font-black hover:text-pink-600 uppercase tracking-widest transition-colors">
              [ Odpowiedz ]
            </button>
          </div>

          <div class="ml-10 mt-3 space-y-3 border-l-2 border-pink-100/50 pl-4">
            <div v-for="reply in comment.replies" :key="reply.id" 
                 class="bg-white border border-gray-100 p-3 rounded-xl text-xs text-gray-600 shadow-sm italic">
              {{ reply.text }}
            </div>

            <div v-if="replyingTo === comment.id" 
                 class="mt-3 flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
              <input 
                v-model="replyText" 
                @keyup.enter="addReply(comment.id)"
                type="text" 
                placeholder="Napisz odpowiedź..." 
                class="flex-1 bg-white border border-pink-200 p-2 px-4 rounded-full text-xs outline-none focus:ring-2 focus:ring-pink-100 transition-all" 
              />
              <button @click="addReply(comment.id)" class="bg-pink-500 text-white px-4 rounded-full text-[10px] font-bold uppercase hover:bg-pink-600 transition-colors">Ślij</button>
              <button @click="replyingTo = null" class="text-gray-400 text-[10px] font-bold uppercase hover:text-gray-600">X</button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-3 mt-4 bg-pink-50/30 p-2 rounded-full border border-pink-50">
        <input 
          v-model="newComment" 
          @keyup.enter="addComment"
          type="text" 
          placeholder="Podziel się swoją teorią..." 
          class="flex-1 bg-transparent p-2 px-4 rounded-full text-sm outline-none placeholder-pink-300" 
        />
        <button @click="addComment" 
                class="bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all shadow-md active:scale-90 font-bold">
          +
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* Punkt 3: SASS i Punkt 12: Scoped Style */
input::placeholder {
  font-style: italic;
  font-weight: 300;
}

// Delikatna animacja dla nowych wpisów
.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>