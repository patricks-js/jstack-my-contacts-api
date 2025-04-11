import type { Category } from "./category";

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  categoryId: string;
};

export type ContactWithCategory = Omit<Contact, "categoryId"> & {
  category: Omit<Category, "id">;
};
