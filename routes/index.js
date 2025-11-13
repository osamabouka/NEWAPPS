import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import AddPod from '@/views/editor/AddPod.vue'
import AddDoc from '@/views/editor/AddDoc.vue' 
import AddDoc from '@/views/editor/AddFilm.vue' 

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/editor/podcast', name: 'AddPodcast', component: AddPod },
  { path: '/editor/documentary', name: 'AddDocumentary', component: AddDoc },
  { path: '/editor/film', name: 'Addfilm', component: AddFilm },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
