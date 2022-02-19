import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/Login"
  },
  {
    path: "/Login",
    name: "login",
    component: () => import("../view/Login.vue")
  },
  {
    path: "/Home",
    name: "home",
    component: () => import("../view/Home.vue")
  }
];

const router = new createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const loginInfo = window.sessionStorage.getItem("loginId");
  if (to.name !== 'login' && !loginInfo) next({ name: 'login' })
  else next()
})

export default router