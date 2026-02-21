import { jsx } from "react/jsx-runtime";
import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import ReactDOMServer from "react-dom/server";
async function resolvePageComponent(path, pages) {
  for (const p of Array.isArray(path) ? path : [path]) {
    const page = pages[p];
    if (typeof page === "undefined") {
      continue;
    }
    return typeof page === "function" ? page() : page;
  }
  throw new Error(`Page not found: ${path}`);
}
const appName = "SmartCaixa";
createServer(
  (page) => createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(
      `./pages/${name}.tsx`,
      /* @__PURE__ */ Object.assign({ "./pages/BaixaProduto/Index.tsx": () => import("./assets/Index-DUsVZ9mO.js"), "./pages/Ferramentas/Dblink/Index.tsx": () => import("./assets/Index-C6jjHFqb.js"), "./pages/auth/CustomLogin.tsx": () => import("./assets/CustomLogin-Ccfuha_f.js"), "./pages/auth/confirm-password.tsx": () => import("./assets/confirm-password-GsweBwao.js"), "./pages/auth/forgot-password.tsx": () => import("./assets/forgot-password-CUd1As76.js"), "./pages/auth/register.tsx": () => import("./assets/register-DaM1NaSK.js"), "./pages/auth/reset-password.tsx": () => import("./assets/reset-password-D9hWdrIf.js"), "./pages/auth/two-factor-challenge.tsx": () => import("./assets/two-factor-challenge-B75LPvp1.js"), "./pages/auth/verify-email.tsx": () => import("./assets/verify-email-Bjpd6qqC.js"), "./pages/dashboard.tsx": () => import("./assets/dashboard-G457s_1l.js"), "./pages/login.tsx": () => import("./assets/login-DGR4mqzX.js"), "./pages/relatorios/baixa.tsx": () => import("./assets/baixa-C7SdUYB1.js"), "./pages/settings/appearance.tsx": () => import("./assets/appearance-C_4YWZy7.js"), "./pages/welcome.tsx": () => import("./assets/welcome-UsabElJE.js") })
    ),
    setup: ({ App, props }) => {
      return /* @__PURE__ */ jsx(App, { ...props });
    }
  })
);
