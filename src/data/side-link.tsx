import { FaShieldAlt } from "react-icons/fa";
import { FaEarthAmericas, FaUsersLine } from "react-icons/fa6";
import { MdAdsClick, MdDashboard } from "react-icons/md";
import { TbHexagonNumber1Filled, TbHexagonNumber2Filled } from "react-icons/tb";

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

export const SideLinks: SideLink[] = [
  {
    title: "Trang Chủ",
    label: "",
    href: "/",
    icon: <MdDashboard size={18} />,
  },
  {
    title: "Tên Miền",
    label: "",
    href: "/domain",
    icon: <FaEarthAmericas size={18} />,
  },
  {
    title: "Quản Lí Link",
    label: "",
    href: "/link",
    icon: <MdAdsClick size={18} />,
    sub: [
      {
        title: "Thêm Link Mới",
        label: "",
        href: "/link/add",
        icon: <TbHexagonNumber1Filled size={18} />,
      },
      {
        title: "Danh Sách Link",
        label: "",
        href: "/link",
        icon: <TbHexagonNumber2Filled size={18} />,
      },
    ],
  },
];

export const AdminLink: SideLink[] = [
  {
    title: "Người Dùng",
    label: "",
    href: "/dashboard/user",
    icon: <FaUsersLine size={18} />,
  },
  {
    title: "Danh Sách Tên Miền",
    label: "",
    href: "/dashboard/domain",
    icon: <FaEarthAmericas size={18} />,
  },
];
