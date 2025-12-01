<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800 text-right">مدیریت کاربران</h1>
      <SearchBar v-model="searchQuery" placeholder="جستجو در کاربران..." />
    </div>
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full bg-white text-right">
        <thead class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <tr>
            <th class="py-3 px-6">مشخصات کاربر</th>
            <th class="py-3 px-6">اطلاعات تماس</th>
            <th class="py-3 px-6">کد ملی</th>
            <th class="py-3 px-6 text-center">موجودی کیف پول</th>
            <th class="py-3 px-6 text-center">وضعیت</th>
            <th class="py-3 px-6 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light">
          <tr v-if="!filteredUsers.length">
            <td colspan="6" class="text-center py-6 text-gray-500">کاربری مطابق با جستجوی شما یافت نشد.</td>
          </tr>
          <tr v-for="(user, index) in filteredUsers" :key="user.id" class="border-b border-gray-200 hover:bg-gray-100" :class="{ 'bg-gray-50': index % 2 !== 0 }">
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
            <td class="py-3 px-6 text-center font-mono">
                {{ new Intl.NumberFormat('fa-IR').format(user.wallet) }} <span class="text-xs">تومان</span>
            </td>
            <td class="py-3 px-6 text-center">
              <span :class="user.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'" class="py-1 px-3 rounded-full text-xs">
                {{ user.isActive ? 'فعال' : 'غیرفعال' }}
              </span>
            </td>
            <td class="py-3 px-6 text-center">
              <button @click="openEditModal(user)" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                ویرایش
              </button>
              <button @click="confirmRemoveUser(user)" class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center mt-2 mx-auto">
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
import { ref, onMounted, computed } from 'vue';
import { getUsers, updateUser, deleteUser } from '@/api/admin';
import { useToast } from 'vue-toastification';
import { useModal } from 'vue-final-modal';
import EditUserModal from '@/components/dashboard/EditUserModal.vue';
import SearchBar from '@/components/ui/SearchBar.vue';
import ConfirmModal from '@/components/ui/ConfirmModal.vue';

const users = ref([]);
const toast = useToast();
const searchQuery = ref('');

const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return users.value;
  }
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(user => {
    return (
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phoneNumber.includes(query) ||
      user.nationalId.includes(query)
    );
  });
});

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

const confirmRemoveUser = (user) => {
  const { open, close } = useModal({
    component: ConfirmModal,
    attrs: {
      title: 'تایید حذف کاربر',
      message: `آیا از حذف کاربر "${user.firstName} ${user.lastName}" اطمینان دارید؟ این عمل قابل بازگشت نیست.`,
      confirmText: 'بله، حذف کن',
      confirmClass: 'bg-red-600 hover:bg-red-700 focus:ring-red-300',
      titleClass: 'text-red-800',
      onConfirm: async () => {
        try {
          const res = await deleteUser(user.id);
          users.value = users.value.filter(u => u.id !== user.id);
          toast.success(res.message);
        } catch (error) {
          toast.error(error.message);
        } finally {
          close();
        }
      },
      onClose() {
        close();
      }
    }
  });
  open();
};
</script>