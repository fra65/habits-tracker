/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import prisma from "@/prisma";

export async function getAllCategories(userId: number) {

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

        return categories
    } catch(err) {
        console.error("Errore nel recupero delle categorie: ", err)
        throw new Error("Errore generico nel recupero delle categorie")
    }

}

export async function getCategory(categoryId: number, userId: number) {

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

        return category
    } catch(err) {
        console.error("Errore nel recupero della categoria: ", err)
        throw new Error("Errore generico nel recupero della categoria")
    }

}



export async function createCategory(data: any) {

    console.log("DATI RICEVUTI NEL BACKEND: ", data)

    try {
        const category = await prisma?.category.create({data});


        if(!category) return null

        return category
    } catch(err) {
        console.error("Errore nella creazione della categoria: ", err)
        throw new Error("Errore generico nella creazione della categoria")
    }

}