// hooks/useNav.ts — Navigation bridge (react-router + app-store sync)
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/app-store';
import type { AppPage } from '@/types/ui';

const PAGE_ROUTES: Record<AppPage, string> = {
  // o gate (D41): só as páginas vivas — `home` aponta pro HOJE, os
  // navigate('home') existentes seguem funcionando
  home: '/hoje',
  inbox: '/at',
  wrap: '/wrap',
  raiz: '/raiz',
  'item-detail': '/item',
};

export function useNav() {
  const routerNavigate = useNavigate();
  const setPage = useAppStore((s) => s.navigate);

  const navigate = (page: AppPage) => {
    setPage(page);
    routerNavigate(PAGE_ROUTES[page] ?? '/');
  };

  const selectItem = (id: string) => {
    useAppStore.getState().selectItem(id);
    routerNavigate(`/item/${id}`);
  };

  const goBack = () => {
    routerNavigate(-1);
  };

  return { navigate, selectItem, goBack };
}
