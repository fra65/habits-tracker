/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import prisma from "@/prisma";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CategoryOutput, CategoryOutputSchema } from "../schema/CategoryOutput.schema";
import CreateCategoryResponse from "../types/createCategoryResponse";
import z from "zod";

export async function getAllCategories(userId: number): Promise<CategoryOutput[] | null> {

    try {
        const categories = await prisma?.category.findMany({
            where: {
                OR: [
                    { userId: userId },
                    { userId: null }
                ]
            }
        })

        if(!categories) return null

        const validateCategory = z.array(CategoryOutputSchema).safeParse(categories)

        if(!validateCategory.success) return null

        return validateCategory.data;

    } catch(err) {
        console.error("Errore nel recupero delle categorie: ", err)
        throw new Error("Errore generico nel recupero delle categorie")
    }

}

export async function getCategory(categoryId: number, userId: number): Promise<CategoryOutput | null> {

    try {
        const category = await prisma?.category.findFirst({
            where: {
                id: categoryId,
                OR: [
                    { userId: userId },
                    { userId: null }
                ]
            }
        });

        if(!category) return null

        const validateCategory = CategoryOutputSchema.safeParse(category)

        if(!validateCategory.success) return null

        return validateCategory.data;

    } catch(err) {
        console.error("Errore nel recupero della categoria: ", err)
        throw new Error("Errore generico nel recupero della categoria")
    }

}


export async function createCategory(data: any): Promise<CreateCategoryResponse> {
  try {
    const category = await prisma.category.create({ data });
    const validateCategory = CategoryOutputSchema.safeParse(category);
    if (!validateCategory.success) {
      return { success: false, message: "Errore validazione categoria" };
    }
    return { success: true, data: validateCategory.data };
  } catch (err: unknown) {
    console.error("Errore catturato in createCategory:", err);
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      return { success: false, message: 'Esiste già una categoria con questo titolo. Scegli un titolo diverso.' };
    }
    return { success: false, message: 'Esiste già una categoria con questo titolo. Scegli un titolo diverso.' };
  }
}



// UPDATE

export async function updateCategory(data: any, categoryId: number, userId: number): Promise<CategoryOutput | null> {
  try {

    const category = await prisma.category.update({
        where: {
            id: categoryId,
            userId
        },
        data 
    });

    const validateCategory = CategoryOutputSchema.safeParse(category)

    if(!validateCategory.success) return null

    return validateCategory.data;

  } catch (err: unknown) {

    console.error("Errore catturato in createCategory:", err);
    // Gestione errore Prisma unique constraint
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      // Rilancia direttamente l'errore Prisma per farlo intercettare dalla route
      throw err;
    }
    throw err;
  }
}




export async function deleteCategory(categoryId: number, userId: number): Promise<CategoryOutput | null> {

    try {
        const category = await prisma?.category.delete({
            where: {
                id: categoryId,
                userId
            }
        });

        if(!category) return null

        const validateCategory = CategoryOutputSchema.safeParse(category)

        if(!validateCategory.success) return null

        return validateCategory.data;

    } catch(err) {
        console.error("Errore nell'eliminazione della categoria: ", err)
        throw new Error("Errore generico nell'eliminazione della categoria")
    }

}
