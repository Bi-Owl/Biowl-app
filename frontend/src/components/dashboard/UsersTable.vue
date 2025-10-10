<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-800 mb-6 text-right">مدیریت کاربران</h1>
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full bg-white text-right">
        <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="py-3 px-6">مشخصات کاربر</th>
            <th class="py-3 px-6">اطلاعات تماس</th>
            <th class="py-3 px-6">کد ملی</th>
            <th class="py-3 px-6 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-for="(user, index) in users" :key="user.id" class="border-b border-gray-200 hover:bg-gray-100" :class="{ 'bg-gray-50': index % 2 !== 0 }">
            <td class="py-3 px-6">
              <div class="flex flex-col">
                <div><span class="font-semibold">{{ user.id }}:</span> {{ user.firstName }} {{ user.lastName }}</div>
                <div class="text-xs text-gray-500">{{ user.email }}</div>
              </div>
            </td>
            <td class="py-3 px-6">
              <div class="flex flex-col">
                <div>{{ user.phoneNumber }}</div>
              </div>
            </td>
            <td class="py-3 px-6">
              <div>{{ user.nationalId }}</div>
            </td>
            <td class="py-3 px-6 text-center">
              <button @click="openEditModal(user)" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                ویرایش
              </button>
              <button @click="removeUser(user.id)" class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center mt-2 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                حذف
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getUsers, updateUser, deleteUser } from '@/api/admin';
import { useToast } from 'vue-toastification';
import { useModal } from 'vue-final-modal';
import EditUserModal from '@/components/dashboard/EditUserModal.vue';
import UserDetailsModal from '@/components/dashboard/UserDetailsModal.vue';

const users = ref([]);
const toast = useToast();

const openEditModal = (user) => {
  const { open, close } = useModal({
    component: EditUserModal,
    attrs: {
      userId: user.id,
      onConfirm(updatedUser) {
        updateUser(updatedUser.id, updatedUser).then(res => {
          toast.success(res.message);
          const index = users.value.findIndex(u => u.id === updatedUser.id);
          if (index !== -1) {
            users.value.splice(index, 1, updatedUser);
          }
          close();
        }).catch(err => {
          toast.error(err.message);
        });
      },
      onClose() {
        close();
      }
    },
  });
  open();
};

onMounted(async () => {
  try {
    users.value = await getUsers();
  } catch (error) {
    toast.error(error.message);
  }
});

const removeUser = async (id) => {
  try {
    const res = await deleteUser(id);
    users.value = users.value.filter(u => u.id !== id);
    toast.success(res.message);
  } catch (error) {
    toast.error(error.message);
  }
};
</script>