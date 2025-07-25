'use client'

import React, { useEffect, useState } from "react";
import CategoryListItem from "../list-item/CategoryListItem";
import getCategories from "../../api/getCategories";
import { CategoryOutput } from "../../schema/CategoryOutput.schema";
import CategoryListSkeleton from "../skeleton/CategoryListSkeleton";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { CategoryModal } from "../modals/createCategoryModal";
import { CategoryDetailsModal } from "../modals/categoryDetailsModal";

const CategoryList = () => {
  const [categories, setCategories] = useState<CategoryOutput[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryOutput | null>(null);

  const t = useTranslations("CategoryListPage");

  const fetchCategories = async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryCreated = () => {
    fetchCategories();
  };

  const handleCategoryUpdated = () => {
    fetchCategories();
  };

  const handleCategoryDeleted = () => {
    fetchCategories();
  };

  const openDetailsModal = (category: CategoryOutput) => {
    setSelectedCategory(category);
    setDetailsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-4">
        <CategoryListSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-8 my-auto min-h-[80vh] h-full">

      {/* Intestazione */}
      <div className="max-w-4xl mx-auto px-0.5 flex flex-col">
        <h1 className="w-full text-center font-bold text-xl text-foreground">
          {t('clp-title')}
        </h1>
        <p className="text-center text-muted-foreground">{t('clp-subtitle')}</p>
      </div>

      {/* Container scrollabile con scrollbar stilizzata */}
      <div
        className="
          overflow-y-auto 
          overflow-x-hidden 
          max-h-[70vh] 
          rounded-md 
          border border-gray-200 
          dark:border-gray-700 
          p-4 
          scrollbar-thin 
          scrollbar-thumb-rounded 
          scrollbar-thumb-gray-400 
          scrollbar-track-gray-100 
          dark:scrollbar-thumb-gray-600 
          dark:scrollbar-track-gray-800
        "
      >
        <ul className="grid md:grid-cols-2 sm:grid-cols-1 gap-4 m-0 p-0 list-none">
          {categories?.map((category) => (
            <CategoryListItem
              key={category.id}
              titolo={category.titolo}
              descrizione={category.descrizione}
              colore={category.colore}
              id={category.id}
              icona={category.icona}
              onClick={() => openDetailsModal(category)}
            />
          ))}
        </ul>
      </div>

      {/* Bottone per creare nuova categoria */}
      <div className="mt-4 mx-auto">
        <Button 
          onClick={() => setCreateModalOpen(true)}
          className="cursor-pointer"
        >
          {t("Buttons.b-new")}
        </Button>
      </div>

      {/* Modale per creare categoria */}
      <CategoryModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCategoryCreated={() => {
          handleCategoryCreated();
          setCreateModalOpen(false);
        }}
      />

      {/* Modale per dettagli/modifica categoria */}
      <CategoryDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        category={selectedCategory}
        onCategoryUpdated={() => {
          handleCategoryUpdated();
          setDetailsModalOpen(false);
        }}
        onCategoryDeleted={() => {
          handleCategoryDeleted();
          setDetailsModalOpen(false);
        }}
      />
    </div>
  );
};

export default CategoryList;
