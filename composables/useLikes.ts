export const usePosts = () => {
  // Globalna tablica postów
  const allPosts = useState('global_posts_list', () => [
    { 
      id: 0, 
      text: "System naukowy zainicjowany. Dodaj swój pierwszy post! 🧪", 
      likes: 0,
      reactions: { sad: 0, dislike: 0, laugh: 0 } // Dodajemy strukturę reakcji
    }
  ])

  const addGlobalPost = (text: string) => {
    allPosts.value.unshift({
      id: Date.now(),
      text: text,
      likes: 0,
      reactions: { sad: 0, dislike: 0, laugh: 0 }
    })
  }

  // Funkcja do aktualizacji reakcji w globalnym stanie
  const updateReaction = (postId, type) => {
    const post = allPosts.value.find(p => p.id === postId)
    if (post) {
      if (type === 'like') {
        post.likes++
      } else {
        post.reactions[type]++
      }
    }
  }

  return {
    allPosts,
    addGlobalPost,
    updateReaction
  }
}