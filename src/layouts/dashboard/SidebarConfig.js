import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import noteEdit from '@iconify-icons/mdi/note-edit';
import storefrontIcon from '@iconify-icons/mdi/storefront';
import checkmarkSquareOutline from '@iconify/icons-eva/checkmark-square-outline';
import calendarFill from '@iconify/icons-eva/calendar-fill';// ----------------------------------------------------------------------
import clipboardFill from '@iconify/icons-eva/clipboard-fill';
const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Nhân viên',
    path: '/dashboard/users',
    icon: getIcon(peopleFill)
  },
  {
    title: 'Quản Lý Ghi Chú',
    icon: getIcon(noteEdit),
    children:[
      {
        title: 'Ghi Chú',
        path: '/dashboard/notes',
        icon: getIcon(noteEdit)
      },
      {
        title: 'Thiết Lập Ghi Chú',
        path: '/dashboard/regular-messages',
        icon: getIcon(noteEdit)
      }
     

    ]
  },
  {
    title: 'Cửa hàng',
    path: '/dashboard/stores',
    icon: getIcon(storefrontIcon)
  },
  {
    title: 'Điểm danh',
    path: '/dashboard/attendances',
    icon: getIcon(checkmarkSquareOutline)
  }
  ,
  {
    title: 'Thẻ thời gian',
    path: '/dashboard/timecards',
    icon: getIcon(calendarFill)
  },
  {
    title: 'Báo cáo chấm công',
    path: '/dashboard/reports/employee',
    icon: getIcon(clipboardFill)
  }
];

export default sidebarConfig;
