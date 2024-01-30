import { Routes } from '@angular/router';

export const routes: Routes = [
    {
       path:"listar",
       loadComponent: () => import("./Components/listar/listar.component").then((m)=>m.ListarComponent)
    },
    {
        path: '',
        redirectTo: 'listar',
        pathMatch: 'full',
      },
    {
        path:"crear",
        loadComponent: () => import("./Components/crear/crear.component").then((m)=>m.CrearComponent)
    },
    {
        path:"editar",
        loadComponent: () => import("./Components/editar/editar.component").then((m)=>m.EditarComponent)
    },
    {
        path:"eliminar",
        loadComponent: () => import("./Components/eliminar/eliminar.component").then((m)=>m.EliminarComponent)
    }
];
