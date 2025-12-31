import { lazy } from 'react';

const Labels = lazy(() => import('../pages/Datas/Labels'));
const Questions = lazy(() => import('../pages/Datas/Questions'));
const EditQuestion = lazy(() => import('../pages/Datas/EditQuestion'));
const Documents = lazy(() => import('../pages/Datas/Documents'));

// 회원 관리 페이지 import
const Teachers = lazy(() => import('../pages/Users/Teachers'));
const Students = lazy(() => import('../pages/Users/Students'));
const DistributorMembers = lazy(
  () => import('../pages/Users/DistributorMembers'),
);

// 기관 관리 페이지 import
const OrganizationDistributors = lazy(
  () => import('../pages/Organizations/Distributors'),
);
const Academies = lazy(() => import('../pages/Organizations/Academies'));

const coreRoutes = [
  {
    path: '/datas/questions',
    title: 'Questions',
    component: Questions,
  },
  {
    path: '/datas/edit-question',
    title: 'EditQuestion',
    component: EditQuestion,
  },
  {
    path: '/datas/add-question',
    title: 'AddQuestion',
    component: EditQuestion,
  },
  {
    path: '/datas/labels',
    title: 'Labels',
    component: Labels,
  },
  {
    path: '/datas/documents',
    title: 'Documents',
    component: Documents,
  },

  // 회원 관리 경로 추가
  {
    path: '/users/distributor-members',
    title: 'DistributorMembers',
    component: DistributorMembers,
  },
  {
    path: '/users/teachers',
    title: 'Teachers',
    component: Teachers,
  },
  {
    path: '/users/students',
    title: 'Students',
    component: Students,
  },

  // 기관 관리 경로 추가
  {
    path: '/organizations/distributors',
    title: 'Distributors',
    component: OrganizationDistributors,
  },
  {
    path: '/organizations/academies',
    title: 'Academies',
    component: Academies,
  },
];

const routes = [...coreRoutes];
export default routes;
